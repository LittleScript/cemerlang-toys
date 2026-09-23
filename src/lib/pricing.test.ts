import { describe, expect, it } from "vitest";
import { priceVisibilityState } from "./pricing";

describe("price visibility", () => {
  it.each([
    [{ authenticated: false }, "ANONYMOUS"],
    [{ authenticated: true, status: undefined }, "AUTHENTICATED_NOT_APPLIED"],
    [{ authenticated: true, status: "PENDING" }, "PENDING"],
    [{ authenticated: true, status: "REJECTED" }, "REJECTED"],
    [{ authenticated: true, status: "APPROVED", hasPriceGroup: false }, "APPROVED_WITHOUT_PRICE_GROUP"],
    [{ authenticated: true, status: "APPROVED", hasPriceGroup: true }, "APPROVED_WITH_PRICE_GROUP"],
  ])("does not expose a price state for %j", (input, expected) => {
    expect(priceVisibilityState(input)).toBe(expected);
  });
});
