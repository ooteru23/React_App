export function parseCurrency(value) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? 0 : value;
  }
  if (!value) {
    return 0;
  }
  const numeric = value.toString().replace(/[^\d-]/g, "");
  return Number(numeric || 0);
}

export function formatCurrency(value) {
  return parseCurrency(value).toLocaleString("en-US");
}

