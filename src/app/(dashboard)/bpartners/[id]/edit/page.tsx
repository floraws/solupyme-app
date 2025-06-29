"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import { useCSRF } from "@/hooks/useCSRF";
import { BPartnerService } from "@/services/bpartner.service";
import { BPartnerResponse } from "@/types/api";
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
    status: z.enum(['active', 'inactive']),
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

const EditBPartnerPage = () => {
    const params = useParams();
    const router = useRouter();
    const [bpartner, setBPartner] = React.useState<BPartnerResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<BPartnerFormData>({
        resolver: zodResolver(bpartnerSchema)
    });
    
    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    // Cargar datos del business partner
    React.useEffect(() => {
        const id = params.id as string;
        if (id) {
            BPartnerService.getById(id)
                .then(bp => {
                    if (bp) {
                        setBPartner(bp);
                        // Rellenar el formulario con los datos existentes
                        reset({
                            name: bp.name,
                            email: bp.email || "",
                            phone: bp.phone || "",
                            address: bp.address || "",
                            city: bp.city || "",
                            country: bp.country || "",
                            taxId: bp.taxId || "",
                            type: bp.type,
                            status: bp.status || 'active',
                            legalName: bp.legalName || "",
                            tradeName: bp.tradeName || "",
                            website: bp.website || "",
                            industry: bp.industry || "",
                            companySize: bp.companySize,
                            notes: bp.notes || "",
                        });
                    } else {
                        setError("Business Partner no encontrado");
                    }
                })
                .catch(() => setError("Error al cargar los detalles del Business Partner"))
                .finally(() => setLoading(false));
        }
    }, [params.id, reset]);

    const onSubmit = async (data: BPartnerFormData) => {
        setMessage(null);
        try {
            // Validar y obtener token CSRF
            await validateAndGetToken();
            
            // Actualizar el business partner usando el servicio
            await BPartnerService.update(params.id as string, data);
            
            setMessage('Business Partner actualizado exitosamente');
            setTimeout(() => router.push(`/bpartners/${params.id}`), 1500);
        } catch (error: unknown) {
            console.error('Error updating business partner:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al actualizar el Business Partner. Inténtalo de nuevo.');
            }
        }
    };

    // Mostrar loading si CSRF no está disponible o si está cargando los datos
    if (csrfLoading || loading) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Card>
                    <div className="text-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-2 text-gray-600">
                            {csrfLoading ? "Cargando sistema de seguridad..." : "Cargando datos del Business Partner..."}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !bpartner) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Alert
                    type="error"
                    message={error || "Business Partner no encontrado"}
                    actions={
                        <a 
                            href="/bpartners" 
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Volver a la lista de Business Partners
                        </a>
                    }
                />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Business Partners', href: '/bpartners' },
        { label: bpartner.name, href: `/bpartners/${bpartner.id}` },
        { label: 'Editar' }
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
                title={`Editar: ${bpartner.name}`}
                subtitle="Modifica la información del socio de negocio"
                backButton={{
                    href: `/bpartners/${bpartner.id}`,
                    label: "Volver a detalles"
                }}
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
                                onClick={() => router.push(`/bpartners/${bpartner.id}`)}
                            >
                                Cancelar
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={isSubmitting || !csrfToken}
                                isLoading={isSubmitting}
                                loadingText="Guardando cambios..."
                                leftIcon={!isSubmitting && csrfToken ? (
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : undefined}
                            >
                                {!csrfToken ? 'Cargando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-1">
                    <Card title="Información del Registro">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Sistema</label>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="text-sm font-mono text-gray-900">{bpartner.id}</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Creado</label>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="text-sm text-gray-900">
                                        {new Date(bpartner.createdAt).toLocaleDateString('es-CO')}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Última Actualización</label>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="text-sm text-gray-900">
                                        {new Date(bpartner.updatedAt).toLocaleDateString('es-CO')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card title="Información" className="mt-6">
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start">
                                <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-medium text-gray-900">Modificar con cuidado</p>
                                    <p>Los cambios afectarán todos los registros relacionados con este Business Partner.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditBPartnerPage;
