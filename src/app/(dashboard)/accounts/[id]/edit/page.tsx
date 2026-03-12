"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Card,
  InputField,
  Button,
  FormLayout
} from "@/components/ui";
import { accountService } from "@/services/account.service";
import { regionService, cityService } from "@/services";
import { useCSRF } from "@/hooks/useCSRF";
import { useMessages } from "@/hooks/useMessages";
import { useCountries } from "@/hooks/useCountries";
import { AccountResponse } from "@/types/api/responses";
import { SelectField } from "@/components/ui/SelectField";
import { LabelValuePair } from "@/types/api/common";
import { ServiceError } from '@/helpers/error-handler';

// Esquema de validación con Zod
const updateAccountSchema = z.object({
  businessName: z.string().min(1, "La razón social es obligatoria"),
  tradeName: z.string().max(100, "El nombre comercial no puede exceder 100 caracteres").optional(),
  address: z.string().max(200, "La dirección no puede exceder 200 caracteres").optional(),
  email: z.string().email("El email debe ser válido"),
  phone: z.string().max(20, "El teléfono no puede exceder 20 caracteres").optional(),
  website: z.string().url("Debe ser una URL válida").or(z.literal("")).optional(),

  countryId: z.string().min(1, "El país es obligatorio"),
  regionId: z.string().min(1, "El region es obligatorio"),
  cityId: z.string().min(1, "La ciudad es obligatoria"),

  identifierType: z.string().optional(),
  organizationType: z.string().optional(),
  identificationNumber: z.string()
    .regex(/^\d+$/, "Debe contener solo números")
    .optional()
    .or(z.literal("")),

  contactName: z.string().optional(),

});

type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;


const EditAccountPage = () => {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  // Hook para manejo de mensajes
  const { error, message, showError, showSuccess, clearAllMessages } = useMessages();

  // Hook reutilizable para cargar países
  const { countries, loading: loadingCountries } = useCountries();

  // Estados para los selects jerárquicos
  const [regions, setRegions] = useState<LabelValuePair[]>([]);
  const [cities, setCities] = useState<LabelValuePair[]>([]);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const { token: csrfToken, loading: csrfLoading, error: csrfError } = useCSRF();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema)
  });

  // Watch para los cambios en los selects
  const countryId = watch("countryId");
  const regionId = watch("regionId");


  // Cargar regiones cuando cambia el país
  useEffect(() => {
    if (countryId) {
      const fetchRegions = async () => {
        console.log("Cargando estados para el país:", countryId);
        setLoadingRegions(true);
        try {
          const statesData = await regionService.getLabelValuesListByCountry(countryId);
          setRegions(statesData);
        } catch (error) {
          console.error('Error loading states:', error);
          if (error instanceof ServiceError) {
            switch (error.code) {
              case 'NETWORK_ERROR':
                showError('Error de conexión al cargar regiones.');
                break;
              case 'UNAUTHORIZED':
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
                setTimeout(() => router.push('/login'), 2000);
                break;
              default:
                showError('Error al cargar las regiones para el país seleccionado.');
            }
          } else {
            showError('Error inesperado al cargar regiones.');
          }
        } finally {
          setLoadingRegions(false);
        }
      };
      fetchRegions();
    } else {
      setRegions([]);
      setCities([]);
      setValue("regionId", "");
      setValue("cityId", "");
    }
  }, [countryId, setValue, router, showError]);

  // Cargar ciudades cuando cambia el estado
  useEffect(() => {
    if (regionId) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const citiesData = await cityService.getLabelValuesList(regionId);
          setCities(citiesData);
        } catch (error) {
          console.error('Error loading cities:', error);
          if (error instanceof ServiceError) {
            switch (error.code) {
              case 'NETWORK_ERROR':
                showError('Error de conexión al cargar ciudades.');
                break;
              case 'UNAUTHORIZED':
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
                setTimeout(() => router.push('/login'), 2000);
                break;
              default:
                showError('Error al cargar las ciudades para la región seleccionada.');
            }
          } else {
            showError('Error inesperado al cargar ciudades.');
          }
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setValue("cityId", "");
    }
  }, [regionId, setValue, router, showError]);
  // Cargar datos de la cuenta
  useEffect(() => {
    const id = params.id as string;
    if (id) {
      accountService.getById(id)
        .then(async accountData => {
          setAccount(accountData);
          setValue("businessName", accountData.businessName ?? "");
          setValue("tradeName", accountData.tradeName ?? undefined);
          setValue("address", accountData.address ?? undefined);
          setValue("email", accountData.email ?? "");
          setValue("phone", accountData.phone ?? undefined);
          setValue("website", accountData.website ?? undefined);
          setValue("organizationType", accountData.organizationType ?? "1");
          setValue("identifierType", accountData.identifierType ?? "31");
          setValue("identificationNumber",
            accountData.identificationNumber ? String(accountData.identificationNumber) : undefined
          );
          setValue("contactName", accountData.contactName ?? undefined);
          if (accountData.countryId)
            setValue("countryId", accountData.countryId);
          if (accountData.regionId)
            setValue("regionId", accountData.regionId);
          if (accountData.cityId)
            setValue("cityId", accountData.cityId);
        })
        .catch((error) => {
          console.error('Error loading account:', error);
          if (error instanceof ServiceError) {
            switch (error.code) {
              case 'NOT_FOUND':
                showError("La cuenta no fue encontrada.", false);
                break;
              case 'UNAUTHORIZED':
                showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
                setTimeout(() => router.push('/login'), 2000);
                break;
              case 'FORBIDDEN':
                showError('No tienes permisos para ver esta cuenta.', false);
                break;
              default:
                showError("Error al cargar los datos de la cuenta.", false);
            }
          } else {
            showError("Error inesperado al cargar la cuenta.", false);
          }
        })
        .finally(() => {
          setLoadingAccount(false);
        });
    }
  }, [params.id, setValue, router, showError]);

  const onSubmit = async (data: UpdateAccountFormData) => {
    if (!account) return;
    clearAllMessages();

    try {
      await accountService.update(params.id as string, data);
      showSuccess('Cuenta actualizada exitosamente');
      setAccount({ ...account, ...data });
      setTimeout(() => router.push("/accounts"), 1500);
    } catch (error: unknown) {
      console.error('Error updating account:', error);

      if (error instanceof ServiceError) {
        // Manejo específico para diferentes tipos de errores de servicio
        switch (error.code) {
          case 'VALIDATION_ERROR':
            showError(`Error de validación: ${error.message}`);
            break;
          case 'CONFLICT':
            showError(`Ya existe una cuenta con estos datos: ${error.message}`);
            break;
          case 'UNAUTHORIZED':
            showError('No tienes permisos para actualizar cuentas. Por favor, inicia sesión nuevamente.', false);
            setTimeout(() => router.push('/login'), 2000);
            break;
          case 'FORBIDDEN':
            showError('No tienes los permisos necesarios para realizar esta acción.');
            break;
          case 'NOT_FOUND':
            showError('La cuenta no fue encontrada. Es posible que haya sido eliminada.', false);
            setTimeout(() => router.push('/accounts'), 2000);
            break;
          case 'NETWORK_ERROR':
            showError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
            break;
          case 'INTERNAL_SERVER_ERROR':
            showError('Error interno del servidor. Por favor, intenta nuevamente en unos momentos.');
            break;
          default:
            showError(error.message || 'Error desconocido al actualizar la cuenta');
        }
      } else if (error instanceof Error) {
        // Manejo para errores estándar de JavaScript
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          showError('Error de conexión. Por favor, verifica tu conexión a internet.');
        } else if (error.name === 'AbortError') {
          showError('La operación fue cancelada. Por favor, intenta nuevamente.');
        } else {
          showError(`Error inesperado: ${error.message}`);
        }
      } else if (typeof error === 'string') {
        showError(error);
      } else {
        // Fallback para errores desconocidos
        showError('Ha ocurrido un error inesperado. Por favor, intenta nuevamente.');
      }
    }
  };

  if (csrfLoading || loadingAccount) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="lg" />
            <span className="text-gray-600">
              {loadingAccount ? "Cargando datos de la cuenta..." : "Cargando sistema de seguridad..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Alert
          type="error"
          title="Error al cargar la cuenta"
          message={error || "Cuenta no encontrada"}
          actions={
            <div className="flex items-center space-x-3 mt-4">
              <Link
                href="/accounts"
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Volver a la lista de cuentas
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Cuentas", href: "/accounts" },
    { label: account.businessName, href: `/accounts/${account.id}` },
    { label: "Editar" }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      <FormLayout
        title="Información de la Cuenta"
        subtitle="Modifica los campos necesarios" sidebarContent={
          <Card title="Información Actual">
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Razón Social:</p>
                <p>{account.businessName}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email:</p>
                <p className="font-mono">{account.email}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Teléfono:</p>
                <p>{account.phone}</p>
              </div>
              {account.countryName && (
                <div>
                  <p className="font-medium text-gray-900">Ubicación:</p>
                  <p>{account.cityName}, {account.regionName}, {account.countryName}</p>
                </div>
              )}
            </div>
          </Card>
        }
        onSubmit={handleSubmit(onSubmit)}
        showSidebar={true}
      >
        {/* Mostrar errores de CSRF y errores generales de forma prominente */}
        {csrfError && (
          <Alert
            type="error"
            title="Error de seguridad"
            message={csrfError}
            className="mb-6"
          />
        )}
        {error && (
          <Alert
            type="error"
            title="Error al procesar la cuenta"
            message={error}
            className="mb-6"
          />
        )}
        {message && (
          <Alert
            type={message.includes('exitosamente') ? 'success' : 'error'}
            title={message.includes('exitosamente') ? 'Éxito' : 'Error'}
            message={message}
            className="mb-6"
          />
        )}

        {/* CSRF Token Hidden Field */}
        {csrfToken && (
          <input type="hidden" name="csrf_token" value={csrfToken} />
        )}

        <InputField
          label="Razón Social"
          {...register("businessName")}
          error={errors.businessName?.message}
          placeholder="Ejemplo: SOLUPYME INC"
          required
        />

        <InputField
          label="Nombre Comercial"
          {...register("tradeName")}
          error={errors.tradeName?.message}
          placeholder="Ejemplo: SoluPyme"
        />

        <InputField
          label="Dirección"
          {...register("address")}
          error={errors.address?.message}
          placeholder="Dirección de la empresa"
        />

        <InputField
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="empresa@email.com"
        />

        <InputField
          label="Teléfono"
          {...register("phone")}
          error={errors.phone?.message}
          placeholder="Ejemplo: 3001234567"
        />          <InputField
          label="Sitio Web"
          {...register("website")}
          error={errors.website?.message}
          placeholder="https://www.empresa.com"
        />

        {/* Grupo Ciudad */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Ubicación</h4>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* País */}
            {countries.length !== 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País <span className="text-red-500">*</span>
                </label>
                <SelectField
                  label=""
                  {...register("countryId")}
                  error={errors.countryId?.message}
                  options={countries}
                  disabled={loadingCountries}
                />
                {loadingCountries && (
                  <p className="text-xs text-gray-500 mt-1">Cargando países...</p>
                )}
              </div>
            )}
            {!countries.length && (
              <div className="text-sm text-gray-500">
                No hay países disponibles. Por favor, crea al menos un país en el sistema.
              </div>
            )}
            {/* Estado */}
            {regions.length !== 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado/Departamento <span className="text-red-500">*</span>
                </label>
                <SelectField
                  label=""
                  {...register("regionId")}
                  error={errors.regionId?.message}
                  options={regions}
                  disabled={!countryId || loadingRegions}
                />
                {loadingRegions && (
                  <p className="text-xs text-gray-500 mt-1">Cargando estados...</p>
                )}
                {!countryId && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona un país primero</p>
                )}
              </div>
            )}
            {!regions.length && countryId && (
              <div className="text-sm text-gray-500">
                No hay estados disponibles. Por favor, crea al menos un estado/region/departamento en el sistema.
              </div>
            )}

            {/* Ciudad */}
            {cities.length !== 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad <span className="text-red-500">*</span>
                </label>
                <SelectField
                  label=""
                  {...register("cityId")}
                  error={errors.cityId?.message}
                  options={cities}
                  disabled={!regionId || loadingCities}
                />
                {loadingCities && (
                  <p className="text-xs text-gray-500 mt-1">Cargando ciudades...</p>
                )}
                {!regionId && (
                  <p className="text-xs text-gray-500 mt-1">Selecciona un estado primero</p>
                )}
              </div>
            )}
            {!cities.length && countryId && regionId && (
              <div className="text-sm text-gray-500">
                No hay ciudades disponibles. Por favor, crea al menos una ciudad en el sistema.
              </div>
            )}
          </div>
        </div>

        {/* Grupo DIAN */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4">DIAN</h4>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {/* Tipo de Organización como Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Organización
              </label>
              <SelectField
                label=""
                {...register("organizationType")}
                error={errors.organizationType?.message}
                options={[
                  { value: "BUSINESS", label: "Persona Jurídica" },
                  { value: "PERSON", label: "Persona Natural" },
                ]}
              />
            </div>
            {/* Tipo de Identificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Identificación
              </label>
              <SelectField
                label=""
                {...register("identifierType")}
                error={errors.identifierType?.message}
                options={[
                  { value: "CC", label: "Cédula de ciudadanía" },
                  { value: "NIT", label: "NIT" },
                ]}
              />
            </div>
            {/* Número de Identificación */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <InputField
                  label="Número de Identificación"
                  {...register("identificationNumber")}
                  error={errors.identificationNumber?.message}
                  placeholder="Número de Identificación"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grupo Contacto */}
        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-800 mb-4">Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <InputField
              label="Nombre de Contacto"
              {...register("contactName")}
              error={errors.contactName?.message}
              placeholder="Nombre completo"
            />
          </div>
        </div>

        {/* Validation Errors */}
        {Object.keys(errors).length > 0 && (
          <Alert
            type="error"
            message={
              <div>
                <p className="font-medium mb-2">Corrige los siguientes errores:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field} className="text-sm">
                      <strong>{field}:</strong> {error?.message}
                    </li>
                  ))}
                </ul>
              </div>
            }
            className="mb-6"
          />
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            type="button"
            onClick={() => router.push(`/accounts/${account.id}`)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!csrfToken}
          >
            {!csrfToken ? 'Cargando...' : 'Actualizar Cuenta'}
          </Button>
        </div>
      </FormLayout>
    </div>
  );
};

export default EditAccountPage;