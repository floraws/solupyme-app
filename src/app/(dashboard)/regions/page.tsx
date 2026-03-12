"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  PageHeader,
  SearchBar,
  LoadingSpinner,
  Alert,
  Table,
  ActionButtonGroup,
  ConfirmDialog,
  EmptyState,
  SelectField
} from "@/components/ui";
import { RegionResponse } from "@/types/api/responses/region.response";
import { regionService } from "@/services/region.service";
import { countryService } from "@/services/country.service";
import { LabelValuePair } from "@/types/api/common";
import { StandardDeleteResult } from "@/helpers/error-handler";

const RegionsPage = () => {
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [regionToDelete, setRegionToDelete] = useState<RegionResponse | null>(null);
  const [countries, setCountries] = useState<LabelValuePair[]>([]);

  const loadRegions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Si hay un filtro de país específico, usar el método especializado
      if (countryFilter && countryFilter !== "all") {
        const data = await regionService.getByCountry(countryFilter);
        setRegions(data);
      } else {
        // Cargar todas las regiones
        const data = await regionService.getAll({
          sortBy: 'name',
          sortOrder: 'asc'
        });
        setRegions(data);
      }
    } catch (err) {
      console.error("Error loading regions:", err);
      setError("Error al cargar las regiones. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [countryFilter]);

  const loadCountries = useCallback(async () => {
    try {
      const data = await countryService.getLabelValuesList();
      const allCountriesOption: LabelValuePair = { value: "all", label: "Todos los países" };
      setCountries([allCountriesOption, ...data]);
    } catch (err) {
      console.error("Error loading countries:", err);
      setError("Error al cargar los países. Por favor, intente nuevamente.");}
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      loadRegions();
      return;
    }

    try {
      setLoading(true);
      const data = await regionService.search(searchTerm, {
        sortBy: 'name',
        sortOrder: 'asc'
      });
      setRegions(data);
    } catch (err) {
      console.error("Error searching regions:", err);
      setError("Error al buscar regiones. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, loadRegions]);

  // Cargar datos iniciales
  useEffect(() => {
    loadRegions();
    loadCountries();
  }, [loadRegions, loadCountries]);

  // Efecto para recargar regiones cuando cambia el filtro de país
  useEffect(() => {
    if (countries.length > 0) { // Solo ejecutar después de cargar países
      loadRegions();
    }
  }, [countryFilter, countries.length, loadRegions]);

  // Efecto para búsqueda con debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      } else if (regions.length === 0) {
        loadRegions();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch, regions.length, loadRegions]);

  const handleDeleteClick = (region: RegionResponse) => {
    setRegionToDelete(region);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!regionToDelete) return;

    setDeletingId(regionToDelete.id);
    try {
      const result: StandardDeleteResult = await regionService.delete(regionToDelete.id);
      
      if (result.success) {
        // Actualización optimista de la UI
        setRegions(regions.filter(r => r.id !== regionToDelete.id));
        setShowDeleteDialog(false);
        setRegionToDelete(null);
        setError(null); // Limpiar errores previos
      } else {
        setError(result.message || "Error al eliminar la región");
      }
    } catch (err) {
      console.error("Error deleting region:", err);
      setError("Error al eliminar la región. Por favor, intente nuevamente.");
    } finally {
      setDeletingId(null);
    }
  };

  const tableColumns = [
    {
      key: 'code',
      label: 'Código',
      render: (_value: unknown, region: RegionResponse) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
          {region.code}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (_value: unknown, region: RegionResponse) => (
        <div className="text-sm font-medium text-gray-900">{region.name}</div>
      )
    },
    {
      key: 'countryName',
      label: 'País',
      render: (_value: unknown, region: RegionResponse) => (
        <div className="text-sm text-gray-600">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
            {region.countryName || region.countryId}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_value: unknown, region: RegionResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/regions/${region.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/regions/${region.id}/edit`,
              tooltip: "Editar región"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(region),
              loading: deletingId === region.id,
              tooltip: "Eliminar región"
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
            <span className="text-gray-600">Cargando regiones...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Regiones"
        subtitle="Gestiona las regiones y estados del sistema"
        backButton={{
          href: "/catalogs",
          label: "Atrás"
        }}
        actions={
          <Link
            href="/regions/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Región
          </Link>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, código o país..."
          />
        </div>
        <div className="w-full sm:w-48">
          <SelectField
            label=""
            options={countries}
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
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

      {regions.length > 0 ? (
        <Table
          data={regions}
          columns={tableColumns}
          emptyMessage="No se encontraron regiones"
        />
      ) : (
        <EmptyState
          title={searchTerm || countryFilter !== "all" ? 'No se encontraron regiones' : 'No hay regiones para mostrar'}
          description={searchTerm || countryFilter !== "all"
            ? `No hay regiones que coincidan con los filtros aplicados`
            : 'Comienza agregando tu primera región al sistema'
          }
          action={!searchTerm && countryFilter === "all" ? (
            <Link
              href="/regions/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Primera Región
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Región"
        message={`¿Estás seguro de que deseas eliminar la región "${regionToDelete?.name}"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default RegionsPage;
