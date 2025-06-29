export interface EmployeeResponse {
    id: string;
    employeeNumber?: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    phone?: string;
    alternativePhone?: string;
    personalEmail?: string;
    
    // 🏢 Información laboral
    position: string;
    department: string;
    directManager?: string;
    team?: string;
    workLocation?: string;
    employmentType: 'full-time' | 'part-time' | 'contract' | 'intern' | 'temporary';
    workSchedule?: string;
    
    // 📅 Fechas importantes
    hireDate: string;
    startDate?: string;
    endDate?: string;
    probationEndDate?: string;
    nextReviewDate?: string;
    
    // 💰 Información salarial y beneficios
    salary?: number;
    currency?: string;
    salaryType?: 'hourly' | 'monthly' | 'annual';
    payrollFrequency?: 'weekly' | 'biweekly' | 'monthly';
    bankAccount?: string;
    bankName?: string;
    
    // 📊 Estado y clasificación
    status: 'active' | 'inactive' | 'on-leave' | 'terminated' | 'suspended';
    employeeLevel?: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'director' | 'executive';
    employeeType?: 'employee' | 'contractor' | 'consultant' | 'intern';
    
    // 🏠 Información personal
    dateOfBirth?: string;
    nationalId?: string;
    passport?: string;
    nationality?: string;
    maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
    gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    
    // 📍 Direcciones
    homeAddress?: {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
    };
    
    // 🚨 Contactos de emergencia
    emergencyContacts?: Array<{
        id: string;
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        address?: string;
        isPrimary?: boolean;
    }>;
    
    // 🎓 Educación y certificaciones
    education?: Array<{
        id: string;
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        graduationYear?: number;
        isVerified?: boolean;
    }>;
    
    certifications?: Array<{
        id: string;
        name: string;
        issuingOrganization: string;
        issueDate: string;
        expirationDate?: string;
        credentialId?: string;
        isActive?: boolean;
    }>;
    
    // 💼 Experiencia y habilidades
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
    
    // 🏖️ Vacaciones y tiempo libre
    vacationDaysTotal?: number;
    vacationDaysUsed?: number;
    vacationDaysRemaining?: number;
    sickDaysUsed?: number;
    personalDaysUsed?: number;
    
    // 📈 Evaluaciones y desarrollo
    performanceRating?: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement' | 'unsatisfactory';
    lastPerformanceReview?: string;
    careerGoals?: string;
    developmentPlan?: string;
    
    // 🔄 Historial laboral interno
    positionHistory?: Array<{
        position: string;
        department: string;
        startDate: string;
        endDate?: string;
        reason?: string;
        salary?: number;
    }>;
    
    // 🎯 Objetivos y metas
    currentObjectives?: Array<{
        id: string;
        title: string;
        description?: string;
        dueDate?: string;
        status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
        priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
    
    // 📋 Beneficios y ventajas
    benefits?: Array<{
        type: string;
        name: string;
        description?: string;
        isActive: boolean;
        startDate?: string;
        endDate?: string;
        cost?: number;
    }>;
    
    // 🏥 Información de salud (sensible)
    healthInsurance?: {
        provider?: string;
        policyNumber?: string;
        beneficiaries?: Array<{
            name: string;
            relationship: string;
            dateOfBirth?: string;
        }>;
    };
    
    // 📱 Información digital
    workEmail?: string;
    workPhone?: string;
    workExtension?: string;
    computerAssetId?: string;
    accessCardId?: string;
    
    // 🔐 Accesos y permisos
    systemAccess?: Array<{
        system: string;
        role: string;
        permissions: string[];
        grantedDate: string;
        expirationDate?: string;
        isActive: boolean;
    }>;
    
    // 📝 Notas y comentarios
    notes?: string;
    confidentialNotes?: string;
    
    // 📄 Documentos
    documents?: Array<{
        id: string;
        type: 'contract' | 'id-copy' | 'resume' | 'certificate' | 'evaluation' | 'other';
        name: string;
        fileName: string;
        fileType: string;
        fileSize: number;
        uploadDate: string;
        url: string;
        isConfidential?: boolean;
    }>;
    
    // 🔄 Auditoría y seguimiento
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    updatedBy?: string;
    
    // 🏷️ Etiquetas y categorización
    tags?: string[];
    customFields?: Record<string, unknown>;
    
    // 📊 Métricas de productividad
    productivity?: {
        punctualityScore?: number;
        attendanceRate?: number;
        projectsCompleted?: number;
        trainingHoursCompleted?: number;
        feedbackScore?: number;
    };
    
    // 🎉 Reconocimientos y logros
    achievements?: Array<{
        id: string;
        title: string;
        description?: string;
        date: string;
        category: 'performance' | 'innovation' | 'teamwork' | 'leadership' | 'other';
        awardedBy?: string;
    }>;
    
    // 🚪 Información de salida (cuando aplique)
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
