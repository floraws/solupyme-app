import { ACCESS_TOKEN, apiUrls, CLIENT_ID, USER_ID } from "../constants";
import { fetchWrapper } from "@/helpers";
import { decodeAccessToken } from "@/lib/utils";
import { AuthRequest } from "@/types/api";
import Cookies from 'js-cookie';
import { set } from "zod/v4";

/**
 * Configuración de cookies seguras
 */
const COOKIE_OPTIONS = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    expires: 7 // 7 días
};

/**
 * Tiempo de expiración en segundos para considerar que el token expira pronto (5 minutos)
 */
const TOKEN_EXPIRY_THRESHOLD = 300;

/**
 * Interfaz para la respuesta de autenticación
 */
interface AuthResponse {
    status: number;
    userId?: string;
    message: string;
}

/**
 * Interfaz para la respuesta del API de autenticación
 */
interface ApiAuthResponse {
    accessToken: string;
    tokenType?: string;
    expiresAt?: number;
}

/**
 * Almacena de forma segura los tokens en cookies y localStorage
 */
function storeTokenSecurely(token: string, userId: string): void {
    try {
        // Almacenar en cookies seguras (preferido)
        Cookies.set(ACCESS_TOKEN, token, COOKIE_OPTIONS);
        Cookies.set(USER_ID, userId, COOKIE_OPTIONS);
        
        // Fallback a localStorage para compatibilidad
        if (typeof window !== "undefined") {
            localStorage.setItem(ACCESS_TOKEN, token);
            localStorage.setItem(USER_ID, userId);
        }
    } catch (error) {
        console.error('Error al almacenar tokens:', error);
        throw new Error('No se pudieron almacenar las credenciales');
    }
}

/**
 * Limpia todos los tokens almacenados
 */
function clearStoredTokens(): void {
    try {
        // Limpiar cookies
        Cookies.remove(ACCESS_TOKEN);
        Cookies.remove(USER_ID);
        Cookies.remove(CLIENT_ID);
        
        // Limpiar localStorage como fallback
        if (typeof window !== "undefined") {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(USER_ID);
            localStorage.removeItem(CLIENT_ID);
        }
    } catch (error) {
        console.error('Error al limpiar tokens:', error);
    }
}

/**
 * Servicio de autenticación que maneja login, logout, refresh de tokens y estado de sesión
 */
export const authService = {
    /**
     * Obtiene el token de acceso actual
     */
    get accessToken(): string | null {
        if (typeof window !== "undefined") {
            // Preferir cookies sobre localStorage por seguridad
            return Cookies.get(ACCESS_TOKEN) || localStorage.getItem(ACCESS_TOKEN);
        }
        return null;
    },
    
    /**
     * Verifica si el usuario está autenticado con un token válido
     */
    get isLoggedIn(): boolean {
        const token = this.accessToken;
        if (!token) return false;
        
        try {
            const decoded = decodeAccessToken(token);
            if (!decoded || !decoded.exp) return false;
            
            // Verificar si el token ha expirado
            const currentTime = Date.now() / 1000;
            return decoded.exp > currentTime;
        } catch {
            return false;
        }
    },
    
    /**
     * Obtiene el ID del usuario actual
     */
    get userId(): string | null {
        if (typeof window !== "undefined") {
            return Cookies.get(USER_ID) || localStorage.getItem(USER_ID);
        }
        return null;
    },

    /**
     * Obtiene el ID del cliente actual
     */
    get clientId(): string | null {
        if (typeof window !== "undefined") {
            return Cookies.get(CLIENT_ID) || localStorage.getItem(CLIENT_ID);
        }
        return null;
    },
    
    /**
     * Realiza el login con las credenciales proporcionadas
     */
    login,
    
    /**
     * Cierra la sesión del usuario actual
     */
    logout,
    
    /**
     * Refresca el token de acceso actual
     */
    refreshToken,
    
    /**
     * Verifica si el token actual está próximo a expirar
     */
    isTokenExpiringSoon,

    /**
     * 
     */
    set clientId(clientId: string) {
        try {
            // Almacenar en cookies seguras
            Cookies.set(CLIENT_ID, clientId, COOKIE_OPTIONS);
            
            // Fallback a localStorage para compatibilidad
            if (typeof window !== "undefined") {
                localStorage.setItem(CLIENT_ID, clientId);
            }
        } catch (error) {
            console.error('Error al almacenar clientId:', error);
            throw new Error('No se pudo almacenar el ID del cliente');
        }
    }
}

/**
 * Realiza el login del usuario con las credenciales proporcionadas
 * @param data - Credenciales de login (username y password)
 * @returns Promise con la respuesta de autenticación
 */
async function login(data: AuthRequest): Promise<AuthResponse> {
    if (!data.username || !data.password) {
        throw new Error('Username y password son requeridos');
    }

    try {
        const response: ApiAuthResponse = await fetchWrapper.post(apiUrls.auth.login, data) as ApiAuthResponse;
        
        if (!response?.accessToken) {
            throw new Error('Respuesta inválida del servidor: token no recibido');
        }

        const payload = decodeAccessToken(response.accessToken);
        
        if (!payload?.userId) {
            throw new Error('Token inválido: no contiene userId');
        }

        // Almacenar tokens de forma segura
        storeTokenSecurely(response.accessToken, payload.userId);
        
        return { 
            status: 200, 
            userId: payload.userId, 
            message: "Login exitoso" 
        };
    } catch (error) {
        console.error('Error en login:', error);
        
        // Limpiar cualquier token que pueda haber quedado
        clearStoredTokens();
        
        const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
        throw new Error(errorMessage);
    }
}

/**
 * Cierra la sesión del usuario actual
 * Limpia todos los tokens almacenados
 */
function logout(): void {
    clearStoredTokens();
}

/**
 * Refresca el token de acceso actual
 * @returns Promise<AuthResponse | false> - Respuesta de autenticación o false si falla
 */
async function refreshToken(): Promise<AuthResponse | false> {
    try {
        const currentToken = authService.accessToken;
        if (!currentToken) {
            throw new Error('No hay token para refrescar');
        }

        const response: ApiAuthResponse = await fetchWrapper.post(apiUrls.auth.refresh, { 
            token: currentToken 
        }) as ApiAuthResponse;
        
        if (!response?.accessToken) {
            throw new Error('Respuesta inválida del servidor: token no recibido');
        }

        const payload = decodeAccessToken(response.accessToken);
        
        if (!payload?.userId) {
            throw new Error('Token inválido: no contiene user_id');
        }

        // Almacenar el nuevo token de forma segura
        storeTokenSecurely(response.accessToken, payload.userId);
        
        return { 
            status: 200, 
            userId: payload.userId, 
            message: "Token refrescado exitosamente" 
        };
    } catch (error) {
        console.error('Error al refrescar token:', error);
        
        // En caso de error, limpiar sesión
        logout();
        return false;
    }
}

/**
 * Verifica si el token actual está próximo a expirar
 * @returns boolean - true si el token expira en menos de 5 minutos o no existe
 */
function isTokenExpiringSoon(): boolean {
    const token = authService.accessToken;
    if (!token) return true;
    
    try {
        const decoded = decodeAccessToken(token);
        if (!decoded?.exp) return true;
        
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = decoded.exp - currentTime;
        
        // Considerar que expira pronto si quedan menos de 5 minutos
        return timeUntilExpiry < TOKEN_EXPIRY_THRESHOLD;
    } catch {
        return true;
    }
}







