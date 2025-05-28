export const ACCESS_TOKEN = "access_token";
export const USER_ID = "user_id";
export const CLIENT_ID = "client_id";
export const BASE_URL = process.env.NEXT_PUBLIC_URL_API;

export const ERROR_BAD_URL = {"code":"10L","message":"La url es incorrecta"}
export * from "./apisUrls";

export enum BillingTypeInfo {
    STEM = "STEM",
    BUNCH = "BUNCH",
}

export enum OperationInfo {
    ADD = "ADD",
    EDIT = "EDIT",
    DELETE = "DELETE"
}