import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";
import { ClientResponse } from "@/types/api";
import { StandardApiResponse } from "@/types/common";
import { authService } from "./auth.service";


export const clientService = {
    /**
     * Busca clientes asociados a un usuario por su ID.
     * @param userId - ID del usuario para buscar clientes asociados.
     * @returns Promesa que resuelve con la lista de clientes asociados al usuario.
     */
    findClientByUserId: async (userId: string): Promise<ClientResponse[]> => {
        try {
            const response = await fetchWrapper.get(apiUrls.clients.findByUserId(userId)) as StandardApiResponse<ClientResponse[]>;
            if (!response.success) {
                throw new Error(response.message || "Error fetching clients");
            }
            if (!Array.isArray(response.data)) {
                throw new Error("La respuesta no es un array de clientes");
            }
            return response.data as ClientResponse[];
        } catch (error) {
            console.error("Error fetching clients by ID:", error);
            throw error;
        }
    },

    findById: async (clientId: string): Promise<ClientResponse> => {
        try {
            const response = await fetchWrapper.get(apiUrls.clients.findById(clientId)) as StandardApiResponse<ClientResponse>;
            if (!response.success) {
                throw new Error(response.message || "Error fetching client");
            }
            return response.data as ClientResponse;
        } catch (error) {
            console.error("Error fetching client by ID:", error);
            throw error;
        }
    },

    getDetails: async (): Promise<ClientResponse> => {
        try {
            const id = authService.clientId as string;
            const response = await fetchWrapper.get(apiUrls.clients.findById(id)) as StandardApiResponse<ClientResponse>;
            if (!response.success) {
                throw new Error(response.message || "Error fetching client details");
            }
            return response.data as ClientResponse;
        } catch (error) {
            console.error("Error fetching client details:", error);
            throw error;
        }
    },

    updateClient: async (clientId: string, data: ClientResponse): Promise<ClientResponse> => {
        try {
            const response = await fetchWrapper.put(apiUrls.clients.findById(clientId), data) as StandardApiResponse<ClientResponse>;
            if (!response.success) {
                throw new Error(response.message || "Error updating client");
            }
            return response.data as ClientResponse;
        } catch (error) {
            console.error("Error updating client:", error);
            throw error;
        }
    },

}

