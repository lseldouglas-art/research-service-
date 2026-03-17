'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  nickname: string;
  avatar: string;
  provider?: string;
  created_at?: string;
  last_login_at?: string;
}

interface Activity {
  id: string;
  action: string;
  tool_name: string;
  description: string;
  metadata: any;
  created_at: string;
}

interface UserStats {
  total: number;
  literatureSplit: number;
  batchAnalysis: number;
  clusterOutline: number;
  paragraphWrite: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // 初始化：从本地存储恢复用户状态
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 登录成功处理
  const handleLogin = useCallback((userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  }, []);

  // 退出登录
  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch('/api/user/info', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, [token]);

  // 记录活动
  const recordActivity = useCallback(async (
    action: string,
    toolName: string,
    description?: string,
    metadata?: any
  ) => {
    if (!token) return;

    try {
      await fetch('/api/user/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          tool_name: toolName,
          description,
          metadata,
        }),
      });
    } catch (error) {
      console.error('Record activity error:', error);
    }
  }, [token]);

  // 获取活动记录
  const getActivities = useCallback(async (limit = 20, offset = 0): Promise<{
    activities: Activity[];
    stats: UserStats;
  } | null> => {
    if (!token) return null;

    try {
      const response = await fetch(
        `/api/user/activities?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return null;

      return await response.json();
    } catch (error) {
      console.error('Get activities error:', error);
      return null;
    }
  }, [token]);

  return {
    user,
    token,
    loading,
    isLoggedIn: !!user && !!token,
    handleLogin,
    logout,
    recordActivity,
    getActivities,
  };
}
