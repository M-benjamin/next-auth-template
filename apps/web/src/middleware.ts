import {
  apiAuthPrefix,
  publicRoutes,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
} from "./routes";
import authConfig from "./auth.config";
import NextAuth from "next-auth";
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const { auth } = NextAuth(authConfig);

//  ------ FOR NEXTAUTH
export default auth((req) => {
  // > Get the nextUrl
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // > Check if the route is protected
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  // > If the route is protected, do nothing
  if (isApiAuthRoute) {
    return null;
  }

  // > If the route is not protected, do nothing
  if (isAuthRoute) {
    // > If connected, redirect to /settings
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    // > If not connected, do nothing
    return null;
  }

  // > If not connected, redirect to /auth/login
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
});

// ------ FOR CLERK
// const isProtectedRoute = createRouteMatcher([
//   "/dashboard",
//   "/dashboard/(.*)", // Protecting dashboard and everything inside
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (isProtectedRoute(req)) {
//     await auth.protect(); // Protect the route if it matches the defined criteria
//   }
// });

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
