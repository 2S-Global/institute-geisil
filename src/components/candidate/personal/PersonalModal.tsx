
import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import PersonalInfoForm from "./PersonalInfoForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const FormModal = ({
  show,
  onClose,
  reload,
  setReload,
  error,
  setError,
  focusSection,
  targetLanguageId,
  setSuccess,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    gender: "",
    dob: null,
    more_info: [],
    marital_status: "",
    partner_name: "",
    category: "",
    differently_abled: "",
    disability_type: "",
    disability_description: "",
    workplace_assistance: "",
    career_break: "",
    career_break_reason: "",
    career_break_start_year: "",
    career_break_start_month: "",
    currently_on_career_break: false,
    career_break_end_year: "",
    career_break_end_month: "",
    usa_visa_type: "",
    work_permit_other_countries: [],
    permanent_address: "",
    hometown: "",
    pincode: "",
    languages: [],
    languagesDetails: [],
    have_usa_visa: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wrongdate, setWrongDate] = useState(false);
  const [wrongdate2, setWrongDate2] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const formatPersonalDetailsResponse = (data) => {
    if (!data) return {};
    const activeLanguages = Array.isArray(data.languages) ? data.languages : [];

    // Safely parse work permits into numerical array IDs
    let safePermits = [];
    if (Array.isArray(data.work_permit_other_countries)) {
      safePermits = data.work_permit_other_countries.map(Number);
    }

    return {
      gender: String(data.gender || ""),
      dob: data.dob ? new Date(data.dob) : null,
      more_info: Array.isArray(data.more_info) ? data.more_info.map(String) : [],
      have_usa_visa: !!data.have_usa_visa,
      partner_name: data.partner_name || "",
      marital_status: String(data.marital_status || ""),
      category: String(data.category || ""),
      differently_abled: data.differently_abled || "",
      disability_type: String(data.disability_type || ""),
      disability_description: data.disability_description || "",
      workplace_assistance: data.workplace_assistance || "",
      career_break: data.career_break || "",
      career_break_reason: String(data.career_break_reason || ""),
      career_break_start_year: String(data.career_break_start_year || ""),
      career_break_start_month: String(data.career_break_start_month || ""),
      currently_on_career_break: !!data.currently_on_career_break,
      career_break_end_year: String(data.career_break_end_year || ""),
      career_break_end_month: String(data.career_break_end_month || ""),
      usa_visa_type: String(data.usa_visa_type || ""),
      work_permit_other_countries: safePermits,
      permanent_address: data.permanent_address || "",
      hometown: data.hometown || "",
      pincode: data.pincode || "",
      languages: activeLanguages,
      languagesDetails: activeLanguages.map((lang) => ({
        language: String(lang.language || ""),
        proficiency: String(lang.proficiency || ""),
        read: !!lang.read,
        write: !!lang.write,
        speak: !!lang.speak,
        _id: lang._id || undefined
      })),
    };
  };

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/candidate/personal/get_personal_details`);
        if (response.status === 200) {
          // FIXED: Checks structural object layer variance dynamically
          const actualData = response.data?.data ? response.data.data : response.data;
          const formatted = formatPersonalDetailsResponse(actualData);

          if (focusSection === "languages" && !targetLanguageId) {
            const blankRow = { language: "", proficiency: "", read: false, write: false, speak: false };
            formatted.languagesDetails = [...formatted.languagesDetails, blankRow];
            formatted.languages = [...formatted.languages, blankRow];
          }

          setFormData(formatted);
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (show) fetchPersonalDetails();
  }, [show, focusSection, targetLanguageId]);

  const validateForm = () => {
    if (focusSection === "languages") {
      let targetIndex = -1;
      if (targetLanguageId) {
        const targetStr = String(targetLanguageId).trim().toLowerCase();
        targetIndex = formData.languagesDetails.findIndex((l) => String(l._id || "").trim().toLowerCase() === targetStr);
      } else {
        targetIndex = formData.languagesDetails.length - 1;
      }

      if (targetIndex === -1 || !formData.languagesDetails[targetIndex]) return false;

      const currentLangRow = formData.languagesDetails[targetIndex];

      if (!currentLangRow.language || currentLangRow.language.toString().trim() === "") return false;
      if (!currentLangRow.proficiency || currentLangRow.proficiency.toString().trim() === "") return false;
      if (!(currentLangRow.read || currentLangRow.write || currentLangRow.speak)) return false;

      return true;
    }

    if (!formData.gender || formData.gender.toString().trim() === "") return false;
    if (!formData.dob) return false;

    if (formData.differently_abled === "Yes") {
      if (!formData.disability_type || formData.disability_type.toString().trim() === "") return false;
      if (formData.disability_type === "999" && (!formData.disability_description || formData.disability_description.toString().trim() === "")) return false;
    }

    if (formData.career_break === "Yes") {
      if (!formData.career_break_reason || formData.career_break_reason.toString().trim() === "") return false;
      if (!formData.career_break_start_year || formData.career_break_start_year.toString().trim() === "") return false;
      if (!formData.career_break_start_month || formData.career_break_start_month.toString().trim() === "") return false;
      if (!formData.currently_on_career_break) {
        if (!formData.career_break_end_year || formData.career_break_end_year.toString().trim() === "") return false;
        if (!formData.career_break_end_month || formData.career_break_end_month.toString().trim() === "") return false;
      }
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  useEffect(() => {
    setWrongDate2(formData.currently_on_career_break ? false : wrongdate);
  }, [formData.currently_on_career_break, wrongdate]);

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      let finalFormData = { ...formData };

      if (focusSection === "languages") {
        finalFormData.languagesDetails = formData.languagesDetails.filter(
          (lang) => lang.language && lang.proficiency
        );
      }

      const response = await API.post(`/api/candidate/personal/submit_personal_details`, finalFormData);
      console.log("response is", response);
      setSaving(false);
      setReload(!reload);
      toast({
        title: "Success",
        description: "Personal details updated successfully",
      });
      onClose();
    } catch (error: any) {
      console.error("Error saving personal details:", error);
      setSaving(false);
      const errMsg = error.response?.data?.message || "Error saving personal details. Please try again.";
      setError(errMsg);
      toast({
        title: "Error",
        variant: "destructive",
        description: errMsg,
      });
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Personal Details</DialogTitle>
          <DialogDescription>This information helps employers know you better.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="text-center py-4 text-sm text-gray-500">loading details...</div>
          ) : (
            <>
              {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
              <PersonalInfoForm
                formData={formData}
                setFormData={setFormData}
                focusSection={focusSection}
                targetLanguageId={targetLanguageId}
                show={show}
                onClose={onClose}
                setReload={setReload}
                setWrongDate={setWrongDate}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <div className="relative inline-flex group">
            <Button
              type="submit"
              onClick={handleSave}
              disabled={!isFormValid || saving || wrongdate2}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
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

export default FormModal;