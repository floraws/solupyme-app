"use client";
import { useEffect, useState, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface SecurityState {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenExpiringSoon: boolean;
  user: Record<string, unknown> | null;
}

export const useSecurity = (requireAuth = true) => {
  const [state, setState] = useState<SecurityState>({
    isAuthenticated: false,
    isLoading: true,
    tokenExpiringSoon: false,
    user: null
  });
  
  const router = useRouter();

  const checkAuthStatus = useCallback(() => {
    try {
      const isAuth = authService.isLoggedIn;
      const tokenExpiring = authService.isTokenExpiringSoon();
      const userId = authService.userId;

      setState({
        isAuthenticated: isAuth,
        isLoading: false,
        tokenExpiringSoon: tokenExpiring,
        user: userId ? { id: userId } : null
      });

      // Si requiere autenticación y no está autenticado, redirigir
      if (requireAuth && !isAuth) {
        router.push('/login');
      }

      // Si el token está por expirar, intentar refrescar
      if (isAuth && tokenExpiring) {
        authService.refreshToken().catch(() => {
          authService.logout();
          router.push('/login');
        });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        tokenExpiringSoon: false,
        user: null
      });
      
      if (requireAuth) {
        router.push('/login');
      }
    }
  }, [requireAuth, router]);

  const logout = useCallback(() => {
    authService.logout();
    setState({
      isAuthenticated: false,
      isLoading: false,
      tokenExpiringSoon: false,
      user: null
    });
    router.push('/login');
  }, [router]);

  const refreshAuth = useCallback(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    checkAuthStatus();

    // Verificar el estado de autenticación cada 60 segundos
    const interval = setInterval(checkAuthStatus, 60000);

    // Listener para cambios en el storage (logout en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && !e.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus, logout]);

  return {
    ...state,
    logout,
    refreshAuth
  };
};

// Hook específico para páginas que requieren autenticación
export const useRequireAuth = () => {
  return useSecurity(true);
};

// Hook para páginas públicas que solo necesitan el estado
export const useAuthState = () => {
  return useSecurity(false);
};
