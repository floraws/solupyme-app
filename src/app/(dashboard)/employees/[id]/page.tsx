"use client";
import { EmployeeService } from "@/services/employee.service";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  PageHeader,
  Breadcrumb,
  LoadingSpinner,
  Alert,
  Card,
  StatsCard
} from "@/components/ui";
import Link from "next/link";
import { EmployeeResponse } from "@/types/api";

const EmployeeDetailsPage = () => {
  const params = useParams();
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      EmployeeService.getById(id)
        .then(x => setEmployee(x))
        .catch(() => setError("Error al cargar los detalles del empleado"))
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando detalles del empleado...</span>
          </div>
        </div>
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
    { label: employee.fullName || `${employee.firstName} ${employee.lastName}` }
  ];

  const getStatusBadge = (status?: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
      case 'inactive':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Inactivo</span>;
      case 'on-leave':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En Licencia</span>;
      case 'terminated':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Terminado</span>;
      case 'suspended':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Suspendido</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Sin estado</span>;
    }
  };

  const formatCurrency = (amount?: number, currency?: string) => {
    if (typeof amount !== 'number') return 'N/A';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency || 'COP'
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <PageHeader
        title={employee.fullName || `${employee.firstName} ${employee.lastName}`}
        subtitle="Información completa del empleado"
        backButton={{
          href: "/employees",
          label: "Volver"
        }}
        actions={
          <Link
            href={`/employees/${employee.id}/edit`}
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Empleado
          </Link>
        }
      />

      {/* Stats Cards */}
      {(employee.salary || employee.vacationDaysRemaining !== undefined || employee.performanceRating) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {employee.salary && (
            <StatsCard
              title="Salario"
              value={formatCurrency(employee.salary, employee.currency)}
              icon="💰"
            />
          )}
          {employee.vacationDaysRemaining !== undefined && (
            <StatsCard
              title="Días de Vacaciones Restantes"
              value={employee.vacationDaysRemaining.toString()}
              icon="🏖️"
            />
          )}
          {employee.performanceRating && (
            <StatsCard
              title="Calificación de Desempeño"
              value={employee.performanceRating}
              icon="⭐"
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Información Básica */}
        <Card title="Información Básica" className="mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID del Sistema</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm font-mono text-gray-900">{employee.id}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  {getStatusBadge(employee.status)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <div className="bg-gray-50 rounded-lg p-3">
                {getStatusBadge(employee.status)}
              </div>
            </div>

            {employee.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-800">
                    {employee.email}
                  </a>
                </div>
              </div>
            )}

            {employee.phone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <a href={`tel:${employee.phone}`} className="text-blue-600 hover:text-blue-800">
                    {employee.phone}
                  </a>
                </div>
              </div>
            )}

            {employee.employeeNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Empleado</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 font-mono">{employee.employeeNumber}</span>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Información Laboral */}
        <Card title="Información Laboral" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{employee.position}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{employee.department}</span>
              </div>
            </div>

            {employee.team && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipo</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{employee.team}</span>
                </div>
              </div>
            )}

            {employee.workLocation && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación de Trabajo</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{employee.workLocation}</span>
                </div>
              </div>
            )}

            {employee.employmentType && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Empleo</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">
                    {employee.employmentType === 'full-time' ? 'Tiempo Completo' :
                     employee.employmentType === 'part-time' ? 'Tiempo Parcial' :
                     employee.employmentType === 'contract' ? 'Contrato' :
                     employee.employmentType === 'intern' ? 'Interno' :
                     employee.employmentType === 'temporary' ? 'Temporal' : employee.employmentType}
                  </span>
                </div>
              </div>
            )}

            {employee.employeeLevel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 capitalize">{employee.employeeLevel}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Información Personal */}
      {(employee.dateOfBirth || employee.nationalId || employee.nationality || employee.homeAddress) && (
        <Card title="Información Personal" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employee.dateOfBirth && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{formatDate(employee.dateOfBirth)}</span>
                </div>
              </div>
            )}

            {employee.nationalId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 font-mono">{employee.nationalId}</span>
                </div>
              </div>
            )}

            {employee.nationality && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nacionalidad</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900">{employee.nationality}</span>
                </div>
              </div>
            )}

            {employee.maritalStatus && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 capitalize">
                    {employee.maritalStatus === 'single' ? 'Soltero' :
                     employee.maritalStatus === 'married' ? 'Casado' :
                     employee.maritalStatus === 'divorced' ? 'Divorciado' :
                     employee.maritalStatus === 'widowed' ? 'Viudo' : employee.maritalStatus}
                  </span>
                </div>
              </div>
            )}
          </div>

          {employee.homeAddress && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Residencia</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-gray-900">
                  {employee.homeAddress.street && <div>{employee.homeAddress.street}</div>}
                  <div>
                    {employee.homeAddress.city && employee.homeAddress.city}
                    {employee.homeAddress.state && `, ${employee.homeAddress.state}`}
                    {employee.homeAddress.postalCode && ` ${employee.homeAddress.postalCode}`}
                  </div>
                  {employee.homeAddress.country && <div>{employee.homeAddress.country}</div>}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Información Salarial */}
      {(employee.salary || employee.bankAccount) && (
        <Card title="Información Salarial" className="mb-6">
          <div className="space-y-4">
            {employee.salary && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salario</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-gray-900 font-mono">{formatCurrency(employee.salary, employee.currency)}</span>
                  {employee.salaryType && (
                    <span className="text-gray-500 ml-2">
                      ({employee.salaryType === 'monthly' ? 'Mensual' : 
                        employee.salaryType === 'annual' ? 'Anual' : 
                        employee.salaryType === 'hourly' ? 'Por Hora' : employee.salaryType})
                    </span>
                  )}
                </div>
              </div>
            )}

            {employee.bankAccount && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuenta Bancaria</label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-900 font-mono">{employee.bankAccount}</div>
                  {employee.bankName && (
                    <div className="text-gray-500 text-sm">{employee.bankName}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Fechas Importantes */}
      <Card title="Fechas Importantes" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-900">{formatDate(employee.hireDate)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Creación</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-900">{formatDate(employee.createdAt)}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Última Actualización</label>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-900">{formatDate(employee.updatedAt)}</span>
            </div>
          </div>

          {employee.startDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{formatDate(employee.startDate)}</span>
              </div>
            </div>
          )}

          {employee.probationEndDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fin del Período de Prueba</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{formatDate(employee.probationEndDate)}</span>
              </div>
            </div>
          )}

          {employee.nextReviewDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Evaluación</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-900">{formatDate(employee.nextReviewDate)}</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Habilidades */}
      {employee.skills && employee.skills.length > 0 && (
        <Card title="Habilidades" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employee.skills.map((skill, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="font-medium text-gray-900">{skill.name}</div>
                <div className="text-sm text-gray-500 capitalize">
                  Nivel: {skill.level}
                  {skill.yearsOfExperience && ` • ${skill.yearsOfExperience} años`}
                </div>
                {skill.category && (
                  <div className="text-xs text-gray-400">{skill.category}</div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Contactos de Emergencia */}
      {employee.emergencyContacts && employee.emergencyContacts.length > 0 && (
        <Card title="Contactos de Emergencia" className="mb-6">
          <div className="space-y-4">
            {employee.emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <div className="text-sm text-gray-500">
                      {contact.relationship}
                      {contact.isPrimary && <span className="ml-2 text-blue-600">(Principal)</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="text-sm text-gray-900">
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                      {contact.phone}
                    </a>
                  </div>
                  {contact.email && (
                    <div className="text-sm text-gray-900">
                      <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.address && (
                    <div className="text-sm text-gray-500">{contact.address}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Notas */}
      {employee.notes && (
        <Card title="Notas" className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{employee.notes}</p>
          </div>
        </Card>
      )}

      {/* Acciones */}
      <Card title="Acciones Disponibles">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href={`/employees/${employee.id}/edit`}
            className="flex items-center justify-center px-4 py-3 border border-green-300 rounded-lg text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Empleado
          </Link>
          
          <Link
            href="/employees"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Ver Todos los Empleados
          </Link>

          {employee.email && (
            <a
              href={`mailto:${employee.email}`}
              className="flex items-center justify-center px-4 py-3 border border-blue-300 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar Email
            </a>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDetailsPage;
