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

const getRecordCompletionYear = (record: any): number | null => {
  let duration = record?.duration;
  if (typeof duration === "string") {
    try {
      duration = JSON.parse(duration || "{}");
    } catch {
      duration = {};
    }
  }
  const year = Number(
    duration?.to ||
      duration?.end ||
      record?.end_year ||
      record?.endYear ||
      record?.year_of_passing ||
      0
  );

  return Number.isInteger(year) && year > 0 ? year : null;
};

export const getMinimumAllowedYearForEducationLevel = (
  levelName: string,
  dob: string | Date | number | null | undefined,
  records: any[],
  getLevelName: (record: any) => string
): number | null => {
  const birthYear = getMinimumAllowedYear(dob);
  if (birthYear === null) return null;

  const normalizedLevelName = String(levelName ?? "").trim().toLowerCase();
  if (normalizedLevelName !== "12th standard") return birthYear;

  const matchingCompletionYear = (name: string) =>
    records
      .filter((record) => getLevelName(record) === name)
      .map(getRecordCompletionYear)
      .filter((year): year is number => year !== null)
      .reduce<number | null>((latestYear, year) => Math.max(latestYear ?? 0, year), null);

  const baseYear =
    matchingCompletionYear("diploma") ??
    matchingCompletionYear("10th standard") ??
    birthYear + 14;

  return baseYear + 2;
};

export const getMinimumCourseDuration = (levelName: string): number => {
  switch (String(levelName ?? "").trim().toLowerCase()) {
    case "undergraduate":
    case "under graduate":
    case "graduation":
    case "doctorate/phd":
    case "doctorate":
    case "phd":
      return 3;
    case "postgraduate":
    case "post graduate":
    case "post graduation":
      return 2;
    default:
      return 0;
  }
};
