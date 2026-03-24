import { NextRequest, NextResponse } from 'next/server';

const OAuthConfig = {
  qq: {
    authorizeUrl: 'https://graph.qq.com/oauth2.0/authorize',
    accessTokenUrl: 'https://graph.qq.com/oauth2.0/token',
    userInfoUrl: 'https://graph.qq.com/user/get_user_info',
    appId: process.env.QQ_APP_ID,
    appKey: process.env.QQ_APP_KEY,
    redirectUri: process.env.QQ_REDIRECT_URI,
  },
  wechat: {
    authorizeUrl: 'https://open.weixin.qq.com/connect/qrconnect',
    accessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token',
    userInfoUrl: 'https://api.weixin.qq.com/sns/userinfo',
    appId: process.env.WECHAT_APP_ID,
    appSecret: process.env.WECHAT_APP_SECRET,
    redirectUri: process.env.WECHAT_REDIRECT_URI,
  },
};

// 获取OAuth授权URL
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');

  if (!provider || !['qq', 'wechat'].includes(provider)) {
    return NextResponse.json({ error: '无效的OAuth提供商' }, { status: 400 });
  }

  const config = OAuthConfig[provider as keyof typeof OAuthConfig];

  if (!config.appId || !config.redirectUri) {
    return NextResponse.json(
      { 
        error: `${provider}未配置，请设置环境变量`,
        required: [
          `${provider.toUpperCase()}_APP_ID`,
          `${provider.toUpperCase()}_APP_KEY` || `${provider.toUpperCase()}_APP_SECRET`,
          `${provider.toUpperCase()}_REDIRECT_URI`
        ]
      },
      { status: 500 }
    );
  }

  // 生成state参数防止CSRF攻击
  const state = Math.random().toString(36).substring(2, 15);

  // 构建授权URL
  let authUrl = '';
  
  if (provider === 'qq') {
    authUrl = `${config.authorizeUrl}?` + new URLSearchParams({
      response_type: 'code',
      client_id: config.appId,
      redirect_uri: config.redirectUri,
      state,
      scope: 'get_user_info',
    }).toString();
  } else if (provider === 'wechat') {
    authUrl = `${config.authorizeUrl}?` + new URLSearchParams({
      appid: config.appId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: 'snsapi_login',
      state,
    }).toString() + '#wechat_redirect';
  }

  return NextResponse.json({
    success: true,
    authUrl,
    state,
  });
}
