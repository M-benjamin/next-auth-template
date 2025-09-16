// > IMPORTANT -> BY DEFAULT ALL ROUTES ARE PROTECTED BY AUTH
/**
 * List of rotes that are public and can be accessed without authentication
 * They do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/email-verification"];

/**
 * List of routes that are use for authentication
 * Authentication is required
 * These routes will redirect loggin in users to /settings
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset-email",
  "/auth/new-password",
];

/**
 * The prefix for API autherntication routes
 * Routes that start with this prefix are used for authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect route after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";
