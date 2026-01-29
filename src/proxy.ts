import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthServices";

export async function proxy(req: NextRequest) {
  const publicRoutes = ["/login-page", "/view"];

  const isPublicRoute = publicRoutes.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Check for an authentication token (assuming token is stored in a cookie)
  const user = await getCurrentUser();

  // If the user is authenticated and tries to access the login page, redirect them to the homepage
  if (user && isPublicRoute) {
    const homeUrl = new URL("/", req.url); // Redirect to homepage
    return NextResponse.redirect(homeUrl);
  }

  // If the user is unauthenticated and tries to access a protected route, redirect them to the login page
  if (!user && !isPublicRoute) {
    const loginUrl = new URL("/login-page", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Allow the request to proceed if none of the above conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all routes except API, _next, and static files
};
