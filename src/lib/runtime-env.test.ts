import { afterEach, describe, expect, it, vi } from "vitest";
import { validateProductionEnv } from "@/lib/runtime-env";

const required = {
  DATABASE_URL: "postgresql://example",
  AUTH_SECRET: "example-secret",
  AUTH_URL: "https://example.test",
  SITE_URL: "https://example.test",
  AUTH_GOOGLE_ID: "example-id",
  AUTH_GOOGLE_SECRET: "example-secret",
};

afterEach(() => {
  vi.unstubAllEnvs();
  for (const name of Object.keys(required)) delete process.env[name];
});

describe("production environment validation", () => {
  it("does not require production values during development", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(() => validateProductionEnv()).not.toThrow();
  });

  it("fails clearly when a required production value is missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    Object.assign(process.env, required);
    delete process.env.AUTH_SECRET;

    expect(() => validateProductionEnv()).toThrow(
      "Missing required production environment variables: AUTH_SECRET"
    );
  });

  it("accepts a complete production contract", () => {
    vi.stubEnv("NODE_ENV", "production");
    Object.assign(process.env, required);

    expect(() => validateProductionEnv()).not.toThrow();
  });
});
