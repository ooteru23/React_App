export function createBonusKey(client, month, employee) {
  return `${client}|${month}|${employee}`;
}

export function createStatusKey(client, month, employee, netValue) {
  return `${client}|${month}|${employee}|${netValue}`;
}

