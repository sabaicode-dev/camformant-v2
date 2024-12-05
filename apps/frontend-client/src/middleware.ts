
import { NextResponse, NextRequest } from "next/server";
import { authHelpers } from "./utils/helper/middlewareHelpers";

export async function middleware(request: NextRequest) {
  console.log("middleware.ts: request.url :::", request.url);

  const { pathname } = request.nextUrl;
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll().map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  const access_token = allCookies.split("; ").find((cookie) => cookie.startsWith("access_token="))?.split("=")[1];
  const refresh_token = allCookies.split("; ").find((cookie) => cookie.startsWith("refresh_token="))?.split("=")[1];

  // Try to refresh tokens if access token is missing but refresh token exists
  if (!access_token && refresh_token) {
    const refreshResult = await authHelpers.refreshAccessToken(refresh_token);
    if (refreshResult) {
      return refreshResult.response;
    } else {
      return authHelpers.clearAuthAndRedirect(request, "/signin");
    }
  }

  // Get user info if access token exists
  let userInfoResponse, userInfo;
  if (access_token) {
    userInfoResponse = await fetch(new URL("/api/userInfo", request.url), {
      method: "GET",
      headers: {
        Cookie: allCookies || "",
      },
    });
    if (!userInfoResponse.ok) {
      return authHelpers.clearAuthAndRedirect(request, "/signin", access_token);
    }
    userInfo = await userInfoResponse.json();
  }

  if (pathname === "/signin" && access_token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (pathname.startsWith("/dashboard") && !access_token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (pathname.startsWith("/dashboard")) {
    const role = userInfo.data.role;
    console.log("middleware.ts: role :::", role);

    if (role !== "company") {
      return await authHelpers.clearAuthAndRedirect(request, "/signin", access_token);
    } else {
      console.log("middleware.ts: User is authorized for the dashboard");
      return NextResponse.next();
    }
  }

  console.log("middleware.ts: pathname :::", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};