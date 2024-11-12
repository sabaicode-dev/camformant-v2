import { NextResponse, NextRequest } from "next/server";
import { signOutAndClearCookies } from "./utils/helper/signOutAndClearCookies";

export async function middleware(request: NextRequest) {
    console.log("middleware.ts: request.url :::", request.url);

    const { pathname } = request.nextUrl;
    const { cookies } = (await import("next/headers"));
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll().map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
    const access_token = allCookies.split('; ').find(cookie => cookie.startsWith('access_token='))?.split('=')[1];

    // Revalidate role and permissions on every request
    let userInfoResponse, userInfo;
    if (access_token) {
        userInfoResponse = await fetch(new URL("/api/userInfo", request.url), {
            method: "GET",
            headers: {
                Cookie: allCookies || "", // Pass request cookies to /api/userInfo
            },
        });

        if (!userInfoResponse.ok) {
            return signOutAndClearCookies(request, "/signin", access_token);
        }

        userInfo = await userInfoResponse.json();
    }

    // 1. Redirect if user is already signed in and trying to access /signin
    if (pathname === "/signin" && access_token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 2. Redirect if trying to access /dashboard but user is not authenticated
    if (pathname.startsWith("/dashboard") && !access_token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // 3. Check user role for /dashboard access if authenticated
    if (pathname.startsWith("/dashboard")) {
        const role = userInfo.data.user.role;
        console.log("middleware.ts: role :::", role);

        // If user does not have the required role, sign out and redirect
        if (role !== "company") {
            return await signOutAndClearCookies(request, "/unAuthorized", access_token);
        }
    }

    console.log("middleware.ts: pathname :::", pathname);
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/signin"],
};
