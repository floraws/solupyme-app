"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  PageHeader,
  SearchBar,
  LoadingSpinner,
  Alert,
  Table,
  ActionButtonGroup,
  ConfirmDialog,
  EmptyState,
  StatsCard,
  SelectField
} from "@/components/ui";
import { BPartnerResponse } from "@/types/api/responses/bpartner.response";
import BPartnerService from "@/services/bpartner.service";

export default function BPartnersPage() {
  useAuth();

  const [bpartners, setBPartners] = useState<BPartnerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bpartnerToDelete, setBPartnerToDelete] = useState<BPartnerResponse | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    customers: number;
    suppliers: number;
    both: number;
    active: number;
    inactive: number;
    bySegment: Record<string, number>;
  } | null>(null);

  const loadBPartners = useCallback(async () => {
    try {
      setLoading(true);
      const [partnersData, statsData] = await Promise.all([
        BPartnerService.getAll(),
        BPartnerService.getStats()
      ]);
      setBPartners(partnersData);
      setStats(statsData);
    } catch (err) {
      setError("Error al cargar los socios de negocio");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBPartners();
  }, [loadBPartners]);

  const handleDeleteClick = (bpartner: BPartnerResponse) => {
    setBPartnerToDelete(bpartner);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bpartnerToDelete) return;

    setDeletingId(bpartnerToDelete.id);
    try {
      await BPartnerService.delete(bpartnerToDelete.id);
      setBPartners(prev => prev.filter(bp => bp.id !== bpartnerToDelete.id));
      setShowDeleteDialog(false);
      setBPartnerToDelete(null);
      // Recargar estadísticas
      const newStats = await BPartnerService.getStats();
      setStats(newStats);
    } catch (err) {
      setError("Error al eliminar el socio de negocio");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getFilteredBPartners = () => {
    let filtered = bpartners;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(bp =>
        bp.name.toLowerCase().includes(searchLower) ||
        bp.legalName?.toLowerCase().includes(searchLower) ||
        bp.email?.toLowerCase().includes(searchLower) ||
        bp.taxId?.toLowerCase().includes(searchLower) ||
        bp.city?.toLowerCase().includes(searchLower) ||
        bp.industry?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter(bp => bp.type === typeFilter);
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(bp => bp.status === statusFilter);
    }

    // Filtro por segmento
    if (segmentFilter !== "all") {
      filtered = filtered.filter(bp => bp.segment === segmentFilter);
    }

    return filtered;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'customer': return 'Cliente';
      case 'supplier': return 'Proveedor';
      case 'both': return 'Ambos';
      default: return type;
    }
  };

  const getStatusBadge = (status?: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
      case 'inactive':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactivo</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pendiente</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Sin estado</span>;
    }
  };

  const getSegmentBadge = (segment?: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (segment) {
      case 'premium':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Premium</span>;
      case 'standard':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Estándar</span>;
      case 'basic':
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Básico</span>;
      case 'vip':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>VIP</span>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredBPartners = getFilteredBPartners();

  const tableColumns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{bpartner.name}</div>
          {bpartner.legalName && bpartner.legalName !== bpartner.name && (
            <div className="text-xs text-gray-500">{bpartner.legalName}</div>
          )}
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {getTypeLabel(bpartner.type)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: unknown, bpartner: BPartnerResponse) => getStatusBadge(bpartner.status)
    },
    {
      key: 'segment',
      label: 'Segmento',
      render: (_: unknown, bpartner: BPartnerResponse) => getSegmentBadge(bpartner.segment) || '-'
    },
    {
      key: 'contact',
      label: 'Contacto',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <div>
          {bpartner.email && (
            <div className="text-sm text-gray-900">{bpartner.email}</div>
          )}
          {bpartner.phone && (
            <div className="text-xs text-gray-500">{bpartner.phone}</div>
          )}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Ubicación',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <div>
          {bpartner.city && (
            <div className="text-sm text-gray-900">{bpartner.city}</div>
          )}
          {bpartner.country && (
            <div className="text-xs text-gray-500">{bpartner.country}</div>
          )}
        </div>
      )
    },
    {
      key: 'value',
      label: 'Valor Total',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(bpartner.totalLifetimeValue)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: unknown, bpartner: BPartnerResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/bpartners/${bpartner.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/bpartners/${bpartner.id}/edit`,
              tooltip: "Editar socio"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(bpartner),
              loading: deletingId === bpartner.id,
              tooltip: "Eliminar socio"
            }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando socios de negocio...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Socios de Negocio"
        subtitle="Gestiona la información de clientes, proveedores y socios comerciales"
        actions={
          <Link
            href="/bpartners/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Socio
          </Link>
        }
      />

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
          />
          <StatsCard
            title="Clientes"
            value={stats.customers}
          />
          <StatsCard
            title="Proveedores"
            value={stats.suppliers}
          />
          <StatsCard
            title="Activos"
            value={stats.active}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, email, ciudad..."
            className="col-span-1 md:col-span-2"
          />
          <SelectField
            label="Tipo"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los tipos' },
              { value: 'customer', label: 'Clientes' },
              { value: 'supplier', label: 'Proveedores' },
              { value: 'both', label: 'Ambos' }
            ]}
          />
          <SelectField
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'active', label: 'Activos' },
              { value: 'inactive', label: 'Inactivos' },
              { value: 'pending', label: 'Pendientes' }
            ]}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <SelectField
            label="Segmento"
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los segmentos' },
              { value: 'vip', label: 'VIP' },
              { value: 'premium', label: 'Premium' },
              { value: 'standard', label: 'Estándar' },
              { value: 'basic', label: 'Básico' }
            ]}
          />
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      {filteredBPartners.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            data={filteredBPartners}
            columns={tableColumns}
            emptyMessage="No se encontraron socios de negocio"
          />
        </div>
      ) : (
        <EmptyState
          title={searchTerm || typeFilter !== "all" || statusFilter !== "all" || segmentFilter !== "all" 
            ? 'No se encontraron socios' 
            : 'No hay socios de negocio'
          }
          description={
            searchTerm || typeFilter !== "all" || statusFilter !== "all" || segmentFilter !== "all"
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer socio de negocio al sistema'
          }
          action={!(searchTerm || typeFilter !== "all" || statusFilter !== "all" || segmentFilter !== "all") ? (
            <Link
              href="/bpartners/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Primer Socio
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Socio de Negocio"
        message={`¿Estás seguro de que deseas eliminar el socio "${bpartnerToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
}
