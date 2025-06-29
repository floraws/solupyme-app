import React from 'react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface ActionButtonProps {
  onClick?: () => void;
  href?: string;
  variant: 'view' | 'edit' | 'delete';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  size?: 'sm' | 'md';
}

const actionVariants = {
  view: {
    colors: 'text-blue-600 hover:text-blue-900 hover:bg-blue-50',
    icon: <EyeIcon className="h-4 w-4" />,
    defaultTooltip: 'Ver detalles',
  },
  edit: {
    colors: 'text-green-600 hover:text-green-900 hover:bg-green-50',
    icon: <PencilIcon className="h-4 w-4" />,
    defaultTooltip: 'Editar',
  },
  delete: {
    colors: 'text-red-600 hover:text-red-900 hover:bg-red-50',
    icon: <TrashIcon className="h-4 w-4" />,
    defaultTooltip: 'Eliminar',
  },
};

const loadingSpinner = (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export function ActionButton({
  onClick,
  href,
  variant,
  disabled = false,
  loading = false,
  tooltip,
  size = 'md',
}: ActionButtonProps) {
  const config = actionVariants[variant];
  const displayTooltip = tooltip || config.defaultTooltip;

  const baseClasses = `inline-flex items-center font-medium px-2 py-1 rounded-md transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${config.colors}`;

  const content = loading ? loadingSpinner : config.icon;

  if (href && !disabled && !loading) {
    return (
      <a
        href={href}
        className={baseClasses}
        title={displayTooltip}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={baseClasses}
      title={displayTooltip}
    >
      {content}
    </button>
  );
}

export interface ActionButtonGroupProps {
  actions: Array<{
    variant: 'view' | 'edit' | 'delete';
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    tooltip?: string;
  }>;
  className?: string;
}

export function ActionButtonGroup({ actions, className = '' }: ActionButtonGroupProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          {...action}
        />
      ))}
    </div>
  );
}
