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