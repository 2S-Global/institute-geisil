import { useEffect, useState } from "react";
import API from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CareerProfileResponse = {
  job_role_name?: string;
  employment_type?: string;
  expected_salary?: string | number | null;
  work_location_name?: string;
};

type EmploymentItem = {
  notice_period_name?: string;
  notice_period?: string;
};

const formatDisplayText = (value?: string | null) => {
  if (!value || value.toString().trim() === "") {
    return "Not added";
  }

  const text = value.toString().trim();

  if (text.toLowerCase() === "full-time") {
    return "Full-time";
  }

  if (text.toLowerCase() === "part-time") {
    return "Part-time";
  }

  if (text.toLowerCase() === "contract") {
    return "Contract";
  }

  return text;
};

const formatSalary = (salary?: string | number | null) => {
  if (!salary && salary !== 0) {
    return "Not added";
  }

  const numericValue = Number(salary);

  if (Number.isNaN(numericValue)) {
    return salary?.toString() || "Not added";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatNoticePeriod = (value?: string | null) => {
  if (!value || value.toString().trim() === "") {
    return "Not added";
  }

  const text = value.toString().trim();

  // Show months as-is
  const monthMatch = text.match(/^(\d+)\s*(month|months)$/i);
  if (monthMatch) {
    const months = Number(monthMatch[1]);
    return `${months} ${months === 1 ? "month" : "months"}`;
  }

  // Show days as-is
  const dayMatch = text.match(/^(\d+)\s*(day|days)$/i);
  if (dayMatch) {
    const days = Number(dayMatch[1]);
    return `${days} ${days === 1 ? "day" : "days"}`;
  }

  return text;
};

const JobPreferences = () => {
  const [careerProfile, setCareerProfile] = useState<CareerProfileResponse>({});
  const [noticePeriod, setNoticePeriod] = useState("Not added");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Career Profile API
        const careerResponse = await API.get(
          "/api/useraction/get_career_profile"
        );

        if (!isMounted) return;

        const careerData =
          careerResponse?.data?.success === true
            ? careerResponse.data.data || {}
            : {};

        setCareerProfile(careerData);

        // Employment API
        const employmentResponse = await API.get(
          "/api/candidate/employment/get_employment"
        );

        if (!isMounted) return;

        const employmentData =
          employmentResponse?.data?.success === true &&
          Array.isArray(employmentResponse.data.data)
            ? employmentResponse.data.data
            : [];

        const preferredNoticePeriod = employmentData.find(
          (item: EmploymentItem) =>
            item.notice_period_name || item.notice_period
        );

        setNoticePeriod(
          preferredNoticePeriod?.notice_period_name ||
            preferredNoticePeriod?.notice_period ||
            "Not added"
        );
      } catch (error) {
        console.error("Error fetching job preferences data:", error);

        if (isMounted) {
          setCareerProfile({});
          setNoticePeriod("Not added");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const preferences = [
    {
      label: "Desired role",
      value: formatDisplayText(careerProfile.job_role_name),
    },
    {
      label: "Employment type",
      value: formatDisplayText(careerProfile.employment_type),
    },
    {
      label: "Expected salary",
      value: formatSalary(careerProfile.expected_salary),
    },
    {
      label: "Notice period",
      value: formatNoticePeriod(noticePeriod),
    },
    {
      label: "Preferred locations",
      value: formatDisplayText(careerProfile.work_location_name),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Job preferences</CardTitle>
        <CardDescription>
          Used to match you to the right roles.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading job preferences...
          </div>
        ) : (
          preferences.map((item) => (
            <div
              key={item.label}
              className="flex items-start justify-between gap-3"
            >
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-right">{item.value}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default JobPreferences;