

import React, { useEffect, useState } from "react";
import { Pencil, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import API from "../../../lib/axios";
import EmploymentModal from "./EmploymentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

// Convert COMPANY NAME to Camel Case
const toCamelCase = (text = "") => {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const EmploymentCard = () => {
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

  // Helper function to resolve boolean/undefined API response values to custom status strings
  const resolveFieldStatus = (flag) => {
    if (flag === true) return "verified";
    if (flag === false) return "rejected";
    return "pending";
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading employment details...
      </div>
    );
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto my-8 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Employment
          </CardTitle>

          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employment
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {error ? (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : employments.length === 0 ? (
            <div className="flex flex-1 items-center justify-center w-full shadow-sm">
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <p className="text-sm">No work experiences added yet.</p>
              </div>
            </div>
          ) : (
            employments.map((job) => {
              const durationStr = job.currentlyWorking
                ? `${job.joining_month_name} ${job.joining_year} to Present`
                : `${job.joining_month_name} ${job.joining_year} to ${job.leaving_month_name} ${job.leaving_year}`;

              const companyStatus = resolveFieldStatus(job.workedInCompany);

              // ⭐ FIX: If company status is pending, force fields to be pending as well
              const designationStatus = companyStatus === "pending" 
                ? "pending" 
                : (job.designationVerified !== undefined ? resolveFieldStatus(job.designationVerified) : companyStatus);

              const typeStatus = companyStatus === "pending" 
                ? "pending" 
                : (job.jobTypeVerified !== undefined ? resolveFieldStatus(job.jobTypeVerified) : companyStatus);

              const durationStatus = companyStatus === "pending" 
                ? "pending" 
                : (job.jobDurationVerified !== undefined ? resolveFieldStatus(job.jobDurationVerified) : companyStatus);

              return (
                <div key={job._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 w-full architecture-fields">
                      {/* 1. Job Title Section */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">
                          {toCamelCase(job.job_title)}
                        </span>
                        <StatusIcon status={designationStatus} />
                      </div>

                      {/* 2. Company Name & Global Status Badge */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">
                          {toCamelCase(job.company_name)}
                        </span>

                        <span
                          onClick={() => handleOpenInfo(job)}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border shadow-sm cursor-pointer hover:opacity-90 transition-opacity ${getBadgeStyles(
                            companyStatus
                          )}`}
                        >
                          <StatusIcon
                            status={companyStatus}
                            inlineBadge={true}
                          />
                          {getBadgeLabel(companyStatus)}
                        </span>
                      </div>

                      {/* 3. Employment Type Field Row */}
                      <div className="text-sm text-gray-600 capitalize flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Type:</span>
                        <span>{job.employmenttype || "N/A"}</span>
                        <StatusIcon status={typeStatus} />
                      </div>

                      {/* 4. Duration Field Row */}
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="text-gray-500 font-medium">
                          Duration:
                        </span>
                        <span>{durationStr}</span>
                        <StatusIcon status={durationStatus} />
                      </div>

                      {/* 5. Notice Period Field Row */}
                      {job.notice_period_name && (
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span className="text-gray-500 font-medium">
                            Notice Period:
                          </span>
                          <span>{job.notice_period_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Edit Action Button */}
                    {companyStatus !== "verified" &&
                      companyStatus !== "rejected" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(job)}
                          className="text-gray-400 hover:text-gray-700 hover:bg-gray-50 shrink-0 ml-4"
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
      <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verification Breakdown</DialogTitle>
            <DialogDescription>
              Detailed status checklist breakdown for tracking your experience verification records.
            </DialogDescription>
          </DialogHeader>
          {activeJobInfo && (
            <div className="space-y-4 py-2 text-sm">
              {/* Company Record */}
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Company Record</span>
                {(() => {
                  const status = resolveFieldStatus(activeJobInfo.workedInCompany);
                  return (
                    <div className="flex items-center gap-2 capitalize">
                      {status}
                      <StatusIcon status={status} />
                    </div>
                  );
                })()}
              </div>

              {/* Designation / Role */}
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Designation / Role</span>
                {(() => {
                  const status = resolveFieldStatus(activeJobInfo.workedInCompany) === "pending"
                    ? "pending"
                    : resolveFieldStatus(activeJobInfo.designationVerified);
                  return (
                    <div className="flex items-center gap-2 capitalize">
                      {status}
                      <StatusIcon status={status} />
                    </div>
                  );
                })()}
              </div>

              {/* Job Type */}
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Job Type</span>
                {(() => {
                  const status = resolveFieldStatus(activeJobInfo.workedInCompany) === "pending"
                    ? "pending"
                    : resolveFieldStatus(activeJobInfo.jobTypeVerified);
                  return (
                    <div className="flex items-center gap-2 capitalize">
                      {status}
                      <StatusIcon status={status} />
                    </div>
                  );
                })()}
              </div>

              {/* Timeline / Duration */}
              <div className="flex items-center justify-between pb-2">
                <span className="font-medium text-gray-500">Timeline / Duration</span>
                {(() => {
                  const status = resolveFieldStatus(activeJobInfo.workedInCompany) === "pending"
                    ? "pending"
                    : resolveFieldStatus(activeJobInfo.jobDurationVerified);
                  return (
                    <div className="flex items-center gap-2 capitalize">
                      {status}
                      <StatusIcon status={status} />
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setInfoDialogOpen(false)}>
              Close View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmploymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployment(null);
        }}
        onRefresh={fetchEmployments}
        jobId={selectedEmployment?._id || ""}
        editData={selectedEmployment}
      />
    </>
  );
};

export default EmploymentCard;