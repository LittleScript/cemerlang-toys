const REQUIRED_PRODUCTION_ENV = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "AUTH_URL",
  "SITE_URL",
  "AUTH_GOOGLE_ID",
  "AUTH_GOOGLE_SECRET",
] as const;

export function validateProductionEnv(): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing = REQUIRED_PRODUCTION_ENV.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}
