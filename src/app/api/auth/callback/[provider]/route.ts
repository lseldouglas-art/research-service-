import { NextRequest, NextResponse } from 'next/server';

const OAuthConfig = {
  qq: {
    accessTokenUrl: 'https://graph.qq.com/oauth2.0/token',
    openIdUrl: 'https://graph.qq.com/oauth2.0/me',
    userInfoUrl: 'https://graph.qq.com/user/get_user_info',
    appId: process.env.QQ_APP_ID,
    appKey: process.env.QQ_APP_KEY,
    redirectUri: process.env.QQ_REDIRECT_URI,
  },
  wechat: {
    accessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
    redirectUri: process.env.WECHAT_REDIRECT_URI,
  },
};

// 处理OAuth回调
export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const { provider } = params;
  const { searchParams } = new URL(request.url);

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=oauth_failed&reason=no_code', request.url)
    );
  }

  const config = OAuthConfig[provider as keyof typeof OAuthConfig];

  if (!config) {
    return NextResponse.redirect(
      new URL('/?error=invalid_provider', request.url)
    );
  }

  try {
    // 1. 使用授权码获取access_token
    let tokenData: any;

    if (provider === 'qq') {
      const tokenUrl = `${config.accessTokenUrl}?` + new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.appId,
        client_secret: config.appKey,
        code,
        redirect_uri: config.redirectUri,
      }).toString();

      const tokenResponse = await fetch(tokenUrl);
      tokenData = await tokenResponse.json();

      // 2. 获取QQ用户的openid
      const openIdUrl = `${config.openIdUrl}?` + new URLSearchParams({
        access_token: tokenData.access_token,
        fmt: 'json',
      }).toString();

      const openIdResponse = await fetch(openIdUrl);
      const openIdData = await openIdResponse.json();
      tokenData.openid = openIdData.openid;

    } else if (provider === 'wechat') {
      const tokenUrl = `${config.accessTokenUrl}?` + new URLSearchParams({
        appid: config.appId,
        secret: config.appSecret,
        code,
        grant_type: 'authorization_code',
      }).toString();

      const tokenResponse = await fetch(tokenUrl);
      tokenData = await tokenResponse.json();
    }

    if (tokenData.errcode || tokenData.error) {
      throw new Error(tokenData.errmsg || tokenData.error_description || '获取access_token失败');
    }

    // 3. 使用access_token获取用户信息
    let userInfo: any;

    if (provider === 'qq') {
      const userUrl = `${config.userInfoUrl}?` + new URLSearchParams({
        access_token: tokenData.access_token,
        oauth_consumer_key: config.appId,
        openid: tokenData.openid,
        fmt: 'json',
      }).toString();

      const userResponse = await fetch(userUrl);
      userInfo = await userResponse.json();

    } else if (provider === 'wechat') {
      const userUrl = `${config.userInfoUrl}?` + new URLSearchParams({
        access_token: tokenData.access_token,
        openid: tokenData.openid,
      }).toString();

      const userResponse = await fetch(userUrl);
      userInfo = await userResponse.json();
    }

    if (userInfo.ret || userInfo.errcode) {
      throw new Error(userInfo.msg || userInfo.errmsg || '获取用户信息失败');
    }

    // 4. 生成登录token（这里简化处理，实际应该使用JWT）
    const user = {
      id: `${provider}_${userInfo.openid}`,
      nickname: userInfo.nickname || userInfo.nickname,
      avatar: userInfo.headimgurl || userInfo.figureurl_qq_2 || userInfo.figureurl_qq_1,
      provider,
    };

    // 5. 生成token（使用简单的base64编码，生产环境应该使用JWT）
    const token = Buffer.from(JSON.stringify({
      user,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7天过期
    })).toString('base64');

    // 6. 重定向到前端，携带token
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('login_success', 'true');
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('user', JSON.stringify(user));

    return NextResponse.redirect(redirectUrl);

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(`/?error=oauth_failed&reason=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
