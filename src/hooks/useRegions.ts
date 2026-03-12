import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { regionService } from '@/services';
import { LabelValuePair } from '@/types/common';
import { ServiceError } from '@/helpers/error-handler';
import { useMessages } from './useMessages';

/**
 * Hook personalizado para cargar y manejar regiones
 * Proporciona funcionalidad reutilizable para cargar regiones con manejo de errores
 * 
 * @param countryId - ID del país para filtrar regiones (opcional)
 * @param autoLoad - Si debe cargar automáticamente al montar (por defecto: true)
 */
export const useRegions = (countryId?: string | null, autoLoad: boolean = true) => {
  const [regions, setRegions] = useState<LabelValuePair[]>([]);
  const [loading, setLoading] = useState(false);
  const { showError } = useMessages();
  const router = useRouter();

  // Función para cargar regiones
  const loadRegions = useCallback(async (specificCountryId?: string | null) => {
    setLoading(true);
    try {
      let regionsData: LabelValuePair[];
      
      if (specificCountryId || countryId) {
        // Cargar regiones por país específico
        const targetCountryId = specificCountryId || countryId;
        if (targetCountryId) {
          regionsData = await regionService.getLabelValuesListByCountry(targetCountryId);
        } else {
          regionsData = await regionService.getAllAsLabelValues();
        }
      } else {
        // Cargar todas las regiones
        regionsData = await regionService.getAllAsLabelValues();
      }
      
      setRegions(regionsData);
      return regionsData;
    } catch (error) {
      console.error('Error loading regions:', error);
      
      if (error instanceof ServiceError) {
        switch (error.code) {
          case 'NETWORK_ERROR':
            showError('Error de conexión al cargar regiones. Verifica tu conexión a internet.');
            break;
          case 'UNAUTHORIZED':
            showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
            setTimeout(() => router.push('/login'), 2000);
            break;
          case 'FORBIDDEN':
            showError('No tienes permisos para ver las regiones.');
            break;
          case 'NOT_FOUND':
            showError('No se encontraron regiones para el país seleccionado.');
            break;
          case 'INTERNAL_SERVER_ERROR':
            showError('Error interno del servidor. Por favor, intenta nuevamente en unos momentos.');
            break;
          default:
            showError('Error al cargar la lista de regiones. Por favor, intenta nuevamente.');
        }
      } else {
        showError('Error inesperado al cargar regiones. Por favor, intenta nuevamente.');
      }
      
      throw error; // Re-lanzar para que el componente pueda manejar el error si es necesario
    } finally {
      setLoading(false);
    }
  }, [countryId, showError, router]);

  // Función para reintentar la carga
  const retryLoadRegions = useCallback(() => {
    return loadRegions();
  }, [loadRegions]);

  // Cargar regiones automáticamente cuando cambia countryId o al montar
  useEffect(() => {
    if (autoLoad) {
      if (countryId) {
        loadRegions(countryId);
      } else if (countryId === undefined) {
        // Solo cargar todas las regiones si countryId es undefined (no null)
        loadRegions();
      } else {
        // Si countryId es null, limpiar las regiones
        setRegions([]);
      }
    }
  }, [countryId, autoLoad, loadRegions]);

  // Función para refrescar la lista
  const refreshRegions = useCallback((specificCountryId?: string | null) => {
    return loadRegions(specificCountryId);
  }, [loadRegions]);

  // Función para limpiar la lista
  const clearRegions = useCallback(() => {
    setRegions([]);
  }, []);

  return {
    // Estados
    regions,
    loading,
    
    // Funciones
    loadRegions,
    retryLoadRegions,
    refreshRegions,
    clearRegions,
    
    // Propiedades calculadas
    hasRegions: regions.length > 0,
    isEmpty: regions.length === 0 && !loading
  };
};

export default useRegions;
