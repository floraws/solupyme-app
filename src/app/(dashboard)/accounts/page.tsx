"use client";

import { Breadcrumb, Card, PageHeader } from "@/components/ui";
import { accountService } from "@/services/account.service";
import { AccountResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const defaultAccount: AccountResponse = {
  id: "",
  businessName: "",
  email: "",
  countryId: "",
  stateId: "",
  cityId: ""
};



export default function AccountPage() {
  const { data: account = defaultAccount, isLoading } = useQuery({
    queryKey: ['accountDetails'],
    queryFn: () => accountService.getAccountDetails(),
    initialData: defaultAccount,
  });

  const breadcrumbItems = [
    { label: "Configuracion", href: "/settings" },
    { label: account.businessName || "Empresa", href: `/accounts` }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title={account.businessName || ""}
        subtitle="Información completa de la cuenta"
        backButton={{
          href: "/settings",
          label: "Volver"
        }}
        actions={
          <Link
            href={`/accounts/${account.id}/edit`}
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Empresa
          </Link>
        }
      />
      <Card 
        title="Información de la empresa"
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
     
          {/* Nombre Legal */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón Social
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-lg font-medium text-gray-900">
                {account.businessName}
              </span>
            </div>
          </div>
      
          {/* Nombre Comercial */}
          <div  className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Comercial
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900">
                {account.tradeName || <span className="text-gray-400">No definido</span>}
              </span>
            </div>
          </div>
      
          {/* Dirección */}
          <div  className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900">
                {account.address || <span className="text-gray-400">No definida</span>}
              </span>
            </div>
          </div>
      
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900">
                {account.email || <span className="text-gray-400">No definido</span>}
              </span>
            </div>
          </div>
      
          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900">
                {account.phone || <span className="text-gray-400">No definido</span>}
              </span>
            </div>
          </div>
      
          {/* Sitio Web */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sitio Web
            </label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-900">
                {account.website || <span className="text-gray-400">No definido</span>}
              </span>
            </div>
          </div>
        </div>
      
        {/* Grupo DIAN */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4">DIAN</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tipo de Organización */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Organización
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.organizationType || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
            {/* Tipo de Identificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Identificación
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.identifierType || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
            {/* Número de Identificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Identificación
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.identificationNumber || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      
        {/* Grupo Contacto */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nombre de Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Contacto
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.contactName || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
            {/* Email de Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Contacto
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.contactEmail || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
            {/* Teléfono de Contacto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono de Contacto
              </label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-900">
                  {account.contactPhone || <span className="text-gray-400">No definido</span>}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
