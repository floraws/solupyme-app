"use client";
import { invoicesService } from "@/services/invoices.service";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PageHeader,
  SearchBar,
  LoadingSpinner,
  Alert,
  Table,
  ActionButtonGroup,
  ConfirmDialog,
  EmptyState
} from "@/components/ui";
import { InvoiceResponse } from "@/types/api";

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<InvoiceResponse | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    invoicesService.getAllInvoices()
      .then(x => setInvoices(x))
      .catch(() => setError("Error al cargar las facturas"))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (invoice: InvoiceResponse) => {
    setInvoiceToDelete(invoice);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;

    setDeletingId(invoiceToDelete.id);
    try {
      // TODO: Implementar delete en el servicio
      // await invoicesService.delete(invoiceToDelete.id);
      setInvoices(invoices.filter(i => i.id !== invoiceToDelete.id));
      setShowDeleteDialog(false);
      setInvoiceToDelete(null);
    } catch {
      setError("Error al eliminar la factura");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Función para formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Función para obtener texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagada';
      case 'sent':
        return 'Enviada';
      case 'overdue':
        return 'Vencida';
      case 'draft':
        return 'Borrador';
      case 'cancelled':
        return 'Cancelada';
      case 'partial':
        return 'Pago Parcial';
      default:
        return status;
    }
  };

  const tableColumns = [
    {
      key: 'number',
      label: 'Número',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
          {invoice.number}
        </span>
      )
    },
    {
      key: 'customer',
      label: 'Cliente',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{invoice.customer.name}</div>
          <div className="text-sm text-gray-500">{invoice.customer.email}</div>
        </div>
      )
    },
    {
      key: 'date',
      label: 'Fecha',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <div className="text-sm text-gray-900">{formatDate(invoice.date)}</div>
      )
    },
    {
      key: 'dueDate',
      label: 'Vencimiento',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
      )
    },
    {
      key: 'total',
      label: 'Total',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
          {getStatusText(invoice.status)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: unknown, invoice: InvoiceResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/invoices/${invoice.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/invoices/${invoice.id}/edit`,
              tooltip: "Editar factura"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(invoice),
              loading: deletingId === invoice.id,
              tooltip: "Eliminar factura"
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
            <span className="text-gray-600">Cargando facturas...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Facturas"
        subtitle="Gestiona todas las facturas del sistema"
        backButton={{
          href: "/dashboards",
          label: "Dashboard"
        }}
        actions={
          <Link
            href="/invoices/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva Factura
          </Link>
        }
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por número, cliente o estado..."
        className="mb-6"
      />

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      {filteredInvoices.length > 0 ? (
        <Table
          data={filteredInvoices}
          columns={tableColumns}
          emptyMessage="No se encontraron facturas"
        />
      ) : (
        <EmptyState
          title={searchTerm ? 'No se encontraron facturas' : 'No hay facturas para mostrar'}
          description={searchTerm
            ? `No hay facturas que coincidan con "${searchTerm}"`
            : 'Comienza creando tu primera factura'
          }
          action={!searchTerm ? (
            <Link
              href="/invoices/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Crear Primera Factura
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Factura"
        message={`¿Estás seguro de que deseas eliminar la factura "${invoiceToDelete?.number}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default InvoicesPage;