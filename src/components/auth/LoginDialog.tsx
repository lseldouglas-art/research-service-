'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  MessageCircle, 
  User,
} from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: (user: { id: string; nickname: string; avatar: string }) => void;
}

export function LoginDialog({ open, onOpenChange, onLoginSuccess }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'qq' | null>(null);

  const handleOAuthLogin = async (provider: 'wechat' | 'qq') => {
    setIsLoading(true);
    setLoginMethod(provider);

    try {
      // 获取授权URL
      const response = await fetch(`/api/auth/oauth?provider=${provider}`);
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        setIsLoading(false);
        setLoginMethod(null);
        return;
      }

      // 显示提示（实际项目中需要处理OAuth回调）
      const message = provider === 'wechat'
        ? '微信登录需要配置真实的微信开放平台AppID和AppSecret。\n\n请查看项目文档配置OAuth参数，或使用游客模式体验。'
        : 'QQ登录需要配置真实的QQ互联AppID和AppSecret。\n\n请查看项目文档配置OAuth参数，或使用游客模式体验。';
      
      alert(message);
      
      // 模拟登录成功（演示用）
      const mockUser = {
        id: `mock-${Date.now()}`,
        nickname: provider === 'wechat' ? '微信用户' : 'QQ用户',
        avatar: '',
      };
      
      // 存储到本地
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', `mock-token-${Date.now()}`);
      
      onLoginSuccess(mockUser);
      onOpenChange(false);
    } catch (error) {
      console.error('Login error:', error);
      alert('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
      setLoginMethod(null);
    }
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: `guest-${Date.now()}`,
      nickname: '游客用户',
      avatar: '',
    };
    
    localStorage.setItem('user', JSON.stringify(guestUser));
    localStorage.setItem('token', `guest-token-${Date.now()}`);
    
    onLoginSuccess(guestUser);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">登录科研助手</DialogTitle>
          <DialogDescription className="text-center pt-1">
            登录后可保存您的研究记录
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 微信登录 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3 hover:bg-green-50 dark:hover:bg-green-950/30"
            onClick={() => handleOAuthLogin('wechat')}
            disabled={isLoading}
          >
            {isLoading && loginMethod === 'wechat' ? (
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" fill="#07C160"/>
              </svg>
            )}
            <span className="text-green-700 dark:text-green-400">
              {isLoading && loginMethod === 'wechat' ? '登录中...' : '微信登录'}
            </span>
          </Button>

          {/* QQ登录 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            onClick={() => handleOAuthLogin('qq')}
            disabled={isLoading}
          >
            {isLoading && loginMethod === 'qq' ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.003 2c-5.612 0-9.003 3.822-9.003 9.027 0 4.328 2.264 7.785 5.555 9.242-.077-.648-.146-1.646.03-2.355.16-.65 1.03-4.37 1.03-4.37s-.263-.525-.263-1.3c0-1.22.707-2.132 1.587-2.132.748 0 1.11.562 1.11 1.236 0 .753-.48 1.878-.726 2.92-.207.874.438 1.586 1.298 1.586 1.558 0 2.757-1.643 2.757-4.014 0-2.098-1.507-3.564-3.66-3.564-2.493 0-3.954 1.87-3.954 3.804 0 .754.29 1.563.652 2.003.071.087.082.163.059.252-.065.274-.213.874-.243.998-.038.162-.126.197-.29.118-1.08-.503-1.753-2.08-1.753-3.347 0-2.726 1.98-5.23 5.713-5.23 3.0 0 5.332 2.136 5.332 4.99 0 2.975-1.876 5.366-4.48 5.366-.875 0-1.697-.455-1.979-.998l-.539 2.056c-.195.75-.722 1.69-1.074 2.264.807.25 1.66.385 2.548.385 5.523 0 10-4.477 10-10S17.523 2 12.003 2z" fill="#12B7F5"/>
              </svg>
            )}
            <span className="text-blue-700 dark:text-blue-400">
              {isLoading && loginMethod === 'qq' ? '登录中...' : 'QQ登录'}
            </span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">
                或者
              </span>
            </div>
          </div>

          {/* 游客模式 */}
          <Button
            variant="outline"
            className="w-full h-12 text-base justify-start gap-3"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            <User className="w-5 h-5 text-slate-600" />
            <span>游客模式体验</span>
          </Button>

          <p className="text-xs text-slate-500 text-center">
            登录即表示您同意我们的服务条款和隐私政策
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
