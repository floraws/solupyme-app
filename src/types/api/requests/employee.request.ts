// Requests para operaciones de empleados

export interface EmployeeCreateRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    alternativePhone?: string;
    personalEmail?: string;
    
    // Información laboral requerida
    position: string;
    department: string;
    directManager?: string;
    team?: string;
    workLocation?: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
    workSchedule?: string;
    
    // Fechas
    hireDate: string;
    startDate?: string;
    probationEndDate?: string;
    nextReviewDate?: string;
    
    // Información salarial
    salary?: number;
    currency?: string;
    salaryType?: 'hourly' | 'monthly' | 'annual';
    payrollFrequency?: 'weekly' | 'biweekly' | 'monthly';
    bankAccount?: string;
    bankName?: string;
    
    // Estado
    status: 'active' | 'inactive' | 'on-leave' | 'terminated' | 'suspended';
    employeeLevel?: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
    employeeType?: 'employee' | 'contractor' | 'consultant' | 'intern';
    
    // Información personal
    dateOfBirth?: string;
    nationalId?: string;
    passport?: string;
    nationality?: string;
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    
    // Dirección
    homeAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    
    // Contactos de emergencia
    emergencyContacts?: Array<{
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        address?: string;
        isPrimary?: boolean;
    }>;
    
    // Información digital
    workEmail?: string;
    workPhone?: string;
    workExtension?: string;
    
    // Notas
    notes?: string;
    
    // Etiquetas
    tags?: string[];
    customFields?: Record<string, unknown>;
}

export interface EmployeeUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    alternativePhone?: string;
    personalEmail?: string;
    
    // Información laboral
    position?: string;
    department?: string;
    directManager?: string;
    team?: string;
    workLocation?: string;
    employmentType?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
    workSchedule?: string;
    
    // Fechas
    startDate?: string;
    endDate?: string;
    probationEndDate?: string;
    nextReviewDate?: string;
    
    // Información salarial
    salary?: number;
    currency?: string;
    salaryType?: 'hourly' | 'monthly' | 'annual';
    payrollFrequency?: 'weekly' | 'biweekly' | 'monthly';
    bankAccount?: string;
    bankName?: string;
    
    // Estado
    status?: 'active' | 'inactive' | 'on-leave' | 'terminated' | 'suspended';
    employeeLevel?: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
    employeeType?: 'employee' | 'contractor' | 'consultant' | 'intern';
    
    // Información personal
    dateOfBirth?: string;
    nationalId?: string;
    passport?: string;
    nationality?: string;
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    
    // Dirección
    homeAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    
    // Contactos de emergencia
    emergencyContacts?: Array<{
        id?: string;
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        address?: string;
        isPrimary?: boolean;
    }>;
    
    // Educación y certificaciones
    education?: Array<{
        id?: string;
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        graduationYear?: number;
        isVerified?: boolean;
    }>;
    
    certifications?: Array<{
        id?: string;
        name: string;
        issuingOrganization: string;
        issueDate: string;
        expirationDate?: string;
        credentialId?: string;
        isActive?: boolean;
    }>;
    
    // Habilidades e idiomas
    skills?: Array<{
        name: string;
        level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
        category?: string;
        yearsOfExperience?: number;
    }>;
    
    languages?: Array<{
        language: string;
        proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
        canRead?: boolean;
        canWrite?: boolean;
        canSpeak?: boolean;
    }>;
    
    // Vacaciones
    vacationDaysTotal?: number;
    vacationDaysUsed?: number;
    sickDaysUsed?: number;
    personalDaysUsed?: number;
    
    // Evaluación
    performanceRating?: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'unsatisfactory';
    lastPerformanceReview?: string;
    careerGoals?: string;
    developmentPlan?: string;
    
    // Objetivos
    currentObjectives?: Array<{
        id?: string;
        title: string;
        description?: string;
        dueDate?: string;
        status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
        priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
    
    // Información digital
    workEmail?: string;
    workPhone?: string;
    workExtension?: string;
    computerAssetId?: string;
    accessCardId?: string;
    
    // Notas
    notes?: string;
    confidentialNotes?: string;
    
    // Etiquetas
    tags?: string[];
    customFields?: Record<string, unknown>;
    
    // Información de salida
    exitDetails?: {
        lastWorkingDay?: string;
        exitInterviewDate?: string;
        exitReason?: 'resignation' | 'termination' | 'retirement' | 'layoff' | 'contract-end' | 'other';
        exitNotes?: string;
        rehireEligible?: boolean;
        assetsReturned?: boolean;
        finalPayProcessed?: boolean;
    };
}

export interface EmployeeSearchRequest {
    query?: string;
    department?: string;
    status?: 'active' | 'inactive' | 'on-leave' | 'terminated' | 'suspended';
    employmentType?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
    employeeLevel?: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
    workLocation?: string;
    manager?: string;
    skill?: string;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    performanceRating?: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'unsatisfactory';
    hireDateFrom?: string;
    hireDateTo?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    sortBy?: 'name' | 'hireDate' | 'department' | 'position' | 'salary' | 'performanceRating';
    sortOrder?: 'asc' | 'desc';
}

export interface EmployeeStatsRequest {
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    includeInactive?: boolean;
    groupBy?: 'department' | 'level' | 'employmentType' | 'location';
}
