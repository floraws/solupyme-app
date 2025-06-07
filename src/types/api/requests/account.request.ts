export interface UpdateAccountRequest {
    businessName: string;
    tradeName?: string;
    address?: string;
    email: string;
    phone?: string;
    website?: string | null | undefined;

    cityId: string;

    identifierType?: string;
    organizationType?: string;
    identificationNumber?: string;

    contactName?: string | null | undefined;
    contactEmail?: string | null | undefined;
    contactPhone?: string | null | undefined;
}
