import { describe, it, expect } from "vitest";
import { parseCurrency, formatCurrency } from "../../src/utils/currency";

describe("currency utils", () => {
  it("parses numbers and numeric strings", () => {
    expect(parseCurrency(1000)).toBe(1000);
    expect(parseCurrency("1,200")).toBe(1200);
    expect(parseCurrency("$3,400")).toBe(3400);
    expect(parseCurrency(null)).toBe(0);
  });

  it("formats currency with en-US locale", () => {
    expect(formatCurrency(1200)).toBe("1,200");
  });
});

