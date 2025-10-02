import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";

export function formatDateValue(value, pattern) {
  if (!value) return "";
  let parsed = value;
  if (typeof value === "string") {
    const normalized = /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
    parsed = parseISO(normalized);
  } else if (!(value instanceof Date)) {
    parsed = new Date(value);
  }
  if (isValid(parsed)) return format(parsed, pattern, { locale: id });
  return typeof value === "string" ? value : String(value);
}

