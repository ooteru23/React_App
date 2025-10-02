import { describe, it, expect } from "vitest";
import { createBonusKey, createStatusKey } from "../../src/utils/bonusKeys";

describe("bonus key utils", () => {
  it("creates stable keys", () => {
    expect(createBonusKey("c", "Jan", "e")).toBe("c|Jan|e");
    expect(createStatusKey("c", "Jan", "e", 100)).toBe("c|Jan|e|100");
  });
});

