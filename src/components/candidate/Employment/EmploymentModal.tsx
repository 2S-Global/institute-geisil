
import React, { useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Select from "@radix-ui/react-select";
import * as Label from "@radix-ui/react-label";
import {
  X,
  ChevronDown,
  Sparkles,
  Trash2,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import API from "../../../lib/axios";
import { useDebounce } from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const months = monthNames.map((name, index) => ({
  value: String(index + 1),
  label: name,
}));

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const EmploymentModal = ({
  isOpen,
  onClose,
  onRefresh,
  jobId = "",
  editData = null,
  profiles = [],
  setRefresh,
}) => {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  // Local states
  const [noticePeriodOptions, setNoticePeriodOptions] = useState([]);
  const [loadingNoticePeriods, setLoadingNoticePeriods] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Autocomplete dynamic company state
  const [defaultOptions, setDefaultOptions] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDropdownSelect, setIsDropdownSelect] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      currentlyWorking: true,
      employmentType: "full-time",
      companyName: "",
      jobTitle: "",
      joiningDate: null,
      leavingDate: null,
      noticePeriod: "",
      description: "",
    },
  });

  const watchCurrentlyWorking = watch("currentlyWorking");
  const watchCompanyName = watch("companyName");
  const watchJobTitle = watch("jobTitle");
  const watchJoiningDate = watch("joiningDate");
  const watchLeavingDate = watch("leavingDate");

  const debouncedCompanyName = useDebounce(watchCompanyName, 300);

  // Sorting profiles array using custom priority logic
  const sortedProfiles = useMemo(() => {
    if (!profiles || !Array.isArray(profiles)) return [];
    return [...profiles].sort((a, b) => {
      const isPresentA = !!(
        a.currentlyWorking ||
        (!a.durationTo?.year && !a.toYear)
      );
      const isPresentB = !!(
        b.currentlyWorking ||
        (!b.durationTo?.year && !b.toYear)
      );

      if (isPresentA && !isPresentB) return -1;
      if (!isPresentA && isPresentB) return 1;

      const yearA = Number(
        a.durationFrom?.year || a.year || a.joining_year || 0,
      );
      const yearB = Number(
        b.durationFrom?.year || b.year || b.joining_year || 0,
      );

      if (yearB !== yearA) {
        return yearB - yearA;
      }

      const monthIdA = Number(
        a.durationFrom?.month_id || a.month_id || a.joining_month || 0,
      );
      const monthIdB = Number(
        b.durationFrom?.month_id || b.month_id || b.joining_month || 0,
      );

      return monthIdB - monthIdA;
    });
  }, [profiles]);

  // 1. Joining Years List
  const joiningYears = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const y = currentYear - i;
      return { value: String(y), label: String(y) };
    });
  }, [currentYear]);

  // 2. Leaving Years List
  const leavingYears = useMemo(() => {
    const fromYear = watchJoiningDate ? watchJoiningDate.getFullYear() : null;
    return Array.from({ length: 50 }, (_, i) => currentYear - i)
      .filter((yr) => !fromYear || yr >= fromYear)
      .map((yr) => ({ value: String(yr), label: String(yr) }));
  }, [watchJoiningDate, currentYear]);

  // 3. Leaving Months List
  const leavingMonths = useMemo(() => {
    if (!watchJoiningDate || !watchLeavingDate) return months;

    const fromYear = watchJoiningDate.getFullYear();
    const toYear = watchLeavingDate.getFullYear();

    if (fromYear === toYear) {
      const fromMonthIndex = watchJoiningDate.getMonth();
      return months.filter((m) => parseInt(m.value, 10) - 1 >= fromMonthIndex);
    }

    return months;
  }, [watchJoiningDate, watchLeavingDate]);

  const handleJoiningYearChange = (yearStr) => {
    const selectedYear = parseInt(yearStr, 10);
    const currentMonth = watchJoiningDate ? watchJoiningDate.getMonth() : 0;
    const newJoiningDate = new Date(selectedYear, currentMonth, 1);

    setValue("joiningDate", newJoiningDate, { shouldValidate: true });

    if (watchLeavingDate) {
      const leavingYear = watchLeavingDate.getFullYear();
      if (selectedYear > leavingYear) {
        setValue("leavingDate", null, { shouldValidate: true });
      } else if (selectedYear === leavingYear) {
        const leavingMonth = watchLeavingDate.getMonth();
        if (currentMonth > leavingMonth) {
          setValue("leavingDate", null, { shouldValidate: true });
        }
      }
    }
  };

  const handleJoiningMonthChange = (monthStr) => {
    const selectedMonthIndex = parseInt(monthStr, 10) - 1;
    const currentYearVal = watchJoiningDate
      ? watchJoiningDate.getFullYear()
      : currentYear;
    const newJoiningDate = new Date(currentYearVal, selectedMonthIndex, 1);

    setValue("joiningDate", newJoiningDate, { shouldValidate: true });

    if (watchLeavingDate) {
      const leavingYear = watchLeavingDate.getFullYear();
      const leavingMonth = watchLeavingDate.getMonth();

      if (currentYearVal === leavingYear && selectedMonthIndex > leavingMonth) {
        setValue("leavingDate", null, { shouldValidate: true });
      }
    }
  };

  // Fetch Notice Period Options on Modal Open
  useEffect(() => {
    const fetchNoticePeriods = async () => {
      setLoadingNoticePeriods(true);
      try {
        const response = await API.get(
          "https://api.geisil.com/api/candidate/employment/get_notice_period",
        );
        if (response.data?.success) {
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

  // Populate / Reset Form Values
  useEffect(() => {
    if (isOpen && editData && jobId) {
      const joinDate =
        editData.joining_year && editData.joining_month
          ? new Date(
              parseInt(editData.joining_year, 10),
              parseInt(editData.joining_month, 10) - 1,
              1,
            )
          : null;

      const leaveDate =
        editData.leaving_year && editData.leaving_month
          ? new Date(
              parseInt(editData.leaving_year, 10),
              parseInt(editData.leaving_month, 10) - 1,
              1,
            )
          : null;

      setIsDropdownSelect(true);
      reset({
        currentlyWorking: editData.currentlyWorking ?? true,
        employmentType: editData.employmenttype || "full-time",
        companyName: editData.company_name || "",
        jobTitle: editData.job_title || "",
        joiningDate: joinDate,
        leavingDate: leaveDate,
        noticePeriod: editData.notice_period || "",
        description: editData.description || "",
      });
    } else if (isOpen && !jobId) {
      setIsDropdownSelect(false);
      reset({
        currentlyWorking: true,
        employmentType: "full-time",
        companyName: "",
        jobTitle: "",
        joiningDate: null,
        leavingDate: null,
        noticePeriod: "",
        description: "",
      });
    }
  }, [isOpen, editData, jobId, reset]);

  // Dynamic Company Matching
  useEffect(() => {
    const fetchMatchingCompanies = async () => {
      if (isDropdownSelect || !debouncedCompanyName?.trim()) {
        setDefaultOptions([]);
        return;
      }

      setLoadingCompanies(true);
      try {
        const response = await API.get(
          "/api/candidate/employment/matching_company",
          {
            params: { company_name: debouncedCompanyName },
          },
        );

        const companies = response.data?.data || [];
        setDefaultOptions(
          companies.map((name) => ({ value: name, label: name })),
        );
      } catch (error) {
        console.error("Error fetching company options:", error);
        setDefaultOptions([]);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchMatchingCompanies();
  }, [debouncedCompanyName, isDropdownSelect]);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
    }),
    [],
  );

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
  ];

  const handleAiGeneration = async () => {
    if (!watchJobTitle?.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description:
          "Please enter a Job Title first so the AI knows what to generate!",
      });
      return;
    }

    setAiLoading(true);
    try {
      const response = await API.post(
        "/api/candidate/employment/generate_description",
        {
          job_title: watchJobTitle,
          company_name: watchCompanyName || "",
        },
      );

      if (response.data?.success && response.data?.description) {
        setValue("description", response.data.description);
        toast({
          title: "AI Generation Complete",
          description: "Job description updated successfully!",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const fallbackText = `<ul><li>Managed daily operations and core responsibilities as a <strong>${watchJobTitle}</strong> at ${watchCompanyName || "the company"}.</li><li>Collaborated with cross-functional teams to identify strategic goals and optimize workflow production.</li><li>Solved complex technical problems and executed critical project deliveries under tight timelines.</li></ul>`;
      setValue("description", fallbackText);
      toast({
        title: "Template Generated",
        description:
          "We inserted a structured template to help you get started.",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const calculateExperience = (startDate, endDate, isCurrent) => {
    if (!startDate) return { yr: "", mnth: "" };

    const startYearVal = startDate.getFullYear();
    const startMonthVal = startDate.getMonth() + 1;

    let endYearVal = new Date().getFullYear();
    let endMonthVal = new Date().getMonth() + 1;

    if (!isCurrent && endDate) {
      endYearVal = endDate.getFullYear();
      endMonthVal = endDate.getMonth() + 1;
    }

    const totalMonths =
      (endYearVal - startYearVal) * 12 + (endMonthVal - startMonthVal);
    if (totalMonths >= 0) {
      return {
        yr: String(Math.floor(totalMonths / 12)),
        mnth: String(totalMonths % 12),
      };
    }
    return { yr: "", mnth: "" };
  };

  // 1. ADD EMPLOYMENT API
  const handleAddEmployment = async (payload) => {
    try {
      const response = await API.post(
        "/api/candidate/employment/add_employment",
        payload,
      );

      const backendMsg =
        response.data?.message ||
        response.data?.msg ||
        "Employment saved successfully!";

      if (
        response.data?.success ||
        response.status === 200 ||
        response.status === 201
      ) {
        toast({
          title: "Success",
          description: backendMsg,
        });
        if (onRefresh) onRefresh();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: backendMsg,
        });
        return false;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        "Failed to save employment record.";

      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: errorMsg,
      });
      return false;
    }
  };

  // 2. EDIT EMPLOYMENT API
  const handleEditEmployment = async (payload) => {
    try {
      const response = await API.put(
        "/api/candidate/employment/edit_employment",
        payload,
      );

      const backendMsg =
        response.data?.message ||
        response.data?.msg ||
        "Employment updated successfully!";

      if (response.data?.success || response.status === 200) {
        toast({
          title: "Success",
          description: backendMsg,
        });
        if (onRefresh) onRefresh();
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: backendMsg,
        });
        return false;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update employment record.";

      toast({
        variant: "destructive",
        title: "Update Failed",
        description: errorMsg,
      });
      return false;
    }
  };

  // Form Submission Handler
  const onSubmit = async (data) => {
    if (!data.companyName?.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter Company Name.",
      });
      return;
    }

    if (!data.jobTitle?.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter Job Title.",
      });
      return;
    }

    if (!data.joiningDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select Joining Date.",
      });
      return;
    }

    if (!data.currentlyWorking && !data.leavingDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select Leaving Date.",
      });
      return;
    }

    setSubmitting(true);

    const { yr, mnth } = calculateExperience(
      data.joiningDate,
      data.leavingDate,
      data.currentlyWorking,
    );

    const payload = {
      _id: jobId || "",
      company_name: data.companyName,
      currentlyWorking: data.currentlyWorking,
      description: data.description || "",
      employmenttype: data.employmentType,
      experience_month: mnth,
      experience_yr: yr,
      job_title: data.jobTitle,
      joining_month: data.joiningDate
        ? String(data.joiningDate.getMonth() + 1)
        : "",
      joining_year: data.joiningDate
        ? String(data.joiningDate.getFullYear())
        : "",
      leaving_month:
        !data.currentlyWorking && data.leavingDate
          ? String(data.leavingDate.getMonth() + 1)
          : "",
      leaving_year:
        !data.currentlyWorking && data.leavingDate
          ? String(data.leavingDate.getFullYear())
          : "",
      notice_period: data.currentlyWorking ? data.noticePeriod : "",
    };

    try {
      let isSuccess = false;
      if (jobId) {
        isSuccess = await handleEditEmployment(payload);
      } else {
        isSuccess = await handleAddEmployment(payload);
      }

      if (isSuccess) {
        onClose(); // Close modal first

        // 💡 SINGLE trigger with brief delay ensures score recalculates accurately without double-firing
        setTimeout(() => {
          if (typeof setRefresh === "function") {
            setRefresh((prev) => prev + 1);
          }
        }, 300);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 3. DELETE EMPLOYMENT API
  const handleDelete = async () => {
    try {
      const response = await API.delete(
        "/api/candidate/employment/delete_employment",
        { data: { _id: jobId } },
      );

      const backendMsg =
        response.data?.message ||
        response.data?.msg ||
        "Employment entry removed.";

      if (response.data?.success || response.status === 200) {
        toast({
          title: "Deleted",
          description: backendMsg,
        });

        if (onRefresh) onRefresh();
        onClose(); // Close modal first

        // 💡 SINGLE trigger with brief delay
        setTimeout(() => {
          if (typeof setRefresh === "function") {
            setRefresh((prev) => prev + 1);
          }
        }, 300);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: backendMsg,
        });
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.response?.data?.error ||
        error.message ||
        "Error processing delete request.";

      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: errorMsg,
      });
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        <Dialog.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-xl translate-x-[-50%] translate-y-[-50%] rounded-xl bg-white p-0 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden border border-slate-100 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50/50">
            <div className="flex m-4 items-center space-x-2.5">
              <div>
                <Dialog.Title className="text-base font-semibold text-slate-900">
                  {jobId ? "Edit Employment" : "Add Employment"}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500">
                  Share your career journey and achievements with employers.
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {jobId && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this record?",
                      )
                    ) {
                      handleDelete();
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit, (errs) =>
              console.log("Validation Errors:", errs),
            )}
            className="p-6 space-y-5 max-h-[calc(85vh-130px)] overflow-y-auto"
          >
            {/* Row 1: Current Working Status */}
            <div className="space-y-2">
              <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Is this your current employment?{" "}
                <span className="text-red-500">*</span>
              </Label.Root>
              <Controller
                name="currentlyWorking"
                control={control}
                render={({ field }) => (
                  <RadioGroup.Root
                    value={field.value ? "yes" : "no"}
                    onValueChange={(val) => {
                      const isCurrent = val === "yes";
                      field.onChange(isCurrent);
                      if (isCurrent) setValue("leavingDate", null);
                    }}
                    className="flex items-center space-x-4 pt-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="yes"
                        id="work-yes"
                        className="w-4 h-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#122B5F] focus:ring-offset-2 data-[state=checked]:border-[#122B5F] data-[state=checked]:bg-[#122B5F] flex items-center justify-center transition-all"
                      >
                        <RadioGroup.Indicator className="w-1.5 h-1.5 rounded-full bg-white" />
                      </RadioGroup.Item>
                      <Label.Root
                        htmlFor="work-yes"
                        className="text-sm font-medium text-slate-700 cursor-pointer"
                      >
                        Yes
                      </Label.Root>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroup.Item
                        value="no"
                        id="work-no"
                        className="w-4 h-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#122B5F] focus:ring-offset-2 data-[state=checked]:border-[#122B5F] data-[state=checked]:bg-[#122B5F] flex items-center justify-center transition-all"
                      >
                        <RadioGroup.Indicator className="w-1.5 h-1.5 rounded-full bg-white" />
                      </RadioGroup.Item>
                      <Label.Root
                        htmlFor="work-no"
                        className="text-sm font-medium text-slate-700 cursor-pointer"
                      >
                        No
                      </Label.Root>
                    </div>
                  </RadioGroup.Root>
                )}
              />
            </div>

            {/* Row 2: Employment Type */}
            <div className="space-y-2">
              <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Employment Type <span className="text-red-500">*</span>
              </Label.Root>
              <Controller
                name="employmentType"
                control={control}
                render={({ field }) => (
                  <RadioGroup.Root
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-4 pt-1"
                  >
                    {[
                      { id: "full-time", label: "Full Time" },
                      { id: "part-time", label: "Part Time" },
                      { id: "contract", label: "Contract" },
                      { id: "internship", label: "Internship" },
                    ].map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroup.Item
                          value={type.id}
                          id={type.id}
                          className="w-4 h-4 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#122B5F] focus:ring-offset-2 data-[state=checked]:border-[#122B5F] data-[state=checked]:bg-[#122B5F] flex items-center justify-center transition-all"
                        >
                          <RadioGroup.Indicator className="w-1.5 h-1.5 rounded-full bg-white" />
                        </RadioGroup.Item>
                        <Label.Root
                          htmlFor={type.id}
                          className="text-sm font-medium text-slate-700 cursor-pointer"
                        >
                          {type.label}
                        </Label.Root>
                      </div>
                    ))}
                  </RadioGroup.Root>
                )}
              />
            </div>

            {/* Row 3: Company Name with Autocomplete */}
            <div className="space-y-1 relative">
              <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Company Name <span className="text-red-500">*</span>
              </Label.Root>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. Google, Microsoft, Acme Corp"
                      autoComplete="off"
                      onChange={(e) => {
                        field.onChange(e);
                        setIsDropdownSelect(false);
                        setShowDropdown(e.target.value.trim() !== "");
                      }}
                      onFocus={() => {
                        if (field.value.trim() !== "") setShowDropdown(true);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                      className={cn(
                        "w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 rounded-lg px-3.5 py-2.5 pr-10 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all",
                        errors.companyName &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 space-x-1">
                      {loadingCompanies ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#122B5F]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                )}
              />
              {errors.companyName && (
                <p className="flex items-center text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  {errors.companyName.message}
                </p>
              )}

              {/* Dynamic Dropdown List */}
              {showDropdown && defaultOptions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-1 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-50 divide-y divide-slate-100 py-1">
                  {defaultOptions.map((option, index) => (
                    <li
                      key={index}
                      onMouseDown={() => {
                        setValue("companyName", option.value);
                        setIsDropdownSelect(true);
                        setShowDropdown(false);
                      }}
                      className="px-3.5 py-2.5 text-sm text-slate-700 hover:bg-[#122B5F]/5 hover:text-[#122B5F] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <span>{option.label}</span>
                      {watchCompanyName === option.value && (
                        <Check className="w-4 h-4 text-[#122B5F]" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Row 4: Job Title */}
            <div className="space-y-1">
              <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Job Title <span className="text-red-500">*</span>
              </Label.Root>
              <Controller
                name="jobTitle"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    className={cn(
                      "w-full bg-slate-50 text-sm text-slate-800 placeholder-slate-400 rounded-lg px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all",
                      errors.jobTitle &&
                        "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                    )}
                  />
                )}
              />
              {errors.jobTitle && (
                <p className="flex items-center text-xs text-red-600 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Row 5: Dates and Notice Period Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Joining Date */}
              <div className="space-y-1">
                <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Joining Date <span className="text-red-500">*</span>
                </Label.Root>
                <div className="grid grid-cols-2 gap-2">
                  <Select.Root
                    value={
                      watchJoiningDate
                        ? String(watchJoiningDate.getMonth() + 1)
                        : ""
                    }
                    onValueChange={handleJoiningMonthChange}
                  >
                    <Select.Trigger
                      className={cn(
                        "flex items-center justify-between w-full bg-slate-50 text-sm text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all h-[42px]",
                        errors.joiningDate &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        !watchJoiningDate && "text-slate-400",
                      )}
                    >
                      <Select.Value placeholder="Month" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        sideOffset={4}
                        className="bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto animate-in fade-in-80 w-[var(--radix-select-trigger-width)]"
                      >
                        <Select.Viewport className="p-1">
                          {months.map((m) => (
                            <Select.Item
                              key={m.value}
                              value={m.value}
                              className="relative flex items-center px-8 py-2 text-sm text-slate-700 rounded-md select-none hover:bg-[#122B5F]/5 hover:text-[#122B5F] focus:bg-[#122B5F]/5 focus:text-[#122B5F] focus:outline-none cursor-pointer"
                            >
                              <Select.ItemText>{m.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                                <Check className="w-4 h-4 text-[#122B5F]" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>

                  <Select.Root
                    value={
                      watchJoiningDate
                        ? String(watchJoiningDate.getFullYear())
                        : ""
                    }
                    onValueChange={handleJoiningYearChange}
                  >
                    <Select.Trigger
                      className={cn(
                        "flex items-center justify-between w-full bg-slate-50 text-sm text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all h-[42px]",
                        errors.joiningDate &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                        !watchJoiningDate && "text-slate-400",
                      )}
                    >
                      <Select.Value placeholder="Year" />
                      <Select.Icon>
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content
                        position="popper"
                        sideOffset={4}
                        className="bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto animate-in fade-in-80 w-[var(--radix-select-trigger-width)]"
                      >
                        <Select.Viewport className="p-1">
                          {joiningYears.map((y) => (
                            <Select.Item
                              key={y.value}
                              value={y.value}
                              className="relative flex items-center px-8 py-2 text-sm text-slate-700 rounded-md select-none hover:bg-[#122B5F]/5 hover:text-[#122B5F] focus:bg-[#122B5F]/5 focus:text-[#122B5F] focus:outline-none cursor-pointer"
                            >
                              <Select.ItemText>{y.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                                <Check className="w-4 h-4 text-[#122B5F]" />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              {/* Conditional Leaving Date vs Notice Period */}
              {!watchCurrentlyWorking ? (
                <div className="space-y-1">
                  <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Leaving Date <span className="text-red-500">*</span>
                  </Label.Root>
                  <div className="grid grid-cols-2 gap-2">
                    <Select.Root
                      value={
                        watchLeavingDate
                          ? String(watchLeavingDate.getMonth() + 1)
                          : ""
                      }
                      onValueChange={(monthStr) => {
                        const month = parseInt(monthStr, 10);
                        const currentYearVal = watchLeavingDate
                          ? watchLeavingDate.getFullYear()
                          : currentYear;
                        setValue(
                          "leavingDate",
                          new Date(currentYearVal, month - 1, 1),
                        );
                      }}
                    >
                      <Select.Trigger
                        className={cn(
                          "flex items-center justify-between w-full bg-slate-50 text-sm text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all h-[42px]",
                          errors.leavingDate &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                          !watchLeavingDate && "text-slate-400",
                        )}
                      >
                        <Select.Value placeholder="Month" />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={4}
                          className="bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto animate-in fade-in-80 w-[var(--radix-select-trigger-width)]"
                        >
                          <Select.Viewport className="p-1">
                            {leavingMonths.map((m) => (
                              <Select.Item
                                key={m.value}
                                value={m.value}
                                className="relative flex items-center px-8 py-2 text-sm text-slate-700 rounded-md select-none hover:bg-[#122B5F]/5 hover:text-[#122B5F] focus:bg-[#122B5F]/5 focus:text-[#122B5F] focus:outline-none cursor-pointer"
                              >
                                <Select.ItemText>{m.label}</Select.ItemText>
                                <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                                  <Check className="w-4 h-4 text-[#122B5F]" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    <Select.Root
                      value={
                        watchLeavingDate
                          ? String(watchLeavingDate.getFullYear())
                          : ""
                      }
                      onValueChange={(yearStr) => {
                        const year = parseInt(yearStr, 10);
                        const currentMonthVal = watchLeavingDate
                          ? watchLeavingDate.getMonth()
                          : 0;
                        setValue(
                          "leavingDate",
                          new Date(year, currentMonthVal, 1),
                        );
                      }}
                    >
                      <Select.Trigger
                        className={cn(
                          "flex items-center justify-between w-full bg-slate-50 text-sm text-slate-800 rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 transition-all h-[42px]",
                          errors.leavingDate &&
                            "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                          !watchLeavingDate && "text-slate-400",
                        )}
                      >
                        <Select.Value placeholder="Year" />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={4}
                          className="bg-white rounded-lg shadow-xl border border-slate-200 z-50 max-h-60 overflow-y-auto animate-in fade-in-80 w-[var(--radix-select-trigger-width)]"
                        >
                          <Select.Viewport className="p-1">
                            {leavingYears.map((y) => (
                              <Select.Item
                                key={y.value}
                                value={y.value}
                                className="relative flex items-center px-8 py-2 text-sm text-slate-700 rounded-md select-none hover:bg-[#122B5F]/5 hover:text-[#122B5F] focus:bg-[#122B5F]/5 focus:text-[#122B5F] focus:outline-none cursor-pointer"
                              >
                                <Select.ItemText>{y.label}</Select.ItemText>
                                <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                                  <Check className="w-4 h-4 text-[#122B5F]" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Notice Period <span className="text-red-500">*</span>
                  </Label.Root>
                  <Controller
                    name="noticePeriod"
                    control={control}
                    render={({ field }) => (
                      <Select.Root
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loadingNoticePeriods}
                      >
                        <Select.Trigger
                          className={cn(
                            "flex items-center justify-between w-full bg-slate-50 text-sm text-slate-800 rounded-lg px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:bg-white focus:border-[#122B5F] focus:ring-2 focus:ring-[#122B5F]/20 disabled:opacity-60 transition-all h-[42px]",
                            errors.noticePeriod &&
                              "border-red-500 focus:border-red-500 focus:ring-red-500/20",
                            !field.value && "text-slate-400",
                          )}
                        >
                          <Select.Value
                            placeholder={
                              loadingNoticePeriods
                                ? "Loading..."
                                : "Select notice period"
                            }
                          />
                          <Select.Icon>
                            {loadingNoticePeriods ? (
                              <Loader2 className="w-4 h-4 animate-spin text-[#122B5F]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                          <Select.Content className="overflow-hidden bg-white rounded-lg shadow-xl border border-slate-200 z-50 animate-in fade-in-80">
                            <Select.Viewport className="p-1">
                              {noticePeriodOptions.map((opt) => (
                                <Select.Item
                                  key={opt._id || opt.id}
                                  value={String(opt.id || opt._id)}
                                  className="relative flex items-center px-8 py-2 text-sm text-slate-700 rounded-md select-none hover:bg-[#122B5F]/5 hover:text-[#122B5F] focus:bg-[#122B5F]/5 focus:text-[#122B5F] focus:outline-none cursor-pointer"
                                >
                                  <Select.ItemText>{opt.name}</Select.ItemText>
                                  <Select.ItemIndicator className="absolute left-2.5 inline-flex items-center justify-center">
                                    <Check className="w-4 h-4 text-[#122B5F]" />
                                  </Select.ItemIndicator>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Row 6: Job Profile Rich Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label.Root className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Job Profile Description
                </Label.Root>
              </div>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div
                    className={cn(
                      "border border-slate-200 rounded-lg overflow-hidden bg-white focus-within:border-[#122B5F] focus-within:ring-2 focus-within:ring-[#122B5F]/20 transition-all",
                      errors.description && "border-red-500",
                    )}
                  >
                    <ReactQuill
                      theme="snow"
                      value={field.value}
                      onChange={field.onChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Outline your core responsibilities, key projects, and measurable achievements..."
                      className="[&_.ql-toolbar]:bg-slate-50/80 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-slate-200 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:text-sm [&_.ql-editor]:text-slate-700"
                    />
                  </div>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAiGeneration}
                className="rounded-full bg-[#EBF3FF] hover:bg-[#DCE9FF] border-none text-[#2563EB] text-xs h-8 px-4 gap-1.5 font-medium shadow-none"
              >
                <Sparkles className="h-3.5 w-3.5 fill-[#2563EB]" />
                Help me write
              </Button>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-[#122B5F] hover:bg-[#122B5F]/90 active:bg-[#122B5F] rounded-lg shadow-sm shadow-[#122B5F]/20 disabled:opacity-60 transition-all"
              >
                {submitting && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                {submitting
                  ? "Saving..."
                  : jobId
                    ? "Update "
                    : "Save "}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EmploymentModal;