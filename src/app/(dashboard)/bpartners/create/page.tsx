"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { BPartnerService } from "@/services/bpartner.service";
import {
    Breadcrumb,
    PageHeader,
    InputField,
    SelectField,
    Button,
    LoadingSpinner,
    Alert,
    Card
} from "@/components/ui";

// Esquema de validación con Zod
const bpartnerSchema = z.object({
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
    address: z
        .string()
        .optional(),
    city: z
        .string()
        .optional(),
    country: z
        .string()
        .optional(),
    taxId: z
        .string()
        .optional(),
    type: z.enum(['customer', 'supplier', 'both'], {
        required_error: "El tipo es obligatorio"
    }),
    status: z.enum(['active', 'inactive'], {
        required_error: "El estado es obligatorio"
    }),
    legalName: z
        .string()
        .optional(),
    tradeName: z
        .string()
        .optional(),
    website: z
        .string()
        .url("Debe ser una URL válida")
        .optional()
        .or(z.literal("")),
    industry: z
        .string()
        .optional(),
    companySize: z.enum(['micro', 'small', 'medium', 'large', 'enterprise']).optional(),
    notes: z
        .string()
        .optional(),
});

type BPartnerFormData = z.infer<typeof bpartnerSchema>;

const CreateBPartnerPage = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BPartnerFormData>({
        resolver: zodResolver(bpartnerSchema),
        defaultValues: {
            status: 'active',
            type: 'customer'
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
            await BPartnerService.create(data);
            
            setMessage('Business Partner creado exitosamente');
            reset();
            setTimeout(() => router.push("/bpartners"), 1500);
        } catch (error: unknown) {
            console.error('Error creating business partner:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al crear el Business Partner. Inténtalo de nuevo.');
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
        { label: 'Business Partners', href: '/bpartners' },
        { label: 'Crear Business Partner' }
    ];

    const typeOptions = [
        { value: 'customer', label: 'Cliente' },
        { value: 'supplier', label: 'Proveedor' },
        { value: 'both', label: 'Cliente y Proveedor' }
    ];

    const statusOptions = [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' }
    ];

    const companySizeOptions = [
        { value: 'micro', label: 'Microempresa' },
        { value: 'small', label: 'Pequeña empresa' },
        { value: 'medium', label: 'Mediana empresa' },
        { value: 'large', label: 'Gran empresa' },
        { value: 'enterprise', label: 'Corporación' }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
            <PageHeader
                title="Crear Nuevo Business Partner"
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
                        <Card title="Información Básica" subtitle="Datos principales del socio de negocio">
                            {/* CSRF Token Hidden Field */}
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Nombre"
                                    {...register("name")}
                                    error={errors.name?.message}
                                    placeholder="Nombre del socio de negocio"
                                    required
                                />

                                <SelectField
                                    label="Tipo"
                                    {...register("type")}
                                    error={errors.type?.message}
                                    options={typeOptions}
                                    required
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

                                <SelectField
                                    label="Estado"
                                    {...register("status")}
                                    error={errors.status?.message}
                                    options={statusOptions}
                                />

                                <InputField
                                    label="ID Tributario"
                                    {...register("taxId")}
                                    error={errors.taxId?.message}
                                    placeholder="900123456-1"
                                />
                            </div>
                        </Card>

                        {/* Información Legal */}
                        <Card title="Información Legal" subtitle="Datos legales y corporativos">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Razón Social"
                                    {...register("legalName")}
                                    error={errors.legalName?.message}
                                    placeholder="Empresa S.A.S."
                                />

                                <InputField
                                    label="Nombre Comercial"
                                    {...register("tradeName")}
                                    error={errors.tradeName?.message}
                                    placeholder="Marca Comercial"
                                />

                                <InputField
                                    label="Sitio Web"
                                    type="url"
                                    {...register("website")}
                                    error={errors.website?.message}
                                    placeholder="https://www.empresa.com"
                                />

                                <InputField
                                    label="Industria"
                                    {...register("industry")}
                                    error={errors.industry?.message}
                                    placeholder="Tecnología, Manufactura, etc."
                                />

                                <SelectField
                                    label="Tamaño de Empresa"
                                    {...register("companySize")}
                                    error={errors.companySize?.message}
                                    options={companySizeOptions}
                                />
                            </div>
                        </Card>

                        {/* Información de Ubicación */}
                        <Card title="Ubicación" subtitle="Datos de dirección y ubicación">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Dirección"
                                    {...register("address")}
                                    error={errors.address?.message}
                                    placeholder="Carrera 15 #85-32, Oficina 501"
                                />

                                <InputField
                                    label="Ciudad"
                                    {...register("city")}
                                    error={errors.city?.message}
                                    placeholder="Bogotá"
                                />

                                <InputField
                                    label="País"
                                    {...register("country")}
                                    error={errors.country?.message}
                                    placeholder="Colombia"
                                />
                            </div>
                        </Card>

                        {/* Notas */}
                        <Card title="Información Adicional" subtitle="Notas y comentarios">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notas
                                    </label>
                                    <textarea
                                        {...register("notes")}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Información adicional sobre el socio de negocio..."
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                                    )}
                                </div>
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
                                    <p><strong>Cliente:</strong> Solo compra productos/servicios</p>
                                    <p><strong>Proveedor:</strong> Solo suministra productos/servicios</p>
                                    <p><strong>Ambos:</strong> Puede ser cliente y proveedor</p>
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
