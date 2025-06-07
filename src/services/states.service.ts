import { apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { StateResponse } from "@/types/api";

export const statesService = {
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
    }
};