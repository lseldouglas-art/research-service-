import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { randomUUID } from 'crypto';

// 微信OAuth配置
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID || '',
  appSecret: process.env.WECHAT_APP_SECRET || '',
  redirectUri: process.env.WECHAT_REDIRECT_URI || '',
};

// QQ OAuth配置
const QQ_CONFIG = {
  appId: process.env.QQ_APP_ID || '',
  appSecret: process.env.QQ_APP_SECRET || '',
  redirectUri: process.env.QQ_REDIRECT_URI || '',
};

// 生成OAuth授权URL
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider'); // 'wechat' | 'qq'

  if (!provider || !['wechat', 'qq'].includes(provider)) {
    return NextResponse.json({ error: '无效的登录方式' }, { status: 400 });
  }

  const state = randomUUID();
  
  // 存储state用于验证（实际项目中应存入Redis或数据库）
  // 这里简化处理，实际需要持久化存储

  let authUrl = '';
  
  if (provider === 'wechat') {
    // 微信开放平台网页授权
    authUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${WECHAT_CONFIG.appId}&redirect_uri=${encodeURIComponent(WECHAT_CONFIG.redirectUri)}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;
  } else if (provider === 'qq') {
    // QQ互联登录
    authUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=${QQ_CONFIG.appId}&redirect_uri=${encodeURIComponent(QQ_CONFIG.redirectUri)}&response_type=code&state=${state}`;
  }

  return NextResponse.json({ 
    authUrl,
    state,
    message: provider === 'wechat' 
      ? '请在微信中扫描二维码完成登录' 
      : '请前往QQ授权页面完成登录'
  });
}

// 处理OAuth回调
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, code, state } = body;

    if (!provider || !code) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    let userInfo: { openid: string; nickname?: string; avatar?: string; unionid?: string };

    if (provider === 'wechat') {
      // 获取access_token
      const tokenResponse = await fetch(
        `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}&code=${code}&grant_type=authorization_code`
      );
      const tokenData = await tokenResponse.json();

      if (tokenData.errcode) {
        return NextResponse.json({ error: '微信授权失败' }, { status: 400 });
      }

      // 获取用户信息
      const userResponse = await fetch(
        `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}`
      );
      const userData = await userResponse.json();

      userInfo = {
        openid: tokenData.openid,
        nickname: userData.nickname,
        avatar: userData.headimgurl,
        unionid: tokenData.unionid,
      };
    } else if (provider === 'qq') {
      // 获取access_token
      const tokenResponse = await fetch(
        `https://graph.qq.com/oauth2.0/token?client_id=${QQ_CONFIG.appId}&client_secret=${QQ_CONFIG.appSecret}&code=${code}&redirect_uri=${encodeURIComponent(QQ_CONFIG.redirectUri)}&grant_type=authorization_code`
      );
      const tokenText = await tokenResponse.text();
      const tokenParams = new URLSearchParams(tokenText);
      const accessToken = tokenParams.get('access_token');

      if (!accessToken) {
        return NextResponse.json({ error: 'QQ授权失败' }, { status: 400 });
      }

      // 获取openid
      const openidResponse = await fetch(
        `https://graph.qq.com/oauth2.0/me?access_token=${accessToken}`
      );
      const openidText = await openidResponse.text();
      const openidMatch = openidText.match(/"openid":"([^"]+)"/);
      const openid = openidMatch ? openidMatch[1] : '';

      // 获取用户信息
      const userResponse = await fetch(
        `https://graph.qq.com/user/get_user_info?access_token=${accessToken}&oauth_consumer_key=${QQ_CONFIG.appId}&openid=${openid}`
      );
      const userData = await userResponse.json();

      userInfo = {
        openid,
        nickname: userData.nickname,
        avatar: userData.figureurl_qq_2 || userData.figureurl_qq_1,
      };
    } else {
      return NextResponse.json({ error: '无效的登录方式' }, { status: 400 });
    }

    // 查找或创建用户
    let { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('openid', userInfo.openid)
      .eq('provider', provider)
      .single();

    if (existingUser) {
      // 更新最后登录时间
      await supabase
        .from('users')
        .update({ 
          last_login_at: new Date().toISOString(),
          nickname: userInfo.nickname || existingUser.nickname,
          avatar: userInfo.avatar || existingUser.avatar,
        })
        .eq('id', existingUser.id);
    } else {
      // 创建新用户
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          openid: userInfo.openid,
          unionid: userInfo.unionid,
          provider,
          nickname: userInfo.nickname,
          avatar: userInfo.avatar,
          last_login_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('创建用户失败:', error);
        return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
      }
      existingUser = newUser;
    }

    // 创建会话
    const sessionToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7天后过期

    await supabase.from('sessions').insert({
      user_id: existingUser.id,
      token: sessionToken,
      expires_at: expiresAt.toISOString(),
    });

    // 记录登录活动
    await supabase.from('user_activities').insert({
      user_id: existingUser.id,
      action: 'login',
      tool_name: 'auth',
      description: `通过${provider === 'wechat' ? '微信' : 'QQ'}登录`,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: existingUser.id,
        nickname: existingUser.nickname,
        avatar: existingUser.avatar,
      },
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
