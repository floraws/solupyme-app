export interface DecodedToken {
  user_id?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}