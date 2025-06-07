import React from 'react';

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  className?: string;
}

const changeColors = {
  increase: 'text-green-600',
  decrease: 'text-red-600',
  neutral: 'text-gray-600',
};

const changeIcons = {
  increase: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
    </svg>
  ),
  decrease: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
    </svg>
  ),
  neutral: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
  ),
};

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon,
  className = '',
}: StatsCardProps) {
  return (
    <div className={`bg-white overflow-hidden shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            {icon && (
              <div className="flex-shrink-0">
                {icon}
              </div>
            )}
          </div>
          
          <div className="mt-2">
            <p className="text-2xl font-semibold text-gray-900">
              {value}
            </p>
          </div>
          
          {(subtitle || change) && (
            <div className="mt-2 flex items-center justify-between">
              {subtitle && (
                <p className="text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
              
              {change && (
                <div className={`flex items-center text-sm ${changeColors[change.type]}`}>
                  {changeIcons[change.type]}
                  <span className="ml-1">
                    {change.value}
                    {change.label && (
                      <span className="text-gray-500 ml-1">{change.label}</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export interface StatsGridProps {
  stats: StatsCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ 
  stats, 
  columns = 3, 
  className = '' 
}: StatsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid gap-6 ${gridCols[columns]} ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}
