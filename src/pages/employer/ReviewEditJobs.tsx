import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MapPin, Users, Clock } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import AsyncCreatableSelect from "react-select/async-creatable";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "react-select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { validateDocuments } from "@/components/employer/postJob/validatePostJobDocuments";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const styles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  draft: "bg-warning/10 text-warning border-warning/20",
};
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: "7px",
    borderRadius: "10px",
  }),
  /*  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#1e1e1e",
    borderColor: state.isFocused ? "#00bcd4" : "#444",
    color: "white",
    padding: "10px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#00bcd4",
    },
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "#2a2a2a",
    color: "white",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#00bcd4"
      : state.isFocused
      ? "#444"
      : "#2a2a2a",
    color: "white",
    cursor: "pointer",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "white",
  }), */
};
export default function ReviewEditJobs() {
  const { toast } = useToast();
  const router = useNavigate();
  const params = useParams(); // for dynamic route parts like [jobId]
  const jobId = params.id;

  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(0);
  const [errorField, setErrorField] = useState(0);
  const formattedExpiryDate = data?.jobExpiryDate
    ? new Date(data.jobExpiryDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      try {
        const response = await api.get(
          `/api/jobposting/get_temp_job_posting_details`,
          {
            params: {
              tempId: jobId,
            },
          },
        );

        if (response.data.success && response.status === 200) {
          setData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add this function inside your component
  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      // console.log("Handle Confirm is running successfully and token from review-jobs !", token)
      const response = await api.post(
        `/api/jobposting/confirm_live_job_posting_details`,
        {},
        {
          params: {
            tempId: jobId,
          },
        },
      );

      if (response.data.success) {
        // Redirect to another page on success
        setSuccess("Job post updated successfully!");
         toast({
                    title: "Success",
                    description: "Job post updated successfully!",
                  });
        setTimeout(() => {
          router("/employer/jobs");
        }, 2000);
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setConfirmLoading(false);
    }
  };
  return (
    <EmployerLayout>
      <PageHeader title="" description="" actions={""} />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
       <>
      {pageLoading ? (
        "loading...."
      ) : (
        <div className="max-w-[700px] mx-auto my-6 md:my-[60px] px-4 sm:px-6 md:px-[30px] py-6 md:py-[40px] bg-white border border-[#e0e0e0] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] font-['Poppins']">
          <h1 className="text-3xl md:text-[2.5em] font-bold mb-8 md:mb-10 text-[#222]">Review</h1>

          <div className="bg-[#f9f9f9] p-4 md:p-6 rounded-[10px] mb-8 md:mb-10">
            <h2 className="text-xl md:text-[1.4em] font-semibold mb-5 text-[#363636] underline">Job Details</h2>

            {data?.jobTitle && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Job title</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data?.jobTitle || "N/A"}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=jobTitleBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.jobDescription && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Job description</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {/* {data.jobDescription} */}
                  <div
                   className="w-full break-words overflow-hidden"
  dangerouslySetInnerHTML={{ __html: data.jobDescription }}
                  />
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=jobDescriptionBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.companyName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Company for this job</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.companyName}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=jobDescription&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {/* {loading ? "loading...." : "✎"} */}
                  </span>
                </div>
              </div>
            )}

            {/* Gender Block */}

            {data?.gender && data.gender.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Gender</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.gender.map((item) => item.name).join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=genderBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Specilization Blocks */}
            {data?.specialization && data.specialization.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Specialization</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.specialization.join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=specializationBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Job Skills Block */}
            {data?.jobSkills && data.jobSkills.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Skills</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.jobSkills.join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=skillBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.positionAvailable && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Number of openings</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.positionAvailable}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=numberOfPositionAvaiable&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.jobType && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Job Type</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.jobType.map((item) => item.label).join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=jobType&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.expectedHours !== "" &&
              data?.expectedHours !== undefined && (
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                  <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Expected hours per week</div>
                  <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                    {data.expectedHours}
                    <span
                      className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                      onClick={async () => {
                        router(
                          `/employer/edit-jobs/${jobId}?type=expectedHoursBlock&flag=review`,
                        );
                      }}
                    >
                      {pageLoading ? "loading...." : "✎"}
                    </span>
                  </div>
                </div>
              )}

            {data?.contractLength && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Contract length</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.contractLength}{" "}
                  {data.contractPeriod === "month"
                    ? data.contractLength > 1
                      ? "months"
                      : "month"
                    : data.contractPeriod === "week"
                      ? data.contractLength > 1
                        ? "weeks"
                        : "week"
                      : data.contractPeriod === "day"
                        ? data.contractLength > 1
                          ? "days"
                          : "day"
                        : ""}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=contractLengthBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.salary && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Pay</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {(() => {
                    const { structure, currency, min, max, amount, rate } =
                      data.salary;

                    switch (structure) {
                      case "range":
                        if (currency && min != null && max != null && rate) {
                          return (
                            <>
                              {currency}
                              {min.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              - {currency}
                              {max.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              {rate}
                            </>
                          );
                        }
                        return <span>Incomplete salary data</span>;

                      case "starting amount":
                        if (currency && amount != null && rate) {
                          return (
                            <>
                              From {currency}
                              {amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              {rate}
                            </>
                          );
                        }
                        return <span>Incomplete salary data</span>;

                      case "maximum amount":
                        if (currency && amount != null && rate) {
                          return (
                            <>
                              Up to {currency}
                              {amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              {rate}
                            </>
                          );
                        }
                        return <span>Incomplete salary data</span>;

                      case "exact amount":
                        if (currency && amount != null && rate) {
                          return (
                            <>
                              {currency}
                              {amount.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}{" "}
                              {rate}
                            </>
                          );
                        }
                        return <span>Incomplete salary data</span>;

                      default:
                        return <span>Salary data not available</span>;
                    }
                  })()}

                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=salaryBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {formattedExpiryDate && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Job Expiry Date</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {formattedExpiryDate}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=jobExpiryDateBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.benefits && data.benefits.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Benefits</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.benefits.map((item) => item.name).join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=benefitsBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Career Level block */}

            {data?.careerLevel && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Career Level</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.careerLevel.name}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=careerLevelBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Experience Level block */}
            {data?.experienceLevel && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Experience Level</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.experienceLevel.name}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=experienceLevelBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Industry Level block */}

            {data?.industryName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Industry</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.industryName}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=industryBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {/* Qualification Block */}

            {data?.qualification && data.qualification.length > 0 && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Qualification</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.qualification.map((item) => item.name).join(", ")}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=qualificationBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.countryName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Country</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {typeof data.country === "object"
                    ? data.countryName
                    : data.countryName}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=countryBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.stateName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">State</div>

                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.stateName}

                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={() =>
                      router(
                        `/employer/edit-jobs/${jobId}?type=stateBlock&flag=review`,
                      )
                    }
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.cityName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">City</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.cityName}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=cityBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.branch?.name && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Branch</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.branch.name}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=branchBlock&flag=review`,
                      );
                    }}
                  >
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            {data?.address && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Complete Address</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.address}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=completeAddressBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t-2 border-dashed border-[#c1c1c1] my-10" />

          <div className="bg-[#f9f9f9] p-4 md:p-6 rounded-[10px] mb-8 md:mb-10">
            <h2 className="text-xl md:text-[1.4em] font-semibold mb-5 text-[#363636] underline">Settings</h2>

            {data?.getApplicationUpdateEmail && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Application method</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  Email
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=mailBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
              <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Require resume</div>
              <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                {data?.resumeRequired ? "Yes" : "No"}
                <span
                  className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                  onClick={async () => {
                    router(
                      `/employer/edit-jobs/${jobId}?type=requireRemumeBlock&flag=review`,
                    );
                  }}
                >
                  {/* &#9998; */}
                  {pageLoading ? "loading...." : "✎"}
                </span>
              </div>
            </div>

            {data?.getApplicationUpdateEmail && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Application updates</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.getApplicationUpdateEmail}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}?type=mailBlock&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {pageLoading ? "loading...." : "✎"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <hr className="border-t-2 border-dashed border-[#c1c1c1] my-10" />

          <div className="bg-[#f9f9f9] p-4 md:p-6 rounded-[10px] mb-8 md:mb-10">
            <h2 className="text-xl md:text-[1.4em] font-semibold mb-5 text-[#363636] underline">Account</h2>

            {/* <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                        <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Contact</div>
                        <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                            Chandra Sarkar
                            <FaEdit className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0" />
                        </div>
                    </div> */}

            {data?.phoneNumber && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Phone number</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.phoneNumber}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {/* {loading ? "loading...." : "✎"} */}
                  </span>
                </div>
              </div>
            )}

            {data?.companyName && (
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-5">
                <div className="w-full md:min-w-[210px] md:w-[210px] text-sm md:text-base text-[#222] font-semibold ">Your company name</div>
                <div className="flex flex-wrap items-start gap-2 text-sm md:text-base text-[#525252] break-words w-full">
                  {data.companyName}
                  <span
                    className="text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5] shrink-0"
                    onClick={async () => {
                      router(
                        `/employer/edit-jobs/${jobId}&flag=review`,
                      );
                    }}
                  >
                    {/* &#9998; */}
                    {/* {loading ? "loading...." : "✎"} */}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-10">
            <button
              className="font-['Poppins'] text-[15px] font-medium px-6 py-[10px] rounded-full border border-[#ccc] bg-white text-[#176be6] transition-all duration-200 hover:bg-[#f2f7ff]"
              onClick={() =>
                router(
                  `/employer/review-edit-jobs/${jobId}?flag=review`,
                )
              }
              disabled={confirmLoading}
            >
              ← Back
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* <button className="btn preview-btn">Preview</button> */}
              <button
                className="font-['Poppins'] text-[15px] font-medium px-6 py-[10px] rounded-full border border-transparent bg-[#176be6] text-white transition-all duration-200 hover:bg-[#0f4fb3]"
                onClick={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      

  
       
       </>
        </div>
      </Card>
    </EmployerLayout>
  );
}
