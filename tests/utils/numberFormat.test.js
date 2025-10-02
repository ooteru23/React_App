import { describe, it, expect } from "vitest";
import { sanitizeDigits, formatWithComma } from "../../src/utils/numberFormat";

describe("numberFormat utils", () => {
  it("sanitizes to digits only", () => {
    expect(sanitizeDigits("a1b2c3")).toBe("123");
    expect(sanitizeDigits(null)).toBe("");
  });

  it("formats with commas", () => {
    expect(formatWithComma("1234")).toBe("1,234");
    expect(formatWithComma(0)).toBe("");
  });
});

