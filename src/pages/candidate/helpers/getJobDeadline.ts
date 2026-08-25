import { parseDatabaseDateToYYYYMMDD } from "../../../utils/utils";

export const getJobDeadline = (
  jobExpiryDate?: string
): string | undefined => {
  if (!jobExpiryDate) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedStr = parseDatabaseDateToYYYYMMDD(jobExpiryDate);
  let expiry: Date;
  if (parsedStr) {
    const parts = parsedStr.split("-");
    expiry = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  } else {
    expiry = new Date(jobExpiryDate);
  }
  expiry.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft > 0) return `Closes in ${daysLeft} days`;
  if (daysLeft === 0) return "Closes today";

  return "Closed";
};