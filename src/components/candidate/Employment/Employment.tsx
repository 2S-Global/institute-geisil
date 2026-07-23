
import React, { useEffect, useState } from "react";
import {
  Pencil,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Calendar,
} from "lucide-react";
import API from "../../../lib/axios";
import EmploymentModal from "./EmploymentModal";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Shared dynamic verification icon component matching API state fields
const StatusIcon = ({ status, inlineBadge = false }) => {
  const iconColor = inlineBadge ? "text-white" : "";

  switch (status) {
    case "verified":
      return (
        <CheckCircle2
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-green-600"}`}
        />
      );
    case "rejected":
      return (
        <XCircle
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-red-600"}`}
        />
      );
    case "pending":
    default:
      return (
        <Clock
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-amber-600"}`}
        />
      );
  }
};




export const EmploymentCard = ({setRefresh}) => {
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [activeJobInfo, setActiveJobInfo] = useState(null);

  const fetchEmployments = () => {
    setLoading(true);
    setError(null);

    API.get("api/candidate/employment/get_employment")
      .then((response) => {
        const resData = response.data;

        if (resData.success && resData.data) {
          setEmployments(resData.data);
        } else {
          setError(resData.message || "Failed to fetch data");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setEmployments([]);
          setError(null);
        } else {
          setError(err.message || "Something went wrong");
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployments();
  }, []);

  const handleEdit = (job) => {
    setSelectedEmployment(job);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEmployment(null);
    setIsModalOpen(true);
  };

  const handleOpenInfo = (job) => {
    setActiveJobInfo(job);
    setInfoDialogOpen(true);
  };

  // Maps status strings to rich, deep background colors with clean borders
  const getBadgeStyles = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-700 text-white border-green-800";
      case "rejected":
        return "bg-red-700 text-white border-red-800";
      case "pending":
      default:
        return "bg-amber-600 text-white border-amber-700";
    }
  };

  // Formats status strings for raw text presentation
  const getBadgeLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "verified":
        return "VERIFIED";
      case "rejected":
        return "REJECTED";
      case "pending":
      default:
        return "PENDING";
    }
  };

  const resolveFieldStatus = (flag) => {
    if (flag === true) return "verified";
    if (flag === false) return "rejected";
    return "pending";
  };

  const sortedEmployments = [...employments].sort((a, b) => {
    // Current job first
    if (a.currentlyWorking !== b.currentlyWorking) {
      return Number(b.currentlyWorking) - Number(a.currentlyWorking);
    }

    // For previous jobs, latest leaving date first
    if (!a.currentlyWorking && !b.currentlyWorking) {
      if ((a.leaving_year || 0) !== (b.leaving_year || 0)) {
        return (b.leaving_year || 0) - (a.leaving_year || 0);
      }

      if ((a.leaving_month || 0) !== (b.leaving_month || 0)) {
        return (b.leaving_month || 0) - (a.leaving_month || 0);
      }
    }

    // Finally sort by joining date
    if ((a.joining_year || 0) !== (b.joining_year || 0)) {
      return (b.joining_year || 0) - (a.joining_year || 0);
    }

    return (b.joining_month || 0) - (a.joining_month || 0);
  });

  return (
    <>
      <Card className="max-w-4xl mx-auto my-8 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Employment
            </CardTitle>
            <CardDescription>
              Details about your current and past work history.
            </CardDescription>
          </div>

          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add Employment
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48 bg-muted" />
                      <Skeleton className="h-4 w-36 bg-muted" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )  : employments.length === 0 ? (
            <div className="flex flex-1 items-center justify-center w-full shadow-sm">
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <p className="text-sm">No work employment added yet.</p>
              </div>
            </div>
          ) : (
            sortedEmployments.map((job) => {
              const durationStr = job.currentlyWorking
                ? `${job.joining_month_name} ${job.joining_year} — Present`
                : `${job.joining_month_name} ${job.joining_year} — ${job.leaving_month_name} ${job.leaving_year}`;

              const companyStatus = resolveFieldStatus(job.workedInCompany);

              const designationStatus =
                companyStatus === "pending"
                  ? "pending"
                  : job.designationVerified !== undefined
                    ? resolveFieldStatus(job.designationVerified)
                    : companyStatus;

              const typeStatus =
                companyStatus === "pending"
                  ? "pending"
                  : job.jobTypeVerified !== undefined
                    ? resolveFieldStatus(job.jobTypeVerified)
                    : companyStatus;

              const durationStatus =
                companyStatus === "pending"
                  ? "pending"
                  : job.jobDurationVerified !== undefined
                    ? resolveFieldStatus(job.jobDurationVerified)
                    : companyStatus;

              // Fallback description matching the sample style if API description is empty
              const jobDescription =
                job.description ||
                job.job_description ||
                `Responsible for managing core assignments, designing execution layouts for ${
                  job.job_title || "this role"
                }, scaling analytics tracking workflows, and pushing higher delivery standards.`;

              return (
                <div
                  key={job._id}
                  className="border border-slate-200 rounded-2xl p-5 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 w-full">
                      {/* Left Icon */}
                      <div className="p-3 bg-blue-50 text-blue-900 rounded-xl shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>

                      <div className="space-y-2 w-full">
                        {/* 1. Job Title */}
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-lg leading-snug">
                            {job.job_title}
                          </h3>
                          <StatusIcon status={designationStatus} />
                        </div>

                        {/* 2. Company Name & Global Status Badge */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
                            {job.company_name}
                          </span>

                          <span
                            onClick={() => handleOpenInfo(job)}
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold border shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${getBadgeStyles(
                              companyStatus,
                            )}`}
                          >
                            <StatusIcon
                              status={companyStatus}
                              inlineBadge={true}
                            />
                            {getBadgeLabel(companyStatus)}
                          </span>
                        </div>

                        {/* 3. Duration Badge */}
                        <div className="flex items-center gap-2 pt-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{durationStr}</span>
                          </div>
                          <StatusIcon status={durationStatus} />
                        </div>

                        {/* 4. Description Paragraph (Matches Image Layout) */}
                        <div
                          className="text-sm text-slate-500 pt-1 leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1"
                          dangerouslySetInnerHTML={{ __html: jobDescription }}
                        />

                        {/* 5. Additional Metadata */}
                        <div className="pt-1 text-xs text-slate-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700">
                              Type:
                            </span>
                            <span className="capitalize">
                              {job.employmenttype || "N/A"}
                            </span>
                            <StatusIcon status={typeStatus} />
                          </div>

                          {job.notice_period_name && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-700">
                                Notice Period:
                              </span>
                              <span>{job.notice_period_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Action Button */}
                    {companyStatus !== "verified" &&
                      companyStatus !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(job)}
                          className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 shrink-0"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Verification Details Shadcn Dialog component layout */}

      <EmploymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployment(null);
        }}
        onRefresh={fetchEmployments}
        jobId={selectedEmployment?._id || ""}
        editData={selectedEmployment}
        setRefresh ={setRefresh}
      />
    </>
  );
};

export default EmploymentCard;
