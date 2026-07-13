import { describe, it, expect } from "vitest";
import { normalizeWhatsApp } from "./phone";

describe("normalizeWhatsApp", () => {
  it("normalizes leading 08 format", () => {
    expect(normalizeWhatsApp("08123456789")).toBe("628123456789");
  });

  it("normalizes leading +62 format", () => {
    expect(normalizeWhatsApp("+628123456789")).toBe("628123456789");
  });

  it("normalizes leading 62 format", () => {
    expect(normalizeWhatsApp("628123456789")).toBe("628123456789");
  });

  it("normalizes format with spaces and dashes", () => {
    expect(normalizeWhatsApp("+62 812-3456-7890")).toBe("6281234567890");
  });

  it("normalizes format with parentheses", () => {
    expect(normalizeWhatsApp("0812 3456 7890")).toBe("6281234567890");
  });

  it("returns null for non-Indonesian number (too short)", () => {
    expect(normalizeWhatsApp("123")).toBeNull();
  });

  it("returns null for non-Indonesian number (wrong prefix)", () => {
    expect(normalizeWhatsApp("+12345678901")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(normalizeWhatsApp("")).toBeNull();
  });

  it("handles single leading 8 format (no 0 prefix)", () => {
    expect(normalizeWhatsApp("81234567890")).toBe("6281234567890");
  });
});
