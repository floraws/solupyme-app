import { useCallback, useState } from 'react';

/**
 * Hook personalizado para manejo de mensajes de error y éxito
 * Proporciona funciones reutilizables para mostrar y limpiar mensajes
 */
export const useMessages = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Función para limpiar mensajes después de un tiempo
  const clearMessages = useCallback((delay: number = 5000) => {
    setTimeout(() => {
      setError(null);
      setMessage(null);
    }, delay);
  }, []);

  // Función para mostrar error con auto-limpieza
  const showError = useCallback((errorMessage: string, autoClear: boolean = true) => {
    setError(errorMessage);
    setMessage(null); // Limpiar mensaje de éxito si existe
    if (autoClear) {
      clearMessages();
    }
  }, [clearMessages]);

  // Función para mostrar mensaje de éxito con auto-limpieza
  const showSuccess = useCallback((successMessage: string, autoClear: boolean = true) => {
    setMessage(successMessage);
    setError(null); // Limpiar mensaje de error si existe
    if (autoClear) {
      clearMessages(3000); // Mensaje de éxito se limpia más rápido
    }
  }, [clearMessages]);

  // Función para limpiar todos los mensajes inmediatamente
  const clearAllMessages = useCallback(() => {
    setError(null);
    setMessage(null);
  }, []);

  // Función para mostrar mensaje informativo (neutral)
  const showInfo = useCallback((infoMessage: string, autoClear: boolean = true) => {
    setMessage(infoMessage);
    setError(null);
    if (autoClear) {
      clearMessages(4000); // Tiempo intermedio para mensajes informativos
    }
  }, [clearMessages]);

  return {
    // Estados
    error,
    message,
    // Funciones de control
    showError,
    showSuccess,
    showInfo,
    clearMessages,
    clearAllMessages,
    // Funciones para control manual (útiles para casos especiales)
    setError,
    setMessage
  };
};

export default useMessages;
