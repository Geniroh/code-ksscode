/**
 * An array of routes that are accessible to the public
 */
export const publicRoutes = ["/register", "/auth-error"];

/**
 * An array of routes that are accessible only to authenticated users
 */
export const authRoutes = ["/register", "/auth-error"];

/**
 * An array of routes that require authentication
 */
export const protectedRoutes = ["/dashboard", "/profile"];

/**
 * Prefix for API authentication routes
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after login
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
