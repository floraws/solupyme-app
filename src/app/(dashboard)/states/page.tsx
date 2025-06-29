"use client";
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
  EmptyState,
  StatsCard 
} from "@/components/ui";
import { StateResponse } from "@/types/api";
import { stateService } from "@/services/states.service";

const StatePage = () => {
  const [states, setStates] = useState<StateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stateToDelete, setStateToDelete] = useState<StateResponse | null>(null);

  useEffect(() => {
    loadStates();
  }, []);

  const loadStates = () => {
    stateService.getAll()
      .then(x => setStates(x))
      .catch(() => setError("Error al cargar los estados"))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (state: StateResponse) => {
    setStateToDelete(state);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!stateToDelete) return;

    setDeletingId(stateToDelete.id);
    try {
      await stateService.delete(stateToDelete.id);
      setStates(states.filter(s => s.id !== stateToDelete.id));
      setShowDeleteDialog(false);
      setStateToDelete(null);
    } catch (error) {
      setError("Error al eliminar el estado");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    {
      key: 'code',
      label: 'Código',
      render: (value: any, state: StateResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
          {state.code}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any, state: StateResponse) => (
        <div className="text-sm font-medium text-gray-900">{state.name}</div>
      )
    },    {
      key: 'countryId',
      label: 'País',
      render: (value: any, state: StateResponse) => (
        <div className="text-sm text-gray-600">{state.countryName || state.countryId}</div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, state: StateResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/states/${state.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/states/${state.id}/edit`,
              tooltip: "Editar estado"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(state),
              loading: deletingId === state.id,
              tooltip: "Eliminar estado"
            }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando estados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Estados"
        subtitle="Gestiona la información de los estados del sistema"
        backButton={{
          href: "/catalogs",
          label: "Atrás"
        }}
        actions={
          <Link
            href="/states/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Estado
          </Link>
        }
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nombre o código..."
        className="mb-6"
      />

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      {filteredStates.length > 0 ? (
        <Table
          data={filteredStates}
          columns={tableColumns}
          emptyMessage="No se encontraron estados"
        />
      ) : (
        <EmptyState
          title={searchTerm ? 'No se encontraron estados' : 'No hay estados para mostrar'}
          description={searchTerm
            ? `No hay estados que coincidan con "${searchTerm}"`
            : 'Comienza agregando tu primer estado al sistema'
          }
          action={!searchTerm ? (            <Link
              href="/states/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Primer Estado
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Estado"
        message={`¿Estás seguro de que deseas eliminar el estado "${stateToDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default StatePage;