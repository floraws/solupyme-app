import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'blue' | 'white' | 'gray';
}

/**
 * Componente spinner de carga
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'blue' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    blue: 'border-gray-300 border-t-blue-600',
    white: 'border-gray-300 border-t-white',
    gray: 'border-gray-300 border-t-gray-600',
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 ${colorClasses[color]}`}></div>
    </div>
  );
}

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * Botón con estado de carga integrado
 */
export function LoadingButton({ 
  isLoading, 
  loadingText = 'Cargando...', 
  children, 
  disabled,
  className = '',
  ...props 
}: LoadingButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${className}`}
    >
      {isLoading && (
        <LoadingSpinner size="sm" className="mr-2" />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
}
