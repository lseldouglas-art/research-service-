# OAuth 登录配置指南

## 概述

网站已集成完整的QQ和微信OAuth登录功能，需要申请第三方开发者账号并配置环境变量才能使用。

---

## QQ互联配置（推荐，个人可申请）

### 1. 申请QQ互联账号

1. 访问：https://connect.qq.com/
2. 点击"登录"，使用QQ账号登录
3. 点击"申请接入"或"创建应用"
4. 填写应用信息：
   - **应用名称**：科研助手（或你的网站名称）
   - **应用分类**：网站
   - **应用简介**：AI辅助学术写作服务平台
   - **应用回调地址**：`https://your-site.vercel.app/api/auth/callback/qq`
   - 等待审核（1-2天）

### 2. 获取凭证

审核通过后，在应用详情页面获取：
- **App ID**：类似 `12345678`
- **App Key**：类似 `abcdef1234567890`

### 3. 配置环境变量

在Vercel项目设置中添加以下环境变量：

```
QQ_APP_ID=12345678
QQ_APP_KEY=abcdef1234567890
QQ_REDIRECT_URI=https://your-site.vercel.app/api/auth/callback/qq
```

---

## 微信开放平台配置（需要企业资质）

### 1. 申请微信开放平台账号

1. 访问：https://open.weixin.qq.com/
2. 注册账号并完成企业认证（¥300/年）
3. 需要：营业执照、法人身份证等

### 2. 创建网站应用

1. 登录后进入"管理中心"
2. 点击"创建网站应用"
3. 填写信息：
   - **网站名称**：科研助手
   - **网站首页**：`https://your-site.vercel.app/`
   - **网站简介**：AI辅助学术写作服务平台
   - **授权回调域**：`your-site.vercel.app`
4. 等待审核（1-2周）

### 3. 获取凭证

审核通过后获取：
- **AppID**：类似 `wx1234567890abcdef`
- **AppSecret**：类似 `1234567890abcdef1234567890abcdef`

### 4. 配置环境变量

在Vercel项目设置中添加：

```
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=1234567890abcdef1234567890abcdef
WECHAT_REDIRECT_URI=https://your-site.vercel.app/api/auth/callback/wechat
```

---

## Vercel环境变量配置步骤

1. 打开你的Vercel项目
2. 进入 **Settings** → **Environment Variables**
3. 添加以下变量：

| 名称 | 值 | 说明 |
|------|-----|------|
| `QQ_APP_ID` | 你的QQ AppID | QQ互联应用ID |
| `QQ_APP_KEY` | 你的QQ AppKey | QQ互联应用密钥 |
| `QQ_REDIRECT_URI` | 你的域名 + `/api/auth/callback/qq` | OAuth回调地址 |
| `WECHAT_APP_ID` | 你的微信AppID | 微信开放平台应用ID |
| `WECHAT_APP_SECRET` | 你的微信AppSecret | 微信开放平台应用密钥 |
| `WECHAT_REDIRECT_URI` | 你的域名 + `/api/auth/callback/wechat` | OAuth回调地址 |

4. 点击 **Save**
5. 重新部署项目（会自动应用新环境变量）

---

## 本地开发环境变量配置

1. 复制环境变量模板：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，填入你的真实凭证：
```env
QQ_APP_ID=你的QQ_APP_ID
QQ_APP_KEY=你的QQ_APP_KEY
QQ_REDIRECT_URI=http://localhost:5000/api/auth/callback/qq

WECHAT_APP_ID=你的微信APP_ID
WECHAT_APP_SECRET=你的微信APP_SECRET
WECHAT_REDIRECT_URI=http://localhost:5000/api/auth/callback/wechat
```

3. 重启开发服务器

---

## 测试登录

配置完成后：

1. 打开网站
2. 点击"登录"
3. 选择"QQ登录"或"微信登录"
4. 授权后自动登录成功

---

## 常见问题

### Q: QQ登录提示"redirect_uri参数错误"
A: 检查QQ互联后台的"应用回调地址"是否与 `QQ_REDIRECT_URI` 一致。

### Q: 微信登录提示"redirect_uri参数错误"
A: 检查微信开放平台的"授权回调域"是否填写为你的域名（不带协议和路径）。

### Q: 环境变量配置后仍然提示"未配置"
A: 需要在Vercel中重新部署项目才能应用新环境变量。

### Q: 本地开发可以登录，部署后不行
A: 确保环境变量中的回调地址使用的是部署后的域名，而不是localhost。

---

## 安全提示

1. ⚠️ **不要将 `AppSecret` 等敏感信息提交到Git仓库**
2. ⚠️ 使用 `.gitignore` 确保 `.env.local` 不会被提交
3. ✅ 所有敏感信息都通过环境变量管理
4. ✅ 生产环境使用HTTPS加密传输
