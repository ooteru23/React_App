import { STATUS, DISBURSEMENT } from "./constants";

export function computeStats(rows, salaryDeductionNumber) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return {
      onTimeValue: 0,
      lateValue: 0,
      totalValue: 0,
      bonusComponent: 0,
      percentOnTime: 0,
      totalOnTime: 0,
      percentLate: 0,
      totalLate: 0,
      bonusOnTime: 0,
      bonusLate: 0,
      total: 0,
    };
  }

  let onTimeValue = 0;
  let lateValue = 0;

  for (const row of rows) {
    if (row?.disbursement_bonus === DISBURSEMENT.PAID) continue;
    if (row?.workStatus === STATUS.ON_TIME) {
      onTimeValue += row?.netValueNumber || 0;
    } else if (row?.workStatus === STATUS.LATE) {
      lateValue += row?.netValueNumber || 0;
    }
  }

  const totalValue = onTimeValue + lateValue;
  const bonusComponent = salaryDeductionNumber > 0 ? totalValue - salaryDeductionNumber : 0;
  const percentOnTime = totalValue > 0 ? Math.round((onTimeValue / totalValue) * 100) : 0;
  const percentLate = totalValue > 0 ? Math.round((lateValue / totalValue) * 100) : 0;
  const totalOnTime = Math.round((percentOnTime / 100) * bonusComponent) || 0;
  const totalLate = Math.round((percentLate / 100) * bonusComponent) || 0;
  const bonusOnTime = Math.round((totalOnTime / 100) * 15) || 0;
  const bonusLate = Math.round((totalLate / 100) * 10) || 0;
  const total = bonusOnTime + bonusLate;

  return {
    onTimeValue,
    lateValue,
    totalValue,
    bonusComponent,
    percentOnTime,
    totalOnTime,
    percentLate,
    totalLate,
    bonusOnTime,
    bonusLate,
    total,
  };
}

