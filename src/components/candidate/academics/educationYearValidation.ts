export const getMinimumAllowedYear = (dob: string | Date | number | null | undefined): number | null => {
  if (typeof dob === "number") return dob;
  if (!dob) return null;

  const birthDate = dob instanceof Date ? dob : new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  return birthDate.getFullYear();
};

export const isYearAllowed = (year: string | number | null | undefined, dob: string | Date | number | null | undefined): boolean => {
  if (!year && year !== 0) return true;

  const minimumYear = getMinimumAllowedYear(dob);
  if (minimumYear === null) return true;

  const parsedYear = Number(year);
  if (Number.isNaN(parsedYear)) return true;

  return parsedYear >= minimumYear;
};
