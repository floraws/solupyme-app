export interface AccountResponse {
    id: string;
    businessName: string;
    tradeName?: string;
    address?: string;
    email: string;
    phone?: string;
    website?: string | null | undefined;

    countryId: string;
    countryName?: string;
    stateId?: string;
    stateName?: string;
    cityId?: string;
    cityName?: string;

    identifierType?: string;
    organizationType?: string;
    identificationNumber?: string;

    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
}