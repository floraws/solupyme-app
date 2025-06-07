import { authService } from "@/services/auth.service";
import { csrfService } from "@/services/csrf.service";
import { BASE_URL, ERROR_BAD_URL } from "@/constants";

/**
 * Flag para evitar múltiples intentos de refresh simultáneos
 */
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE'),
};

/**
 * Maneja el refresh automático del token
 */
async function handleTokenRefresh(): Promise<boolean> {
    if (isRefreshing && refreshPromise) {
        return refreshPromise;
    }

    isRefreshing = true;
    refreshPromise = authService.refreshToken().then(result => {
        isRefreshing = false;
        refreshPromise = null;
        return !!result;
    }).catch(() => {
        isRefreshing = false;
        refreshPromise = null;
        return false;
    });

    return refreshPromise;
}

/**
 * Crea headers comunes para todas las requests
 */
function createCommonHeaders(): Headers {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    return headers;
}

/**
 * Agrega headers de autenticación si el usuario está logueado
 */
function addAuthHeaders(headers: Headers): void {
    if (authService.isLoggedIn) {
        const token = authService.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const clientId = authService.clientId;
        if (clientId) {
            headers.set('X-Client-Id', clientId);
        }
    }
}

/**
 * Realiza una request HTTP básica (sin CSRF)
 */
function request(method: string) {
    return async (path: string, body?: unknown, csrfToken?: string): Promise<unknown> => {
        const url = `${BASE_URL}${path}`;

        if (!isValidHttpUrl(url)) {
            return Promise.reject({
                status: ERROR_BAD_URL.code,
                message: ERROR_BAD_URL.message
            });
        }

        const requestHeaders = createCommonHeaders();
        addAuthHeaders(requestHeaders);

        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            if (csrfToken) {
                requestHeaders.set('X-CSRF-TOKEN', csrfToken);
            } else {
                try {
                    const tokenData = await csrfService.getCSRFData();
                    const headerName = tokenData.headerName || 'X-CSRF-TOKEN';
                    requestHeaders.set(headerName, tokenData.token);
                } catch (error) {
                    console.warn('Failed to get CSRF token:', error);
                }
            }
        }
        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
            credentials: 'include',
        };

        // Solo agregar body para métodos que lo requieren
        if (method !== 'GET' && method !== 'HEAD' && body) {
            requestOptions.body = JSON.stringify(body);
        }

        return executeRequest(url, requestOptions, requestHeaders);
    };
}


/**
 * Ejecuta la request con manejo de refresh token
 */
async function executeRequest(
    url: string,
    requestOptions: RequestInit,
    requestHeaders: Headers
): Promise<unknown> {
    try {
        const response = await fetch(url, requestOptions);

        // ✅ Si recibimos 401 y tenemos token, intentar refresh
        if (response.status === 401 && authService.accessToken) {
            const refreshSuccess = await handleTokenRefresh();

            if (refreshSuccess) {
                // Actualizar headers con nuevo token
                const newToken = authService.accessToken;
                if (newToken) {
                    requestHeaders.set('Authorization', `Bearer ${newToken}`);
                    const retryOptions = { ...requestOptions, headers: requestHeaders };
                    const retryResponse = await fetch(url, retryOptions);
                    return handleResponse(retryResponse);
                }
            }
        }

        return handleResponse(response);
    } catch (error) {
        console.error('Error en request:', error);
        return Promise.reject({
            status: 0,
            message: 'Error de conexión. Verifica tu conexión a internet.'
        });
    }
}

/**
 * Valida si una URL es válida HTTP/HTTPS
 */
function isValidHttpUrl(url: string): boolean {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Maneja la respuesta HTTP
 */
async function handleResponse(response: Response): Promise<unknown> {
    const isJson = response.headers?.get('content-type')?.includes('application/json');
    let data = null;

    try {
        data = isJson ? await response.json() : await response.text();
    } catch (error) {
        console.error('Error parsing response:', error);
    }

    if (!response.ok) {
        // ✅ Manejo específico mejorado de errores
        if (response.status === 401) {
            console.warn('Token inválido o expirado');
            if (authService.accessToken) {
                authService.logout();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        } else if (response.status === 403) {
            console.warn('Error de permisos o CSRF token inválido');
        }

        const error = {
            status: response.status,
            message: data?.message || `Error ${response.status}: ${response.statusText}`,
            data: data
        };

        return Promise.reject(error);
    }

    return data;
}