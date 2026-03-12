import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { countryService } from '@/services';
import { LabelValuePair } from '@/types/common';
import { ServiceError } from '@/helpers/error-handler';
import { useMessages } from './useMessages';

/**
 * Hook personalizado para cargar y manejar países
 * Proporciona funcionalidad reutilizable para cargar países con manejo de errores
 */
export const useCountries = () => {
  const [countries, setCountries] = useState<LabelValuePair[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useMessages();
  const router = useRouter();

  // Función para cargar países
  const loadCountries = useCallback(async () => {
    setLoading(true);
    try {
      const countriesData = await countryService.getLabelValuesList();
      setCountries(countriesData);
      return countriesData;
    } catch (error) {
      console.error('Error loading countries:', error);
      
      if (error instanceof ServiceError) {
        switch (error.code) {
          case 'NETWORK_ERROR':
            showError('Error de conexión al cargar países. Verifica tu conexión a internet.');
            break;
          case 'UNAUTHORIZED':
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
            setTimeout(() => router.push('/login'), 2000);
            break;
          case 'FORBIDDEN':
            showError('No tienes permisos para ver los países.');
            break;
          case 'INTERNAL_SERVER_ERROR':
            showError('Error interno del servidor. Por favor, intenta nuevamente en unos momentos.');
            break;
          default:
            showError('Error al cargar la lista de países. Por favor, intenta nuevamente.');
        }
      } else {
        showError('Error inesperado al cargar países. Por favor, intenta nuevamente.');
      }
      
      throw error; // Re-lanzar para que el componente pueda manejar el error si es necesario
    } finally {
      setLoading(false);
    }
  }, [showError, router]);

  // Cargar países automáticamente al montar el hook
  useEffect(() => {
    loadCountries();
  }, [loadCountries]);

  // Función para refrescar la lista
  const refreshCountries = useCallback(() => {
    return loadCountries();
  }, [loadCountries]);

  // Función para limpiar la lista
  const clearCountries = useCallback(() => {
    setCountries([]);
  }, []);

  return {
    // Estados
    countries,
    loading,
    
    // Funciones
    loadCountries,
    refreshCountries,
    clearCountries,
    
    // Propiedades calculadas
    hasCountries: countries.length > 0,
    isEmpty: countries.length === 0 && !loading
  };
};

export default useCountries;
