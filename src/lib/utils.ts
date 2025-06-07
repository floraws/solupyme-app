import { DecodedToken } from "@/interfaces/DecodeToken";
import { jwtDecode } from "jwt-decode";

export function decodeAccessToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convierte recursivamente las claves de un objeto o array
export function keysToCamelCase<T>(data: any): T {
  if (Array.isArray(data)) {
    return data.map(keysToCamelCase) as any;
  } else if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        toCamelCase(key),
        keysToCamelCase(value)
      ])
    ) as T;
  }
  return data;
}

export function nullsToUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === null ? undefined : v])
  ) as T;
}
