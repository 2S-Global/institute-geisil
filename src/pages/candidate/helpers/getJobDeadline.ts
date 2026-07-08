export const getJobDeadline = (
  jobExpiryDate?: string
): string | undefined => {
  if (!jobExpiryDate) return undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(jobExpiryDate);
  expiry.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft > 0) return `Closes in ${daysLeft} days`;
  if (daysLeft === 0) return "Closes today";

  return "Closed";
};