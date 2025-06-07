import { ACCESS_TOKEN, apiUrls } from "@/constants";
import { fetchWrapper } from "@/helpers";
import { AccessTokenResponse } from "@/types/api";
import { cookies } from "next/headers";


export async function POST(request: Request) {
    const { username, password } = await request.json();
    if (!username || !password) {
        return new Response(JSON.stringify({ status: 400, message: "Username and password are required" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const response = await fetchWrapper.post(apiUrls.auth.login, { username, password });
    if (response) {
        const cookieStore = await cookies();
        const accessTokenResponse: AccessTokenResponse = response as AccessTokenResponse;
        cookieStore.set(ACCESS_TOKEN, accessTokenResponse.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });
    }
    return new Response(JSON.stringify({ status: 200, message: "Login Exisoso" }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}