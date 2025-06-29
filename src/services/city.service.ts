import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { CityResponse, CreateCityRequest, UpdateCityRequest } from "@/types/api";
import { LabelValuePair } from "@/models";

export const cityService = {
    /**
     * Obtiene todas las ciudades.
     * @returns Promesa que resuelve con un array de ciudades.
     */
    getAll: async (): Promise<CityResponse[]> => {
        return await fetchWrapper.get(apiUrls.cities.getAll) as CityResponse[];
    },

    /**
     * Obtiene una ciudad por su ID.
     * @param id - ID de la ciudad a obtener.
     * @returns Promesa que resuelve con la ciudad solicitada.
     */
    getById: async (id: string): Promise<CityResponse> => {
        return await fetchWrapper.get(apiUrls.cities.getById(id)) as CityResponse;
    },

    /**
     * Crea una nueva ciudad.
     * @param city - Datos de la ciudad a crear.
     * @returns Promesa que resuelve cuando se crea la ciudad.
     */
    create: async (city: CreateCityRequest) => {
        return await fetchWrapper.post(apiUrls.cities.insert, city);
    },

    /**
     * Actualiza una ciudad existente.
     * @param id - ID de la ciudad a actualizar.
     * @param city - Datos de la ciudad a actualizar.
     * @returns Promesa que resuelve cuando se actualiza la ciudad.
     */
    update: async (id: string, city: UpdateCityRequest) => {
        return await fetchWrapper.put(apiUrls.cities.update(id), city);
    },

    /**
     * Elimina una ciudad.
     * @param id - ID de la ciudad a eliminar.
     * @returns Promesa que resuelve cuando se elimina la ciudad.
     */
    delete: async (id: string) => {
        return await fetchWrapper.delete(apiUrls.cities.delete(id));
    },

    /**
     * Obtiene la lista de ciudades por estado en formato label-value.
     * @param stateId - ID del estado para obtener sus ciudades.
     * @returns Promesa que resuelve con un array de ciudades en formato label-value.
     */
    getLabelValuesList: async (stateId: string): Promise<LabelValuePair[]> => {
        return await fetchWrapper.get(apiUrls.cities.labelValuesList(stateId)) as LabelValuePair[];
    },

    /**
     * Crea todas las ciudades de Colombia.
     * @returns Promesa que resuelve cuando se crean las ciudades.
     */
    createCitiesColombia: async () => {
        return await fetchWrapper.post(apiUrls.cities.createCitiesColombia, {});
    },
};
