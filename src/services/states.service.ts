import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { StateResponse, CreateStateRequest, UpdateStateRequest } from "@/types/api";
import { LabelValuePair } from "@/models";

export const stateService = {
    /**
     * Obtiene todos los estados.
     * @returns Promesa que resuelve con un array de estados.
     */
    getAll: async (): Promise<StateResponse[]> => {
        return await fetchWrapper.get(apiUrls.states.getAll) as StateResponse[];
    },

    /**
     * Obtiene un estado por su ID.
     * @param id - ID del estado a obtener.
     * @returns Promesa que resuelve con el estado solicitado.
     */
    getById: async (id: string): Promise<StateResponse> => {
        return await fetchWrapper.get(apiUrls.states.getById(id)) as StateResponse;
    },

    /**
     * Crea un nuevo estado.
     * @param state - Datos del estado a crear.
     * @returns Promesa que resuelve cuando se crea el estado.
     */
    create: async (state: CreateStateRequest) => {
        return await fetchWrapper.post(apiUrls.states.insert, state);
    },

    /**
     * Actualiza un estado existente.
     * @param id - ID del estado a actualizar.
     * @param state - Datos del estado a actualizar.
     * @returns Promesa que resuelve cuando se actualiza el estado.
     */
    update: async (id: string, state: UpdateStateRequest) => {
        return await fetchWrapper.put(apiUrls.states.update(id), state);
    },

    /**
     * Elimina un estado.
     * @param id - ID del estado a eliminar.
     * @returns Promesa que resuelve cuando se elimina el estado.
     */
    delete: async (id: string) => {
        return await fetchWrapper.delete(apiUrls.states.delete(id));
    },

    /**
     * Obtiene la lista de estados por país en formato label-value.
     * @param countryId - ID del país para obtener sus estados.
     * @returns Promesa que resuelve con un array de estados en formato label-value.
     */
    getLabelValuesListByCountry: async (countryId: string): Promise<LabelValuePair[]> => {
        return await fetchWrapper.get(apiUrls.states.labelValuesListByCountry(countryId)) as LabelValuePair[];
    },

    createStatesColombia: async () => {
        return await fetchWrapper.post(apiUrls.states.createStatesColombia, {});
    }
    


};