// import { auth } from "@/auth";
// import {
//   DEFAULT_LOGIN_REDIRECT,
//   apiAuthPrefix,
//   authRoutes,
//   publicRoutes,
//   protectedRoutes,
// } from "@/routes";

// const constructCallbackUrl = (url: URL) => {
//   const callbackUrl = url.searchParams.get("callback");

//   if (callbackUrl) {
//     try {
//       const decodedUrl = decodeURIComponent(callbackUrl);
//       return encodeURIComponent(decodedUrl);
//     } catch {
//       // If decoding fails, assume it's not encoded
//       return encodeURIComponent(callbackUrl);
//     }
//   }

//   // Default to encoding the pathname and search if no "callback" exists
//   let pathWithQuery = url.pathname;
//   if (url.search) {
//     pathWithQuery += url.search;
//   }
//   return encodeURIComponent(pathWithQuery);
// };

// export default auth((req) => {
//   const { nextUrl } = req;
//   const isLoggedIn = !!req.auth;

//   const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
//   const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
//   const isAuthRoute = authRoutes.includes(nextUrl.pathname);
//   const isProtectedRoute = protectedRoutes.includes(nextUrl?.pathname);

//   if (isApiAuthRoute) {
//     return undefined;
//   }

//   if (!isLoggedIn && isProtectedRoute) {
//     const encodedCallbackUrl = constructCallbackUrl(nextUrl);

//     return Response.redirect(
//       new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
//     );
//   }

//   if (!isLoggedIn && !isPublicRoute) {
//     const encodedCallbackUrl = constructCallbackUrl(nextUrl);

//     return Response.redirect(
//       new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
//     );
//   }

//   if (isLoggedIn && isAuthRoute) {
//     return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
//   }

//   return undefined;
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  protectedRoutes,
} from "@/routes";
import { NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "*",
  "https://ksscode-390383760878.europe-west2.run.app",
  "http://localhost:3000",
];

const constructCallbackUrl = (url: URL) => {
  const callbackUrl = url.searchParams.get("callback");
  if (callbackUrl) {
    try {
      const decodedUrl = decodeURIComponent(callbackUrl);
      return encodeURIComponent(decodedUrl);
    } catch {
      // If decoding fails, assume it's not encoded
      return encodeURIComponent(callbackUrl);
    }
  }
  // Default to encoding the pathname and search if no "callback" exists
  let pathWithQuery = url.pathname;
  if (url.search) {
    pathWithQuery += url.search;
  }
  return encodeURIComponent(pathWithQuery);
};

// CORS helper function
const addCorsHeaders = (response: Response, origin: string | null) => {
  const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
};

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(nextUrl?.pathname);
  const origin = req.headers.get("origin");

  // Handle CORS preflight requests for API routes
  if (req.method === "OPTIONS" && nextUrl.pathname.startsWith("/api/")) {
    const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);

    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "null",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Your existing auth logic
  if (isApiAuthRoute) {
    return undefined;
  }

  if (!isLoggedIn && isProtectedRoute) {
    const encodedCallbackUrl = constructCallbackUrl(nextUrl);
    const redirectResponse = Response.redirect(
      new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
    );
    return addCorsHeaders(redirectResponse, origin);
  }

  if (!isLoggedIn && !isPublicRoute) {
    const encodedCallbackUrl = constructCallbackUrl(nextUrl);
    const redirectResponse = Response.redirect(
      new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
    );
    return addCorsHeaders(redirectResponse, origin);
  }

  if (isLoggedIn && isAuthRoute) {
    const redirectResponse = Response.redirect(
      new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)
    );
    return addCorsHeaders(redirectResponse, origin);
  }

  // For API routes, add CORS headers to the response
  if (nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    return addCorsHeaders(response, origin);
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
