"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  FormLayout,
  InputField,
} from "@/components/ui";
import { registerService } from "@/services/register.service";

const registerSchema = z.object({
  identificationNumber: z
    .string()
    .min(1, "El número de identificación es obligatorio")
    .regex(/^\d+$/, "Debe contener solo números"),
  businessName: z.string().min(1, "La razón social es obligatoria"),
  tradeName: z.string().min(1, "El nombre comercial es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .max(20, "El teléfono no puede exceder 20 caracteres"),
  email: z.email("El email debe ser válido"),
  website: z
    .string()
    .url("Debe ser una URL válida (incluye https://)")
    .or(z.literal("")),
  contact: z.string().min(1, "El contacto es obligatorio"),
  username: z.email("El nombre de usuario debe ser un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const defaultValues: RegisterFormData = {
  identificationNumber: "",
  businessName: "",
  tradeName: "",
  address: "",
  phoneNumber: "",
  email: "",
  website: "",
  contact: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const preview = watch();

  const onSubmit = async (data: RegisterFormData) => {
    setSubmitError("");
    setSuccessMessage("");

    try {
      var response = await registerService.register(data);
      setSuccessMessage("Registro guardado exitosamente.");
      console.log("Payload de registro:", data);
    } catch {
      setSubmitError("No fue posible guardar el registro. Intenta nuevamente.");
    }
  };

  const breadcrumbItems = [
    { label: "Registro", href: "/register" },
    { label: "Editar" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <FormLayout
        title="Información de la Empresa"
        subtitle="Completa los campos del registro"
        sidebarContent={
          <Card title="Resumen Actual">
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Identificación:</p>
                <p>{preview.identificationNumber || "Sin definir"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Razón Social:</p>
                <p>{preview.businessName || "Sin definir"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email:</p>
                <p className="font-mono">{preview.email || "Sin definir"}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Contacto:</p>
                <p>{preview.contact || "Sin definir"}</p>
              </div>
            </div>
          </Card>
        }
        onSubmit={handleSubmit(onSubmit)}
        showSidebar={true}
      >
        {submitError && (
          <Alert
            type="error"
            title="Error al guardar"
            message={submitError}
            className="mb-6"
          />
        )}

        {successMessage && (
          <Alert
            type="success"
            title="Éxito"
            message={successMessage}
            className="mb-6"
          />
        )}

        <InputField
          label="Número de Identificación"
          {...register("identificationNumber")}
          error={errors.identificationNumber?.message}
          placeholder="Ejemplo: 900123456"
          required
        />

        <InputField
          label="Razón Social"
          {...register("businessName")}
          error={errors.businessName?.message}
          placeholder="Ejemplo: SoluPyme SAS"
          required
        />

        <InputField
          label="Nombre Comercial"
          {...register("tradeName")}
          error={errors.tradeName?.message}
          placeholder="Ejemplo: SoluPyme"
          required
        />
        <InputField
          label="Dirección"
          {...register("address")}
          error={errors.address?.message}
          placeholder="Dirección de la empresa"
          required
        />

        <InputField
          label="Teléfono"
          {...register("phoneNumber")}
          error={errors.phoneNumber?.message}
          placeholder="Ejemplo: 3001234567"
          required
        />

        <InputField
          label="Email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="empresa@email.com"
          required
        />

        <InputField
          label="Sitio Web"
          {...register("website")}
          error={errors.website?.message}
          placeholder="https://www.empresa.com"
        />

        <InputField
          label="Contacto"
          {...register("contact")}
          error={errors.contact?.message}
          placeholder="Nombre de la persona de contacto"
          required
        />

        <InputField
          label="Nombre de Usuario"
          {...register("username")}
          error={errors.username?.message}
          placeholder="Ejemplo: usuario@empresa.com"
          required
        />

        <InputField
          label="Contraseña"
          {...register("password")}
          error={errors.password?.message}
          placeholder="********"
          type="password"
          required
        />

        <InputField
          label="Confirmar Contraseña"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          placeholder="********"
          type="password"
          required
        />

        {Object.keys(errors).length > 0 && (
          <Alert
            type="error"
            message={
              <div>
                <p className="font-medium mb-2">Corrige los siguientes errores:</p>
                <ul className="list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([field, fieldError]) => (
                    <li key={field} className="text-sm">
                      <strong>{field}:</strong> {fieldError?.message}
                    </li>
                  ))}
                </ul>
              </div>
            }
            className="mb-6"
          />
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              window.location.href = "/register";
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Guardar Registro
          </Button>
        </div>
      </FormLayout>
    </div>
  );
}