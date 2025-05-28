import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";
import { ClientResponse } from "@/models";


export const clientService = {
    /**
     * Busca clientes asociados a un usuario por su ID.
     * @param userId - ID del usuario para buscar clientes asociados.
     * @returns Promesa que resuelve con la lista de clientes asociados al usuario.
     */   
    findClientByUserId: async (userId: string): Promise<ClientResponse[]> => {
        try {
            const response = await fetchWrapper.get(apiUrls.clients.findByUserId(userId));
            return response as ClientResponse[];
        } catch (error) {
            console.error("Error fetching clients by ID:", error);
            throw error;
        }
    },
}

