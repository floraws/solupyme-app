"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { bPartnerService } from "@/services/bpartner.service";
import {
    Breadcrumb,
    PageHeader,
    InputField,
    Button,
    LoadingSpinner,
    Alert,
    Card,
    CheckboxGroup
} from "@/components/ui";

// Esquema de validación con Zod
const bpartnerSchema = z.object({
    code: z
        .string()
        .optional(),
    name: z
        .string()
        .min(1, "El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(200, "El nombre no puede exceder 200 caracteres"),
    email: z
        .string()
        .email("Debe ser un email válido")
        .optional()
        .or(z.literal("")),
    phone: z
        .string()
        .optional(),
    type: z.array(z.enum(['customer', 'supplier', 'employee', 'producer', 'transporter', 'vendor', 'contractor', 'partner', 'distributor', 'reseller', 'affiliate', 'consultant', 'freelancer', 'agent', 'broker', 'manufacturer', 'wholesaler', 'retailer', 'investor', 'sponsor']))
        .min(1, "Debe seleccionar al menos un tipo"),
    notes: z
        .string()
        .optional(),
});

type BPartnerFormData = z.infer<typeof bpartnerSchema>;

const CreateBPartnerPage = () => {
    const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<BPartnerFormData>({
        resolver: zodResolver(bpartnerSchema),
        defaultValues: {
            type: []
        }
    });
    const [message, setMessage] = React.useState<string | null>(null);
    const router = useRouter();

    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    const onSubmit = async (data: BPartnerFormData) => {
        setMessage(null);
        try {
            // Validar y obtener token CSRF
            await validateAndGetToken();

            // Crear el business partner usando el servicio
            await bPartnerService.create(data);

            setMessage('Business Partner creado exitosamente');
            reset();
            setTimeout(() => router.push("/bpartners"), 1500);
        } catch (error: unknown) {
            console.error('Error creating business partner:', error);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // Manejar errores específicos
            switch (errorMessage) {
                case 'DUPLICATE_CODE':
                    setMessage('Error: El código/identificación ya está registrado. Por favor, use un código diferente.');
                    break;
                case 'SERVER_ERROR':
                    setMessage('Error interno del servidor. Por favor, inténtalo más tarde.');
                    break;
                case 'NETWORK_ERROR':
                    setMessage('Error de conexión. Verifica tu conexión a internet.');
                    break;
                default:
                    if (errorMessage.startsWith('VALIDATION_ERROR:')) {
                        setMessage(`Error de validación: ${errorMessage.replace('VALIDATION_ERROR:', '').trim()}`);
                    } else {
                        const errorObj = error as { status?: number };
                        if (errorObj.status === 403) {
                            setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
                        } else {
                            setMessage('Error al crear el Business Partner. Inténtalo de nuevo.');
                        }
                    }
                    break;
            }
        }
    };

    // Mostrar loading si CSRF no está disponible
    if (csrfLoading) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
        { label: 'Socio de negocio', href: '/bpartners' },
        { label: 'Crear Socio de negocio' }
    ];

    const typeOptions = [
        { value: 'customer', label: 'Cliente' },
        { value: 'supplier', label: 'Proveedor' },
        { value: 'employee', label: 'Empleado' },
        { value: 'partner', label: 'Socio' },
    ];

    const watchedType = watch('type');

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
            <PageHeader
                title="Crear Nuevo Socio de Negocio"
                subtitle="Agrega un nuevo socio de negocio al sistema"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Form */}
                <div className="lg:col-span-3">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* CSRF Error Alert */}
                        {csrfError && (
                            <Alert
                                type="error"
                                title="Error de seguridad"
                                message={csrfError}
                            />
                        )}

                        {/* Información Básica */}
                        <Card>
                            {/* CSRF Token Hidden Field */}
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Codigo / Identificación / NIT"
                                    {...register("code")}
                                    error={errors.code?.message}
                                    placeholder="900123456"
                                />
                                <InputField
                                    label="Nombre"
                                    {...register("name")}
                                    error={errors.name?.message}
                                    placeholder="Nombre del socio de negocio"
                                    required
                                    className="md:col-span-2"
                                />


                                <InputField
                                    label="Email"
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                    placeholder="contacto@empresa.com"
                                />

                                <InputField
                                    label="Teléfono"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                    placeholder="+57 1 234 5678"
                                />

                                <CheckboxGroup
                                    label="Tipo"
                                    options={typeOptions}
                                    value={watchedType || []}
                                    onChange={(values) => setValue('type', values as BPartnerFormData["type"])}
                                    error={errors.type?.message}
                                    required
                                    className="md:col-span-2"
                                    columns={3}
                                />
                            </div>
                        </Card>

                        {/* Message */}
                        {message && (
                            <Alert
                                type={message.includes('exitosamente') ? 'success' : 'error'}
                                title={message.includes('exitosamente') ? 'Éxito' : 'Error'}
                                message={message}
                            />
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => router.push('/bpartners')}
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
                                {!csrfToken ? 'Cargando...' : 'Crear Business Partner'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <Card title="Información">
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Tipos de Socios</p>
                                    <p><strong>Cliente:</strong> Compra productos/servicios</p>
                                    <p><strong>Proveedor:</strong> Suministra productos/servicios</p>
                                    <p><strong>Socio:</strong> Colaboración estratégica</p>
                                    <p><strong>Distribuidor:</strong> Vende productos a terceros</p>
                                    <p><strong>Contratista:</strong> Servicios especializados</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Estados</p>
                                    <p><strong>Activo:</strong> Socio operativo</p>
                                    <p><strong>Inactivo:</strong> Socio suspendido</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CreateBPartnerPage;
