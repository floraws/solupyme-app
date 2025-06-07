import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';
import { Alert } from './Alert';

export interface FormLayoutProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;

  // Form state
  isLoading?: boolean;
  error?: string | null;
  success?: string | null;

  // Actions
  submitText?: string;
  cancelText?: string;
  cancelHref?: string;
  onCancel?: () => void;

  // Layout
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  className?: string;
  formClassName?: string;

  // CSRF
  csrfError?: string | null;
  csrfToken?: string | null;
}

export function FormLayout({
  title,
  subtitle,
  breadcrumbs,
  onSubmit,
  children,
  isLoading = false,
  error,
  success,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  cancelHref,
  onCancel,
  showSidebar = true,
  sidebarContent,
  className = '',
  formClassName = '',
  csrfError,
  csrfToken,
}: FormLayoutProps) {
  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <Breadcrumb items={breadcrumbs} />
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${showSidebar ? 'lg:grid-cols-3' : ''} gap-8`}>
        {/* Form */}
        <div className={showSidebar ? 'lg:col-span-2' : ''}>
          <Card>
            {/* Success Message */}
            {success && (
              <Alert
                type="success"
                message={success}
              />
            )}

            {/* Error Message */}
            {error && (
              <Alert
                type="error"
                message={error}
              />
            )}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* CSRF Error Alert */}
              {csrfError && (
                <Alert
                  type="error"
                  message={`Error de seguridad: ${csrfError}`}
                  className="mb-6"
                />
              )}
              {/* CSRF Token Hidden Field */}
              {csrfToken && (
                <input type="hidden" name="csrf_token" value={csrfToken} />
              )}
              {/* Form Fields */}
              {children}
            </form>

          </Card>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="lg:col-span-1">
            {sidebarContent ? (
              sidebarContent
            ) : (
              <Card
                title="Información"
                padding="md"
              >
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Campos requeridos</p>
                      <p>Completa todos los campos marcados con (*)</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
