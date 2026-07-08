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
const EducationModal = ({ show,
  onClose,
  reload,
  setReload,
  selectedLevel,
  edit_id,
  setError,
  setSuccess}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
 // console.log("show",show)
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    _id: "",
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
  const { toast } = useToast();
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

  const validateForm = () => {
    // 'level' is always required
    if (!formData.level || formData.level.toString().trim() === "") {
      return false;
    }

    if (formData.level == 1 || formData.level == 2) {
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
  }, [formData]);

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
      setReload(true);
      onClose();
    } catch (error) {
      console.error("Error saving education data:", error);
      setError("Error saving education data");
      toast({
          title: "Error",
          variant: "destructive",
          description: "Error saving education data",
        })
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
      setReload(true);
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
