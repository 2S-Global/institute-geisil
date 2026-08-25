export function toLocalDateTime(utcTime) {
  const date = new Date(utcTime);
  if (isNaN(date.getTime())) {
    return "";
  }
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );
  return `${values.year}/${values.month}/${values.day} ${values.hour}:${values.minute} ${values.dayPeriod.toLowerCase()}`;
}

export const parseDatabaseDateToYYYYMMDD = (dateStr: any): string | null => {
  if (!dateStr) return null;
  const str = String(dateStr);
  if (str.endsWith("T00:00:00.000Z") || str.endsWith("T00:00:00Z") || str.endsWith("T00:00:00")) {
    return str.split("T")[0];
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseYYYYMMDDToLocalDate = (dateVal: any): Date | null => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) return dateVal;
  const parts = String(dateVal).split("T")[0].split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateVal);
};

export const formatLocalDateToYYYYMMDD = (dateVal: any): string | null => {
  if (!dateVal) return null;
  if (dateVal instanceof Date) {
    const year = dateVal.getFullYear();
    const month = String(dateVal.getMonth() + 1).padStart(2, "0");
    const day = String(dateVal.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return String(dateVal).split("T")[0];
};

export const parseDatabaseDateToLocal = (dateStr: any): Date | null => {
  if (!dateStr) return null;
  const parsedStr = parseDatabaseDateToYYYYMMDD(dateStr);
  if (!parsedStr) return null;
  const parts = parsedStr.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
};
