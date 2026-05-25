export class AccessTokenResponse {
    'access_token': string;
    'token_type': string;
    'expires_in': number;
    'refresh_token': string;
    'scope': string;
}

/**
 * Interfaz para la respuesta de autenticación
 */
export interface AuthResponse {
    status: number;
    userId?: string;
    message: string;
}
