import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import KycBox from "./KycBox";

const KycModal = ({
  show,
  onClose,
  setError,
  setSuccess,
  setMessageId,
  setErrorId,
  setReload,
  focusSection,
  data,
}) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
      message: "Please fill a valid Aadhaar number and name.",
    },
  ];

  const ValidateForm = () => {
    setFormErrors("");
    setIsFormValid(false);

    let hasAnyGroupFilled = false;

    for (const { fields, message } of validationConfig) {
      const isAnyFilled = fields.some(
        (field) => formData[field]?.toString().trim() !== "",
      );

      if (isAnyFilled) {
        hasAnyGroupFilled = true;

        const isAllFilled = fields.every(
          (field) => formData[field]?.toString().trim() !== "",
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
    setMessageId(null);
    setErrorId(null);

    try {
      const response = await API.post(
        `${apiurl}/api/candidatekyc/kyc`,
        formData,
      );

      if (response.data.success) {
        setSuccess(response.data.message || "KYC updated successfully.");
        toast({
          title: "Success",
          description: response.data.message || "KYC updated successfully.",
        });
        setMessageId(Date.now());
        setReload(true);
        onClose();
      }

      if (!response.data.success) {
        setError(response.data.message || "Failed to update KYC.");
        toast({
          title: "Error",
          variant: "destructive",
          description: response.data.message || "Failed to update KYC.",
        });
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error(error);
      setError("Failed to update KYC. Try again later.");
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to update KYC. Try again later.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      {/* ADDED onOpenAutoFocus HERE TO STOP AUTO FOCUS ON THE INPUT BOX */}
      <DialogContent
        className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">KYC</DialogTitle>
          <DialogDescription>
            Complete your KYC verification details below.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5 pt-2" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <KycBox
              formData={formData}
              setFormData={setFormData}
              focusSection={focusSection}
            />
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {/* <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>

            <div className="relative w-full sm:w-auto">
              {!isFormValid && (
                <div className="absolute bottom-full right-0 mb-2 z-50 w-max max-w-[220px] rounded bg-gray-800 px-3 py-2 text-sm text-white shadow-lg">
                  Please fill all required fields
                  <div className="absolute right-6 top-full border-4 border-transparent border-t-gray-800" />
                </div>
              )}

              <Button
                type="submit"
                disabled={!isFormValid || saving}
                className="w-full sm:w-auto"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div> */}

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
                  disabled={!isFormValid || saving}
                  
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KycModal;
