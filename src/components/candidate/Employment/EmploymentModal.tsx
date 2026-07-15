
import React, { useState, useEffect } from "react";
import { X, ChevronDown, Sparkles, Trash2, Loader2 } from "lucide-react";
import API from "../../../lib/axios";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const EmploymentModal = ({
  isOpen,
  onClose,
  onRefresh,
  jobId = "",
  editData = null,
}) => {
  const { toast } = useToast();

  // Component state hooks
  const [currentlyWorking, setCurrentlyWorking] = useState(true);
  const [employmentType, setEmploymentType] = useState("full-time");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [joiningYear, setJoiningYear] = useState("");
  const [joiningMonth, setJoiningMonth] = useState("");
  const [leavingYear, setLeavingYear] = useState("");
  const [leavingMonth, setLeavingMonth] = useState("");
  const [description, setDescription] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");

  // Notice Period dynamic options state
  const [noticePeriodOptions, setNoticePeriodOptions] = useState([]);
  const [loadingNoticePeriods, setLoadingNoticePeriods] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [defaultOptions, setDefaultOptions] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownSelect, setIsDropdownSelect] = useState(false);

  // Fetch dynamic notice periods from API
  useEffect(() => {
    const fetchNoticePeriods = async () => {
      setLoadingNoticePeriods(true);
      try {
        const response = await API.get(
          "https://api.geisil.com/api/candidate/employment/get_notice_period",
        );
        if (response.data.success) {
          setNoticePeriodOptions(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching notice periods:", error);
      } finally {
        setLoadingNoticePeriods(false);
      }
    };

    if (isOpen) {
      fetchNoticePeriods();
    }
  }, [isOpen]);

  // Populate data when editing an existing record
  useEffect(() => {
    if (isOpen && editData && jobId) {
      setCurrentlyWorking(editData.currentlyWorking ?? true);
      setEmploymentType(editData.employmenttype || "full-time");
      setCompanyName(editData.company_name || "");
      setIsDropdownSelect(true);
      setJobTitle(editData.job_title || "");
      setJoiningYear(
        editData.joining_year ? String(editData.joining_year) : "",
      );
      setJoiningMonth(
        editData.joining_month ? String(editData.joining_month) : "",
      );
      setLeavingYear(
        editData.leaving_year ? String(editData.leaving_year) : "",
      );
      setLeavingMonth(
        editData.leaving_month ? String(editData.leaving_month) : "",
      );
      setDescription(editData.description || "");
      setNoticePeriod(editData.notice_period || "");
    } else if (isOpen && !jobId) {
      // Reset form fields for brand new additions
      setCurrentlyWorking(true);
      setEmploymentType("full-time");
      setCompanyName("");
      setIsDropdownSelect(false);
      setJobTitle("");
      setJoiningYear("");
      setJoiningMonth("");
      setLeavingYear("");
      setLeavingMonth("");
      setDescription("");
      setNoticePeriod("");
    }
  }, [isOpen, editData, jobId]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ script: "super" }, { script: "sub" }],
    ],
  };

  const formats = ["bold", "italic", "underline", "strike", "script"];

  const debouncedCompanyName = useDebounce(companyName, 300);

  // Handles dynamic company matching and input backspacing
  useEffect(() => {
    const fetchDefaultOptions = async () => {
      if (isDropdownSelect) {
        return;
      }
      if (!debouncedCompanyName.trim()) {
        setDefaultOptions([]);
        return;
      }

      setLoading2(true);
      try {
        const response = await API.get(
          `/api/candidate/employment/random_company?company_name=${encodeURIComponent(debouncedCompanyName)}`,
          "/api/candidate/employment/matching_company",
          {
            params: { company_name: companyName },
          }
        );
        
        const companies = response.data?.data || [];
        const options = companies.map((name) => ({
          value: name,
          label: name,
        }));
        setDefaultOptions(options);
      } catch (error) {
        console.error("Error fetching default options:", error);
        setDefaultOptions([]);
      } finally {
        setLoading2(false);
      }
    };

    fetchDefaultOptions();
  }, [debouncedCompanyName, isDropdownSelect]);

  if (!isOpen) return null;

  const handleAiGeneration = async () => {
    if (!jobTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please enter a Job Title first so the AI knows what to write about!",
      });
      return;
    }

    setAiLoading(true);
    try {
      const response = await API.post(
        "/api/candidate/employment/generate_description",
        {
          job_title: jobTitle,
          company_name: companyName || "",
        },
      );

      if (response.data.success && response.data.description) {
        setDescription(response.data.description);
        toast({
          title: "AI Generation Complete",
          description: "Job description updated successfully!",
        });
      } else {
        const fallbackText = `• Managed daily operations and core responsibilities as a ${jobTitle} at ${companyName || "the company"}.\n• Collaborated with cross-functional teams to identify goals and optimize workflow production.\n• Solved complex problems and executed project deliveries under tight timelines.`;
        setDescription(fallbackText);
      }
    } catch (error) {
      const fallbackText = `• Managed daily operations and core responsibilities as a ${jobTitle} at ${companyName || "the company"}.\n• Collaborated with cross-functional teams to identify goals and optimize workflow production.\n• Solved complex problems and executed project deliveries under tight timelines.`;
      setDescription(fallbackText);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let computedExpYr = "";
    let computedExpMnth = "";

    if (joiningYear && joiningMonth) {
      const startYear = parseInt(joiningYear, 10);
      const startMonth = parseInt(joiningMonth, 10);

      let endYear = new Date().getFullYear();
      let endMonth = new Date().getMonth() + 1;

      if (!currentlyWorking && leavingYear && leavingMonth) {
        endYear = parseInt(leavingYear, 10);
        endMonth = parseInt(leavingMonth, 10);
      }

      const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

      if (totalMonths >= 0) {
        computedExpYr = String(Math.floor(totalMonths / 12));
        computedExpMnth = String(totalMonths % 12);
      }
    }

    const payload = {
      _id: jobId || "",
      company_name: companyName,
      currentlyWorking: currentlyWorking,
      employmenttype: employmentType,
      job_title: jobTitle,
      joining_month: joiningMonth ? String(joiningMonth) : "",
      joining_year: joiningYear ? String(joiningYear) : "",
      leaving_month: currentlyWorking
        ? ""
        : leavingMonth
          ? String(leavingMonth)
          : "",
      leaving_year: currentlyWorking
        ? ""
        : leavingYear
          ? String(leavingYear)
          : "",
      description: description,
      notice_period: currentlyWorking ? noticePeriod : "",
      experience_month: computedExpMnth,
      experience_yr: computedExpYr,
    };

    try {
      const response = jobId
        ? await API.put("/api/candidate/employment/edit_employment", payload)
        : await API.post("/api/candidate/employment/add_employment", payload);

      if (response.data.success) {
        toast({
          title: "Success",
          description:
            response.data.message || "Employment updated successfully!",
        });
        if (onRefresh) onRefresh();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          error.response?.data?.message || "Failed to submit request.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(
        "/api/candidate/employment/delete_employment",
        { data: { _id: jobId } },
      );
      if (response.data.success) {
        toast({
          title: "Deleted",
          description:
            response.data.message || "Employment entry removed successfully!",
        });
        if (onRefresh) onRefresh();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message || "Failed to delete entry.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description:
          error.response?.data?.message || "Error processing delete command.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden font-sans text-gray-700 my-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-md font-bold text-gray-800">Employment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto"
        >
          <div className="flex items-start justify-between space-x-4">
            <p className="text-xs text-gray-600 leading-relaxed">
              Details like job title, company name, etc, help employers
              understand your work
            </p>
            {jobId && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete these employment details?",
                    )
                  ) {
                    handleDelete();
                  }
                }}
                className="text-red-500 hover:text-red-700 transition-colors pt-0.5"
                title="Delete Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Current Employment Radio Buttons */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Is this your current employment?{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="currentlyWorking"
                  checked={currentlyWorking === true}
                  onChange={() => setCurrentlyWorking(true)}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
                />
                <span className="ml-1.5">Yes</span>
              </label>
              <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="currentlyWorking"
                  checked={currentlyWorking === false}
                  onChange={() => setCurrentlyWorking(false)}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
                />
                <span className="ml-1.5">No</span>
              </label>
            </div>
          </div>

          {/* Employment Type Radio Buttons */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-4 pt-1">
              <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="employmentType"
                  checked={employmentType === "full-time"}
                  onChange={() => setEmploymentType("full-time")}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
                />
                <span className="ml-1.5">Full Time</span>
              </label>
              <label className="flex items-center text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="employmentType"
                  checked={employmentType === "part-time"}
                  onChange={() => setEmploymentType("part-time")}
                  className="w-3.5 h-3.5 text-blue-600 border-gray-300 focus:ring-blue-500 accent-blue-600"
                />
                <span className="ml-1.5">Part Time</span>
              </label>
            </div>
          </div>

          {/* Company Name Field with Dynamic Dropdown */}
          <div className="space-y-1 relative">
            <label className="block text-xs font-bold text-gray-800">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="Enter or create a company name"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  setIsDropdownSelect(false);
                  setShowDropdown(true);
                  const val = e.target.value;
                  setCompanyName(val);
                  setShowDropdown(val.trim() !== "");
                }}
                onFocus={() => {
                  if (companyName.trim() !== "") {
                    setShowDropdown(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className="w-full bg-[#f4f7f9] text-xs text-gray-700 placeholder-gray-400 rounded-md px-3 py-2.5 pr-10 focus:outline-none focus:bg-white border border-transparent focus:border-gray-200 transition-colors"
              />
              <div className="absolute right-3 flex items-center pointer-events-none text-gray-400 space-x-1">
                {companyName && (
                  <span className="text-gray-300 text-xs">✕</span>
                )}
                <span className="text-gray-300 text-xs">|</span>
                {loading2 ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </div>

            {showDropdown && defaultOptions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50 divide-y divide-gray-50">
                {defaultOptions.map((option, index) => (
                  <li
                    key={index}
                    onMouseDown={() => {
                      setCompanyName(option.value);
                      setIsDropdownSelect(true);
                      setShowDropdown(false);
                    }}
                    className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Job Title Field */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter your job title"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full bg-[#f4f7f9] text-xs text-gray-700 placeholder-gray-400 rounded-md px-3 py-2.5 focus:outline-none focus:bg-white border border-transparent focus:border-gray-200 transition-colors"
            />
          </div>

          {/* Joining Date Container */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-800">
              Joining Date <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative flex items-center">
                <select
                  required
                  value={joiningYear}
                  onChange={(e) => setJoiningYear(e.target.value)}
                  className="w-full bg-[#f4f7f9] text-xs text-gray-700 border border-transparent rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                >
                  <option value="">Select Year</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
                <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative flex items-center">
                <select
                  required
                  value={joiningMonth}
                  onChange={(e) => setJoiningMonth(e.target.value)}
                  className="w-full bg-[#f4f7f9] text-xs text-gray-700 border border-transparent rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
                <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Conditional Leaving Date vs Notice Period Layouts */}
          {!currentlyWorking ? (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-800">
                Leaving Date <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative flex items-center">
                  <select
                    required
                    value={leavingYear}
                    onChange={(e) => setLeavingYear(e.target.value)}
                    className="w-full bg-[#f4f7f9] text-xs text-gray-700 border border-transparent rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                  >
                    <option value="">Select Year</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative flex items-center">
                  <select
                    required
                    value={leavingMonth}
                    onChange={(e) => setLeavingMonth(e.target.value)}
                    className="w-full bg-[#f4f7f9] text-xs text-gray-700 border border-transparent rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer"
                  >
                    <option value="">Select Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                  <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-800">
                Notice Period <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <select
                  required
                  value={noticePeriod}
                  onChange={(e) => setNoticePeriod(e.target.value)}
                  className="w-full bg-[#f4f7f9] text-xs text-gray-700 border border-transparent rounded-md px-3 py-2.5 appearance-none focus:outline-none focus:bg-white focus:border-gray-200 cursor-pointer disabled:opacity-60"
                  disabled={loadingNoticePeriods}
                >
                  <option value="">
                    {loadingNoticePeriods
                      ? "Fetching options..."
                      : "Select Notice Period"}
                  </option>
                  {noticePeriodOptions.map((opt) => (
                    <option key={opt._id} value={String(opt.id)}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 flex items-center pointer-events-none text-gray-400">
                  {loadingNoticePeriods ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Job Profile Rich Editor Box layout */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              Job Profile
            </label>
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                placeholder="Type your job profile..."
                style={{ height: "140px" }}
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAiGeneration}
                disabled={aiLoading}
                className="inline-flex items-center space-x-1 px-4 py-1.5 bg-[#eaf3ff] hover:bg-[#dbeaff] text-[#1a73e8] rounded-full text-xs font-semibold transition-colors disabled:opacity-60"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-[#1a73e8]" />
                )}
                <span>{aiLoading ? "Generating..." : "Help me write"}</span>
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              )}
              {submitting ? "Saving..." : jobId ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EmploymentModal;