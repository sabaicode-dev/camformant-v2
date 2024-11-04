import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    console.log("middleware.ts: request.url :::", request.url);

    const { pathname } = request.nextUrl;
    const token = request.cookies.get("access_token");

    console.log("middleware.ts: pathname :::", pathname);

    // If the user is trying to access the login page and is already authenticated, redirect to the dashboard
    if (pathname === "/signin" && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If the user is trying to access a protected route and is not authenticated, redirect to the login page
    if (pathname.startsWith("/dashboard") && !token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If none of the above conditions are met, continue with the request
    return NextResponse.next();
}

// Configure the middleware to run for specific routes
export const config = {
    matcher: ["/dashboard/:path*", "/signin"], // Adjust the matcher to your protected routes and login page
};