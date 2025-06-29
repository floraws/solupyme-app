"use client";
import { countryService } from "@/services/country.service";
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
import { CountryResponse } from "@/types/api/responses/country.response";

const CountryPage = () => {
  const [countries, setCountries] = useState<CountryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<CountryResponse | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = () => {
    countryService.getAll()
      .then(x => setCountries(x))
      .catch(() => setError("Error al cargar los países"))
      .finally(() => setLoading(false));
  };

  const handleDeleteClick = (country: CountryResponse) => {
    setCountryToDelete(country);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!countryToDelete) return;

    setDeletingId(countryToDelete.id);
    try {
      await countryService.delete(countryToDelete.id);
      setCountries(countries.filter(c => c.id !== countryToDelete.id));
      setShowDeleteDialog(false);
      setCountryToDelete(null);
    } catch (error) {
      setError("Error al eliminar el país");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const tableColumns = [
    {
      key: 'code',
      label: 'Código',
      render: (value: any, country: CountryResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
          {country.code}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (value: any, country: CountryResponse) => (
        <div className="text-sm font-medium text-gray-900">{country.name}</div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones', render: (value: any, country: CountryResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/countries/${country.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/countries/${country.id}/edit`,
              tooltip: "Editar país"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(country),
              loading: deletingId === country.id,
              tooltip: "Eliminar país"
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
            <span className="text-gray-600">Cargando países...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">      <PageHeader
      title="Países"
      subtitle="Gestiona la información de los países del sistema"
      backButton={{
        href: "/catalogs",
        label: "Atrás"
      }}
      actions={
        <Link
          href="/countries/create"
          className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar País
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

      {filteredCountries.length > 0 ? (
        <Table
          data={filteredCountries}
          columns={tableColumns}
          emptyMessage="No se encontraron países"
        />
      ) : (<EmptyState
        title={searchTerm ? 'No se encontraron países' : 'No hay países para mostrar'}
        description={searchTerm
          ? `No hay países que coincidan con "${searchTerm}"`
          : 'Comienza agregando tu primer país al sistema'
        }
        action={!searchTerm ? (
          <Link
            href="/countries/create"
            className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Primer País
          </Link>
        ) : undefined}
      />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar País"
        message={`¿Estás seguro de que deseas eliminar el país "${countryToDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default CountryPage;