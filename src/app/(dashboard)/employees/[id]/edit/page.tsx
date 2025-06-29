"use client";
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCSRF } from "@/hooks/useCSRF";
import { EmployeeService } from "@/services/employee.service";
import { EmployeeResponse } from "@/types/api";
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

// Esquema de validación con Zod (igual al de crear)
const employeeSchema = z.object({
    firstName: z
        .string()
        .min(1, "El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    lastName: z
        .string()
        .min(1, "El apellido es obligatorio")
        .min(2, "El apellido debe tener al menos 2 caracteres")
        .max(100, "El apellido no puede exceder 100 caracteres"),
    email: z
        .string()
        .min(1, "El email es obligatorio")
        .email("Debe ser un email válido"),
    phone: z
        .string()
        .optional(),
    employeeNumber: z
        .string()
        .optional(),
    position: z
        .string()
        .min(1, "La posición es obligatoria")
        .min(2, "La posición debe tener al menos 2 caracteres"),
    department: z
        .string()
        .min(1, "El departamento es obligatorio"),
    workLocation: z
        .string()
        .optional(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern', 'temporary'], {
        required_error: "El tipo de empleo es obligatorio"
    }),
    status: z.enum(['active', 'inactive', 'on-leave', 'terminated', 'suspended'], {
        required_error: "El estado es obligatorio"
    }),
    employeeLevel: z.enum(['junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive']).optional(),
    employeeType: z.enum(['employee', 'contractor', 'consultant', 'intern']).optional(),
    hireDate: z
        .string()
        .min(1, "La fecha de contratación es obligatoria"),
    salary: z
        .string()
        .optional()
        .transform((val) => val === "" ? undefined : val)
        .refine((val) => val === undefined || !isNaN(Number(val)), "El salario debe ser un número válido"),
    currency: z
        .string()
        .optional(),
    salaryType: z.enum(['hourly', 'monthly', 'annual']).optional(),
    dateOfBirth: z
        .string()
        .optional(),
    nationalId: z
        .string()
        .optional(),
    nationality: z
        .string()
        .optional(),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),
    gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional(),
    homeAddress: z
        .string()
        .optional(),
    city: z
        .string()
        .optional(),
    state: z
        .string()
        .optional(),
    postalCode: z
        .string()
        .optional(),
    country: z
        .string()
        .optional(),
    notes: z
        .string()
        .optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EditEmployeePage = () => {
    const params = useParams();
    const router = useRouter();
    const [employee, setEmployee] = React.useState<EmployeeResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string | null>(null);
    
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema)
    });
    
    const { token: csrfToken, loading: csrfLoading, error: csrfError, validateAndGetToken } = useCSRF();

    // Cargar datos del empleado
    React.useEffect(() => {
        const id = params.id as string;
        if (id) {
            EmployeeService.getById(id)
                .then(emp => {
                    if (emp) {
                        setEmployee(emp);
                        // Rellenar el formulario con los datos existentes
                        reset({
                            firstName: emp.firstName,
                            lastName: emp.lastName,
                            email: emp.email,
                            phone: emp.phone || "",
                            employeeNumber: emp.employeeNumber || "",
                            position: emp.position,
                            department: emp.department,
                            workLocation: emp.workLocation || "",
                            employmentType: emp.employmentType,
                            status: emp.status,
                            employeeLevel: emp.employeeLevel,
                            employeeType: emp.employeeType,
                            hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : "",
                            salary: emp.salary ? emp.salary.toString() : "",
                            currency: emp.currency || "COP",
                            salaryType: emp.salaryType,
                            dateOfBirth: emp.dateOfBirth || "",
                            nationalId: emp.nationalId || "",
                            nationality: emp.nationality || "",
                            maritalStatus: emp.maritalStatus,
                            gender: emp.gender,
                            homeAddress: emp.homeAddress?.street || "",
                            city: emp.homeAddress?.city || "",
                            state: emp.homeAddress?.state || "",
                            postalCode: emp.homeAddress?.postalCode || "",
                            country: emp.homeAddress?.country || "",
                            notes: emp.notes || "",
                        });
                    } else {
                        setError("Empleado no encontrado");
                    }
                })
                .catch(() => setError("Error al cargar los detalles del empleado"))
                .finally(() => setLoading(false));
        }
    }, [params.id, reset]);

    const onSubmit = async (data: EmployeeFormData) => {
        setMessage(null);
        try {
            // Validar y obtener token CSRF
            await validateAndGetToken();
            
            // Transformar los datos para el API
            const employeeData = {
                ...data,
                fullName: `${data.firstName} ${data.lastName}`,
                salary: data.salary ? Number(data.salary) : undefined,
                homeAddress: data.homeAddress ? {
                    street: data.homeAddress,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country
                } : undefined
            };
            
            // Actualizar el empleado usando el servicio
            await EmployeeService.update(params.id as string, employeeData);
            
            setMessage('Empleado actualizado exitosamente');
            setTimeout(() => router.push(`/employees/${params.id}`), 1500);
        } catch (error: unknown) {
            console.error('Error updating employee:', error);
            const errorObj = error as { status?: number };
            if (errorObj.status === 403) {
                setMessage('Error de seguridad: Token CSRF inválido. Por favor, recarga la página.');
            } else {
                setMessage('Error al actualizar el empleado. Inténtalo de nuevo.');
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
                            {csrfLoading ? "Cargando sistema de seguridad..." : "Cargando datos del empleado..."}
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Alert
                    type="error"
                    message={error || "Empleado no encontrado"}
                    actions={
                        <Link 
                            href="/employees" 
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Volver a la lista de empleados
                        </Link>
                    }
                />
            </div>
        );
    }

    const breadcrumbItems = [
        { label: 'Empleados', href: '/employees' },
        { label: employee.fullName || `${employee.firstName} ${employee.lastName}`, href: `/employees/${employee.id}` },
        { label: 'Editar' }
    ];

    const employmentTypeOptions = [
        { value: 'full-time', label: 'Tiempo Completo' },
        { value: 'part-time', label: 'Tiempo Parcial' },
        { value: 'contract', label: 'Contrato' },
        { value: 'intern', label: 'Interno' },
        { value: 'temporary', label: 'Temporal' }
    ];

    const statusOptions = [
        { value: 'active', label: 'Activo' },
        { value: 'inactive', label: 'Inactivo' },
        { value: 'on-leave', label: 'En Licencia' },
        { value: 'terminated', label: 'Terminado' },
        { value: 'suspended', label: 'Suspendido' }
    ];

    const levelOptions = [
        { value: '', label: 'Seleccionar nivel...' },
        { value: 'junior', label: 'Junior' },
        { value: 'mid', label: 'Mid' },
        { value: 'senior', label: 'Senior' },
        { value: 'lead', label: 'Lead' },
        { value: 'manager', label: 'Manager' },
        { value: 'director', label: 'Director' },
        { value: 'executive', label: 'Executive' }
    ];

    const typeOptions = [
        { value: '', label: 'Seleccionar tipo...' },
        { value: 'employee', label: 'Empleado' },
        { value: 'contractor', label: 'Contratista' },
        { value: 'consultant', label: 'Consultor' },
        { value: 'intern', label: 'Interno' }
    ];

    const maritalStatusOptions = [
        { value: '', label: 'Seleccionar estado civil...' },
        { value: 'single', label: 'Soltero' },
        { value: 'married', label: 'Casado' },
        { value: 'divorced', label: 'Divorciado' },
        { value: 'widowed', label: 'Viudo' },
        { value: 'other', label: 'Otro' }
    ];

    const genderOptions = [
        { value: '', label: 'Seleccionar género...' },
        { value: 'male', label: 'Masculino' },
        { value: 'female', label: 'Femenino' },
        { value: 'other', label: 'Otro' },
        { value: 'prefer-not-to-say', label: 'Prefiero no decir' }
    ];

    const salaryTypeOptions = [
        { value: 'hourly', label: 'Por Hora' },
        { value: 'monthly', label: 'Mensual' },
        { value: 'annual', label: 'Anual' }
    ];

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Breadcrumb items={breadcrumbItems} />
            <PageHeader
                title={`Editar: ${employee.fullName || `${employee.firstName} ${employee.lastName}`}`}
                subtitle="Modifica la información del empleado"
                backButton={{
                    href: `/employees/${employee.id}`,
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
                        <Card title="Información Básica" subtitle="Datos principales del empleado">
                            {/* CSRF Token Hidden Field */}
                            {csrfToken && (
                                <input type="hidden" name="csrf_token" value={csrfToken} />
                            )}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Nombre *"
                                    {...register("firstName")}
                                    error={errors.firstName?.message}
                                    placeholder="María"
                                />
                                
                                <InputField
                                    label="Apellido *"
                                    {...register("lastName")}
                                    error={errors.lastName?.message}
                                    placeholder="González"
                                />
                                
                                <InputField
                                    label="Email *"
                                    type="email"
                                    {...register("email")}
                                    error={errors.email?.message}
                                    placeholder="maria.gonzalez@empresa.com"
                                />
                                
                                <InputField
                                    label="Teléfono"
                                    {...register("phone")}
                                    error={errors.phone?.message}
                                    placeholder="+57 300 123 4567"
                                />

                                <InputField
                                    label="Número de Empleado"
                                    {...register("employeeNumber")}
                                    error={errors.employeeNumber?.message}
                                    placeholder="EMP-2025-001"
                                />

                                <SelectField
                                    label="Estado *"
                                    {...register("status")}
                                    error={errors.status?.message}
                                    options={statusOptions}
                                />
                            </div>
                        </Card>

                        {/* Información Laboral */}
                        <Card title="Información Laboral" subtitle="Detalles del trabajo y posición">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Posición *"
                                    {...register("position")}
                                    error={errors.position?.message}
                                    placeholder="Gerente de Desarrollo"
                                />
                                
                                <SelectField
                                    label="Departamento *"
                                    {...register("department")}
                                    error={errors.department?.message}
                                    options={[
                                        { value: '', label: 'Seleccionar departamento...' },
                                        { value: 'Tecnología', label: 'Tecnología' },
                                        { value: 'Ventas', label: 'Ventas' },
                                        { value: 'Marketing', label: 'Marketing' },
                                        { value: 'Recursos Humanos', label: 'Recursos Humanos' },
                                        { value: 'Finanzas', label: 'Finanzas' },
                                        { value: 'Operaciones', label: 'Operaciones' },
                                        { value: 'Administración', label: 'Administración' }
                                    ]}
                                />

                                <InputField
                                    label="Ubicación de Trabajo"
                                    {...register("workLocation")}
                                    error={errors.workLocation?.message}
                                    placeholder="Bogotá - Oficina Principal"
                                />

                                <SelectField
                                    label="Tipo de Empleo *"
                                    {...register("employmentType")}
                                    error={errors.employmentType?.message}
                                    options={employmentTypeOptions}
                                />

                                <SelectField
                                    label="Nivel"
                                    {...register("employeeLevel")}
                                    error={errors.employeeLevel?.message}
                                    options={levelOptions}
                                />

                                <SelectField
                                    label="Tipo de Empleado"
                                    {...register("employeeType")}
                                    error={errors.employeeType?.message}
                                    options={typeOptions}
                                />

                                <InputField
                                    label="Fecha de Contratación *"
                                    type="date"
                                    {...register("hireDate")}
                                    error={errors.hireDate?.message}
                                />
                            </div>
                        </Card>

                        {/* Información Salarial */}
                        <Card title="Información Salarial" subtitle="Detalles de compensación">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <InputField
                                    label="Salario"
                                    type="number"
                                    {...register("salary")}
                                    error={errors.salary?.message}
                                    placeholder="8500000"
                                />

                                <SelectField
                                    label="Moneda"
                                    {...register("currency")}
                                    error={errors.currency?.message}
                                    options={[
                                        { value: 'COP', label: 'COP - Peso Colombiano' },
                                        { value: 'USD', label: 'USD - Dólar Americano' },
                                        { value: 'EUR', label: 'EUR - Euro' }
                                    ]}
                                />

                                <SelectField
                                    label="Tipo de Salario"
                                    {...register("salaryType")}
                                    error={errors.salaryType?.message}
                                    options={salaryTypeOptions}
                                />
                            </div>
                        </Card>

                        {/* Información Personal */}
                        <Card title="Información Personal" subtitle="Datos personales del empleado">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Fecha de Nacimiento"
                                    type="date"
                                    {...register("dateOfBirth")}
                                    error={errors.dateOfBirth?.message}
                                />

                                <InputField
                                    label="Cédula de Identidad"
                                    {...register("nationalId")}
                                    error={errors.nationalId?.message}
                                    placeholder="1234567890"
                                />

                                <InputField
                                    label="Nacionalidad"
                                    {...register("nationality")}
                                    error={errors.nationality?.message}
                                    placeholder="Colombiana"
                                />

                                <SelectField
                                    label="Estado Civil"
                                    {...register("maritalStatus")}
                                    error={errors.maritalStatus?.message}
                                    options={maritalStatusOptions}
                                />

                                <SelectField
                                    label="Género"
                                    {...register("gender")}
                                    error={errors.gender?.message}
                                    options={genderOptions}
                                />
                            </div>
                        </Card>

                        {/* Dirección */}
                        <Card title="Dirección de Residencia" subtitle="Información de ubicación">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Dirección"
                                        {...register("homeAddress")}
                                        error={errors.homeAddress?.message}
                                        placeholder="Carrera 45 #123-45, Apartamento 801"
                                    />
                                </div>

                                <InputField
                                    label="Ciudad"
                                    {...register("city")}
                                    error={errors.city?.message}
                                    placeholder="Bogotá"
                                />

                                <InputField
                                    label="Estado/Departamento"
                                    {...register("state")}
                                    error={errors.state?.message}
                                    placeholder="Cundinamarca"
                                />

                                <InputField
                                    label="Código Postal"
                                    {...register("postalCode")}
                                    error={errors.postalCode?.message}
                                    placeholder="110221"
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
                                        placeholder="Información adicional sobre el empleado..."
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
                                onClick={() => router.push(`/employees/${employee.id}`)}
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
                                    <span className="text-sm font-mono text-gray-900">{employee.id}</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Creado</label>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="text-sm text-gray-900">
                                        {new Date(employee.createdAt).toLocaleDateString('es-CO')}
                                    </span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Última Actualización</label>
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <span className="text-sm text-gray-900">
                                        {new Date(employee.updatedAt).toLocaleDateString('es-CO')}
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
                                    <p>Los cambios afectarán todos los registros relacionados con este empleado.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeePage;
