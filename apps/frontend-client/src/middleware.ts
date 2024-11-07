import { NextResponse, NextRequest } from "next/server";
import { signOutAndClearCookies } from "./utils/helper/signOutAndClearCookies";
import { API_ENDPOINTS } from "./utils/const/api-endpoints";

export async function middleware(request: NextRequest) {
  console.log("middleware.ts: request.url :::", request.url);

  const { pathname } = request.nextUrl;
  const { cookies } = await import("next/headers");
  const cookieStore = cookies();
  const allCookies = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const access_token = allCookies
    .split("; ")
    .find((cookie) => cookie.startsWith("access_token="))
    ?.split("=")[1];

  // Helper function to clear cookies and redirect
  const signOutAndClearCookies = async (
    req: NextRequest,
    redirectUrl: string
  ) => {
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
    req.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, "", { expires: new Date(0) });
    });
    return response;
  };

  // Get user info if access token exists
  let userInfoResponse, userInfo;
  if (access_token) {
    userInfoResponse = await fetch(new URL("/api/userInfo", request.url), {
      method: "GET",
      headers: {
        Cookie: allCookies || "", // Pass request cookies to /api/userInfo
      },
    });
    // If the user info request failed, clear cookies and redirect to /signin
    if (!userInfoResponse.ok) {
      return signOutAndClearCookies(request, "/signin");
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
    const role = userInfo?.data?.role;
    console.log("middleware.ts: role :::", role);

    // If user is not authorized for the dashboard, clear cookies and redirect
    if (role !== "admin") {
      return await signOutAndClearCookies(request, "/signin");
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
