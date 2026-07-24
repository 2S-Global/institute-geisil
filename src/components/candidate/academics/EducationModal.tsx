import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { Trash2, Sparkles } from "lucide-react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import EducationForm from "./EducationForm"
import { getMinimumAllowedYear } from "./educationYearValidation";
const EducationModal = ({ show,
  onClose,
  reload,
  setReload,
  selectedLevel,
  edit_id,
  setError,
  setSuccess,
  onEducationChanged}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
 // console.log("show",show)
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    _id: "",
    dob: "",
    level: "",
    state: "",
    board: "",
    year_of_passing: "",
    medium: "",
    marks: "",
    eng_marks: "",
    math_marks: "",
    university: "",
    school_name: "",
    institute_name: "",
    course_name: "",
    course_type: "",
    start_year: "",
    end_year: "",
    grading_system: "",
    is_primary: false,
    transcript: null,
    transcriptPreview: "",
    certificate: null,
    certificatePreview: "",
    level_type: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [existingEducationData, setExistingEducationData] = useState([]);
  const [allowedLevels, setAllowedLevels] = useState([]);
  const [minimumAllowedYear, setMinimumAllowedYear] = useState<number | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const fetchCandidateDob = async () => {
      try {
        const response = await API.get(
          `/api/candidate/personal/get_personal_details_with_name`
        );

        if (response.status === 200) {
          const dob = response.data?.data?.dob || "";
          setFormData((prev) => ({ ...prev, dob }));
        }
      } catch (error) {
        console.error("Error fetching candidate DOB:", error);
      }
    };

    const fetchLevels = async () => {
      try {
        const response = await API.get(`/api/sql/dropdown/education_level`);
        if (response.status === 200) {
          setLevels(response.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching education levels:", error);
      }
    };

    const fetchExistingEducation = async () => {
      try {
        const response = await API.get(`/api/userdata/get_user_education`);
        if (response.status === 200) {
          setExistingEducationData(response.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching user education data:", error);
      }
    };

    fetchCandidateDob();
    fetchLevels();
    fetchExistingEducation();
  }, []);

  useEffect(() => {
    if (selectedLevel) {
      console.log("selectedLevel from useEffect", selectedLevel);
      setFormData({ ...formData, level: selectedLevel });
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (edit_id) {
      console.log("edit_id from useEffect", edit_id);
      setFormData({ ...formData, _id: edit_id });
      /* http://localhost:8080/api/userdata/get_edit_user_data?dataId=6839499e3bbfe3574bccef83 */
      const fetchuserdata = async () => {
        setLoading(true);
        try {
          const response = await API.get(
            `/api/userdata/get_edit_user_data?dataId=${edit_id}`
          );

          if (response.status == 200) {
            const responseData = response.data.data;

            setFormData({
              ...formData,
              _id: responseData._id || "",
              school_name: responseData.school_name || "",
              level: responseData.level || "",
              state: responseData.state || "",
              board: responseData.board || "",
              year_of_passing: responseData.year_of_passing || "",
              medium: responseData.medium_of_education || "",
              marks: responseData.marks || "",
              eng_marks: responseData.eng_marks || "",
              math_marks: responseData.math_marks || "",
              university: responseData.universityName || "",
              institute_name: responseData.instituteName || "",
              course_name: responseData.courseName || "",
              course_type: responseData.courseType || "",
              start_year: responseData.duration.from || "",
              end_year: responseData.duration.to || "",
              grading_system: responseData.gradingSystem || "",
              is_primary: responseData.isPrimary || false,
              transcript: null,
              transcriptPreview: responseData.transcript_data || "",
              certificate: null,
              certificatePreview: responseData.certificate_data || "",
              level_type: responseData.levelType || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchuserdata();
    }
  }, [edit_id]);

  const normalizeLevelName = (value) => String(value ?? "").trim().toLowerCase();

  const getLevelLabel = (levelItem) => {
    if (!levelItem) return "";
    return normalizeLevelName(levelItem.level || levelItem.name || levelItem.label);
  };

  const getLevelLabelFromRecord = (record) => {
    const recordLevel = record?.level_name ?? record?.levelName ?? record?.level;
    if (typeof recordLevel === "string" && Number.isNaN(Number(recordLevel))) {
      return normalizeLevelName(recordLevel);
    }

    const levelId = record?.level_id ?? recordLevel ?? "";
    if (levelId === "") return "";

    const matchedLevel = levels.find((level) => String(level.id) === String(levelId));
    return getLevelLabel(matchedLevel);
  };

  const getAllowedLevelsForAdd = (allLevels, records) => {
    if (!allLevels.length) return [];

    const existingLabels = records
      .map((record) => getLevelLabelFromRecord(record))
      .filter(Boolean);

    const has10th = existingLabels.includes("10th standard");
    const has12th = existingLabels.includes("12th standard");
    const hasDiploma = existingLabels.includes("diploma");
    const hasUndergraduate = existingLabels.some((label) => label === "undergraduate" || label === "under graduate" || label === "graduation");
    const hasPostgraduate = existingLabels.some((label) => label === "postgraduate" || label === "post graduate");
    const hasDoctorate = existingLabels.some((label) => label === "doctorate/phd" || label === "doctorate" || label === "phd");
    const onlyLevels = (...labels) => allLevels.filter((level) => labels.includes(getLevelLabel(level)));

    if (!has10th) {
      return onlyLevels("10th standard");
    }

    if (hasUndergraduate && !hasPostgraduate) {
      return onlyLevels("postgraduate", "post graduate", "post graduation");
    }

    if (hasPostgraduate && !hasDoctorate) {
      return onlyLevels("doctorate/phd", "doctorate", "phd");
    }

    if (hasDoctorate) return [];

    if (has12th && hasDiploma) return onlyLevels("undergraduate", "under graduate", "graduation");
    if (hasDiploma) return onlyLevels("12th standard", "undergraduate", "under graduate", "graduation");
    if (has12th) return onlyLevels("diploma", "undergraduate", "under graduate", "graduation");

    return onlyLevels("12th standard", "diploma");
  };

  const getMinimumAllowedYearForLevel = (levelId, dobValue, records) => {
    const matchedLevel = levels.find((level) => String(level.id) === String(levelId));
    const levelLabel = getLevelLabel(matchedLevel);
    const birthYear = dobValue ? new Date(dobValue).getFullYear() : null;

    if (!birthYear) return null;

    const tenthRecord = records.find((record) => getLevelLabelFromRecord(record) === "10th standard");
    const twelfthRecord = records.find((record) => getLevelLabelFromRecord(record) === "12th standard");
    const getCourseEndYear = (record) =>
      Number(record?.duration?.to || record?.end_year || record?.year_of_passing || 0) || null;
    const latestRecord = records.reduce((latest, record) => {
      if (!latest) return record;
      const latestDate = new Date(latest.createdAt || latest.created_at || 0).getTime();
      const recordDate = new Date(record.createdAt || record.created_at || 0).getTime();
      return recordDate >= latestDate ? record : latest;
    }, null);

    if (levelLabel === "10th standard") return birthYear + 14;

    if (levelLabel === "12th standard") {
      const baseYear = Number(tenthRecord?.year_of_passing || birthYear + 14);
      return baseYear + 2;
    }

    if (levelLabel === "diploma") {
      const baseYear = Number(twelfthRecord?.year_of_passing || tenthRecord?.year_of_passing || birthYear + 14);
      return baseYear;
    }

    if (["undergraduate", "under graduate", "graduation", "postgraduate", "post graduate", "post graduation", "doctorate/phd", "doctorate", "phd"].includes(levelLabel)) {
      return getCourseEndYear(latestRecord) || birthYear;
    }

    return birthYear;
  };

  useEffect(() => {
    if (!levels.length) {
      setAllowedLevels([]);
      setMinimumAllowedYear(null);
      return;
    }

    const relevantRecords = existingEducationData.filter((record) => !edit_id || String(record._id) !== String(edit_id));
    const nextAllowedLevels = edit_id ? levels : getAllowedLevelsForAdd(levels, relevantRecords);
    setAllowedLevels(nextAllowedLevels);

    if (!formData.level) {
      setMinimumAllowedYear(null);
      return;
    }

    const computedMinimumYear = getMinimumAllowedYearForLevel(formData.level, formData.dob, relevantRecords);
    setMinimumAllowedYear(computedMinimumYear);
  }, [levels, existingEducationData, formData.level, formData.dob, edit_id]);

  const validateForm = () => {
    // 'level' is always required
    if (!formData.level || formData.level.toString().trim() === "") {
      return false;
    }

    if (formData.level == 1 || formData.level == 2) {
      const yearOfPassing = formData.year_of_passing;
      if (yearOfPassing && minimumAllowedYear !== null && Number(yearOfPassing) < minimumAllowedYear) {
        return false;
      }
      const requiredFields = [
        "level",
        "state",
        "board",
        "year_of_passing",
        "medium",
        "marks",
      ];

      if (formData.level == 2) {
        requiredFields.push("eng_marks");
        requiredFields.push("math_marks");
      }

      const isAnyFieldEmpty = requiredFields.some((field) => {
        const value = formData[field];

        return !value || value.toString().trim() === "";
      });

      if (isAnyFieldEmpty) return false;
    } else {
      const requiredFields = [
        "level",
        "state",
        "university",
        "institute_name",
        "course_name",
        "course_type",
        "start_year",
        "end_year",
        "grading_system",
        "marks",
      ];

      const isAnyFieldEmpty = requiredFields.some((field) => {
        const value = formData[field];
        if (field === "transcript" || field === "certificate") {
          return !value;
        }
        return !value || value.toString().trim() === "";
      });

      if (isAnyFieldEmpty) return false;
      
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData, minimumAllowedYear, levels, existingEducationData]);

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }

    if (!validateForm()) {
      console.log("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      const payload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          payload.append(key, formData[key]);
        }
      }
      if (edit_id) {
        const response = await API.put(
          `/api/useraction/usereducation`,
          payload
        );
        console.log("Education data saved successfully:", response.data);
      } else {
        const response = await API.post(
          `/api/useraction/usereducation`,
          payload
        );
        console.log("Education data saved successfully:", response.data);
      }
    toast({
          title: "Success",
          description: "Education data saved successfully",
        });
      setSuccess("Education data saved successfully");
      await onEducationChanged?.();
      onClose();
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Error saving education data";

      console.error("Error saving education data:", error);
      setError(serverMessage);
      toast({
        title: "Error",
        variant: "destructive",
        description: serverMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!edit_id) {
      console.error("No education record selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setLoading(true);

      /* /api/useraction/delete_user_data?_id=683958213ade488ea47299eb */
      const response = await API.delete(
        `/api/useraction/delete_user_data?_id=${edit_id}`
       
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete education record");
      }
      await onEducationChanged?.(edit_id);
      onClose();
    } catch (error) {
      console.error("Error deleting education record:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };

  if (!show) return null;

  return (
<Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
    {/* Header */}
    <DialogHeader>
      <div className="flex items-center justify-between">
        <div>
          <DialogTitle className="text-xl font-semibold">
            Academics
          </DialogTitle>

          <DialogDescription className="mt-1">
            Details like course, university, and more help recruiters identify
            your educational background.
          </DialogDescription>
        </div>

        {edit_id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleConfirmDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>
    </DialogHeader>

    {/* Body */}
    <div className="pt-2">
      <EducationForm
        formData={formData}
        setFormData={setFormData}
        selectedLevel_main={selectedLevel}
        edit_id_main={edit_id}
        loading={loading}
        setLoading={setLoading}
        allowedLevels={allowedLevels}
        minimumAllowedYear={minimumAllowedYear}
      />
    </div>

    {/* Footer */}
{/*     <DialogFooter className="gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>

      <div className="relative group">
        {!isFormValid && (
          <div className="absolute bottom-full left-0 mb-2 hidden whitespace-nowrap rounded border border-red-500 bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow group-hover:block">
            Please fill all required fields
          </div>
        )}

        <Button
          onClick={handleSave}
          disabled={!isFormValid || saving}
        >
          {edit_id
            ? saving
              ? "Updating..."
              : "Update"
            : saving
            ? "Saving..."
            : "Save"}
        </Button>
      </div>
    </DialogFooter> */}
     <div className="flex justify-end gap-3 pt-6">

        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
        >
          Cancel
        </button>

        <div className="relative inline-flex group">
        <button
            type="submit"
            onClick={handleSave}
            disabled={!isFormValid || saving}
            className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:cursor-not-allowed disabled:bg-[#27406F]/50"
        >
          {edit_id
            ? saving
              ? "Updating..."
              : "Update"
            : saving
            ? "Saving..."
            : "Save"}
        </button>

        {!isFormValid && (
            <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
            Please fill all required fields.
            </div>
        )}
        </div>

      </div>
  </DialogContent>
</Dialog>
  );
};

export default EducationModal;
