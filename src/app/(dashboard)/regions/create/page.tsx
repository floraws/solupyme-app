"use client";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { useMessages } from "@/hooks/useMessages";
import {
    Breadcrumb,
    PageHeader,
    InputField,
    Button,
    LoadingSpinner,
    Alert,
    Card
} from "@/components/ui";
import { countryService, regionService } from '@/services';
import { LabelValuePair } from '@/types/common';
import { ServiceError } from '@/helpers/error-handler';

// Esquema de validación con Zod
const regionSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio").max(100, "El nombre no puede exceder 100 caracteres"),
    code: z.string().min(1, "El código es obligatorio").max(10, "El código no puede exceder 10 caracteres"),
    countryId: z.string().min(1, "El país es obligatorio")
});

type RegionFormData = z.infer<typeof regionSchema>;

const CreateRegionPage = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegionFormData>({
        resolver: zodResolver(regionSchema)
    });
    
    // Hook reutilizable para manejo de mensajes
    const { error, message, showError, showSuccess, clearAllMessages } = useMessages();
    
    const router = useRouter();
    const { token: csrfToken, loading: csrfLoading, error: csrfError } = useCSRF();

    const [countries, setCountries] = useState<LabelValuePair[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    useEffect(() => {
        const fetchCountries = async () => {
            setLoadingCountries(true);
            clearAllMessages(); // Limpiar errores previos
            try {
                const countriesData = await countryService.getLabelValuesList();
                setCountries(countriesData);
            } catch (error) {
                console.error('Error loading countries:', error);
                if (error instanceof ServiceError) {
                    switch (error.code) {
                        case 'NETWORK_ERROR':
                            showError('Error de conexión al cargar países. Verifica tu conexión a internet.');
                            break;
                        case 'UNAUTHORIZED':
                            showError('Sesión expirada. Por favor, inicia sesión nuevamente.', false);
                            setTimeout(() => router.push('/login'), 2000);
                            break;
                        default:
                            showError('Error al cargar la lista de países. Por favor, recarga la página.');
                    }
                } else {
                    showError('Error inesperado al cargar países. Por favor, recarga la página.');
                }
            } finally {
                setLoadingCountries(false);
            }
        };
        fetchCountries();
    }, [router, showError, clearAllMessages]);

    const onSubmit = async (data: RegionFormData) => {
        clearAllMessages();
        
        try {
            await regionService.create(data);
            showSuccess('Región creada exitosamente');
            reset();
            setTimeout(() => router.push("/regions"), 1500);
        } catch (error: unknown) {
            console.error('Error al crear región:', error);
            
            if (error instanceof ServiceError) {
                // Manejo específico para diferentes tipos de errores de servicio
                switch (error.code) {
                    case 'VALIDATION_ERROR':
                        showError(`Error de validación: ${error.message}`);
                        break;
                    case 'CONFLICT':
                        showError(`Ya existe una región con estos datos: ${error.message}`);
                        break;
                    case 'UNAUTHORIZED':
                        showError('No tienes permisos para crear regiones. Por favor, inicia sesión nuevamente.', false);
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
                        showError(error.message || 'Error desconocido al crear la región');
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
                <Card>
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-2 text-gray-600">Cargando sistema de seguridad...</p>
                    </div>
                </Card>
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Regiones', href: '/regions' },
        { label: 'Crear Región' }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
            <PageHeader
                title="Crear Nueva Región"
                subtitle="Agrega una nueva región al sistema"
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card title="Información de la Región" subtitle="Completa los campos requeridos">
                        {/* Mostrar errores de CSRF y errores generales de forma prominente */}
                        {csrfError && (
                            <Alert type="error" title="Error de seguridad" message={csrfError} />
                        )}
                        {error && (
                            <Alert 
                                type="error" 
                                title="Error al crear la región" 
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
                            {countries.length !== 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                                    <select
                                        {...register("countryId")}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Selecciona un país</option>
                                        {countries.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    {errors.countryId && (
                                        <p className="mt-1 text-sm text-red-600">{errors.countryId.message}</p>
                                    )}
                                </div>
                            )}
                            {!countries.length && loadingCountries && (
                                <div className="text-sm text-gray-500 flex items-center">
                                    <LoadingSpinner size="sm" className="mr-2" />
                                    Cargando países...
                                </div>
                            )}
                            {!countries.length && !loadingCountries && !error && (
                                <Alert 
                                    type="warning" 
                                    title="Sin países disponibles"
                                    message="No hay países disponibles. Por favor, crea al menos un país en el sistema antes de crear regiones."
                                />
                            )}
                            {!countries.length && !loadingCountries && error && error.includes('países') && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                    <div className="flex items-center">
                                        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="text-sm text-yellow-800">
                                                No se pudieron cargar los países. El campo País es requerido para crear una región.
                                            </p>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled={loadingCountries}
                                            isLoading={loadingCountries}
                                            loadingText="Cargando..."
                                        >
                                            Reintentar
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <InputField
                                label="Código de la Región"
                                {...register("code")}
                                error={errors.code?.message}
                                placeholder="Ej: 05"
                                required
                            />
                            <InputField
                                label="Nombre de la Región"
                                {...register("name")}
                                error={errors.name?.message}
                                placeholder="Ejemplo: Antioquia"
                                required
                            />

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => router.push('/regions')}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !csrfToken}
                                    isLoading={isSubmitting}
                                    loadingText="Guardando..."
                                    leftIcon={!isSubmitting && csrfToken ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                    ) : undefined}
                                >
                                    {!csrfToken ? 'Cargando...' : 'Crear Región'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Información">
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Código de la región</p>
                                    <p>Debe ser un código único y corto (ej: ANT, CUN, BOG)</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateRegionPage;
