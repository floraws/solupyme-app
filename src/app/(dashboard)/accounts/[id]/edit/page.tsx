"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  PageHeader,
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Card,
  InputField,
  Button,
  FormLayout
} from "@/components/ui";
import { accountService } from "@/services/account.service";
import { useCSRF } from "@/hooks/useCSRF";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import { AccountResponse } from "@/types/api/responses";
import { SelectField } from "@/components/ui/SelectField";

// Esquema de validación con Zod
export const updateAccountSchema = z.object({
  businessName: z.string().min(1, "La razón social es obligatoria"),
  tradeName: z.string().max(100, "El nombre comercial no puede exceder 100 caracteres").optional(),
  address: z.string().max(200, "La dirección no puede exceder 200 caracteres").optional(),
  email: z.string().email("El email debe ser válido"),
  phone: z.string().max(20, "El teléfono no puede exceder 20 caracteres").optional(),
  website: z.string().url("Debe ser una URL válida").optional(),

  cityId: z.string().min(1, "La ciudad es obligatoria"),

  identifierType: z.string().optional(),
  organizationType: z.string().optional(),
  identificationNumber: z.string().optional(),

  contactName: z.string().optional(),
  contactEmail: z.string().email("El email debe ser válido").optional(),
  contactPhone: z.string().optional(),
});

export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

const EditAccountPage = () => {
  const params = useParams();
  const router = useRouter();
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema)
  });
  const [message, setMessage] = useState<string | null>(null);

  const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

  // Cargar datos de la cuenta
  useEffect(() => {
    const id = params.id as string;
    if (id) {
      accountService.getById(id)
        .then(accountData => {
          setAccount(accountData);
          setValue("businessName", accountData.businessName ?? "");
          setValue("tradeName", accountData.tradeName ?? undefined);
          setValue("address", accountData.address ?? undefined);
          setValue("email", accountData.email ?? "");
          setValue("phone", accountData.phone ?? undefined);
          setValue("website", accountData.website ?? undefined);
          setValue("cityId", accountData.cityId ?? "");
          setValue("organizationType", accountData.organizationType ?? "");
          setValue("identifierType", accountData.identifierType ?? undefined);
          setValue("identificationNumber", accountData.identificationNumber ?? undefined);
          setValue("contactName", accountData.contactName ?? undefined);
          setValue("contactEmail", accountData.contactEmail ?? undefined);
          setValue("contactPhone", accountData.contactPhone ?? undefined);
        })
        .catch(() => setError("Error al cargar la cuenta"))
        .finally(() => setLoadingAccount(false));
    }
  }, [params.id, setValue]);

  const onSubmit = async (data: UpdateAccountFormData) => {
    alert("onSubmit called with data: " + JSON.stringify(data));
    if (!account) return;

    setMessage(null);
    try {

      // Usar fetchWrapper con CSRF token
      accountService.create(params.id as string, data);

      setMessage('Cuenta actualizada exitosamente');

      // Actualizar los datos locales
      setAccount({ ...account, ...data });

      // Redirigir después de unos segundos
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

      <PageHeader
        title="Editar Cuenta"
        subtitle={`Modifica la información de "${account.businessName}"`}
      />
      <FormLayout
        title="Información de la Cuenta"
        subtitle="Modifica los campos necesarios"
        sidebarContent={
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          />

          <InputField
            label="Sitio Web"
            {...register("website")}
            error={errors.website?.message}
            placeholder="https://www.empresa.com"
          />

          {/* Grupo DIAN */}
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
                    { value: "BUSSINESS", label: "Persona Jurídica" },
                    { value: "PERSON", label: "Persona Natural" },
                  ]}
                />
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              <InputField
                label="Nombre de Contacto"
                {...register("contactName")}
                error={errors.contactName?.message}
                placeholder="Nombre completo"
              />
              <InputField
                label="Email de Contacto"
                {...register("contactEmail")}
                error={errors.contactEmail?.message}
                placeholder="contacto@email.com"
              />
              <InputField
                label="Teléfono de Contacto"
                {...register("contactPhone")}
                error={errors.contactPhone?.message}
                placeholder="Ejemplo: 3001234567"
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
        </form>
      </FormLayout>
    </div>
  );
};

export default EditAccountPage;