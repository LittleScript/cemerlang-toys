import { describe, expect, it } from "vitest";
import { isQaAuthEnabled, isQaUserId } from "@/lib/qa-auth";

const qaUrl = "postgresql://qa-user:secret@example.test/cemerlang_phase2d_qa";

describe("QA auth guard", () => {
  it("requires the exact isolated QA database and explicit opt-in", () => {
    expect(isQaAuthEnabled({ NODE_ENV: "development", QA_AUTH_ENABLED: "true", DATABASE_URL: qaUrl })).toBe(true);
    expect(isQaAuthEnabled({ NODE_ENV: "development", QA_AUTH_ENABLED: "false", DATABASE_URL: qaUrl })).toBe(false);
    expect(isQaAuthEnabled({ NODE_ENV: "development", QA_AUTH_ENABLED: "true", DATABASE_URL: qaUrl.replace("cemerlang_phase2d_qa", "cemerlang") })).toBe(false);
  });

  it("cannot be enabled in production", () => {
    expect(isQaAuthEnabled({ NODE_ENV: "production", QA_AUTH_ENABLED: "true", DATABASE_URL: qaUrl })).toBe(false);
  });

  it("limits browser identities to QA fixture users", () => {
    expect(isQaUserId("qa-member-a")).toBe(true);
    expect(isQaUserId("user-production")).toBe(false);
  });
});

