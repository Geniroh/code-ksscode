import { auth } from "@/auth";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  protectedRoutes,
} from "@/routes";

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

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isProtectedRoute = protectedRoutes.includes(nextUrl?.pathname);

  if (isApiAuthRoute) {
    return undefined;
  }

  if (!isLoggedIn && isProtectedRoute) {
    const encodedCallbackUrl = constructCallbackUrl(nextUrl);

    return Response.redirect(
      new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (!isLoggedIn && !isPublicRoute) {
    const encodedCallbackUrl = constructCallbackUrl(nextUrl);

    return Response.redirect(
      new URL(`/register?callback=${encodedCallbackUrl}`, nextUrl)
    );
  }

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  return undefined;
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
