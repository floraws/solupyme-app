"use client";

import { Breadcrumb, Card, PageHeader } from "@/components/ui";
import { clientService } from "@/services/client.service";
import { ClientResponse } from "@/types/api/responses/client.response";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

const defaultAccount: ClientResponse = {
    id: "",
    businessName: "",
    tradeName: "",
    address: "",
    email: "",
    phone: "",
    website: "",
    countryId: "",
    countryName: "",
    regionId: "",
    regionName: "",
    cityId: "",
    cityName: "",
    organizationId: "",
    organizationType: "",
    identifierType: "",
    identificationNumber: 0,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
};

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const [formData, setFormData] = useState<ClientResponse>(defaultAccount);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: account = defaultAccount } = useQuery({
    queryKey: ['clientDetails', clientId],
    queryFn: () => clientService.findById(clientId),
    initialData: defaultAccount,
  });

  useEffect(() => {
    setFormData(account)
  }, [account])

  const updateMutation = useMutation({
    mutationFn: (data: ClientResponse) => clientService.updateClient(clientId, data),
    onSuccess: () => {
      router.push(`/accounts/${clientId}`);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName?.trim()) {
      newErrors.businessName = "Razón Social es requerida";
    }
    if (!formData.email?.trim()) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email de contacto inválido";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Teléfono es requerido";
    }
    if (!formData.address?.trim()) {
      newErrors.address = "Dirección es requerida";
    }
    if (!formData.organizationType) {
      newErrors.organizationType = "Tipo de Organización es requerido";
    }
    if (!formData.identifierType) {
      newErrors.identifierType = "Tipo de Identificación es requerido";
    }
    if (!formData.identificationNumber) {
      newErrors.identificationNumber = "Número de Identificación es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ClientResponse, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate(formData);
    }
  };

  const breadcrumbItems = [
    { label: "Configuracion", href: "/settings" },
    { label: account.businessName || "Empresa", href: `/accounts/${clientId}` }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title={`Editar: ${account.businessName || "Empresa"}`}
        subtitle="Actualiza la información de la empresa"
        backButton={{
          href: `/accounts/${clientId}`,
          label: "Cancelar"
        }}
      />

      <Card title="Información de la empresa" className="mb-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón Social *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.businessName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={formData.tradeName || ''}
                onChange={(e) => handleInputChange('tradeName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-800 mb-4">DIAN</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Organización *
                </label>
                <select
                  value={formData.organizationType}
                  onChange={(e) => handleInputChange('organizationType', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.organizationType
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  <option value="PJ">Persona Jurídica</option>
                  <option value="PN">Persona Natural</option>
                </select>
                {errors.organizationType && <p className="text-red-500 text-sm mt-1">{errors.organizationType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Identificación *
                </label>
                <select
                  value={formData.identifierType}
                  onChange={(e) => handleInputChange('identifierType', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.identifierType
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                >
                  <option value="">Seleccionar...</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="NIT">NIT</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="PA">Pasaporte</option>
                </select>
                {errors.identifierType && <p className="text-red-500 text-sm mt-1">{errors.identifierType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Identificación *
                </label>
                <input
                  type="number"
                  value={formData.identificationNumber || ''}
                  onChange={(e) => handleInputChange('identificationNumber', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.identificationNumber
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                {errors.identificationNumber && <p className="text-red-500 text-sm mt-1">{errors.identificationNumber}</p>}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-800 mb-4">Contacto</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Contacto
                </label>
                <input
                  type="text"
                  value={formData.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  value={formData.contactEmail || ''}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.contactEmail
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-green-500'
                  }`}
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone || ''}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm disabled:opacity-50"
            >
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/accounts/${clientId}`)}
              className="inline-flex items-center justify-center bg-gray-300 text-gray-900 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-400 transition-all duration-200 font-semibold text-sm"
            >
              Cancelar
            </button>
          </div>

          {updateMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">Error al guardar los cambios. Intenta nuevamente.</p>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}