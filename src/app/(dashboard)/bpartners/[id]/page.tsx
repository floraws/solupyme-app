"use client";
import { BPartnerService } from "@/services/bpartner.service";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  PageHeader,
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Card,
  StatsCard
} from "@/components/ui";
import Link from "next/link";
import { BPartnerResponse } from "@/types/api";

const BPartnerDetailsPage = () => {
  const params = useParams();
  const [bpartner, setBPartner] = useState<BPartnerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      BPartnerService.getById(id)
        .then(x => setBPartner(x))
        .catch(() => setError("Error al cargar los detalles del Business Partner"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando detalles del Business Partner...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bpartner) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert
          type="error"
          message={error || "Business Partner no encontrado"}
          actions={
            <a 
              href="/bpartners" 
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Volver a la lista de Business Partners
            </a>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Business Partners", href: "/bpartners" },
    { label: bpartner.name }
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      'customer': 'Cliente',
      'supplier': 'Proveedor',
      'both': 'Cliente y Proveedor'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const badgeClasses = status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
    
    const statusLabel = status === 'active' ? 'Activo' : 'Inactivo';
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${badgeClasses}`}>
        {statusLabel}
      </span>
    );
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title={bpartner.name}
        subtitle="Información completa del Business Partner"
        backButton={{
          href: "/bpartners",
          label: "Volver"
        }}
        actions={
          <Link
            href={`/bpartners/${bpartner.id}/edit`}
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Business Partner
          </Link>
        }
      />

      {/* Stats Cards */}
      {(bpartner.totalLifetimeValue || bpartner.totalOrderCount || bpartner.averageOrderValue) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {bpartner.totalLifetimeValue && (
            <StatsCard
              title="Valor Total del Cliente"
              value={formatCurrency(bpartner.totalLifetimeValue, bpartner.defaultCurrency)}
              icon="💰"
            />
          )}
          {bpartner.totalOrderCount && (
            <StatsCard
              title="Total de Órdenes"
              value={bpartner.totalOrderCount.toString()}
              icon="📦"
            />
          )}
          {bpartner.averageOrderValue && (
            <StatsCard
              title="Valor Promedio de Orden"
              value={formatCurrency(bpartner.averageOrderValue, bpartner.defaultCurrency)}
              icon="📊"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información Básica */}
        <Card title="Información Básica" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Sistema</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-mono text-gray-900">{bpartner.id}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {getTypeLabel(bpartner.type)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className="bg-gray-50 rounded-lg p-3">
                {getStatusBadge(bpartner.status)}
              </div>
            </div>

            {bpartner.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <a href={`mailto:${bpartner.email}`} className="text-blue-600 hover:text-blue-800">
                    {bpartner.email}
                  </a>
                </div>
              </div>
            )}

            {bpartner.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <a href={`tel:${bpartner.phone}`} className="text-blue-600 hover:text-blue-800">
                    {bpartner.phone}
                  </a>
                </div>
              </div>
            )}

            {bpartner.website && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <a href={bpartner.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    {bpartner.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Información Legal */}
        <Card title="Información Legal" className="mb-6">
          <div className="space-y-4">
            {bpartner.legalName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{bpartner.legalName}</span>
                </div>
              </div>
            )}

            {bpartner.tradeName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{bpartner.tradeName}</span>
                </div>
              </div>
            )}

            {bpartner.taxId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Tributario</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 font-mono">{bpartner.taxId}</span>
                </div>
              </div>
            )}

            {bpartner.registrationNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Registro</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 font-mono">{bpartner.registrationNumber}</span>
                </div>
              </div>
            )}

            {bpartner.industry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industria</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{bpartner.industry}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Ubicación */}
        {(bpartner.address || bpartner.city || bpartner.country) && (
          <Card title="Ubicación" className="mb-6">
            <div className="space-y-4">
              {bpartner.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-900">{bpartner.address}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {bpartner.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-900">{bpartner.city}</span>
                    </div>
                  </div>
                )}

                {bpartner.country && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-900">{bpartner.country}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Información Financiera */}
        {(bpartner.creditLimit || bpartner.creditBalance || bpartner.annualRevenue) && (
          <Card title="Información Financiera" className="mb-6">
            <div className="space-y-4">
              {bpartner.creditLimit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Límite de Crédito</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-900 font-mono">{formatCurrency(bpartner.creditLimit, bpartner.defaultCurrency)}</span>
                  </div>
                </div>
              )}

              {bpartner.creditBalance && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Saldo de Crédito</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-900 font-mono">{formatCurrency(bpartner.creditBalance, bpartner.defaultCurrency)}</span>
                  </div>
                </div>
              )}

              {bpartner.annualRevenue && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingresos Anuales</label>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-900 font-mono">{formatCurrency(bpartner.annualRevenue, bpartner.defaultCurrency)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Notas */}
      {bpartner.notes && (
        <Card title="Notas" className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{bpartner.notes}</p>
          </div>
        </Card>
      )}

      {/* Fechas */}
      <Card title="Información de Seguimiento" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-900">{formatDate(bpartner.createdAt)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Última Actualización</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-900">{formatDate(bpartner.updatedAt)}</span>
            </div>
          </div>

          {bpartner.lastContacted && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Último Contacto</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{formatDate(bpartner.lastContacted)}</span>
              </div>
            </div>
          )}

          {bpartner.lastPurchaseDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Última Compra</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{formatDate(bpartner.lastPurchaseDate)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Acciones */}
      <Card title="Acciones Disponibles">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/bpartners/${bpartner.id}/edit`}
            className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Business Partner
          </Link>
          
          <Link
            href="/bpartners"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver Todos los Business Partners
          </Link>

          {bpartner.email && (
            <a
              href={`mailto:${bpartner.email}`}
              className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Email
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BPartnerDetailsPage;
