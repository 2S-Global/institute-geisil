import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { useToast } from "@/hooks/use-toast";


import KycBox from "./Kycboxnew";

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
  if (!show) return null;
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const apiurl = "";
  const token = localStorage.getItem("token");
  const {toast}=useToast()
  /* 
  console.log("data", data); */

  const [formData, setFormData] = useState({
    pan_number: data?.pan_number || "",
    pan_name: data?.pan_name || "",
    cin_number: data?.cin_number || "",
    cin_name: data?.cin_name || "",
    gstin_name: data?.gstin_name || "",
    gstin_number: data?.gstin_number || "",
  });

  const [formerrors, setFormErrors] = useState("");

  const validationConfig = [
    {
      fields: ["pan_number", "pan_name"],
      message: "Please fill both the PAN number and name.",
    },
    {
      fields: ["cin_number", "cin_name"],
      message: "Please fill both the CIN number and name.",
    },
    {
      fields: ["gstin_number", "gstin_name"],
      message: "Please fill both the GSTIN number and name.",
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
    setMessageId(null);
    setErrorId(null);

    try {
      const response = await API.post(
        `/api/companykyc/kyc`,
        formData
      );

      if (response.data.success) {
        setSuccess(response.data.message || "KYC updated successfully.");
         toast({
                    title: "Success",
                    description:response.data.message || "KYC updated successfully.",
                  });
        setMessageId(Date.now());
        setReload(true);
        onClose();
      }

      if (!response.data.success) {
         toast({
                    title: "Error",
                     variant: "destructive",
                    description:response.data.message || "Failed to update KYC.",
                  });
        setError(response.data.message || "Failed to update KYC.");
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error(error);
      toast({
                    title: "Error",
                     variant: "destructive",
                    description:"Failed to update KYC. Try again later.",
                  });
      setError("Failed to update KYC. Try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
   <>
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    tabIndex="-1"
  >
    <div className="w-full max-w-4xl px-4">
      <div className="overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h5 className="text-lg font-semibold">KYC</h5>

          <button
            type="button"
            className="text-2xl leading-none text-gray-500 hover:text-black"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <form className="space-y-0" onSubmit={handleSubmit}>
          {/* Modal Body */}
          <div className="px-6 py-4">
            <KycBox
              formData={formData}
              setFormData={setFormData}
              focusSection={focusSection}
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <button
              type="button"
              className="rounded-md bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>

            <style>{`
              .tooltip-wrapper {
                position: relative;
                display: inline-block;
              }

              .tooltip-wrapper .custom-tooltip {
                visibility: hidden;
                background-color: white;
                color: red;
                font-weight: bold;
                text-align: center;
                border: 1px solid red;
                border-radius: 4px;
                padding: 5px 10px;
                position: absolute;
                bottom: 100%;
                left: 0;
                margin-bottom: 6px;
                z-index: 1;
                white-space: nowrap;
              }

              .tooltip-wrapper:hover .custom-tooltip {
                visibility: visible;
              }
            `}</style>

            <div className="tooltip-wrapper">
              {!isFormValid && (
                <div className="custom-tooltip">{formerrors}</div>
              )}

              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isFormValid || saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</>
  );
};

export default KycModal;
