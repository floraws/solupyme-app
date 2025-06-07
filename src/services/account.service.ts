import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";
import { AccountResponse, UpdateAccountRequest } from "@/types/api";
import { authService } from "./auth.service";
export const accountService = {
    /**
     * Obtiene los detalles de la cuenta del usuario autenticado.
     * @returns Promesa que resuelve con los detalles de la cuenta del usuario.
     */
    getAccountDetails: async (): Promise<AccountResponse> => {
        try {
            const id = authService.clientId as string;
            const response = await fetchWrapper.get(apiUrls.account.getById(id));
            return response as AccountResponse;
        } catch (error) {
            console.error("Error fetching account details:", error);
            throw error;
        }
    },
    getById: async (id: string): Promise<AccountResponse> => {
        try {
            const response = await fetchWrapper.get(apiUrls.account.getById(id));
            return response as AccountResponse;
        } catch (error) {
            console.error("Error fetching account by ID:", error);
            throw error;
        }
    },
    /**
     * Actualiza los detalles de la cuenta del usuario autenticado.
     * @param account Detalles de la cuenta a actualizar.
     * @returns Promesa que resuelve con los detalles actualizados de la cuenta.
     */
    create: async (id: string, updateAccountRequest: UpdateAccountRequest): Promise<AccountResponse> => {
        try {
            const response = await fetchWrapper.put(apiUrls.account.create(id, updateAccountRequest));
            return response as AccountResponse;
        } catch (error) {
            console.error("Error updating account details:", error);
            throw error;
        }
    },
    
};