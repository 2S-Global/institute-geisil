import { describe, expect, it } from "vitest";
import {
  getMinimumAllowedYear,
  getMinimumAllowedYearForEducationLevel,
  getMinimumCourseDuration,
  isYearAllowed,
} from "./educationYearValidation";

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

  it("uses the 10th passing year plus two years for 12th standard when no diploma exists", () => {
    expect(
      getMinimumAllowedYearForEducationLevel("12th standard", "1998-01-15", [
        { level_name: "10th standard", year_of_passing: 2018 },
      ], (record) => record.level_name)
    ).toBe(2020);
  });

  it("uses the diploma passing year plus two years for 12th standard when diploma exists", () => {
    expect(
      getMinimumAllowedYearForEducationLevel("12th standard", "1998-01-15", [
        { level_name: "10th standard", year_of_passing: 2018 },
        { level_name: "diploma", year_of_passing: 2020 },
      ], (record) => record.level_name)
    ).toBe(2022);
  });

  it("uses the diploma course end year plus two years for 12th standard", () => {
    expect(
      getMinimumAllowedYearForEducationLevel("12th standard", "1998-01-15", [
        { level_name: "10th standard", year_of_passing: 2018 },
        { level_name: "diploma", duration: { to: 2021 } },
      ], (record) => record.level_name)
    ).toBe(2023);
  });

  it("returns the requested minimum durations for degree levels", () => {
    expect(getMinimumCourseDuration("Undergraduate")).toBe(3);
    expect(getMinimumCourseDuration("Post Graduate")).toBe(2);
    expect(getMinimumCourseDuration("Doctorate/PhD")).toBe(3);
  });
});
