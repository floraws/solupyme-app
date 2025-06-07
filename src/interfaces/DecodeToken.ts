export interface DecodedToken {
  userId?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}