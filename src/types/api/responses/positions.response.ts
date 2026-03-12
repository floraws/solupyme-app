export interface PositionResponse {
    id: string;
    name: string;
    description?: string;
    departmentId: string;
    departmentName?: string;
    locationId?: string;
    locationName?: string;
    jobTitle?: string;
    jobLevel?: string;
    employmentType?: 'full-time' | 'part-time' | 'contract' | 'temporary';
    status: 'active' | 'inactive' | 'pending';
    createdAt: string;
    updatedAt: string;
    responsibilities?: string[];
    requirements?: string[];
    salaryRange?: {
        min: number;
        max: number;
        currency?: string;
    };
    benefits?: string[];
    skills?: string[];
    reportsTo?: string; // ID of the position this one reports to
    teamSize?: number; // Number of employees in this position
    isRemote?: boolean; // Indicates if the position can be remote
    createdBy?: string; // ID of the user who created the position
    updatedBy?: string; // ID of the user who last updated the position
}