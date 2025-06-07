import { BASE_URL } from "@/constants";

interface CSRFResponse {
    token: string;
    headerName: string;
    parameterName: string;
}

export const csrfService = {


    /**
     * Obtiene el token CSRF y el nombre del header desde el servidor Spring Boot
     */
    async getCSRFData(): Promise<CSRFResponse> {
        try {
            const response = await fetch(`${BASE_URL}/auth/csrf-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get CSRF data: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching CSRF data:', error);
            throw error;
        }
    },


    /**
     * Obtiene el token CSRF del servidor Spring Boot
     */
    async getCSRFToken(): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/auth/csrf-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get CSRF token: ${response.status}`);
            }

            const data: CSRFResponse = await response.json();
            return data.token;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
            throw error;
        }
    },

    /**
     * Obtiene el nombre del header que Spring Boot espera
     */
    async getCSRFHeaderName(): Promise<string> {
        try {
            const response = await fetch(`${BASE_URL}/auth/csrf-token`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                return 'X-XSRF-TOKEN'; // Fallback por defecto
            }

            const data: CSRFResponse = await response.json();
            return data.headerName;
        } catch (error) {
            console.error('Error fetching CSRF header name:', error);
            return 'X-XSRF-TOKEN'; // Fallback por defecto
        }
    }
};
