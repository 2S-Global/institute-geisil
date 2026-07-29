
import { useEffect, useState } from "react";
import API from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Calendar, MapPin, IndianRupee, Clock } from "lucide-react";

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

interface JobPreferencesProps {
  refreshKey?: number;
}

const formatDisplayText = (value?: string | null) => {
  if (!value || value.toString().trim() === "") {
    return "Not Added";
  }

  const text = value.toString().trim();

  if (text.toLowerCase() === "full-time") {
    return "Full-Time";
  }

  if (text.toLowerCase() === "part-time") {
    return "Part-Time";
  }

  if (text.toLowerCase() === "contract") {
    return "Contract";
  }

  return text;
};

const formatSalary = (salary?: string | number | null) => {
  if (!salary && salary !== 0) {
    return "Not Added";
  }

  const numericValue = Number(salary);

  if (Number.isNaN(numericValue)) {
    return salary?.toString() || "Not Added";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatNoticePeriod = (value?: string | null) => {
  if (!value || value.toString().trim() === "") {
    return "Not Added";
  }

  const text = value.toString().trim();

  // Show months as-is
  const monthMatch = text.match(/^(\d+)\s*(month|months)$/i);
  if (monthMatch) {
    const months = Number(monthMatch[1]);
    return `${months} ${months === 1 ? "Month" : "Months"}`;
  }

  // Show days as-is
  const dayMatch = text.match(/^(\d+)\s*(day|days)$/i);
  if (dayMatch) {
    const days = Number(dayMatch[1]);
    return `${days} ${days === 1 ? "Day" : "Days"}`;
  }

  return text;
};

const JobPreferences = ({ refreshKey }: JobPreferencesProps) => {
  const [careerProfile, setCareerProfile] = useState<CareerProfileResponse>({});
  const [noticePeriod, setNoticePeriod] = useState("Not Added");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Career Profile API
        const careerResponse = await API.get(
          "/api/useraction/get_career_profile",
        );

        if (!isMounted) return;

        const careerData =
          careerResponse?.data?.success === true
            ? careerResponse.data.data || {}
            : {};

        setCareerProfile(careerData);

        // Employment API
        const employmentResponse = await API.get(
          "/api/candidate/employment/get_employment",
        );

        if (!isMounted) return;

        const employmentData =
          employmentResponse?.data?.success === true &&
          Array.isArray(employmentResponse.data.data)
            ? employmentResponse.data.data
            : [];

        const preferredNoticePeriod = employmentData.find(
          (item: EmploymentItem) =>
            item.notice_period_name || item.notice_period,
        );

        setNoticePeriod(
          preferredNoticePeriod?.notice_period_name ||
            preferredNoticePeriod?.notice_period ||
            "Not Added",
        );
      } catch (error) {
        console.error("Error fetching job preferences data:", error);

        if (isMounted) {
          setCareerProfile({});
          setNoticePeriod("Not Added");
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
  }, [refreshKey]);

  const preferences = [
    {
      label: "Desired Role",
      value: formatDisplayText(careerProfile.job_role_name),
      icon: Briefcase,
    },
    {
      label: "Employment Type",
      value: formatDisplayText(careerProfile.employment_type),
      icon: Calendar,
    },
    {
      label: "Expected Salary",
      value: formatSalary(careerProfile.expected_salary),
      icon: IndianRupee,
    },
    {
      label: "Notice Period",
      value: formatNoticePeriod(noticePeriod),
      icon: Clock,
    },
    {
      label: "Preferred Locations",
      value: formatDisplayText(careerProfile.work_location_name),
      icon: MapPin,
    },
  ];

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold tracking-tight">
          Job Preferences
        </CardTitle>
        <CardDescription className="text-xs">
          Used To Match You To Relevant Roles And Opportunities.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3.5 text-sm">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {preferences.map((item) => {
              const Icon = item.icon;
              const isNotAdded = item.value === "Not Added";

              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                    <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                    <span className="text-xs font-medium tracking-tight truncate">
                      {item.label}
                    </span>
                  </div>

                  {item.label === "Notice Period" ? (
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border transition-colors ${
                        isNotAdded
                          ? "bg-secondary/50 text-muted-foreground border-transparent"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {item.value}
                    </span>
                  ) : (
                    <span
                      className={`text-right truncate max-w-[200px] text-xs font-medium ${
                        isNotAdded
                          ? "text-muted-foreground/70"
                          : "text-foreground"
                      }`}
                      title={item.value}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobPreferences;