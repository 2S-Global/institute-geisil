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
