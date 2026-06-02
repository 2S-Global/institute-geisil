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
import { useParams, useSearchParams } from "react-router-dom";
import { validateDocuments } from "@/components/employer/postJob/validatePostJobDocuments";
import { useNavigate } from "react-router-dom";
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
export default function PostNewJob() {
  const { toast } = useToast();
  const router = useNavigate();
  const params = useParams(); // for dynamic route parts like [jobId]
  const [searchParams] = useSearchParams(); // for query params like ?type=jobTitle
  const id = params.jobId; // from route /edit/[jobId]
  const type = searchParams?.get("type"); // from query string ?type=jobTitle

  const [showBy, setShowBy] = useState(""); // Track dropdown selection
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [jobLocationType, setJobLocationType] = useState(""); // Remote or On-site
  const [advertiseCity, setAdvertiseCity] = useState("No"); // Yes or No
  const [salaryStructure, setSalaryStructure] = useState("");

  const [pageLoading, setPageLoading] = useState(false);
  const [jobTitleLoading, setJobTitleLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openExpiryPicker, setOpenExpiryPicker] = useState(false);

  const jobTitleRef = useRef();
  const jobDescriptionRef = useRef();
  const specializationRef = useRef(null);
  const jobSkillsRef = useRef(null);
  const getApplicationUpdateEmailRef = useRef();
  const positionAvailableRef = useRef();
  const jobTypeRef = useRef();

  const showByRef = useRef(null);
  const expectedHoursRef = useRef(null);
  const fromHoursRef = useRef(null);
  const toHoursRef = useRef(null);
  const contractLengthRef = useRef();
  const contractPeriodRef = useRef();
  const jobExpiryDateRef = useRef();
  const salaryStructureRef = useRef();
  const careerLevelRef = useRef();
  const industryRef = useRef();
  const qualificationRef = useRef();
  const jobLocationTypeRef = useRef();
  const advertiseCityRef = useRef();
  const advertiseCityNameRef = useRef();
  const countryRef = useRef();
  const cityRef = useRef();
  const branchRef = useRef();
  const addressRef = useRef();
  const experienceLevelRef = useRef();
  const stateRef = useRef();

  const refs = {
    jobTitle: jobTitleRef,
    jobDescription: jobDescriptionRef,
    specialization: specializationRef, // ⭐ ADD THIS
    jobSkills: jobSkillsRef,

    getApplicationUpdateEmail: getApplicationUpdateEmailRef,
    positionAvailable: positionAvailableRef,
    jobType: jobTypeRef,
    showBy: showByRef,
    expectedHours: expectedHoursRef,
    fromHours: fromHoursRef,
    toHours: toHoursRef,
    contractLength: contractLengthRef, // ⭐ NEW
    contractPeriod: contractPeriodRef, // ⭐ NEW
    jobExpiryDate: jobExpiryDateRef,
    jobLocationType: jobLocationTypeRef,
    salaryStructure: salaryStructureRef,
    careerLevel: careerLevelRef,
    experienceLevel: experienceLevelRef,
    industry: industryRef,
    qualification: qualificationRef,
    advertiseCity: advertiseCityRef,
    advertiseCityName: advertiseCityNameRef,
    country: countryRef,
    state: stateRef,
    city: cityRef,
    branch: branchRef,
    address: addressRef,
    state: stateRef,
  };

  //main
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token");
  }

  // API list
  const [jobTitleOptions, setJobTitleOptions] = useState([]);

  const [specialization, setSpecialization] = useState([]);
  const [jobType, setJobType] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [careerLevel, setCareerLevel] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState([]);
  const [gender, setGender] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [qualification, setQualification] = useState([]);
  const [country, setCountry] = useState([]);
  const [state, setState] = useState([]);

  const [city, setCity] = useState([]);
  const [branch, setBranch] = useState([]);
  const [jobSkills, setJobSkills] = useState([]);
  const [inputValue, setInputValue] = useState(""); // ⭐ controls typing

  // Error Variables
  const [error, setError] = useState({});

  const [success, setSuccess] = useState(null);
  const [errorId, setErrorId] = useState(0);
  const [errorField, setErrorField] = useState(0);

  // Initilize form data
  const [formData, setFormData] = useState({
    jobTitleId: "", // ADD THIS
    jobTitleName: "", // ADD THIS
    jobTitle: "", // you can keep this for backward compatibility

    jobDescription: "",
    getApplicationUpdateEmail: "",
    specialization: [],
    jobType: [],
    showBy: "",
    expectedHours: "",
    fromHours: "",
    toHours: "",
    contractLength: "",
    contractPeriod: "",
    positionAvailable: "",
    jobExpiryDate: null,
    salary: {
      structure: "range",
      currency: "₹",
      min: null,
      max: null,
      amount: null,
      rate: "per year",
    },
    benefits: [],
    careerLevel: "",
    experienceLevel: "",
    gender: [],
    industry: "",
    qualification: [],
    jobLocationType: "",
    country: "",
    city: "",
    branch: "",
    address: "",
    advertiseCity: "",
    advertiseCityName: "",
    resumeRequired: false,
    jobSkills: [],
  });

  useEffect(() => {
    if (!type) return;

    const timeout = setTimeout(() => {
      const element = document.getElementById(type);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        if (type !== "all") {
          element.classList.add("highlight");
          setTimeout(() => {
            element.classList.remove("highlight");
          }, 3000);
        }
      }
    }, 200); // small delay (200ms)

    return () => clearTimeout(timeout);
  }, [type, formData.jobLocationType]);

  useEffect(() => {
    // ✅ CREATE MODE → no loading screen
    if (!id) {
      setPageLoading(false);
      return;
    }

    // ✅ EDIT MODE
    const fetchData = async () => {
      setPageLoading(true);

      try {
        const response = await api.get(
          `/api/jobposting/get_job_posting_details`,
          {
            params: {
              jobId: id,
            },
          },
        );

        if (response.data.success) {
          const job = response.data.data;

          setInputValue(job.jobTitle || "");

          setFormData({
            jobTitleId: job.jobTitle || "",
            jobTitleName: job.jobTitle || "",
            jobTitle: job.jobTitle || "",
            jobDescription: job.jobDescription || "",
            getApplicationUpdateEmail: job.getApplicationUpdateEmail || "",
            specialization: Array.isArray(job.specialization)
              ? job.specialization
              : [],
            jobType: job.jobType?.map((t) => t._id) || [],
            showBy: job.showBy || "fixed",
            expectedHours: job.expectedHours || "",
            fromHours: job.fromHours || "",
            toHours: job.toHours || "",
            contractLength: job.contractLength || "",
            contractPeriod: job.contractPeriod || "",
            positionAvailable: job.positionAvailable || "",
            jobExpiryDate: job.jobExpiryDate
              ? new Date(job.jobExpiryDate).toISOString().split("T")[0]
              : null,
            salary: {
              structure: job.salary?.structure || "range",
              currency: job.salary?.currency || "₹",
              min: job.salary?.min || null,
              max: job.salary?.max || null,
              amount: job.salary?.amount || null,
              rate: job.salary?.rate || "per year",
            },
            benefits: job.benefits?.map((b) => b._id) || [],
            careerLevel: job.careerLevel?._id || "",
            experienceLevel: job.experienceLevel?._id || "",
            gender: job.gender?.map((g) => g._id) || [],
            industry: job.industry || "",
            qualification: job.qualification?.map((q) => q._id) || [],
            jobLocationType: job.jobLocationType || "",
            country: job.country ? String(job.country) : "",
            state: job.state ? String(job.state) : "",
            city: job.city ? String(job.city) : "",
            branch: job.branch?._id || "",
            address: job.address || "",
            advertiseCity: job.advertiseCity || "",
            advertiseCityName: job.advertiseCityName || "",
            resumeRequired: job.resumeRequired || false,
            jobSkills: Array.isArray(job.jobSkills)
              ? job.jobSkills.map((s) => ({ value: s, label: s }))
              : [],
          });
        }
      } catch (err) {
        console.error("Edit fetch failed", err);
      } finally {
        setPageLoading(false); // ✅ ONLY here
      }
    };

    fetchData();
  }, [id]);

  const fetchStates = async () => {
    try {
      const res = await api.get(`/api/sql/dropdown/All_states`);

      if (res.data.success) {
        setState(res.data.data);
      } else {
        setState([]);
      }
    } catch (error) {
      console.error("State fetch error", error);
      setState([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, jobExpiryDate: date });
    }
  };

  // For Job Skills

  // ✅ 1. Fetch random skills on mount
  useEffect(() => {
    const fetchRandomSkills = async () => {
      try {
        setJobTitleLoading(true);
        const res = await api.get(`${apiurl}/api/sql/dropdown/Random_Skill`);
        const data = res.data.data || [];

        console.log("Here is my all random skills::::'''''", data);
        setJobSkills(
          Array.from(
            new Set(data.filter(Boolean).map((s) => s.trim().toLowerCase())),
          ).map((skill) => ({
            label: skill?.charAt(0).toUpperCase() + skill?.slice(1),
            value: skill,
          })),
        );
      } catch (err) {
        console.error("Error fetching random skills:", err);
      } finally {
        setJobTitleLoading(false); // ✅ correct
      }
    };
    fetchRandomSkills();
  }, [apiurl]);

  const fetchSkills = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return [];

    try {
      const token = localStorage.getItem("token");

      const response = await api.get(
        `${apiurl}/api/sql/dropdown/matching_Skill?skill_name=${inputValue}`,
      );

      const fetched = response.data.data || [];

      const unique = Array.from(
        new Set(fetched.map((s) => s.trim().toLowerCase())),
      );

      const formatted = unique.map((skill) => ({
        label: skill?.charAt(0).toUpperCase() + skill?.slice(1),
        value: skill,
      }));

      return formatted;
    } catch (e) {
      console.error("Skill fetch failed", e);
      return [];
    }
  };

  const loadJobTitles = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return []; // avoid unnecessary calls

    const res = await api.get(`/api/jobposting/all_job_title`, {
      params: { q: inputValue },
    });

    return res.data.data.map((item) => ({
      value: item._id,
      label: item.title,
    }));
  };

  // 🔹 When user types
  const handleInputChange = (inputValue) => {
    fetchSkills(inputValue);
  };

  const selectedJobTypeLabels = jobType
    .filter((opt) => formData.jobType.includes(opt.value))
    .map((opt) => opt.label);

  const isPartTime = selectedJobTypeLabels.includes("Part-time");

  const isInternLike = selectedJobTypeLabels.some((label) =>
    ["Internship", "Contractual / Temporary", "Freelance"].includes(label),
  );

  const fetchSpecialization = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const response = await fetch(
        `${apiurl}/api/jobposting/all_job_specializations?query=${inputValue}`,
      );

      const data = await response.json();

      const list = data.data || [];

      return list.map((item) => ({
        label: item.name,
        value: item.name,
      }));
    } catch (error) {
      console.error("Error fetching specializations:", error);
      return [];
    }
  };

  // 🔥 AUTO LOAD STATE & CITY IN EDIT MODE
  useEffect(() => {
    if (formData.country) {
      fetchStates(formData?.country);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state]);

  useEffect(() => {
    const fetchJobType = async () => {
      // setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/jobposting/all_job_types`);
        const data = await response.json();
        setJobType(
          data.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error("Error fetching more info list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchBenefits = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_benefits`,
        );
        const data = await response.json();
        setBenefits(
          data.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error("Error fetching marriage status list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchCareerLevels = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_career_levels`,
        );
        const data = await response.json();
        console.log("Career Levels Data by mee :) :", data);
        // setCategories(data.data);
        setCareerLevel(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchExperienceLevel = async () => {
      // setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_experience_levels`,
        );
        const data = await response.json();
        setExperienceLevel(data.data);
      } catch (error) {
        console.error("Error fetching USA visa list:", error);
      } finally {
        // setLoading(false);
      }
    };

    const fetchGender = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_gender`);
        const data = await response.json();
        setGender(
          data.data.map((item) => ({
            label: item.name,
            value: item.id,
          })),
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchIndustry = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/get_industry`);
        const data = await response.json();
        setIndustry(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchQualification = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(
          `${apiurl}/api/jobposting/all_job_qualifications`,
        );
        const data = await response.json();
        setQualification(
          data.data.map((item) => ({ label: item.name, value: item._id })),
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchCountry = async () => {
      //  setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountry(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    const fetchBranches = async () => {
      //  setLoading(true);
      try {
        const response = await api.get(`/api/jobposting/all_company_branches`);
        console.log(
          "Branches Data by mee should only data :) :",
          response.data.data,
        );
        if (response.status === 200) {
          console.log("All Company Branches fetched successfully");
          setBranch(response.data.data);
        }
        // setCity(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        //  setLoading(false);
      }
    };

    // fetchSpecialization();
    fetchJobType();
    fetchBenefits();
    fetchCareerLevels();
    fetchExperienceLevel();
    fetchGender();
    fetchIndustry();
    fetchQualification();
    fetchCountry();

    fetchBranches();
    fetchStates();
  }, [apiurl]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  // Map dropdown values → label names
  const labelMap = {
    fixed: "Fixed at",
    rangeFrom: "From",
    rangeTo: "To",
    maximum: "No more than",
    minimum: "No less than",
  };

  const contractLength = [
    { value: "month(s)", label: "month(s)" },
    { value: "week(s)", label: "week(s)" },
    { value: "day(s)", label: "day(s)" },
  ];
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    // console.log("Form Data Submitted:", formData);

    if (!formData.jobTitleId?.trim()) {
      setError({ jobTitle: "Job title is required" });
      setErrorField("jobTitle");
      setErrorId(Date.now());

      const ref = refs.jobTitle;
      if (ref?.current) {
        try {
          ref.current.focus?.();
          ref.current.select?.focus?.();
        } catch (err) {
          console.warn("Focus failed for jobTitle", err);
        }
      }
      return;
    }

    if (
      !formData.jobDescription ||
      formData.jobDescription.trim() === "" ||
      formData.jobDescription === "<p><br></p>"
    ) {
      setError({ jobDescription: "Job description is required" });
      setErrorField("jobDescription");
      setErrorId(Date.now());

      const ref = refs["jobDescription"];
      if (ref && ref.current) {
        try {
          ref.current.focus();
        } catch (e) {
          console.warn("ReactQuill focus failed");
        }
      }

      return;
    }

    // 📌 EMAIL VALIDATION
    if (
      !formData.getApplicationUpdateEmail ||
      formData.getApplicationUpdateEmail.trim() === ""
    ) {
      setError({ getApplicationUpdateEmail: "Email is required" });
      setErrorField("getApplicationUpdateEmail");
      setErrorId(Date.now());

      const ref = refs["getApplicationUpdateEmail"];
      if (ref && ref.current) {
        try {
          ref.current.focus();
        } catch (err) {
          console.warn("Focus failed for email field", err);
        }
      }
      return;
    }

    // 📌 EMAIL FORMAT REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!emailRegex.test(formData.getApplicationUpdateEmail)) {
      setError({
        getApplicationUpdateEmail: "Please enter a valid email address",
      });
      setErrorField("getApplicationUpdateEmail");
      setErrorId(Date.now());

      const ref = refs["getApplicationUpdateEmail"];
      if (ref && ref.current) {
        try {
          ref.current.focus();
        } catch (err) {
          console.warn("Focus failed on invalid email", err);
        }
      }
      return;
    }

    if (formData.specialization.length === 0) {
      setError({ specialization: "Specialization is required" });
      setErrorField("specialization");
      setErrorId(Date.now());

      const ref = refs["specialization"];

      if (ref && ref.current) {
        try {
          if (ref.current.focus) ref.current.focus();
          if (ref.current.select) ref.current.select.focus(); // react-select case
        } catch (err) {
          console.warn("Focus failed for specialization", err);
        }
      }

      return;
    }

    if (!formData.jobSkills || formData.jobSkills.length === 0) {
      setError({ jobSkills: "Skills are required" }); // FIXED
      setErrorField("jobSkills");
      setErrorId(Date.now());

      const ref = refs["jobSkills"];
      if (ref && ref.current) {
        try {
          if (ref.current.focus) ref.current.focus(); // normal input
          if (ref.current.select) ref.current.select.focus(); // react-select case
        } catch (err) {
          console.warn("Focus failed for Skills", err);
        }
      }

      return;
    }

    const errorMsg = validateDocuments(formData);
    if (errorMsg) {
      const { field, message } = errorMsg;
      setError({ [field]: message });

      setErrorId(Date.now());
      setErrorField(field); // keep track of which field failed

      // 🧩 Step 2: Focus and highlight the invalid field
      const ref = refs[field];

      if (ref && ref.current) {
        try {
          // For react-select or normal inputs
          if (ref.current.focus) ref.current.focus();
          if (ref.current.select) ref.current.select.focus();
        } catch (err) {
          console.warn("Focus failed for field:", field, err);
        }

        const el =
          ref.current?.controlRef ||
          ref.current?.select?.controlRef ||
          ref.current; // fallback
      }

      return;
    }

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }

    setSubmitting(true);
    try {
      let response;
      if (id) {
        const payload = {
          ...formData,

          // ✅ REQUIRED by backend
          jobTitle: formData.jobTitleName?.trim(),

          // ✅ string[]
          jobSkills: formData.jobSkills
            .map((s) => s.value.trim())
            .filter(Boolean),

          // ✅ string[]
          specialization: formData.specialization.map((s) => s.trim()),

          // ✅ ObjectId[]
          jobType: formData.jobType,

          // ✅ ObjectId[]
          benefits: formData.benefits,
          qualification: formData.qualification,
          gender: formData.gender,

          careerLevel: formData.careerLevel || null,
          experienceLevel: formData.experienceLevel || null,
          country: formData.country || null,
          city: formData.city || null,
          branch: formData.branch || null,
        };

        response = await api.post(
          `/api/jobposting/edit_job_posting_details`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            params: {
              jobId: id,
            },
          },
        );

        if (!response.data.success) {
          setError(response.data.message);
          setErrorId(Date.now());
          return;
        }

        setSuccess("Job post updated successfully!");
      } else {
        const payload = {
          ...formData,

          // ✅ REQUIRED by backend
          jobTitle: formData.jobTitleName?.trim(),

          // ✅ string[]
          jobSkills: formData.jobSkills
            .map((s) => s.value.trim())
            .filter(Boolean),

          // ✅ string[]
          specialization: formData.specialization.map((s) => s.trim()),

          // ✅ ObjectId[]
          jobType: formData.jobType,

          // ✅ ObjectId[]
          benefits: formData.benefits,
          qualification: formData.qualification,
          gender: formData.gender,

          careerLevel: formData.careerLevel || null,
          experienceLevel: formData.experienceLevel || null,
          country: formData.country || null,
          city: formData.city || null,
          branch: formData.branch || null,
        };

        response = await api.post(
          `/api/jobposting/add_job_posting_details`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.data.success) {
          setError(response.data.message);
          setErrorId(Date.now());
          return;
        }

        setSuccess("Job posting created successfully!");
      }

      if (response.data.success) {
        console.log(
          "✅ Job posting data is saved successfully:",
          response.data.data,
        );

        // ✅ Redirect to review page with returned jobId
        const jobId = response.data.jobId; // API returns saved job object
        const status = response.data.data.status; // draft

        // router.push(`/employers-dashboard/post-jobs/review-jobs/${jobId}?status=${status}`);
        if (id) {
          // ✅ EDIT MODE → no review page, no status needed
          router(
            `/employer/review-jobs/${jobId}?status=${status}`,
          );
        } else {
          // ✅ CREATE MODE → go to review page with status
          router(
            `/employer/review-jobs/${jobId}?status=${status}`,
          );
        }
        // router.push(`/employers-dashboard/post-jobs/review-jobs`);
        // OR if you want to pass as query: /review-job?jobId=...&status=...
      } else {
        throw new Error(response.data.message || "An error occurred");
      }

      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Upload failed:", error);

      setError("Failed. Try again.");
      setErrorId(Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      if (!stateId) {
        setCity([]);
        return;
      }

      const res = await api.get(`${apiurl}/api/sql/dropdown/get_india_cities`, {
        params: { stateId }, // ✅ PASS stateId here
      });

      if (res.data.success) {
        setCity(res.data.data);
      } else {
        setCity([]);
      }
    } catch (error) {
      console.error("City fetch error", error);
      setCity([]);
    }
  };
  if (pageLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <EmployerLayout>
      <PageHeader title="Post a New Job" description="" actions={""} />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <>
            <form className="w-full" onSubmit={handleSubmit}>
              {/*  <MessageComponent success={success} errorId={errorId} /> */}

              <div className="flex flex-wrap -mx-3">
                {/* Job Title */}
                <div className="w-full px-3 mt-2 mb-4" id="jobTitleBlock">
                  <label htmlFor="jobTitleInput" className="font-semibold">
                    Job Title <span className="text-red-500">*</span>
                  </label>

                  <Autocomplete
                    freeSolo
                    disablePortal
                    loading={jobTitleLoading}
                    options={jobTitleOptions}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    inputValue={inputValue}
                    onInputChange={async (e, value, reason) => {
                      setInputValue(value);

                      setError((prev) => ({ ...prev, jobTitle: "" }));

                      setFormData((prev) => ({
                        ...prev,
                        jobTitleId: value,
                        jobTitleName: value,
                      }));

                      if (reason === "input") {
                        const result = await loadJobTitles(value);
                        setJobTitleOptions(result);
                        setJobTitleLoading(false);
                      }

                      if (value.trim() === "") {
                        setFormData((prev) => ({
                          ...prev,
                          jobTitleId: "",
                          jobTitleName: "",
                        }));

                        setError((prev) => ({
                          ...prev,
                          jobTitle: "Job title is required",
                        }));
                      }
                    }}
                    onChange={(e, selected) => {
                      if (!selected) return;

                      if (typeof selected === "object") {
                        setFormData((prev) => ({
                          ...prev,
                          jobTitleId: selected.value,
                          jobTitleName: selected.label,
                        }));
                        setInputValue(selected.label);
                      }

                      if (typeof selected === "string") {
                        setFormData((prev) => ({
                          ...prev,
                          jobTitleId: selected,
                          jobTitleName: selected,
                        }));
                        setInputValue(selected);
                      }

                      setError((prev) => ({ ...prev, jobTitle: "" }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Search or type Job Title…"
                        inputRef={jobTitleRef}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();

                            setTimeout(() => {
                              jobDescriptionRef?.current?.getEditor()?.focus();
                            }, 0);
                          }
                        }}
                        sx={{
                          "& .MuiInputBase-root": {
                            padding: "12px 10px",
                            borderRadius: "6px",
                          },
                        }}
                        InputProps={{
                          ...params?.InputProps,
                          endAdornment: (
                            <>
                              {jobTitleLoading ? (
                                <CircularProgress size={20} />
                              ) : null}

                              {params?.InputProps?.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />

                  {error?.jobTitle && (
                    <span className="block mt-1 text-sm font-medium text-red-500">
                      {error?.jobTitle}
                    </span>
                  )}
                </div>

                {/* Job Description */}
                <div className="w-full px-3 mb-6" id="jobDescriptionBlock">
                  <label htmlFor="jobDescription" className="font-semibold">
                    Job Description <span className="text-red-500">*</span>
                  </label>

                  <ReactQuill
                    id="jobDescription"
                    name="jobDescription"
                    theme="snow"
                    value={formData.jobDescription}
                    ref={jobDescriptionRef}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobDescription: content,
                      }))
                    }
                    placeholder="Write detailed job description here..."
                    className="mt-2"
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ color: [] }, { background: [] }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ align: [] }],
                        ["blockquote", "code-block"],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "color",
                      "background",
                      "script",
                      "list",
                      "indent",
                      "align",
                      "blockquote",
                      "code-block",
                      "link",
                      "image",
                      "video",
                    ]}
                  />

                  {error?.jobDescription && (
                    <div className="mt-2 text-sm font-medium text-red-500">
                      {error.jobDescription}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="w-full md:w-1/2 px-3 mb-6" id="mailBlock">
                  <label
                    htmlFor="getApplicationUpdateEmail"
                    className="font-semibold"
                  >
                    Get application updates
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    name="getApplicationUpdateEmail"
                    id="getApplicationUpdateEmail"
                    ref={getApplicationUpdateEmailRef}
                    value={formData.getApplicationUpdateEmail}
                    onChange={(e) => {
                      handleChange(e);

                      setError((prev) => ({
                        ...prev,
                        getApplicationUpdateEmail: "",
                      }));
                    }}
                    placeholder="testing@gmail.com"
                    className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errorField === "getApplicationUpdateEmail" &&
                    error?.getApplicationUpdateEmail && (
                      <p className="mt-1 text-sm font-medium text-red-500">
                        {error.getApplicationUpdateEmail}
                      </p>
                    )}
                </div>

                {/* Gender */}
                <div className="w-full md:w-1/2 px-3 mb-6" id="genderBlock">
                  <label className="block mb-2 font-semibold text-gray-700">
                    Gender
                  </label>

                  <Select
                    styles={customStyles}
                    isMulti
                    name="gender"
                    options={gender}
                    classNamePrefix="select"
                    value={gender.filter((option) =>
                      formData.gender.includes(option.value),
                    )}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        gender: selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      }))
                    }
                  />
                </div>

                {/* Example Tailwind Grid */}

                {/* Search Select */}
                <div
                  className="w-full lg:w-1/2 px-3 mb-6"
                  id="specializationBlock"
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    Specialization <span className="text-red-500">*</span>
                  </label>

                  <AsyncCreatableSelect
                    isMulti
                    cacheOptions
                    defaultOptions={false}
                    ref={specializationRef}
                    loadOptions={fetchSpecialization}
                    placeholder="Search or create specialization..."
                    classNamePrefix="select"
                    styles={customStyles}
                    noOptionsMessage={() => "Please start typing…"}
                    value={formData.specialization.map((name) => ({
                      label: name,
                      value: name,
                    }))}
                    onChange={(selectedOptions) => {
                      if (errorField === "specialization") {
                        setError({});
                        setErrorField("");
                      }

                      setFormData((prev) => ({
                        ...prev,
                        specialization: selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      }));
                    }}
                    onCreateOption={(inputValue) => {
                      if (errorField === "specialization") {
                        setError({});
                        setErrorField("");
                      }

                      setFormData((prev) => ({
                        ...prev,
                        specialization: [...prev.specialization, inputValue],
                      }));
                    }}
                  />

                  {errorField === "specialization" && error?.specialization && (
                    <p className="text-red-500 text-sm mt-1">
                      {error.specialization}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div className="w-full lg:w-1/2 px-3 mb-6" id="skillBlock">
                  <label className="block mb-2 font-medium text-gray-700">
                    Skills <span className="text-red-500">*</span>
                  </label>

                  <AsyncCreatableSelect
                    isMulti
                    cacheOptions
                    styles={customStyles}
                    defaultOptions={false}
                    loadOptions={fetchSkills}
                    placeholder="Search or create skills..."
                    classNamePrefix="select"
                    ref={jobSkillsRef}
                    noOptionsMessage={() => "Please start typing…"}
                    value={formData.jobSkills}
                    onChange={(selected) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobSkills: selected || [],
                      }))
                    }
                    onCreateOption={(inputValue) =>
                      setFormData((prev) => ({
                        ...prev,
                        jobSkills: [
                          ...prev.jobSkills,
                          { label: inputValue, value: inputValue },
                        ],
                      }))
                    }
                  />

                  {errorField === "jobSkills" && error?.jobSkills && (
                    <p className="text-red-500 text-sm font-medium mt-1">
                      {error.jobSkills}
                    </p>
                  )}
                </div>

                {/* Number of Positions */}
                <div
                  className="w-full lg:w-1/2 px-3 mb-6"
                  id="numberOfPositionAvaiable"
                >
                  <label
                    htmlFor="positionAvaiable"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    <b>Number of Positions Available</b>
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="positionAvailable"
                    id="positionAvaiable"
                    value={formData.positionAvailable}
                    ref={positionAvailableRef}
                    onChange={handleChange}
                    min={1}
                    placeholder="1"
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {errorField === "positionAvailable" &&
                    error?.positionAvailable && (
                      <p className="text-red-500 text-sm font-medium mt-1">
                        {error.positionAvailable}
                      </p>
                    )}
                </div>

                {/* Job Type */}
                <div className="w-full lg:w-1/2 px-3 mb-6" id="jobType">
                  <label className="block mb-2 font-medium text-gray-700">
                    <b>Job Type</b>
                    <span className="text-red-500">*</span>
                  </label>

                  <Select
                    isMulti
                    styles={customStyles}
                    name="jobType"
                    ref={jobTypeRef}
                    options={jobType}
                    classNamePrefix="select"
                    value={jobType.filter((opt) =>
                      formData.jobType.includes(opt.value),
                    )}
                    onChange={(selectedOptions) => {
                      const ids = selectedOptions
                        ? selectedOptions.map((opt) => opt.value)
                        : [];

                      const labels = selectedOptions
                        ? selectedOptions.map((opt) => opt.label)
                        : [];

                      const isPartTimeSelected = labels.includes("Part-time");

                      const isInternLikeSelected = labels.some((v) =>
                        [
                          "Internship",
                          "Contractual / Temporary",
                          "Freelance",
                        ].includes(v),
                      );

                      setFormData((prev) => ({
                        ...prev,
                        jobType: ids,

                        expectedHours: isPartTimeSelected
                          ? prev.expectedHours
                          : "",
                        fromHours: isPartTimeSelected ? prev.fromHours : "",
                        toHours: isPartTimeSelected ? prev.toHours : "",
                        showBy: isPartTimeSelected ? prev.showBy || "" : "",

                        contractLength: isInternLikeSelected
                          ? prev.contractLength
                          : "",
                        contractPeriod: isInternLikeSelected
                          ? prev.contractPeriod
                          : "",
                      }));
                    }}
                  />

                  {errorField === "jobType" && error?.jobType && (
                    <p className="text-red-500 text-sm font-medium mt-1">
                      {error.jobType}
                    </p>
                  )}
                </div>

                {/* Expected Hours */}
                {isPartTime && (
                  <div className="w-full px-3 mb-6" id="expectedHoursBlock">
                    <label className="block mb-4 font-medium text-gray-700">
                      Expected hours
                    </label>

                    <div className="flex flex-wrap gap-4">
                      {/* Show By */}
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm mb-2">Show by</label>

                        <select
                          ref={showByRef}
                          className={`w-full rounded-lg border px-4 py-3 bg-gray-50 ${
                            errorField === "showBy"
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          value={formData.showBy || ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              showBy: e.target.value,
                              expectedHours: "",
                              fromHours: "",
                              toHours: "",
                            }));
                          }}
                        >
                          <option value="">Select</option>
                          <option value="fixed">Fixed hours</option>
                          <option value="range">Range</option>
                          <option value="maximum">Maximum</option>
                          <option value="minimum">Minimum</option>
                        </select>

                        {errorField === "showBy" && error?.showBy && (
                          <p className="text-red-500 text-sm mt-1">
                            {error.showBy}
                          </p>
                        )}
                      </div>

                      {/* Fixed Input */}
                      {formData.showBy && formData.showBy !== "range" && (
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-sm mb-2">
                            {labelMap[formData.showBy]}
                          </label>

                          <input
                            type="number"
                            ref={expectedHoursRef}
                            name="expectedHours"
                            placeholder="Enter hours"
                            value={formData.expectedHours ?? ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                expectedHours: e.target.value,
                                fromHours: "",
                                toHours: "",
                              }))
                            }
                            className={`w-full rounded-lg border px-4 py-3 bg-gray-50 ${
                              errorField === "expectedHours"
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />

                          {errorField === "expectedHours" && (
                            <p className="text-red-500 text-sm mt-1">
                              {error.expectedHours}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Range */}
                      {formData.showBy === "range" && (
                        <>
                          <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm mb-2">From</label>

                            <input
                              type="number"
                              ref={fromHoursRef}
                              name="fromHours"
                              placeholder="e.g. 4"
                              value={formData.fromHours ?? ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  fromHours: e.target.value,
                                  expectedHours: "",
                                }))
                              }
                              className={`w-full rounded-lg border px-4 py-3 bg-gray-50 ${
                                errorField === "fromHours"
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />

                            {errorField === "fromHours" && (
                              <p className="text-red-500 text-sm mt-1">
                                {error.fromHours}
                              </p>
                            )}
                          </div>

                          <div className="flex-1 min-w-[200px]">
                            <label className="block text-sm mb-2">To</label>

                            <input
                              type="number"
                              ref={toHoursRef}
                              name="toHours"
                              placeholder="e.g. 8"
                              value={formData.toHours ?? ""}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  toHours: e.target.value,
                                  expectedHours: "",
                                }))
                              }
                              className={`w-full rounded-lg border px-4 py-3 bg-gray-50 ${
                                errorField === "toHours"
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />

                            {errorField === "toHours" && (
                              <p className="text-red-500 text-sm mt-1">
                                {error.toHours}
                              </p>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex items-end pb-3">
                        <span className="text-sm text-gray-600">
                          Hours per week
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contract Timings */}
                {isInternLike && (
                  <div className="w-full px-3 mb-6">
                    <label className="block mb-3 font-medium">
                      How long is the contract?
                    </label>

                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Contract Length */}
                      <div className="flex-1">
                        <label className="block mb-1 text-sm">Length</label>

                        <input
                          type="number"
                          name="contractLength"
                          ref={contractLengthRef}
                          placeholder=""
                          min={1}
                          value={formData.contractLength ?? ""}
                          className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                            errorField === "contractLength"
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              contractLength: e.target.value,
                            }));
                          }}
                        />

                        {/* 🔴 ERROR MESSAGE */}
                        {errorField === "contractLength" &&
                          error?.contractLength && (
                            <p className="mt-1 text-sm font-medium text-red-500">
                              {error.contractLength}
                            </p>
                          )}
                      </div>

                      {/* Contract Period */}
                      <div className="flex-1">
                        <label className="block mb-1 text-sm">Period</label>

                        <select
                          className={`w-full rounded-lg border px-4 py-3 outline-none transition ${
                            errorField === "contractPeriod"
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          name="contractPeriod"
                          ref={contractPeriodRef}
                          value={formData.contractPeriod ?? ""}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              contractPeriod: e.target.value,
                            }));
                          }}
                        >
                          <option value="" disabled>
                            Select period
                          </option>

                          <option value="month">month(s)</option>

                          <option value="week">week(s)</option>

                          <option value="day">day(s)</option>
                        </select>

                        {/* 🔴 ERROR MESSAGE */}
                        {errorField === "contractPeriod" &&
                          error?.contractPeriod && (
                            <p className="mt-1 text-sm font-medium text-red-500">
                              {error.contractPeriod}
                            </p>
                          )}
                      </div>
                    </div>
                  </div>
                )}

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <div
                    className="w-full md:w-1/2 px-3 mb-6"
                    id="jobExpiryDateBlock"
                  >
                    <label
                      htmlFor="jobExpiryDate"
                      className="block mb-2 font-semibold"
                    >
                      Post Expiry Date <span className="text-red-500">*</span>
                    </label>

                    <DatePicker
                      open={openExpiryPicker}
                      onOpen={() => setOpenExpiryPicker(true)}
                      onClose={() => setOpenExpiryPicker(false)}
                      closeOnSelect
                      value={
                        formData.jobExpiryDate
                          ? new Date(formData.jobExpiryDate)
                          : null
                      }
                      onChange={(newValue) => {
                        handleDateChange(newValue);
                        setOpenExpiryPicker(false);
                      }}
                      minDate={new Date()}
                      maxDate={
                        new Date(
                          today.getFullYear() + 1,
                          today.getMonth(),
                          today.getDate(),
                        )
                      }
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          inputRef: jobExpiryDateRef,
                          id: "jobExpiryDate",
                          placeholder: "dd/mm/yyyy",
                          error: errorField === "jobExpiryDate",
                          onClick: () => setOpenExpiryPicker(true),
                          className:
                            "w-full rounded-lg border border-gray-200 bg-[#f0f5f7] px-4 py-3 outline-none focus:border-blue-500",
                        },
                      }}
                    />

                    {errorField === "jobExpiryDate" && error?.jobExpiryDate && (
                      <p className="mt-1 text-sm font-medium text-red-500">
                        {error.jobExpiryDate}
                      </p>
                    )}
                  </div>
                </LocalizationProvider>

                <div className="w-full px-3 mb-6" id="salaryBlock">
                  <label className="block mb-2 font-semibold">
                    Salary <span className="text-red-500">*</span>
                  </label>

                  <div className="flex flex-wrap gap-4">
                    {/* Show pay by Dropdown */}
                    <div className="flex-1 min-w-[180px]">
                      <label className="block mb-1 text-sm">Show pay by</label>

                      <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        value={formData.salary.structure}
                        ref={salaryStructureRef}
                        onChange={(e) => {
                          const structure = e.target.value;

                          let newSalary = {
                            ...formData.salary,
                            structure,
                          };

                          switch (structure) {
                            case "range":
                              newSalary.min = null;
                              newSalary.max = null;
                              newSalary.amount = null;
                              break;

                            case "starting amount":
                              newSalary.min = null;
                              newSalary.max = null;
                              newSalary.amount = null;
                              break;

                            case "maximum amount":
                              newSalary.min = null;
                              newSalary.max = null;
                              newSalary.amount = null;
                              break;

                            case "exact amount":
                              newSalary.min = null;
                              newSalary.max = null;
                              newSalary.amount = null;
                              break;

                            default:
                              break;
                          }

                          setFormData({
                            ...formData,
                            salary: newSalary,
                          });
                        }}
                      >
                        <option value="range">Range</option>
                        <option value="starting amount">Starting amount</option>
                        <option value="maximum amount">Maximum amount</option>
                        <option value="exact amount">Exact amount</option>
                      </select>
                    </div>

                    {/* Currency */}
                    <div className="flex-1 min-w-[140px]">
                      <label className="block mb-1 text-sm">Currency</label>

                      <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        value={formData.salary.currency}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: {
                              ...formData.salary,
                              currency: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="₹">₹</option>
                        <option value="$">$</option>
                        <option value="€">€</option>
                        <option value="£">£</option>
                      </select>
                    </div>

                    {/* Minimum */}
                    {formData.salary.structure === "range" && (
                      <div className="flex-1 min-w-[180px]">
                        <label className="block mb-1 text-sm">Minimum</label>

                        <input
                          type="text"
                          value={formData.salary.min || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salary: {
                                ...formData.salary,
                                min: e.target.value,
                              },
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                          placeholder="400000"
                        />
                      </div>
                    )}

                    {/* Maximum / Amount */}
                    <div className="flex-1 min-w-[180px]">
                      <label className="block mb-1 text-sm">
                        {formData.salary.structure === "range"
                          ? "Maximum"
                          : "Amount"}
                      </label>

                      <input
                        type="text"
                        value={
                          formData.salary.structure === "range"
                            ? formData.salary.max || ""
                            : formData.salary.amount || ""
                        }
                        onChange={(e) => {
                          const value = e.target.value;

                          if (formData.salary.structure === "range") {
                            setFormData({
                              ...formData,
                              salary: {
                                ...formData.salary,
                                max: value,
                              },
                            });
                          } else {
                            setFormData({
                              ...formData,
                              salary: {
                                ...formData.salary,
                                amount: value,
                              },
                            });
                          }
                        }}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        placeholder={
                          formData.salary.structure === "range" ||
                          formData.salary.structure === "maximum amount"
                            ? "800000"
                            : "400000"
                        }
                      />
                    </div>

                    {/* Rate */}
                    <div className="flex-1 min-w-[180px]">
                      <label className="block mb-1 text-sm">Rate</label>

                      <select
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                        value={formData.salary.rate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salary: {
                              ...formData.salary,
                              rate: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="per hour">per hour</option>
                        <option value="per day">per day</option>
                        <option value="per week">per week</option>
                        <option value="per month">per month</option>
                        <option value="per year">per year</option>
                      </select>
                    </div>
                  </div>

                  {errorField === "salaryStructure" &&
                    error?.salaryStructure && (
                      <p className="mt-1 text-sm font-medium text-red-500">
                        {error.salaryStructure}
                      </p>
                    )}
                </div>

                {/* Benefits */}
                <div className="w-full md:w-1/2 px-3 mb-6" id="benefitsBlock">
                  <label className="block mb-2 font-semibold">Benefits</label>

                  <Select
                    styles={customStyles}
                    isMulti
                    name="benefits"
                    options={benefits}
                    classNamePrefix="select"
                    value={benefits.filter((option) =>
                      formData.benefits.includes(option.value),
                    )}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        benefits: selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      }))
                    }
                  />
                </div>

                {/* Career Level */}
                <div
                  className="w-full md:w-1/2 px-3 mb-6"
                  id="careerLevelBlock"
                >
                  <label className="block mb-2 font-semibold">
                    Career Level <span className="text-red-500">*</span>
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    value={formData.careerLevel}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        careerLevel: e.target.value,
                      }));
                    }}
                    ref={careerLevelRef}
                  >
                    <option value="">Select</option>

                    {careerLevel.map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.name}
                      </option>
                    ))}
                  </select>

                  {errorField === "careerLevel" && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {error.careerLevel}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div
                  className="w-full md:w-1/2 px-3 mb-6"
                  id="experienceLevelBlock"
                >
                  <label className="block mb-2 font-semibold">
                    Experience Level <span className="text-red-500">*</span>
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    value={formData.experienceLevel}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        experienceLevel: e.target.value,
                      }));
                    }}
                    ref={experienceLevelRef}
                  >
                    <option value="">Select</option>

                    {experienceLevel.map((level) => (
                      <option key={level._id} value={level._id}>
                        {level.name}
                      </option>
                    ))}
                  </select>

                  {errorField === "experienceLevel" && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {error.experienceLevel}
                    </p>
                  )}
                </div>

                {/* Industry */}
                <div className="w-full md:w-1/2 px-3 mb-6" id="industryBlock">
                  <label className="block mb-2 font-semibold">
                    Industry <span className="text-red-500">*</span>
                  </label>

                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                    value={formData.industry}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        industry: e.target.value,
                      }));
                    }}
                    ref={industryRef}
                  >
                    <option value="">Select</option>

                    {industry.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.job_industry}
                      </option>
                    ))}
                  </select>

                  {errorField === "industry" && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {error.industry}
                    </p>
                  )}
                </div>

                {/* Qualification */}
                <div
                  className="w-full md:w-1/2 px-3 mb-6"
                  id="qualificationBlock"
                >
                  <label className="block mb-2 font-semibold">
                    Qualification <span className="text-red-500">*</span>
                  </label>

                  <Select
                    isMulti
                    styles={customStyles}
                    name="qualification"
                    ref={qualificationRef}
                    options={qualification}
                    classNamePrefix="select"
                    value={qualification.filter((option) =>
                      formData.qualification.includes(option.value),
                    )}
                    onChange={(selectedOptions) =>
                      setFormData((prev) => ({
                        ...prev,
                        qualification: selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : [],
                      }))
                    }
                  />

                  {errorField === "qualification" && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {error.qualification}
                    </p>
                  )}
                </div>

                {/* Job Location Type */}
                <div className="w-full md:w-1/2 px-3 mb-6">
                  <label className="block mb-2 font-semibold">
                    Which option best describes this job's location?{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    className={`w-full rounded-lg border px-4 py-3 outline-none ${
                      error?.jobLocationType
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    value={formData.jobLocationType}
                    ref={jobLocationTypeRef}
                    onChange={(e) => {
                      const value = e.target.value;

                      setFormData((prev) => {
                        if (value === "remote") {
                          return {
                            ...prev,
                            jobLocationType: "remote",

                            country: "",
                            state: "",
                            city: "",
                            branch: "",
                            address: "",

                            advertiseCity: "No",
                            advertiseCityName: "",
                          };
                        }

                        if (value === "on-site") {
                          return {
                            ...prev,
                            jobLocationType: "on-site",

                            advertiseCity: "",
                            advertiseCityName: "",
                          };
                        }

                        return prev;
                      });
                    }}
                  >
                    <option value="">Select</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-site</option>
                  </select>

                  {error?.jobLocationType && (
                    <p className="mt-1 text-sm font-medium text-red-500">
                      {error.jobLocationType}
                    </p>
                  )}
                </div>

{/* Show when On-site */}
{formData.jobLocationType === "on-site" && (
  <>
    {/* Branch Dropdown */}
    <div className="w-full md:w-1/2 px-3 mb-6" id="branchBlock">
      <label>
        <b>Branch </b>
        <span className="text-red-500">*</span>
      </label>

      <select
        className="w-full rounded-md border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.branch}
        onChange={(e) => {
          const selectedBranchId = e.target.value;

          const selectedBranch = branch.find(
            (b) => b._id === selectedBranchId,
          );

          setFormData((prev) => ({
            ...prev,
            branch: selectedBranchId,
            address: selectedBranch?.address || "",
          }));
        }}
        ref={branchRef}
      >
        <option value="">Select</option>
        {branch.map((level) => (
          <option key={level._id} value={level._id}>
            {level.name}
          </option>
        ))}
      </select>

      {error.branch && (
        <p className="mt-1 text-sm font-medium text-red-500">
          {error.branch}
        </p>
      )}
    </div>

    {/* Complete Address */}
    <div className="w-full md:w-1/2 px-3 mb-6" id="completeAddressBlock">
      <label>
        <b>Complete Address </b>
        <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="address"
        ref={addressRef}
        placeholder="C-1 Someshwar Tenament, Ranip, Ahmedabad, Gujarat, India"
        value={formData.address}
        onChange={(e) => {
          console.log(
            "Complete Address selected value -- Chandra Sarkar : ",
            e.target.value,
          );

          setFormData((prev) => ({
            ...prev,
            address: e.target.value,
          }));
        }}
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2"
      />

      {error.address && (
        <p className="mt-1 text-sm font-medium text-red-500">
          {error.address}
        </p>
      )}
    </div>
  </>
)}

{/* Show when Remote */}
{formData.jobLocationType === "remote" && (
  <div className="w-full md:w-1/2 px-3 mb-6" ref={advertiseCityRef}>
    <label className="mb-2 block">
      <b>Do you want to advertise your job in a specific city?</b>
      <span className="text-red-500"> *</span>
    </label>

    <div className="flex flex-wrap gap-4">
      {/* No Option */}
      <label className="flex items-center">
        <input
          type="radio"
          name="advertiseCity"
          value="No"
          checked={formData.advertiseCity === "No"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              advertiseCity: e.target.value,
              advertiseCityName: "",
            }))
          }
          className="mr-2 h-4 w-4"
        />
        No (Anywhere in India)
      </label>

      {/* Yes Option */}
      <label className="flex items-center">
        <input
          type="radio"
          name="advertiseCity"
          value="Yes"
          checked={formData.advertiseCity === "Yes"}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              advertiseCity: e.target.value,
            }))
          }
          className="mr-2 h-4 w-4"
        />
        Yes
      </label>
    </div>

    {error.advertiseCity && (
      <div className="mt-1 text-sm text-red-500">
        {error.advertiseCity}
      </div>
    )}
  </div>
)}

{/* Show when Remote + Yes */}
{formData.jobLocationType === "remote" &&
  formData.advertiseCity === "Yes" && (
    <div className="w-full md:w-1/2 px-3 mb-6">
      <label>
        <b>Where do you want to advertise this job?</b>
        <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="advertiseCityName"
        value={formData.advertiseCityName}
        onChange={handleChange}
        ref={advertiseCityNameRef}
        className="w-full rounded-md border border-gray-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {error.advertiseCityName && (
        <div className="mt-1 text-sm text-red-500">
          {error.advertiseCityName}
        </div>
      )}
    </div>
  )}

{/* Resume Required Checkbox */}
<div className="w-full  px-3 mb-6" id="requireRemumeBlock">
  <div className="flex items-center">
    <input
      type="checkbox"
      id="rememberMe"
      checked={formData.resumeRequired}
      onChange={(e) => {
        setFormData((prev) => ({
          ...prev,
          resumeRequired: e.target.checked,
        }));
      }}
      className="h-4 w-4"
    />

    <label
      className="ml-2 text-sm font-medium text-gray-700"
      htmlFor="rememberMe"
    >
      Resume is required
    </label>
  </div>
</div>
                {/* Submit Button */}
                <div className="w-full px-3 text-right">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        {id ? "Updating..." : "Saving..."}
                      </>
                    ) : id ? (
                      "Update"
                    ) : (
                      "Next"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </>
        </div>
      </Card>
    </EmployerLayout>
  );
}
