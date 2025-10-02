import { describe, it, expect } from "vitest";
import { computeStats } from "../../src/utils/bonusStats";
import { STATUS, DISBURSEMENT } from "../../src/utils/constants";

describe("computeStats", () => {
  it("returns zeros for empty rows", () => {
    const stats = computeStats([], 0);
    expect(stats.total).toBe(0);
    expect(stats.totalValue).toBe(0);
  });

  it("computes on time and late splits and bonuses", () => {
    const rows = [
      { workStatus: STATUS.ON_TIME, netValueNumber: 1000, disbursement_bonus: DISBURSEMENT.UNPAID },
      { workStatus: STATUS.LATE, netValueNumber: 500, disbursement_bonus: DISBURSEMENT.UNPAID },
    ];
    const stats = computeStats(rows, 200);
    expect(stats.totalValue).toBe(1500);
    expect(stats.bonusComponent).toBe(1300);
    expect(stats.percentOnTime + stats.percentLate).toBe(100);
    expect(stats.total).toBeGreaterThan(0);
  });
});

