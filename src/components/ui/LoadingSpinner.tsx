import React from 'react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: 'blue' | 'white' | 'gray';
}

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

export function LoadingSpinner({ 
  size = 'md', 
  className = '', 
  color = 'blue' 
}: LoadingSpinnerProps) {
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 ${colorClasses[color]}`}></div>
    </div>
  );
}
