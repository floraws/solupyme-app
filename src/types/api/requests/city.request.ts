export interface CityRequest {
    regionId: string;
    regionName?: string;
    countryName?: string;
    code: string;
    name: string;
}

export interface CreateCityRequest {
    regionId: string;
    code: string;
    name: string;
}

export interface UpdateCityRequest {
    regionId?: string;
    code?: string;
    name?: string;
    isActive?: boolean;
}
