/**
 * Utilidades estándar para manejo de errores en servicios
 * Proporciona clases de error tipadas y manejo centralizado
 */

/**
 * Error base para todos los errores de servicios
 */
export class ServiceError extends Error {
    constructor(
        message: string,
        public code: string,
        public status?: number,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ServiceError';
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, field?: string) {
        super(message, 'VALIDATION_ERROR', 400, { field });
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends ServiceError {
    constructor(resource: string, id?: string) {
        super(`${resource} no encontrado${id ? ` con ID: ${id}` : ''}`, 'NOT_FOUND', 404, { resource, id });
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends ServiceError {
    constructor(message: string, conflictField?: string) {
        super(message, 'CONFLICT', 409, { conflictField });
        this.name = 'ConflictError';
    }
}

export class UnauthorizedError extends ServiceError {
    constructor(message: string = 'No autorizado') {
        super(message, 'UNAUTHORIZED', 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ServiceError {
    constructor(message: string = 'Acceso prohibido') {
        super(message, 'FORBIDDEN', 403);
        this.name = 'ForbiddenError';
    }
}

export class NetworkError extends ServiceError {
    constructor(message: string = 'Error de red') {
        super(message, 'NETWORK_ERROR', 0);
        this.name = 'NetworkError';
    }
}

/**
 * Manejador centralizado de errores para servicios
 */
export class ErrorHandler {
    /**
     * Maneja errores de respuesta HTTP y los convierte en errores tipados
     */
    static handleHttpError(error: unknown, operation: string, resource: string, context?: ErrorContext): never {
        const errorObj = error as {
            status?: number;
            message?: string;
            field?: string;
            id?: string;
            conflictField?: string;
        };

        let serviceError: ServiceError;

        if (!errorObj.status) {
            serviceError = new NetworkError(`Error de conexión en ${operation}`);
        } else {
            switch (errorObj.status) {
                case 400:
                    serviceError = new ValidationError(
                        errorObj.message || `Datos inválidos en ${operation}`,
                        errorObj.field
                    );
                    break;
                
                case 401:
                    serviceError = new UnauthorizedError(
                        errorObj.message || 'Token de autenticación inválido'
                    );
                    break;
                
                case 403:
                    serviceError = new ForbiddenError(
                        errorObj.message || `No tienes permisos para ${operation}`
                    );
                    break;
                
                case 404:
                    serviceError = new NotFoundError(resource, errorObj.id);
                    break;
                
                case 409:
                    serviceError = new ConflictError(
                        errorObj.message || `${resource} ya existe`,
                        errorObj.conflictField
                    );
                    break;
                
                case 422:
                    serviceError = new ValidationError(
                        errorObj.message || `Error de validación en ${operation}`,
                        errorObj.field
                    );
                    break;
                
                case 500:
                    serviceError = new ServiceError(
                        'Error interno del servidor',
                        'INTERNAL_SERVER_ERROR',
                        500
                    );
                    break;
                
                default:
                    serviceError = new ServiceError(
                        errorObj.message || `Error desconocido en ${operation}`,
                        'UNKNOWN_ERROR',
                        errorObj.status,
                        { originalError: error }
                    );
            }
        }

        // Log del error con contexto
        ErrorLogger.logError(serviceError, `${operation} (${resource})`, context);

        throw serviceError;
    }

    /**
     * Valida que un parámetro requerido no sea null/undefined/vacío
     */
    static validateRequired(value: unknown, fieldName: string): void {
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
            throw new ValidationError(`${fieldName} es requerido`, fieldName);
        }
    }

    /**
     * Valida la longitud de un string
     */
    static validateLength(value: string, fieldName: string, min?: number, max?: number): void {
        if (min && value.length < min) {
            throw new ValidationError(
                `${fieldName} debe tener al menos ${min} caracteres`,
                fieldName
            );
        }
        
        if (max && value.length > max) {
            throw new ValidationError(
                `${fieldName} no puede exceder ${max} caracteres`,
                fieldName
            );
        }
    }

    /**
     * Valida formato de email
     */
    static validateEmail(email: string, fieldName: string = 'email'): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError(`${fieldName} debe tener un formato válido`, fieldName);
        }
    }

    /**
     * Valida que un ID tenga formato válido
     */
    static validateId(id: string, fieldName: string = 'id'): void {
        ErrorHandler.validateRequired(id, fieldName);
        
        // Validación básica de ID (puede ser UUID, número, etc.)
        if (typeof id !== 'string' || id.trim().length === 0) {
            throw new ValidationError(`${fieldName} debe ser un identificador válido`, fieldName);
        }
    }

    /**
     * Valida formato de URL
     */
    static validateUrl(url: string, fieldName: string = 'URL'): void {
        try {
            new URL(url);
        } catch {
            throw new ValidationError(`${fieldName} debe tener un formato válido`, fieldName);
        }
    }

    /**
     * Valida que un número esté dentro de un rango
     */
    static validateRange(value: number, fieldName: string, min?: number, max?: number): void {
        if (min !== undefined && value < min) {
            throw new ValidationError(
                `${fieldName} debe ser mayor o igual a ${min}`,
                fieldName
            );
        }
        
        if (max !== undefined && value > max) {
            throw new ValidationError(
                `${fieldName} debe ser menor o igual a ${max}`,
                fieldName
            );
        }
    }

    /**
     * Valida que un valor esté en una lista de valores permitidos
     */
    static validateEnum<T>(value: T, allowedValues: T[], fieldName: string): void {
        if (!allowedValues.includes(value)) {
            throw new ValidationError(
                `${fieldName} debe ser uno de: ${allowedValues.join(', ')}`,
                fieldName
            );
        }
    }

    /**
     * Combina múltiples validaciones y devuelve todos los errores encontrados
     */
    static validateMultiple(validations: Array<() => void>): ValidationError[] {
        const errors: ValidationError[] = [];
        
        validations.forEach(validation => {
            try {
                validation();
            } catch (error) {
                if (error instanceof ValidationError) {
                    errors.push(error);
                } else {
                    errors.push(new ValidationError('Error de validación desconocido'));
                }
            }
        });
        
        return errors;
    }

    /**
     * Ejecuta validaciones y lanza el primer error encontrado o todos si se especifica
     */
    static validate(validations: Array<() => void>, throwAll: boolean = false): void {
        const errors = ErrorHandler.validateMultiple(validations);
        
        if (errors.length > 0) {
            if (throwAll && errors.length > 1) {
                throw new ValidationError(
                    `Se encontraron ${errors.length} errores de validación: ${errors.map(e => e.message).join(', ')}`
                );
            } else {
                throw errors[0];
            }
        }
    }
}

/**
 * Tipo para respuestas estándar de operaciones de eliminación
 */
export interface StandardDeleteResult {
    success: boolean;
    message: string;
    deletedId?: string;
    deletedAt?: string;
    error?: string;
}

/**
 * Tipo para opciones de consulta estándar
 */
export interface StandardQueryOptions {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: Record<string, unknown>;
}

/**
 * Respuesta paginada estándar
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

/**
 * Tipo para respuestas de operaciones que pueden fallar
 */
export interface OperationResult<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
    message?: string;
}

/**
 * Opciones para retry automático en servicios
 */
export interface RetryOptions {
    maxRetries: number;
    delayMs: number;
    exponentialBackoff: boolean;
    retryCondition?: (error: unknown) => boolean;
}

/**
 * Configuración para logging de errores
 */
export interface ErrorLogConfig {
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    logToConsole: boolean;
    logToExternal?: (error: ServiceError, context: string) => void;
    sensitiveFields?: string[];
}

/**
 * Contexto adicional para errores
 */
export interface ErrorContext {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    userAgent?: string;
    timestamp?: string;
    additionalData?: Record<string, unknown>;
}

/**
 * Utilidad para construir query strings
 */
export class QueryBuilder {
    static build(options: StandardQueryOptions): string {
        const params = new URLSearchParams();
        
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (typeof value === 'object') {
                    params.append(key, JSON.stringify(value));
                } else {
                    params.append(key, String(value));
                }
            }
        });
        
        return params.toString();
    }

    /**
     * Convierte StandardQueryOptions a un objeto plano para APIs
     */
    static toPlainObject(options: StandardQueryOptions): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        
        Object.entries(options).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                result[key] = value;
            }
        });
        
        return result;
    }
}

/**
 * Utilidad para operaciones con retry automático
 */
export class RetryHandler {
    /**
     * Ejecuta una operación con retry automático
     */
    static async withRetry<T>(
        operation: () => Promise<T>,
        options: RetryOptions
    ): Promise<T> {
        let lastError: unknown;
        
        for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                
                // Si hay una condición de retry y no se cumple, no reintentar
                if (options.retryCondition && !options.retryCondition(error)) {
                    throw error;
                }
                
                // Si es el último intento, lanzar el error
                if (attempt === options.maxRetries) {
                    throw error;
                }
                
                // Calcular delay
                let delay = options.delayMs;
                if (options.exponentialBackoff) {
                    delay = options.delayMs * Math.pow(2, attempt);
                }
                
                // Esperar antes del siguiente intento
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    }

    /**
     * Condición de retry para errores de red
     */
    static networkErrorCondition(error: unknown): boolean {
        return error instanceof NetworkError || 
               (error instanceof ServiceError && error.status === 0);
    }

    /**
     * Condición de retry para errores temporales del servidor
     */
    static serverErrorCondition(error: unknown): boolean {
        if (error instanceof ServiceError) {
            return error.status === 500 || 
                   error.status === 502 || 
                   error.status === 503 || 
                   error.status === 504;
        }
        return false;
    }
}

/**
 * Utilidad mejorada para logging de errores
 */
export class ErrorLogger {
    private static config: ErrorLogConfig = {
        logLevel: 'error',
        logToConsole: true,
        sensitiveFields: ['password', 'token', 'secret', 'key']
    };

    /**
     * Configura el logger de errores
     */
    static configure(config: Partial<ErrorLogConfig>): void {
        ErrorLogger.config = { ...ErrorLogger.config, ...config };
    }

    /**
     * Registra un error con contexto
     */
    static logError(
        error: ServiceError | Error,
        context: string,
        errorContext?: ErrorContext
    ): void {
        const logData = {
            timestamp: new Date().toISOString(),
            error: {
                name: error.name,
                message: error.message,
                ...(error instanceof ServiceError && {
                    code: error.code,
                    status: error.status,
                    details: ErrorLogger.sanitizeDetails(error.details)
                })
            },
            context,
            ...errorContext
        };

        if (ErrorLogger.config.logToConsole) {
            console.error(`[${ErrorLogger.config.logLevel.toUpperCase()}] ${context}:`, logData);
        }

        if (ErrorLogger.config.logToExternal && error instanceof ServiceError) {
            ErrorLogger.config.logToExternal(error, context);
        }
    }

    /**
     * Sanitiza datos sensibles antes del logging
     */
    private static sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
        if (!details) return details;

        const sanitized = { ...details };
        const sensitiveFields = ErrorLogger.config.sensitiveFields || [];

        sensitiveFields.forEach(field => {
            if (field in sanitized) {
                sanitized[field] = '[REDACTED]';
            }
        });

        return sanitized;
    }
}
