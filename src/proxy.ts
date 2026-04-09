import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthServices";

export async function proxy(req: NextRequest) {
  const publicRoutes = ["/login-page", "/view"];
  const pathname = req.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

  // 🔒 Protect ALL admin-dashboard routes (including nested)
  const isSuperAdminRoute = pathname.startsWith("/admin-dashboard");

  const user = await getCurrentUser();

  // ✅ Logged-in user → block public pages
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Not logged-in → block protected routes
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login-page", req.url));
  }

  // 🔥 Super Admin only access
  if (user && isSuperAdminRoute && user.role !== "Super-Admin") {
    return NextResponse.redirect(new URL("/", req.url)); // or "/unauthorized"
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { getCurrentUser } from "./services/AuthServices";

// export async function proxy(req: NextRequest) {
//   const publicRoutes = ["/login-page", "/view"];

//   const isPublicRoute = publicRoutes.some((path) =>
//     req.nextUrl.pathname.startsWith(path)
//   );

//   // Check for an authentication token (assuming token is stored in a cookie)
//   const user = await getCurrentUser();

//   // If the user is authenticated and tries to access the login page, redirect them to the homepage
//   if (user && isPublicRoute) {
//     const homeUrl = new URL("/", req.url); // Redirect to homepage
//     return NextResponse.redirect(homeUrl);
//   }

//   // If the user is unauthenticated and tries to access a protected route, redirect them to the login page
//   if (!user && !isPublicRoute) {
//     const loginUrl = new URL("/login-page", req.url);
//     return NextResponse.redirect(loginUrl);
//   }

//   // Allow the request to proceed if none of the above conditions are met
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next|.*\\..*).*)"], // Match all routes except API, _next, and static files
// };
