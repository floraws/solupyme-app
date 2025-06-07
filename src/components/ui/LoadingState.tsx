import React from 'react';

export interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingMessage?: string;
  errorTitle?: string;
  onRetry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const loadingSizes = {
  sm: { spinner: 'h-6 w-6', container: 'py-8' },
  md: { spinner: 'h-8 w-8', container: 'py-12' },
  lg: { spinner: 'h-12 w-12', container: 'py-16' },
};

export function LoadingState({
  loading,
  error,
  children,
  loadingMessage = "Cargando...",
  errorTitle = "Error",
  onRetry,
  className = '',
  size = 'md',
}: LoadingStateProps) {
  const sizeConfig = loadingSizes[size];

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${sizeConfig.container} ${className}`}>
        <div className="flex items-center space-x-3">
          <div className={`animate-spin rounded-full ${sizeConfig.spinner} border-b-2 border-blue-600`}></div>
          <span className="text-gray-600 font-medium">{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${sizeConfig.container} ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">{errorTitle}</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="ml-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
