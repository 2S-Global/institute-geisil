/**
 * Helper to compare two jobs by their deadline.
 * - Active deadlines (today or future) are sorted ascending (closest first).
 * - Jobs with no deadline are placed below active jobs.
 * - Closed jobs are placed at the bottom, sorted descending by recency.
 */
export const compareJobsByDeadline = (a: any, b: any): number => {
  const getDaysLeft = (expiryDateStr?: string) => {
    if (!expiryDateStr) return Infinity;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDateStr);
    if (isNaN(expiry.getTime())) return Infinity;
    expiry.setHours(0, 0, 0, 0);
    return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const daysA = getDaysLeft(a.rawJob?.jobExpiryDate);
  const daysB = getDaysLeft(b.rawJob?.jobExpiryDate);

  const getPriority = (d: number) => {
    if (d >= 0 && d !== Infinity) return 1; // Active
    if (d === Infinity) return 2; // No deadline
    return 3; // Closed
  };

  const pA = getPriority(daysA);
  const pB = getPriority(daysB);

  if (pA !== pB) return pA - pB;
  if (pA === 1) return daysA - daysB;
  if (pA === 3) return daysB - daysA;
  return 0;
};
