import { useState, useEffect, useCallback } from 'react';
import { csrfService } from '@/services/csrf.service';

interface UseCSRFReturn {
  token: string | null;
  loading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
  validateAndGetToken: () => Promise<string>;
}

/**
 * Custom hook for CSRF token management with Spring Boot
 * Fetches token from Spring Boot /api/auth/csrf endpoint
 */
export const useCSRF = (): UseCSRFReturn => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from Spring Boot server
      const newToken = await csrfService.getCSRFToken();
      setToken(newToken);
    } catch (err) {
      console.error('Failed to load CSRF token:', err);
      setError('Failed to load security token');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async () => {
    await loadToken();
  }, [loadToken]);

  const validateAndGetToken = useCallback(async (): Promise<string> => {
    if (!token) {
      await refreshToken();
    }
    
    if (!token) {
      throw new Error('Failed to obtain valid CSRF token');
    }
    
    return token;
  }, [token, refreshToken]);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  return {
    token,
    loading,
    error,
    refreshToken,
    validateAndGetToken
  };
};
