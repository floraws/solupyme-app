"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { countryService } from "@/services/country.service";
import { useRouter, useParams } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { CountryResponse } from '@/types/api/responses/country.response';

// Esquema de validación con Zod
const countrySchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .min(3, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    code: z
        .string()
        .min(1, "El código es obligatorio")
        .length(2, "El código debe ser de exactamente 2 caracteres")
        .regex(/^[A-Z]{2}$/, "El código debe ser de 2 letras mayúsculas (ej: AR)")
        .transform(val => val.toUpperCase())
});

type CountryFormData = z.infer<typeof countrySchema>;

const EditCountryPage = () => {
    const params = useParams();
    const router = useRouter();
    const [country, setCountry] = useState<CountryResponse | null>(null);
    const [loadingCountry, setLoadingCountry] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<CountryFormData>({
        resolver: zodResolver(countrySchema)
    });
    const [message, setMessage] = useState<string | null>(null);

    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    // Cargar datos del país
    useEffect(() => {
        const id = params.id as string;
        if (id) {
            countryService.getById(id)
                .then(countryData => {
                    setCountry(countryData);
                    setValue("name", countryData.name);
                    setValue("code", countryData.code);
                })
                .catch(() => setError("Error al cargar el país"))
                .finally(() => setLoadingCountry(false));
        }
    }, [params.id, setValue]);

    const onSubmit = async (data: CountryFormData) => {
        if (!country) return;

        setMessage(null);
        try {
            // Validar y obtener token CSRF
            const validToken = await validateAndGetToken();

            // Usar fetchWrapper con CSRF token
            await fetchWrapper.put(`/countries/${country.id}`, data, validToken);
            setMessage('País actualizado exitosamente');

            // Actualizar los datos locales
            setCountry({ ...country, ...data });

            // Redirigir después de unos segundos
            setTimeout(() => router.push("/countries"), 1500);
        } catch (error: unknown) {
            console.error('Error updating country:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al actualizar el país. Inténtalo de nuevo.');
            }
        }
    };    // Mostrar loading si CSRF o country no están disponibles
    if (csrfLoading || loadingCountry) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                        <LoadingSpinner size="lg" />
                        <span className="text-gray-600">
                            {loadingCountry ? "Cargando datos del país..." : "Cargando sistema de seguridad..."}
                        </span>
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
                        <Link
                            href="/countries"
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Volver a la lista de países
                        </Link>
                    }
                />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: "Países", href: "/countries" },
        { label: country.name, href: `/countries/${country.id}` },
        { label: "Editar" }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />
            <FormLayout
                title="Información del País"
                subtitle="Modifica los campos necesarios"
                sidebarContent={
                    <Card title="Información Actual">
                        <div className="space-y-4 text-sm text-gray-600">
                            <div>
                                <p className="font-medium text-gray-900">Código Actual:</p>
                                <p className="font-mono">{country.code}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">País Actual:</p>
                                <p>{country.name}</p>
                            </div>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Código del país</p>
                                    <p>Debe ser un código ISO de 2 letras en mayúsculas</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                }
                onSubmit={handleSubmit(onSubmit)}
                showSidebar={true}
                csrfError={csrfError}
                csrfToken={csrfToken}
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
                    label="Código del País"
                    {...register("code")}
                    error={errors.code?.message}
                    placeholder="AR"
                    maxLength={2}
                    className="font-mono uppercase"
                    helpText="Código ISO de 2 letras (ej: AR, US, ES)"
                    onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase();
                    }}
                    required
                />
                <InputField
                    label="Nombre del País"
                    {...register("name")}
                    error={errors.name?.message}
                    placeholder="Ejemplo: Argentina"
                    required
                />

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
                        onClick={() => router.push(`/countries/${country.id}`)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        disabled={!csrfToken}
                    >
                        {!csrfToken ? 'Cargando...' : 'Actualizar País'}
                    </Button>
                </div>
            </FormLayout>
        </div>
    );
};

export default EditCountryPage;
