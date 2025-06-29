export interface CityRequest {
    name: string;
    code: string;
    stateId: string;
    stateName?: string;
    countryName?: string;
}

export interface CreateCityRequest {
    name: string;
    code: string;
    stateId: string;
    isActive: boolean;
}

export interface UpdateCityRequest {
    name?: string;
    code?: string;
    stateId?: string;
    isActive?: boolean;
}
