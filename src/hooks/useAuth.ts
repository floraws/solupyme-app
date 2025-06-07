import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { AuthRequest } from '@/types/api/requests';

/**
 * Estado de autenticación
 */
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string | null;
    clientId: string | null;
  } | null;
  error: string | null;
  tokenExpiringSoon: boolean;
}

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona estado de autenticación, funciones de login/logout y manejo automático de tokens
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
    tokenExpiringSoon: false,
  });

  /**
   * Inicializa el estado de autenticación
   */
  const initializeAuth = useCallback(() => {
    try {
      const isLoggedIn = authService.isLoggedIn;
      const userId = authService.userId;
      const clientId = authService.clientId;
      const tokenExpiringSoon = authService.isTokenExpiringSoon();

      setAuthState({
        isAuthenticated: isLoggedIn,
        isLoading: false,
        user: isLoggedIn ? { id: userId, clientId } : null,
        error: null,
        tokenExpiringSoon: tokenExpiringSoon,
      });
    } catch (error) {
      console.error('Error al inicializar autenticación:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: 'Error al verificar autenticación',
        tokenExpiringSoon: false,
      });
    }
  }, []);

  /**
   * Realiza el login
   */
  const login = useCallback(async (credentials: AuthRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await authService.login(credentials);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: result.userId || null,
          clientId: authService.clientId,
        },
        error: null,
        tokenExpiringSoon: false,
      });

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: errorMessage,
        tokenExpiringSoon: false,
      });

      throw error;
    }
  }, []);

  /**
   * Realiza el logout
   */
  const logout = useCallback(() => {
    try {
      authService.logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
        tokenExpiringSoon: false,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []);

  /**
   * Refresca el token si es necesario
   */
  const refreshTokenIfNeeded = useCallback(async () => {
    if (!authState.isAuthenticated) return;

    try {
      if (authService.isTokenExpiringSoon()) {
        const result = await authService.refreshToken();
        
        if (result) {
          setAuthState(prev => ({
            ...prev,
            user: prev.user ? {
              ...prev.user,
              id: result.userId || prev.user.id,
            } : null,
          }));
        } else {
          // Si el refresh falla, cerrar sesión
          logout();
        }
      }
    } catch (error) {
      console.error('Error al refrescar token:', error);
      logout();
    }
  }, [authState.isAuthenticated, logout]);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  // Inicializar el estado de autenticación al montar el componente
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Verificar periódicamente si el token necesita ser refrescado
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenIfNeeded();
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, [refreshTokenIfNeeded]);

  return {
    ...authState,
    login,
    logout,
    refreshTokenIfNeeded,
    clearError,
  };
}
