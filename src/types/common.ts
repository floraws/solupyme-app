export * from './api/common';

export interface DeleteResult {
  success: boolean;
  message: string;
  deletedId?: string;
  deletedAt?: string;
}

/**
 * Interfaz para la respuesta del API de autenticación
 */
export interface ApiAuthResponse {
  accessToken: string;
  tokenType?: string;
  expiresAt?: number;
}

/**
 * Respuesta estándar para operaciones mutables.
 * Mapea al record StandardApiResponse<T> del backend (com.pymsoftware.solubiz.response).
 *
 * Campos:
 *  - success:    indica si la operación fue exitosa
 *  - message:    mensaje descriptivo de la operación
 *  - data:       datos resultantes (null en respuestas de error o Void)
 *  - timestamp:  marca de tiempo UTC (ISO 8601 string tras serialización JSON)
 *  - statusCode: código de estado HTTP
 *  - meta:       metadatos adicionales opcionales
 */
export interface StandardApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
  statusCode: number;
  meta: Record<string, unknown> | null;
}

/** Narrowing helper: respuesta exitosa con data garantizada no nula */
export interface StandardApiResponseOk<T> extends StandardApiResponse<T> {
  success: true;
  data: T;
  statusCode: 200;
}

/** Narrowing helper: respuesta de error sin data */
export interface StandardApiResponseError extends StandardApiResponse<null> {
  success: false;
  data: null;
}

/** Type guard: verifica si la respuesta fue exitosa */
export function isApiResponseOk<T>(
  response: StandardApiResponse<T>
): response is StandardApiResponseOk<T> {
  return response.success === true;
}


export class ApiError<T = null> extends Error {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly data: T | null;
  public readonly timestamp: string;
  public readonly meta: Record<string, unknown> | null;
  constructor(message: string, statusCode: number, data: T | null = null, meta: Record<string, unknown> | null = null) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.meta = meta;
  }
}
