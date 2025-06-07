"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { fetchWrapper } from "@/helpers/fetch-wrapper";
import Link from "next/link";
import {
    Breadcrumb,
    PageHeader,
    InputField,
    Button,
    LoadingSpinner,
    Alert,
    Card
} from "@/components/ui";

// Esquema de validación con Zod
const countrySchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    code: z
        .string()
        .min(1, "El código es obligatorio")
        .length(2, "El código debe ser de exactamente 2 caracteres")
        .regex(/^[A-Z]{2}$/, "El código debe ser de 2 letras mayúsculas (ej: AR)")
        .transform(val => val.toUpperCase())
});

type CountryFormData = z.infer<typeof countrySchema>;

const CreateCountryPage = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CountryFormData>({
        resolver: zodResolver(countrySchema)
    });
    const [message, setMessage] = React.useState<string | null>(null);
    const router = useRouter();
    
    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    const onSubmit = async (data: CountryFormData) => {
        setMessage(null);
        try {
            // Validar y obtener token CSRF
            const validToken = await validateAndGetToken();
            
            // Usar fetchWrapper con CSRF token
            await fetchWrapper.post('/countries', data, validToken);
            setMessage('País creado exitosamente');
            reset();
            setTimeout(() => router.push("/countries"), 1500);
        } catch (error: unknown) {
            console.error('Error creating country:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al crear el país. Inténtalo de nuevo.');
            }
        }
    };    // Mostrar loading si CSRF no está disponible
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
        { label: 'Países', href: '/countries' },
        { label: 'Crear País' }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
              <PageHeader
                title="Crear Nuevo País"
                subtitle="Agrega un nuevo país al sistema"
            />            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                    <Card title="Información del País" subtitle="Completa los campos requeridos">
                        {/* CSRF Error Alert */}
                        {csrfError && (
                            <Alert
                                type="error"
                                title="Error de seguridad"
                                message={csrfError}
                            />
                        )}
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* CSRF Token Hidden Field */}
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}                            <InputField
                                label="Nombre del País"
                                {...register("name")}
                                error={errors.name?.message}
                                placeholder="Ejemplo: Argentina"
                                required
                            />

                            <InputField
                                label="Código del País"
                                {...register("code")}
                                error={errors.code?.message}
                                placeholder="AR"
                                required
                                maxLength={2}
                                className="font-mono uppercase"
                                style={{ textTransform: 'uppercase' }}
                                helpText="Código ISO de 2 letras (ej: AR, US, ES)"
                                onChange={(e) => {
                                    e.target.value = e.target.value.toUpperCase();
                                    register("code").onChange(e);
                                }}
                            />

                            {/* Message */}
                            {message && (
                                <Alert
                                    type={message.includes('exitosamente') ? 'success' : 'error'}
                                    title={message.includes('exitosamente') ? 'Éxito' : 'Error'}
                                    message={message}
                                />
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={() => router.push('/countries')}
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
                                    {!csrfToken ? 'Cargando...' : 'Crear País'}
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
                                    <p className="font-medium text-gray-900">Código del país</p>
                                    <p>Debe ser un código ISO de 2 letras en mayúsculas</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateCountryPage;