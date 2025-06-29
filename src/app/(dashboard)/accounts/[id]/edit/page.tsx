"use client";
import React, { useCallback, useEffect, useState } from "react";
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
import { countryService, stateService, cityService } from "@/services";
import { useCSRF } from "@/hooks/useCSRF";
import { AccountResponse } from "@/types/api/responses";
import { SelectField } from "@/components/ui/SelectField";
import { LabelValuePair } from "@/models";

// Esquema de validación con Zod
const updateAccountSchema = z.object({
  businessName: z.string().min(1, "La razón social es obligatoria"),
  tradeName: z.string().max(100, "El nombre comercial no puede exceder 100 caracteres").optional(),
  address: z.string().max(200, "La dirección no puede exceder 200 caracteres").optional(),
  email: z.string().email("El email debe ser válido"),
  phone: z.string().max(20, "El teléfono no puede exceder 20 caracteres").optional(),
  website: z.string().url("Debe ser una URL válida").or(z.literal("")).optional(),

  countryId: z.string().min(1, "El país es obligatorio"),
  stateId: z.string().min(1, "El estado es obligatorio"),
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
  const [error, setError] = useState<string | null>(null);

  // Estados para los selects jerárquicos
  const [countries, setCountries] = useState<LabelValuePair[]>([]);
  const [states, setStates] = useState<LabelValuePair[]>([]);
  const [cities, setCities] = useState<LabelValuePair[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);


  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema)
  });
  const [message, setMessage] = useState<string | null>(null);

  // Watch para los cambios en los selects
  const countryId = watch("countryId");
  const stateId = watch("stateId");

  const { token: csrfToken, loading: csrfLoading, error: csrfError } = useCSRF();
  // Cargar países al montar el componente
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const countriesData = await countryService.getLabelValuesList();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoadingCountries(false);
      }
      setValue("stateId", "");
      setValue("cityId", "");
      setStates([]);
      setCities([]);
    };
    fetchCountries();
  }, [setValue]);

  // Cargar estados cuando cambia el país
  useEffect(() => {
    if (countryId) {
      const fetchStates = async () => {
        console.log("Cargando estados para el país:", countryId);
        setLoadingStates(true);
        try {
          const statesData = await stateService.getLabelValuesListByCountry(countryId);
          setStates(statesData);
        } catch (error) {
          console.error('Error loading states:', error);
        } finally {
          setLoadingStates(false);
        }
      };
      fetchStates();
    }
  }, [countryId, setValue]);

  // Cargar ciudades cuando cambia el estado
  useEffect(() => {
    if (stateId) {
      const fetchCities = async () => {
        setLoadingCities(true);
        try {
          const citiesData = await cityService.getLabelValuesList(stateId);
          setCities(citiesData);
          setValue("cityId", "");
        } catch (error) {
          console.error('Error loading cities:', error);
        } finally {
          setLoadingCities(false);
        }
      };
      fetchCities();
    }
  }, [stateId, setValue]);
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
          setValue("identificationNumber", accountData.identificationNumber ?? undefined);
          setValue("contactName", accountData.contactName ?? undefined);
          setValue("countryId", accountData.countryId ?? "");
          setValue("stateId", accountData.stateId ?? "");
          setValue("cityId", accountData.cityId ?? "");
        })
        .catch(() => setError("Error al cargar la cuenta"))
        .finally(() => {
          setLoadingAccount(false);
        });
    }
  }, [params.id, setValue, countries, states, cities]);

  const onSubmit = async (data: UpdateAccountFormData) => {
    if (!account) return;
    setMessage(null);
    try {
      accountService.update(params.id as string, data);
      setMessage('Cuenta actualizada exitosamente');
      setAccount({ ...account, ...data });
      setTimeout(() => router.push("/accounts"), 1500);
    } catch (error: unknown) {
      console.error('Error updating account:', error);
      const errorObj = error as { status?: number };
      if (errorObj.status === 403) {
        setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
      } else {
        setMessage('Error al actualizar la cuenta. Inténtalo de nuevo.');
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
          message={error || "Cuenta no encontrada"}
          actions={
            <Link
              href="/accounts"
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Volver a la lista de cuentas
            </Link>
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
                  <p>{account.cityName}, {account.stateName}, {account.countryName}</p>
                </div>
              )}
            </div>
          </Card>
        }
        onSubmit={handleSubmit(onSubmit)}
        showSidebar={true}
      >
        {/* CSRF Error Alert */}
        {csrfError && (
          <Alert
            type="error"
            message={`Error de seguridad: ${csrfError}`}
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

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado/Departamento <span className="text-red-500">*</span>
              </label>
              <SelectField
                label=""
                {...register("stateId")}
                error={errors.stateId?.message}
                options={states}
                disabled={!countryId || loadingStates}
              />
              {loadingStates && (
                <p className="text-xs text-gray-500 mt-1">Cargando estados...</p>
              )}
              {!countryId && (
                <p className="text-xs text-gray-500 mt-1">Selecciona un país primero</p>
              )}
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <SelectField
                label=""
                {...register("cityId")}
                error={errors.cityId?.message}
                options={cities}
                disabled={!stateId || loadingCities}
              />
              {loadingCities && (
                <p className="text-xs text-gray-500 mt-1">Cargando ciudades...</p>
              )}
              {!stateId && (
                <p className="text-xs text-gray-500 mt-1">Selecciona un estado primero</p>
              )}
            </div>
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
                  { value: "1", label: "Persona Jurídica" },
                  { value: "2", label: "Persona Natural" },
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
                  { value: "13", label: "Cédula de ciudadanía" },
                  { value: "31", label: "NIT" },
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

        {/* Message */}
        {message && (
          <Alert
            type={message.includes('exitosamente') ? 'success' : 'error'}
            message={message}
          />
        )}

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