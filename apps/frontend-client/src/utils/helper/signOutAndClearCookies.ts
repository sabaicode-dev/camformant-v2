import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "../const/api-endpoints";

export const signOutAndClearCookies = async (req: NextRequest, redirectUrl: string, access_token?: string) => {
    try {
        if (access_token) {
            await fetch(API_ENDPOINTS.SIGN_OUT, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
        }
    } catch (error) {
        console.error("Failed to sign out:", error);
    }

    const response = NextResponse.redirect(new URL(redirectUrl, req.url));
    req.cookies.getAll().forEach(cookie => {
        response.cookies.set(cookie.name, '', { expires: new Date(0) }); // Clear all cookies
    });
    return response;
};