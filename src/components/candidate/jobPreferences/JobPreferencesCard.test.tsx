import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import JobPreferences from "@/components/candidate/jobPreferences/JobPreferences";

const { getMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
}));

vi.mock("@/lib/axios", () => ({
  default: {
    get: getMock,
  },
}));

describe("JobPreferences", () => {
  beforeEach(() => {
    getMock.mockReset();
  });

  it("renders career and employment values from the API responses", async () => {
    getMock
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            job_role_name: "Senior Frontend Engineer",
            employment_type: "full-time",
            expected_salary: 1800000,
            work_location_name: "Bengaluru, Remote",
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: [{ notice_period_name: "30 days", currentlyWorking: true }],
        },
      });

    render(<JobPreferences />);

    await waitFor(() => {
      expect(screen.getByText("Senior Frontend Engineer")).toBeInTheDocument();
    });

    expect(screen.getByText("Full-time")).toBeInTheDocument();
    expect(screen.getByText("₹18,00,000")).toBeInTheDocument();
    expect(screen.getByText("30 days")).toBeInTheDocument();
    expect(screen.getByText("Bengaluru, Remote")).toBeInTheDocument();
  });
});
