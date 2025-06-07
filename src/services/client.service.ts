import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";
import { ClientResponse } from "@/types/api";
import { sleep } from "@/lib";


export const clientService = {
    /**
     * Busca clientes asociados a un usuario por su ID.
     * @param userId - ID del usuario para buscar clientes asociados.
     * @returns Promesa que resuelve con la lista de clientes asociados al usuario.
     */
    findClientByUserId: async (userId: string): Promise<ClientResponse[]> => {
        try {
            const response = await fetchWrapper.get(apiUrls.clients.findByUserId(userId));
            if (!Array.isArray(response)) {
                throw new Error("La respuesta no es un array de clientes");
            }
            return response as ClientResponse[];
        } catch (error) {
            console.error("Error fetching clients by ID:", error);
            throw error;
        }
    },

}

