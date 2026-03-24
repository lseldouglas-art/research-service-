'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const loginSuccess = searchParams.get('login_success');
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (loginSuccess === 'true' && token && userStr) {
      try {
        const user = JSON.parse(userStr);
        login(user, token);

        // 清除URL中的参数
        router.replace('/');
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.replace('/?error=oauth_callback_failed');
      }
    }
  }, [searchParams, router, login]);

  return null;
}
