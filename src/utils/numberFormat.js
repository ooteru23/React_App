export const sanitizeDigits = (value) =>
  value === null || value === undefined
    ? ""
    : value.toString().replace(/[^0-9]/g, "");

export const formatWithComma = (value) => {
  const clean = sanitizeDigits(value);
  if (!clean) {
    return "";
  }
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
