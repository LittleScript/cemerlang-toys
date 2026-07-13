import { describe, it, expect } from "vitest";
import { slugify, formatRupiah, cn } from "./utils";

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles Indonesian text", () => {
    expect(slugify("Mobil-mobilan & Kendaraan")).toBe("mobil-mobilan-kendaraan");
  });

  it("strips leading/trailing dashes", () => {
    expect(slugify("  --test--  ")).toBe("test");
  });

  it("removes diacritics from NFKD normalization", () => {
    // "tér" -> "ter"
    expect(slugify("tér")).toBe("ter");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  it("handles multiple separator characters", () => {
    expect(slugify("foo & bar + baz")).toBe("foo-bar-baz");
  });
});

describe("formatRupiah", () => {
  it("formats with Indonesian locale", () => {
    const result = formatRupiah(15000);
    expect(result).toContain("Rp");
    expect(result).toContain("15.000");
  });

  it("handles zero", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });

  it("handles large numbers", () => {
    const result = formatRupiah(150000000);
    expect(result).toContain("Rp");
    expect(result).toContain("150.000.000");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("px-4 py-2", "bg-blue-500");
    expect(result).toBe("px-4 py-2 bg-blue-500");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toBe("base extra");
  });

  it("tailwind-merge resolves conflicting utilities", () => {
    const result = cn("px-4 py-2", "px-6");
    expect(result).toContain("px-6");
    expect(result).toContain("py-2");
    expect(result).not.toContain("px-4");
  });
});
