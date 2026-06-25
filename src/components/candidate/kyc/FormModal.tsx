import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
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
import { useToast } from "@/hooks/use-toast";
import KycBox from "./KycBox";
const FormModal = ({ show, onClose, data = {}, setRefresh, 

  setMessageId,
  setErrorId,
  setReload,
  focusSection }) => {
  const apiurl =  import.meta.env.VITE_API_URL;
 // console.log("show",show)
    const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();
  const token = localStorage.getItem("token");
  /* 
  console.log("data", data); */

  const [formData, setFormData] = useState({
    pan_number: data?.pan_number || "",
    pan_name: data?.pan_name || "",
    epic_number: data?.epic_number || "",
    epic_name: data?.epic_name || "",
    passport_name: data?.passport_name || "",
    passport_number: data?.passport_number || "",
    passport_dob: data?.passport_dob || "",
    dl_number: data?.dl_number || "",
    dl_name: data?.dl_name || "",
    dl_dob: data?.dl_dob || "",
    aadhar_number: data?.aadhar_number || "",
    aadhar_name: data?.aadhar_name || "",
  });

  const [formerrors, setFormErrors] = useState("");

  const validationConfig = [
    {
      fields: ["pan_number", "pan_name"],
      message: "Please fill both the PAN number and name.",
    },
    {
      fields: ["epic_number", "epic_name"],
      message: "Please fill both the EPIC number and name.",
    },
    {
      fields: ["passport_number", "passport_name", "passport_dob"],
      message: "Please fill Passport number, name, and DOB.",
    },
    {
      fields: ["dl_number", "dl_name", "dl_dob"],
      message: "Please fill Driving License number, name, and DOB.",
    },
    {
      fields: ["aadhar_number", "aadhar_name"],
      message: "Please fill a valid Aadhar number and name.",
    },
  ];

  const ValidateForm = () => {
    setFormErrors("");
    setIsFormValid(false); // default: invalid

    let hasAnyGroupFilled = false;

    for (const { fields, message } of validationConfig) {
      // Check if at least one field in this group is filled
      const isAnyFilled = fields.some(
        (field) => formData[field]?.toString().trim() !== ""
      );

      if (isAnyFilled) {
        hasAnyGroupFilled = true; // ✅ at least one group has data

        // If some are filled, ensure all are filled
        const isAllFilled = fields.every(
          (field) => formData[field]?.toString().trim() !== ""
        );

        if (!isAllFilled) {
          setFormErrors(message);
          setIsFormValid(false);
          return;
        }
      }
    }

    if (!hasAnyGroupFilled) {
      setFormErrors("Please fill at least one document.");
      setIsFormValid(false);
      return;
    }

    // ✅ Passed all checks
    setIsFormValid(true);
  };

  useEffect(() => {
    ValidateForm();
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    //setMessageId(null);
    //setErrorId(null);
    //console.log("formData kkkkkkkkkkkkkkkk lllllllllllllllllllllll",formData)
    try {
      const response = await API.post(
        `/api/candidatekyc/kyc`,
        formData
      );

      if (response.data.success) {
        setSuccess(response.data.message || "KYC updated successfully.");
        //setMessageId(Date.now());
        setTimeout(() => {
            setReload(p=>p+1);
            onClose();
        }, 2000);
      }

      if (!response.data.success) {
        setError(response.data.message || "Failed to update KYC.");
        //setErrorId(Date.now());
      }
    } catch (error) {
      //console.error(error);
      setError("Failed to update KYC. Try again later.");
    } 
  };
  if (!show) return null;

  return (
<Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">

    {/* Header */}
    <DialogHeader>
      <DialogTitle className="font-display text-xl">
        KYC
      </DialogTitle>

      <DialogDescription>
        Complete your KYC verification details below.
      </DialogDescription>
    </DialogHeader>

    <form className="space-y-5 pt-2" onSubmit={handleSubmit}>

      {/* Body */}
      <div className="space-y-4">
        <KycBox
          formData={formData}
          setFormData={setFormData}
          focusSection={focusSection}
        />
      </div>

      {/* Footer */}
      <DialogFooter className="gap-2 pt-2">

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

        {/* Tooltip Wrapper */}
        <div className="relative group">
          {!isFormValid && (
            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-white text-red-600 font-semibold border border-red-500 rounded px-3 py-1 text-xs whitespace-nowrap shadow">
              {formerrors}
            </div>
          )}

          <Button
            type="submit"
            disabled={!isFormValid || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>

      </DialogFooter>

    </form>
       {/* Messages */}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

  </DialogContent>
</Dialog>
  );
};

export default FormModal;
