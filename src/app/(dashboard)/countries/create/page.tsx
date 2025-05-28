"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { CountryRequest } from "@/models/CountryRequest";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import Link from "next/link";

const CreateCountryPage = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CountryRequest>();
    const [message, setMessage] = React.useState<string | null>(null);
    const router = useRouter();
    
    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    const onSubmit = async (data: CountryRequest) => {
        setMessage(null);
        try {
            // Validar y obtener token CSRF
            const validToken = await validateAndGetToken();
            
            // Usar fetchWrapper con CSRF token
            await fetchWrapper.postWithCSRF('/countries', data, validToken);
            setMessage('País creado exitosamente');
            reset();
            setTimeout(() => router.push("/countries"), 1500);        } catch (error: unknown) {
            console.error('Error creating country:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al crear el país. Inténtalo de nuevo.');
            }
        }
    };

    // Mostrar loading si CSRF no está disponible
    if (csrfLoading) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Cargando sistema de seguridad...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link href="/countries" className="text-gray-500 hover:text-gray-700 font-medium">
                            Países
                        </Link>
                    </li>
                    <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <li className="text-gray-900 font-medium">Crear País</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo País</h1>
                <p className="text-gray-600 mt-1">Agrega un nuevo país al sistema</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Información del País</h2>
                            <p className="text-sm text-gray-500 mt-1">Completa los campos requeridos</p>
                            {/* CSRF Error Alert */}
                            {csrfError && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-red-600 text-sm flex items-center">
                                        <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        Error de seguridad: {csrfError}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            {/* CSRF Token Hidden Field */}
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}

                            {/* Country Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                                    Nombre del País *
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { 
                                        required: "El nombre es obligatorio",
                                        minLength: { value: 2, message: "El nombre debe tener al menos 2 caracteres" }
                                    })}
                                    className={`block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                                        errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="Ejemplo: Argentina"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Country Code */}
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-2">
                                    Código del País *
                                </label>
                                <input
                                    id="code"
                                    type="text"
                                    {...register("code", { 
                                        required: "El código es obligatorio",
                                        pattern: {
                                            value: /^[A-Z]{2}$/,
                                            message: "El código debe ser de 2 letras mayúsculas (ej: AR)"
                                        }
                                    })}
                                    className={`block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono uppercase ${
                                        errors.code ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="AR"
                                    maxLength={2}
                                    style={{ textTransform: 'uppercase' }}
                                />
                                {errors.code && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.code.message}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">Código ISO de 2 letras (ej: AR, US, ES)</p>
                            </div>

                            {/* Message */}
                            {message && (
                                <div className={`rounded-lg p-4 ${
                                    message.includes('exitosamente') 
                                        ? 'bg-green-50 border border-green-200' 
                                        : 'bg-red-50 border border-red-200'
                                }`}>
                                    <div className="flex items-center">
                                        {message.includes('exitosamente') ? (
                                            <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                        <span className={`font-medium ${
                                            message.includes('exitosamente') ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                            {message}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Link
                                    href="/countries"
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !csrfToken}
                                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            {!csrfToken ? 'Cargando...' : 'Crear País'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar with Security Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información</h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Código del país</p>
                                    <p>Debe ser un código ISO de 2 letras en mayúsculas</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Validación automática</p>
                                    <p>Los campos se validan en tiempo real</p>
                                </div>
                            </div>
                            {/* Security Status */}
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Protección CSRF</p>
                                    <p>Formulario protegido contra ataques de falsificación de solicitudes</p>
                                    <p className="text-xs mt-1 text-green-600">
                                        {csrfToken ? '✓ Token activo' : '⏳ Cargando...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCountryPage;