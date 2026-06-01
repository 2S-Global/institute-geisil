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
export default function ReviewJobs() {
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
      setLoading(true); // start loader
      try {
        const response = await api.get(
          `/api/jobposting/get_job_posting_details`,
          {
            params: {
              jobId: jobId,
              status: "draft",
            },
          },
        );

        if (response.data.success && response.status === 200) {
          setData(response.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchData();
  }, []);

  // Add this function inside your component
  const handleConfirm = async () => {
    setConfirmLoading(true);
    try {
      console.log(
        "Handle Confirm is running successfully and token from review-jobs !",
        jobId
      );
      const response = await api.post(
        `/api/jobposting/confirm_job_posting_details?jobId=${jobId}`,
        {
          params: {
            jobId: jobId,
          },
        },
      );

      if (response.data.success) {
        // Redirect to another page on success
        setSuccess("Job post Created successfully!");
         toast({
                    title: "Success",
                    description: "Job post Created successfully!",
                  });
        setTimeout(() => {
          router("/employer/jobs"); // Replace with your target page
        }, 2000);
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setConfirmLoading(false); // stop loader
    }
  };

  return (
    <EmployerLayout>
      <PageHeader title="" description="" actions={""} />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <>
            {/* <MessageComponent success={success} errorId={errorId} /> */}

            {loading ? (
              "loading...."
            ) : (
              <div className="max-w-[700px] mx-auto my-[60px] px-[30px] py-[40px] bg-white border border-[#e0e0e0] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] font-['Poppins']">
                <h1 className="text-[2.5em] font-bold mb-10 text-[#222]">
                  Review
                </h1>

                <div className="bg-[#f9f9f9] p-6 rounded-[10px] mb-10">
                  <h2 className="text-[1.4em] font-semibold mb-5 text-[#363636] underline">
                    Job Details
                  </h2>

                  {data?.jobTitle && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">
                        Job title
                      </div>

                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        {data?.jobTitle || "N/A"}

                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=jobTitleBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.jobDescription && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">
                        Job description
                      </div>

                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: data.jobDescription,
                          }}
                        />

                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=jobDescriptionBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.companyName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">
                        Company for this job
                      </div>

                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        {data.companyName}

                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=jobDescription`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Gender Block */}
                  {data?.gender && data.gender.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-1/3 min-w-[210px] font-medium text-gray-700 font-semibold">
                        Gender
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>
                          {data.gender.map((item) => item.name).join(", ")}
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=genderBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Specilization Blocks */}
                  {data?.specialization && data.specialization.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Specialization
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>{data.specialization.join(", ")}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=specializationBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Job Skills Block */}
                  {data?.jobSkills && data.jobSkills.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Skills
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>{data.jobSkills.join(", ")}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=skillBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Number of openings */}
                  {data?.positionAvailable && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Number of openings
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>{data.positionAvailable}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=numberOfPositionAvaiable`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Job Type */}
                  {data?.jobType && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Job Type
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>
                          {data.jobType.map((item) => item.label).join(", ")}
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=jobType`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Expected hours */}
                  {data?.expectedHours !== "" &&
                    data?.expectedHours !== undefined && (
                      <div className="flex flex-col md:flex-row md:items-center mb-5">
                        <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                          Expected hours per week
                        </div>

                        <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                          <span>{data.expectedHours}</span>

                          <span
                            className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                            onClick={async () => {
                              setLoading(true);
                              router(
                                `/employer/edit-jobs/${jobId}?type=expectedHoursBlock`,
                              );
                            }}
                          >
                            {loading ? "loading...." : "✎"}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Contract length */}
                  {data?.contractLength && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-1/3 font-medium text-gray-700 font-semibold">
                        Contract length
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>
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
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Salary */}
                  {data?.salary && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Pay
                      </div>

                      <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between text-gray-900">
                        <span>
                          {(() => {
                            const {
                              structure,
                              currency,
                              min,
                              max,
                              amount,
                              rate,
                            } = data.salary;

                            switch (structure) {
                              case "range":
                                if (
                                  currency &&
                                  min != null &&
                                  max != null &&
                                  rate
                                ) {
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
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=salaryBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {formattedExpiryDate && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Job Expiry Date
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{formattedExpiryDate}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=jobExpiryDateBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.benefits && data.benefits.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Benefits
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>
                          {data.benefits.map((item) => item.name).join(", ")}
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=benefitsBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Career Level block */}
                  {data?.careerLevel && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Career Level
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.careerLevel.name}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=careerLevelBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Experience Level block */}
                  {data?.experienceLevel && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Experience Level
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.experienceLevel.name}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=experienceLevelBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Industry Level block */}
                  {data?.industryName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Industry
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.industryName}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=industryBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Qualification Block */}
                  {data?.qualification && data.qualification.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Qualification
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>
                          {data.qualification
                            .map((item) => item.name)
                            .join(", ")}
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=qualificationBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.countryName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Country
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>
                          {typeof data.country === "object"
                            ? data.countryName
                            : data.countryName}
                        </span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=countryBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.stateName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        State
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.stateName}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={() =>
                            router(
                              `/employer/edit-jobs/${jobId}?type=stateBlock`,
                            )
                          }
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.cityName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        City
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.cityName}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=cityBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.branch?.name && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Branch
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.branch.name}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=branchBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {data?.address && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="w-full md:w-1/3 font-medium text-gray-700 min-w-[210px] font-semibold">
                        Complete Address
                      </div>

                      <div className="w-1/3 font-medium text-gray-700">
                        <span>{data.address}</span>

                        <span
                          className="ml-3 cursor-pointer text-lg text-blue-600 hover:text-blue-800"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=completeAddressBlock`,
                            );
                          }}
                        >
                          {loading ? "loading...." : "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Continue same conversion pattern for all detail rows */}
                </div>

                <hr className="border-t-2 border-dashed border-[#c1c1c1] my-10" />

                <div className="bg-[#f9f9f9] p-6 rounded-[10px] mb-10">
                  <h2 className="text-[1.4em] font-semibold mb-5 text-[#363636] underline font-semibold">
                    Settings
                  </h2>

                  {data?.getApplicationUpdateEmail && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold">Application method</div>
                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        Email
                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=mailBlock`,
                            );
                          }}
                        >
                          {/* &#9998; */}
                          {loading ? "loading....": "✎"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row md:items-center mb-5">
                    <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">
                      Require resume
                    </div>

                    <div className="flex items-center gap-[10px] text-base text-[#525252]">
                      {data?.resumeRequired ? "Yes" : "No"}

                      <span
                        className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                        onClick={async () => {
                          setLoading(true);
                          router(
                            `/employer/edit-jobs/${jobId}?type=requireRemumeBlock`,
                          );
                        }}
                      >
                        {loading ? "loading...." : "✎"}
                      </span>
                    </div>
                  </div>

                  {data?.getApplicationUpdateEmail && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold">Application updates</div>
                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        {data.getApplicationUpdateEmail}
                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}?type=mailBlock`,
                            );
                          }}
                        >
                          {/* &#9998; */}
                          {loading ? "loading....": "✎"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-t-2 border-dashed border-[#c1c1c1] my-10" />

                <div className="bg-[#f9f9f9] p-6 rounded-[10px] mb-10">
                  <h2 className="text-[1.4em] font-semibold mb-5 text-[#363636] underline font-semibold">
                    Account
                  </h2>

                  {data?.phoneNumber && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">
                        Phone number
                      </div>

                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        {data.phoneNumber}
                      </div>
                    </div>
                  )}

                  {data?.companyName && (
                    <div className="flex flex-col md:flex-row md:items-center mb-5">
                      <div className="min-w-[210px] text-base text-[#222] font-medium font-semibold ">Your company name</div>
                      <div className="flex items-center gap-[10px] text-base text-[#525252]">
                        {data.companyName}
                        <span
                          className="ml-4 text-[#176be6] cursor-pointer text-[1.1em] hover:text-[#004bb5]"
                          onClick={async () => {
                            setLoading(true);
                            router(
                              `/employer/edit-jobs/${jobId}`,
                            );
                          }}
                        >
                          {/* &#9998; */}
                          {/* {loading ? "loading....": "✎"} */}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-4">
                  <button
                    className="font-['Poppins'] text-[15px] font-medium px-6 py-[10px] rounded-full border border-[#ccc] bg-white text-[#176be6] transition-all duration-200 hover:bg-[#f2f7ff]"
                    onClick={() =>
                      router(`/employer/edit-jobs/${jobId}`)
                    }
                    disabled={confirmLoading}
                  >
                    ← Back
                  </button>

                  <div className="flex gap-3">
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

            {/* <CopyrightFooter /> */}
          </>
        </div>
      </Card>
    </EmployerLayout>
  );
}
