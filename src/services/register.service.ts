import { fetchWrapper } from "@/helpers";
import { apiUrls } from "@/constants";
import { StandardApiResponse } from "@/types/common";

export interface RegisterRequest {
  identificationNumber: string;
  businessName: string;
  tradeName: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  contact: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export const registerService = {
  /**
   * Registra un nuevo usuario.
   * @param data Datos de registro.
   * @returns Promesa con el usuario registrado.
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await fetchWrapper.post(apiUrls.register, data) as StandardApiResponse<RegisterResponse>;
      if (!response.success) {
        throw new Error(response.message || "Error al registrar el usuario");
      }
      return response.data as RegisterResponse;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): boolean => {
    return !!password && password.length >= 8;
  },
};
