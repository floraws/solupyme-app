"use client";
import { countryService } from "@/services/country.service";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  PageHeader,
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Card
} from "@/components/ui";
import Link from "next/link";
import { CountryResponse } from "@/types/api";

const CountryDetailsPage = () => {
  const params = useParams();
  const [country, setCountry] = useState<CountryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      countryService.getById(id)
        .then(x => setCountry(x))
        .catch(() => setError("Error al cargar los detalles del país"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando detalles del país...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert
          type="error"
          message={error || "País no encontrado"}
          actions={
            <a 
              href="/countries" 
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Volver a la lista de países
            </a>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Países", href: "/countries" },
    { label: country.name }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title={country.name}
        subtitle="Información completa del país"
        backButton={{
          href: "/countries",
          label: "Volver"
        }}
        actions={
          <Link
            href={`/countries/${country.id}/edit`}
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar País
          </Link>
        }
      />

      <Card 
        title="Información del País"
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Sistema
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-mono text-gray-900">{country.id}</span>
            </div>
          </div>

          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código del País
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 font-mono">
                {country.code}
              </span>
            </div>
          </div>

          {/* Nombre */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del País
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg font-medium text-gray-900">{country.name}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card 
        title="Acciones Disponibles"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`/countries/${country.id}/edit`}
            className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar País
          </a>
          
          <a
            href="/countries"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver Todos los Países
          </a>
        </div>
      </Card>
    </div>
  );
};

export default CountryDetailsPage;
