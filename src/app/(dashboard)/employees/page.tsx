"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  PageHeader,
  SearchBar,
  LoadingSpinner,
  Alert,
  Table,
  ActionButtonGroup,
  ConfirmDialog,
  EmptyState,
  StatsCard,
  SelectField
} from "@/components/ui";
import { EmployeeResponse } from "@/types/api/responses/employee.response";
import { EmployeeService } from "@/services/employee.service";

export default function EmployeesPage() {
  useAuth();

  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeResponse | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    active: number;
    inactive: number;
    onLeave: number;
    byDepartment: Record<string, number>;
    byLevel: Record<string, number>;
    byType: Record<string, number>;
  } | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const [employeesData, statsData] = await Promise.all([
        EmployeeService.getAll(),
        EmployeeService.getStats()
      ]);
      setEmployees(employeesData);
      setStats(statsData);
    } catch (err) {
      setError("Error al cargar los empleados");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleDeleteClick = (employee: EmployeeResponse) => {
    setEmployeeToDelete(employee);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;

    setDeletingId(employeeToDelete.id);
    try {
      await EmployeeService.delete(employeeToDelete.id);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteDialog(false);
      setEmployeeToDelete(null);
      // Recargar estadísticas
      const newStats = await EmployeeService.getStats();
      setStats(newStats);
    } catch (err) {
      setError("Error al eliminar el empleado");
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getFilteredEmployees = () => {
    let filtered = employees;

    // Filtro por búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.fullName?.toLowerCase().includes(searchLower) ||
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.employeeNumber?.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por departamento
    if (departmentFilter !== "all") {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(emp => emp.status === statusFilter);
    }

    // Filtro por nivel
    if (levelFilter !== "all") {
      filtered = filtered.filter(emp => emp.employeeLevel === levelFilter);
    }

    return filtered;
  };

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

  const getLevelBadge = (level?: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (level) {
      case 'junior':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Junior</span>;
      case 'mid':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Mid</span>;
      case 'senior':
        return <span className={`${baseClasses} bg-indigo-100 text-indigo-800`}>Senior</span>;
      case 'lead':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Lead</span>;
      case 'manager':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Manager</span>;
      case 'director':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Director</span>;
      case 'executive':
        return <span className={`${baseClasses} bg-pink-100 text-pink-800`}>Executive</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type?: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type) {
      case 'employee':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Empleado</span>;
      case 'contractor':
        return <span className={`${baseClasses} bg-orange-100 text-orange-800`}>Contratista</span>;
      case 'consultant':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>Consultor</span>;
      case 'intern':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Interno</span>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const filteredEmployees = getFilteredEmployees();

  const tableColumns = [
    {
      key: 'name',
      label: 'Nombre',
      render: (_: unknown, employee: EmployeeResponse) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{employee.fullName || `${employee.firstName} ${employee.lastName}`}</div>
          {employee.employeeNumber && (
            <div className="text-xs text-gray-500 font-mono">{employee.employeeNumber}</div>
          )}
        </div>
      )
    },
    {
      key: 'position',
      label: 'Posición',
      render: (_: unknown, employee: EmployeeResponse) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{employee.position}</div>
          <div className="text-xs text-gray-500">{employee.department}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_: unknown, employee: EmployeeResponse) => getStatusBadge(employee.status)
    },
    {
      key: 'level',
      label: 'Nivel',
      render: (_: unknown, employee: EmployeeResponse) => getLevelBadge(employee.employeeLevel) || '-'
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (_: unknown, employee: EmployeeResponse) => getTypeBadge(employee.employeeType) || '-'
    },
    {
      key: 'contact',
      label: 'Contacto',
      render: (_: unknown, employee: EmployeeResponse) => (
        <div>
          <div className="text-sm text-gray-900">{employee.email}</div>
          {employee.phone && (
            <div className="text-xs text-gray-500">{employee.phone}</div>
          )}
        </div>
      )
    },
    {
      key: 'hireDate',
      label: 'Fecha de Contratación',
      render: (_: unknown, employee: EmployeeResponse) => (
        <div className="text-sm text-gray-900">
          {formatDate(employee.hireDate)}
        </div>
      )
    },
    {
      key: 'salary',
      label: 'Salario',
      render: (_: unknown, employee: EmployeeResponse) => (
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(employee.salary)}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: unknown, employee: EmployeeResponse) => (
        <ActionButtonGroup
          actions={[
            {
              variant: 'view',
              href: `/employees/${employee.id}`,
              tooltip: "Ver detalles"
            },
            {
              variant: 'edit',
              href: `/employees/${employee.id}/edit`,
              tooltip: "Editar empleado"
            },
            {
              variant: 'delete',
              onClick: () => handleDeleteClick(employee),
              loading: deletingId === employee.id,
              tooltip: "Eliminar empleado"
            }
          ]}
        />
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Cargando empleados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="Empleados"
        subtitle="Gestiona la información de los empleados de la empresa"
        actions={
          <Link
            href="/employees/create"
            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold text-sm"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Empleado
          </Link>
        }
      />

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total"
            value={stats.total}
          />
          <StatsCard
            title="Activos"
            value={stats.active}
          />
          <StatsCard
            title="Inactivos"
            value={stats.inactive}
          />
          <StatsCard
            title="En Licencia"
            value={stats.onLeave}
          />
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, email, posición..."
            className="col-span-1 md:col-span-2"
          />
          <SelectField
            label="Departamento"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los departamentos' },
              { value: 'Tecnología', label: 'Tecnología' },
              { value: 'Ventas', label: 'Ventas' },
              { value: 'Marketing', label: 'Marketing' },
              { value: 'Recursos Humanos', label: 'Recursos Humanos' },
              { value: 'Finanzas', label: 'Finanzas' },
              { value: 'Operaciones', label: 'Operaciones' },
              { value: 'Administración', label: 'Administración' }
            ]}
          />
          <SelectField
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los estados' },
              { value: 'active', label: 'Activo' },
              { value: 'inactive', label: 'Inactivo' },
              { value: 'on-leave', label: 'En Licencia' },
              { value: 'terminated', label: 'Terminado' },
              { value: 'suspended', label: 'Suspendido' }
            ]}
          />
          <SelectField
            label="Nivel"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            options={[
              { value: 'all', label: 'Todos los niveles' },
              { value: 'junior', label: 'Junior' },
              { value: 'mid', label: 'Mid' },
              { value: 'senior', label: 'Senior' },
              { value: 'lead', label: 'Lead' },
              { value: 'manager', label: 'Manager' },
              { value: 'director', label: 'Director' },
              { value: 'executive', label: 'Executive' }
            ]}
          />
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
        />
      )}

      {filteredEmployees.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            data={filteredEmployees}
            columns={tableColumns}
            emptyMessage="No se encontraron empleados"
          />
        </div>
      ) : (
        <EmptyState
          title={searchTerm || departmentFilter !== "all" || statusFilter !== "all" || levelFilter !== "all" 
            ? 'No se encontraron empleados' 
            : 'No hay empleados registrados'
          }
          description={
            searchTerm || departmentFilter !== "all" || statusFilter !== "all" || levelFilter !== "all"
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando el primer empleado al sistema'
          }
          action={!(searchTerm || departmentFilter !== "all" || statusFilter !== "all" || levelFilter !== "all") ? (
            <Link
              href="/employees/create"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Primer Empleado
            </Link>
          ) : undefined}
        />
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Empleado"
        message={`¿Estás seguro de que deseas eliminar el empleado "${employeeToDelete?.fullName || `${employeeToDelete?.firstName} ${employeeToDelete?.lastName}`}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={!!deletingId}
      />
    </div>
  );
}
