"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { useMessages } from "@/hooks/useMessages";
import { useCountries } from "@/hooks/useCountries";
import {
    Breadcrumb,
    PageHeader,
    InputField,
    Button,
    LoadingSpinner,
    Alert,
    Card,
    SelectField
} from "@/components/ui";
import { regionService, cityService } from '@/services';
import { LabelValuePair } from '@/types/common';
import { ServiceError } from '@/helpers/error-handler';

// Esquema de validación con Zod
const citySchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no puede exceder 100 caracteres"),
    code: z.string().min(1, "El código es obligatorio").max(10, "El código no puede exceder 10 caracteres"),
    countryId: z.string().min(1, "El país es obligatorio"),
    regionId: z.string().min(1, "La región/estado es obligatorio")
});

type CityFormData = z.infer<typeof citySchema>;

const CreateCityPage = () => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<CityFormData>({
        resolver: zodResolver(citySchema)
    });

    const { error, message, showError, showSuccess, clearAllMessages } = useMessages();
    const { countries, loading: loadingCountries } = useCountries();

    const router = useRouter();
    const { token: csrfToken, loading: csrfLoading, error: csrfError } = useCSRF();

    const [regions, setRegions] = useState<LabelValuePair[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(false);

    // Watch para los cambios en los selects
    const countryId = watch("countryId");
    const regionId = watch("regionId");

    useEffect(() => {
        const fetchRegions = async () => {
            setLoadingRegions(true);
            clearAllMessages(); // Limpiar errores previos
            try {
                const regionsData = await regionService.getAllAsLabelValues();
                setRegions(regionsData);
            } catch (error) {
                console.error('Error loading regions:', error);
                if (error instanceof ServiceError) {
                    switch (error.code) {
                        case 'NETWORK_ERROR':
                            showError('Error de conexión al cargar regiones. Verifica tu conexión a internet.');
                            break;
                        case 'UNAUTHORIZED':
                            showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
                            setTimeout(() => router.push('/login'), 2000);
                            break;
                        default:
                            showError('Error al cargar la lista de regiones. Por favor, recarga la página.');
                    }
                } else {
                    showError('Error inesperado al cargar regiones. Por favor, recarga la página.');
                }
            } finally {
                setLoadingRegions(false);
            }
        };
        fetchRegions();
    }, [countryId, setValue, router, showError, clearAllMessages]);

    const onSubmit = async (data: CityFormData) => {
        clearAllMessages();

        try {
            // Agregar isActive al envío de datos
            const cityData = {
                ...data,
                isActive: true
            };
            await cityService.create(cityData);
            showSuccess('Ciudad creada exitosamente');
            reset();
            setTimeout(() => router.push("/cities"), 1500);
        } catch (error: unknown) {
            console.error('Error al crear ciudad:', error);

            if (error instanceof ServiceError) {
                // Manejo específico para diferentes tipos de errores de servicio
                switch (error.code) {
                    case 'VALIDATION_ERROR':
                        showError(`Error de validación: ${error.message}`);
                        break;
                    case 'CONFLICT':
                        showError(`Ya existe una ciudad con estos datos: ${error.message}`);
                        break;
                    case 'UNAUTHORIZED':
                        showError('No tienes permisos para crear ciudades. Por favor, inicia sesión nuevamente.', false);
                        // Opcionalmente redirigir al login
                        setTimeout(() => router.push('/login'), 2000);
                        break;
                    case 'FORBIDDEN':
                        showError('No tienes los permisos necesarios para realizar esta acción.');
                        break;
                    case 'NETWORK_ERROR':
                        showError('Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.');
                        break;
                    case 'INTERNAL_SERVER_ERROR':
                        showError('Error interno del servidor. Por favor, intenta nuevamente en unos momentos.');
                        break;
                    default:
                        showError(error.message || 'Error desconocido al crear la ciudad');
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

    if (csrfLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                        <LoadingSpinner size="lg" />
                        <span className="text-gray-600">Cargando sistema de seguridad...</span>
                    </div>
                </div>
            </div>
        );
    }


    const breadcrumbItems = [
        { label: 'Ciudades', href: '/cities' },
        { label: 'Crear Ciudad' }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
            <PageHeader
                title="Crear Nueva Ciudad"
                subtitle="Agrega una nueva ciudad al sistema"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Información de la Ciudad" subtitle="Completa los campos requeridos">
                        {/* Mostrar errores de CSRF y errores generales de forma prominente */}
                        {csrfError && (
                            <Alert type="error" title="Error de seguridad" message={csrfError} />
                        )}
                        {error && (
                            <Alert
                                type="error"
                                title="Error al crear la ciudad"
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

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}
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
                            {regions.length !== 0 && (
                                <div>
                                    <SelectField
                                        {...register("regionId")}
                                        options={regions}
                                        label='Selecciona una región/estado'
                                        error={errors.regionId?.message}
                                    />
                                </div>
                            )}
                            {/* Regiones */}

                            {!regions.length && loadingRegions && (
                                <div className="text-sm text-gray-500 flex items-center">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Cargando regiones...
                                </div>
                            )}
                            {!regions.length && !loadingRegions && !error && (
                                <Alert
                                    type="warning"
                                    title="Sin regiones disponibles"
                                    message="No hay regiones disponibles. Por favor, crea al menos una región en el sistema antes de crear ciudades."
                                />
                            )}
                            <InputField
                                label="Código de la Ciudad"
                                {...register("code")}
                                error={errors.code?.message}
                                placeholder="Ej: 05001"
                                required
                            />
                            <InputField
                                label="Nombre de la Ciudad"
                                {...register("name")}
                                error={errors.name?.message}
                                placeholder="Ejemplo: Medellín"
                                required
                            />

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

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => router.push('/cities')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !csrfToken || !regionId }
                                    isLoading={isSubmitting}
                                    loadingText="Guardando..."
                                    leftIcon={!isSubmitting && csrfToken && regions.length > 0 ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    ) : undefined}
                                >
                                    {!csrfToken ? 'Cargando...' : regions.length === 0 ? 'Sin regiones' : 'Crear Ciudad'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Guía de Creación">
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Código único</p>
                                    <p>El código debe ser único y generalmente sigue estándares municipales (ej: 05001 para Medellín, 11001 para Bogotá)</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Región requerida</p>
                                    <p>Selecciona la región/estado al que pertenece la ciudad. Si no aparecen regiones, créalas primero</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Estado activo</p>
                                    <p>Las ciudades nuevas se crean activas automáticamente y estarán disponibles inmediatamente para su uso</p>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-50 rounded-md">
                                <div className="flex">
                                    <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <div>
                                        <p className="font-medium text-blue-900 text-sm">Consejo</p>
                                        <p className="text-blue-800 text-xs">Los códigos de ciudad suelen seguir el formato del código DANE en Colombia: primeros 2 dígitos para departamento + 3 dígitos para municipio.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateCityPage;
