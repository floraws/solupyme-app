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
    identificationNumber?: number;

    contactName?: string | null | undefined;

}

