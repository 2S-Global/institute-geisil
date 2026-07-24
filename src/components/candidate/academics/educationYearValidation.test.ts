import { describe, expect, it } from "vitest";
import { getMinimumAllowedYear, isYearAllowed } from "./educationYearValidation";

describe("education year validation", () => {
  it("returns the birth year as the minimum allowed year", () => {
    expect(getMinimumAllowedYear("1998-01-15")).toBe(1998);
    expect(getMinimumAllowedYear(new Date("1998-01-15"))).toBe(1998);
  });

  it("rejects years before the user's birth year", () => {
    expect(isYearAllowed(1997, "1998-01-15")).toBe(false);
    expect(isYearAllowed("1998", "1998-01-15")).toBe(true);
    expect(isYearAllowed(2000, "1998-01-15")).toBe(true);
  });

  it("allows all values when no date of birth is available", () => {
    expect(isYearAllowed(1980, null)).toBe(true);
    expect(isYearAllowed("2020", "")).toBe(true);
  });
});
