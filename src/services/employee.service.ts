import { EmployeeResponse } from '@/types/api/responses/employee.response';
import { 
    EmployeeCreateRequest, 
    EmployeeUpdateRequest, 
    EmployeeSearchRequest, 
    EmployeeStatsRequest 
} from '@/types/api/requests/employee.request';
import employeesData from '@/data/employees.json';

export class EmployeeService {
    private static employees: EmployeeResponse[] = employeesData as EmployeeResponse[];

    /**
     * Obtiene todos los empleados
     */
    static async getAll(): Promise<EmployeeResponse[]> {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 300));
        return [...this.employees];
    }

    /**
     * Obtiene un empleado por ID
     */
    static async getById(id: string): Promise<EmployeeResponse | null> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const employee = this.employees.find(emp => emp.id === id);
        return employee ? { ...employee } : null;
    }

    /**
     * Busca empleados por nombre, email, posición o departamento
     */
    static async search(query: string): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 250));
        
        if (!query.trim()) {
            return this.getAll();
        }

        const searchTerm = query.toLowerCase();
        return this.employees.filter(emp =>
            emp.firstName.toLowerCase().includes(searchTerm) ||
            emp.lastName.toLowerCase().includes(searchTerm) ||
            emp.fullName?.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            emp.employeeNumber?.toLowerCase().includes(searchTerm) ||
            emp.phone?.toLowerCase().includes(searchTerm) ||
            emp.nationalId?.toLowerCase().includes(searchTerm)
        );
    }

    /**
     * Filtra empleados por departamento
     */
    static async getByDepartment(department: string): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => 
            emp.department.toLowerCase() === department.toLowerCase()
        );
    }

    /**
     * Filtra empleados por estado
     */
    static async getByStatus(status: 'active' | 'inactive' | 'on-leave' | 'terminated' | 'suspended'): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => emp.status === status);
    }

    /**
     * Filtra empleados por tipo de empleo
     */
    static async getByEmploymentType(type: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary'): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => emp.employmentType === type);
    }

    /**
     * Filtra empleados por nivel
     */
    static async getByLevel(level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive'): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => emp.employeeLevel === level);
    }

    /**
     * Obtiene empleados por ubicación de trabajo
     */
    static async getByLocation(location: string): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => 
            emp.workLocation?.toLowerCase().includes(location.toLowerCase())
        );
    }

    /**
     * Obtiene empleados que reportan a un manager específico
     */
    static async getByManager(managerId: string): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return this.employees.filter(emp => emp.directManager === managerId);
    }

    /**
     * Obtiene empleados con evaluaciones de desempeño pendientes
     */
    static async getPendingReviews(): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentDate = new Date();
        return this.employees.filter(emp => {
            if (!emp.nextReviewDate) return false;
            const reviewDate = new Date(emp.nextReviewDate);
            return reviewDate <= currentDate && emp.status === 'active';
        });
    }

    /**
     * Obtiene empleados con certificaciones próximas a vencer
     */
    static async getExpiringCertifications(daysAhead: number = 30): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        
        return this.employees.filter(emp => {
            if (!emp.certifications) return false;
            return emp.certifications.some(cert => {
                if (!cert.expirationDate || !cert.isActive) return false;
                const expDate = new Date(cert.expirationDate);
                return expDate <= futureDate && expDate >= new Date();
            });
        });
    }

    /**
     * Crea un nuevo empleado
     */
    static async create(employeeData: EmployeeCreateRequest): Promise<EmployeeResponse> {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const newEmployee: EmployeeResponse = {
            id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            employeeNumber: `EMP-${new Date().getFullYear()}-${String(this.employees.length + 1).padStart(3, '0')}`,
            fullName: `${employeeData.firstName} ${employeeData.lastName}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...employeeData
        };
        
        this.employees.push(newEmployee);
        return { ...newEmployee };
    }

    /**
     * Actualiza un empleado existente
     */
    static async update(id: string, employeeData: EmployeeUpdateRequest): Promise<EmployeeResponse | null> {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1) return null;
        
        const updatedEmployee = {
            ...this.employees[index],
            ...employeeData,
            fullName: employeeData.firstName && employeeData.lastName 
                ? `${employeeData.firstName} ${employeeData.lastName}`
                : this.employees[index].fullName,
            updatedAt: new Date().toISOString()
        };
        
        this.employees[index] = updatedEmployee;
        return { ...updatedEmployee };
    }

    /**
     * Elimina un empleado (cambiar estado a terminated)
     */
    static async delete(id: string): Promise<boolean> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const index = this.employees.findIndex(emp => emp.id === id);
        if (index === -1) return false;
        
        // En lugar de eliminar, marcamos como terminado
        this.employees[index] = {
            ...this.employees[index],
            status: 'terminated',
            updatedAt: new Date().toISOString(),
            exitDetails: {
                ...this.employees[index].exitDetails,
                lastWorkingDay: new Date().toISOString(),
                exitReason: 'termination'
            }
        };
        
        return true;
    }

    /**
     * Obtiene estadísticas de empleados
     */
    static async getStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        onLeave: number;
        terminated: number;
        byDepartment: Array<{ department: string; count: number }>;
        byLevel: Array<{ level: string; count: number }>;
        byEmploymentType: Array<{ type: string; count: number }>;
        avgSalary: number;
        pendingReviews: number;
        expiringCertifications: number;
    }> {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const total = this.employees.length;
        const active = this.employees.filter(emp => emp.status === 'active').length;
        const inactive = this.employees.filter(emp => emp.status === 'inactive').length;
        const onLeave = this.employees.filter(emp => emp.status === 'on-leave').length;
        const terminated = this.employees.filter(emp => emp.status === 'terminated').length;
        
        // Estadísticas por departamento
        const departmentCounts = this.employees.reduce((acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const byDepartment = Object.entries(departmentCounts).map(([department, count]) => ({
            department,
            count
        }));
        
        // Estadísticas por nivel
        const levelCounts = this.employees.reduce((acc, emp) => {
            const level = emp.employeeLevel || 'not-specified';
            acc[level] = (acc[level] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const byLevel = Object.entries(levelCounts).map(([level, count]) => ({
            level,
            count
        }));
        
        // Estadísticas por tipo de empleo
        const typeCounts = this.employees.reduce((acc, emp) => {
            acc[emp.employmentType] = (acc[emp.employmentType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        const byEmploymentType = Object.entries(typeCounts).map(([type, count]) => ({
            type,
            count
        }));
        
        // Salario promedio
        const salaries = this.employees
            .filter(emp => emp.salary && emp.status === 'active')
            .map(emp => emp.salary!);
        const avgSalary = salaries.length > 0 
            ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length 
            : 0;
        
        // Evaluaciones pendientes
        const pendingReviews = (await this.getPendingReviews()).length;
        
        // Certificaciones próximas a vencer
        const expiringCertifications = (await this.getExpiringCertifications()).length;
        
        return {
            total,
            active,
            inactive,
            onLeave,
            terminated,
            byDepartment,
            byLevel,
            byEmploymentType,
            avgSalary,
            pendingReviews,
            expiringCertifications
        };
    }

    /**
     * Obtiene empleados con mejor desempeño
     */
    static async getTopPerformers(limit: number = 10): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        return this.employees
            .filter(emp => emp.status === 'active' && emp.performanceRating)
            .sort((a, b) => {
                const ratingOrder = {
                    'excellent': 5,
                    'good': 4,
                    'satisfactory': 3,
                    'needs-improvement': 2,
                    'unsatisfactory': 1
                };
                
                const aRating = ratingOrder[a.performanceRating as keyof typeof ratingOrder] || 0;
                const bRating = ratingOrder[b.performanceRating as keyof typeof ratingOrder] || 0;
                
                return bRating - aRating;
            })
            .slice(0, limit);
    }

    /**
     * Obtiene empleados nuevos (contratados en los últimos N días)
     */
    static async getNewHires(days: number = 30): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return this.employees.filter(emp => {
            const hireDate = new Date(emp.hireDate);
            return hireDate >= cutoffDate;
        });
    }

    /**
     * Obtiene empleados por cumpleaños en el mes actual
     */
    static async getBirthdaysThisMonth(): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const currentMonth = new Date().getMonth();
        
        return this.employees.filter(emp => {
            if (!emp.dateOfBirth) return false;
            const birthDate = new Date(emp.dateOfBirth);
            return birthDate.getMonth() === currentMonth && emp.status === 'active';
        });
    }

    /**
     * Obtiene empleados con habilidades específicas
     */
    static async getBySkill(skillName: string, minLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert'): Promise<EmployeeResponse[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const levelOrder = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'expert': 4
        };
        
        const minLevelValue = minLevel ? levelOrder[minLevel] : 0;
        
        return this.employees.filter(emp => {
            if (!emp.skills) return false;
            
            return emp.skills.some(skill => {
                const skillMatches = skill.name.toLowerCase().includes(skillName.toLowerCase());
                const levelMatches = !minLevel || levelOrder[skill.level] >= minLevelValue;
                return skillMatches && levelMatches;
            });
        });
    }
}