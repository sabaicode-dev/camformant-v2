import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: any) {
    const accessToken = cookies().get('access_token');
    console.log("Access ::::::", accessToken);
    if (!accessToken) {
        // If the cookie is missing, redirect to the sign-in page
        return NextResponse.redirect(new URL('/signin', request.url));
    }

    // If the token exists, continue with the request
    return NextResponse.next();
}

// Define the paths that require authentication
export const config = {
    matcher: ['/dashboard/:path*'], // Protect /dashboard and all its subroutes
};
