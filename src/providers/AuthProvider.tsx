'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { UserNoticeDialog } from '@/components/auth/UserNoticeDialog';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { OAuthCallback } from '@/components/auth/OAuthCallback';

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  showLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [showNotice, setShowNotice] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 初始化
  useEffect(() => {
    // 检查是否同意声明
    const noticeAgreed = localStorage.getItem('userNoticeAgreed');
    if (!noticeAgreed) {
      setShowNotice(true);
    }

    // 恢复登录状态
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleNoticeAgree = () => {
    setShowNotice(false);
  };

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleLoginRequest = () => {
    setShowLogin(true);
  };

  const handleLoginSuccess = (userData: User) => {
    const mockToken = `token-${Date.now()}`;
    login(userData, mockToken);
    setShowLogin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        token,
        login,
        logout,
        showLogin: handleLoginRequest,
      }}
    >
      {children}
      
      {/* OAuth回调处理 */}
      <OAuthCallback />
      
      {/* 用户声明弹窗 */}
      <UserNoticeDialog
        open={showNotice}
        onOpenChange={setShowNotice}
        onAgree={handleNoticeAgree}
      />

      {/* 登录弹窗 */}
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </AuthContext.Provider>
  );
}
