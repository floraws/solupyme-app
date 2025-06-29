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
import { CityResponse } from "@/types/api";
import { cityService } from "@/services/city.service";

const CityPage = () => {
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cityToDelete, setCityToDelete] = useState<CityResponse | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = () => {
    cityService.getAll()
      .then(x => setCities(x))
      .catch(() => setError("Error al cargar las ciudades"))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (city: CityResponse) => {
    setCityToDelete(city);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!cityToDelete) return;

    setDeletingId(cityToDelete.id);
    try {
      await cityService.delete(cityToDelete.id);
      setCities(cities.filter(c => c.id !== cityToDelete.id));
      setShowDeleteDialog(false);
      setCityToDelete(null);
    } catch (error) {
      setError("Error al eliminar la ciudad");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.stateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.countryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableColumns = [
    {
      key: 'code',
      label: 'Código',
      render: (value: any, city: CityResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
          {city.code}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any, city: CityResponse) => (
        <div className="text-sm font-medium text-gray-900">{city.name}</div>
      )
    },
    {
      key: 'stateName',
      label: 'Departamento/Estado',
      render: (value: any, city: CityResponse) => (
        <div className="text-sm text-gray-600">{city.stateName || city.stateId}</div>
      )
    },
    {
      key: 'countryName',
      label: 'País',
      render: (value: any, city: CityResponse) => (
        <div className="text-sm text-gray-600">{city.countryName}</div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, city: CityResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/cities/${city.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/cities/${city.id}/edit`,
              tooltip: "Editar ciudad"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(city),
              loading: deletingId === city.id,
              tooltip: "Eliminar ciudad"
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
            <span className="text-gray-600">Cargando ciudades...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Ciudades"
        subtitle="Gestiona la información de las ciudades del sistema"
        backButton={{
          href: "/catalogs",
          label: "Atrás"
        }}
        actions={
          <Link
            href="/cities/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Ciudad
          </Link>
        }
      />

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Buscar por nombre, código, estado o país..."
        className="mb-6"
      />

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      {filteredCities.length > 0 ? (
        <Table
          data={filteredCities}
          columns={tableColumns}
          emptyMessage="No se encontraron ciudades"
        />
      ) : (
        <EmptyState
          title={searchTerm ? 'No se encontraron ciudades' : 'No hay ciudades para mostrar'}
          description={searchTerm
            ? `No hay ciudades que coincidan con "${searchTerm}"`
            : 'Comienza agregando tu primera ciudad al sistema'
          }
          action={!searchTerm ? (
            <Link
              href="/cities/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Primera Ciudad
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Ciudad"
        message={`¿Estás seguro de que deseas eliminar la ciudad "${cityToDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default CityPage;