import { useMemo } from "react";
import { computeStats } from "../utils/bonusStats";

export function useBonusStats(bonusRows, salaryDeductionNumber) {
  return useMemo(
    () => computeStats(bonusRows, salaryDeductionNumber),
    [bonusRows, salaryDeductionNumber]
  );
}

