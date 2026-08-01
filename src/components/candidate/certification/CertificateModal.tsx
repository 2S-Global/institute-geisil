

import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month);
};

const CertificateModal = ({
  setReload,
  show,
  onClose,
  item = {},
  setError,
  setSuccess,
}) => {
  if (!show) return null;

  const { toast } = useToast();
  const [childerror, setChildError] = useState(null);
  const [wrongDate, setWrongDate] = useState(false);
  const [dobYear, setDobYear] = useState(null);

  const [formData, setFormData] = useState({
    _id: item?._id || "",
    title: item?.title || "",
    certificationId: item?.certificationId || "",
    url: item?.url || "",
    validityFromyear: item?.validityFromyear || "",
    validityFrommonth: item?.validityFrommonth || "",
    validityToyear: item?.validityToyear || "",
    validityToMonth: item?.validityToMonth || "",
    doesNotExpire: item?.doesNotExpire || false,
  });

  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const [urlError, setUrlError] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // 1. Fetch user profile data to extract DOB year
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get("/api/userdata/userdata");
        const userData = response.data?.data || response.data?.user || response.data;
        const dob = userData?.dob || userData?.dateOfBirth;

        if (dob) {
          const parsedYear = new Date(dob).getFullYear();
          if (!isNaN(parsedYear)) {
            setDobYear(parsedYear);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data for DOB:", err);
      }
    };

    if (show) {
      fetchUserData();
    }
  }, [show]);

  // 2. Validate start & end dates
  useEffect(() => {
    if (formData.doesNotExpire) {
      setChildError("");
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(
        formData.validityFromyear,
        formData.validityFrommonth
      );
      const endValue = getComparableDateValue(
        formData.validityToyear,
        formData.validityToMonth
      );

      if (startValue && endValue) {
        if (startValue > endValue) {
          setChildError("End date cannot be before start date.");
          setWrongDate(true);
        } else {
          setChildError("");
          setWrongDate(false);
        }
      }
    }
  }, [
    formData.validityFromyear,
    formData.validityFrommonth,
    formData.validityToyear,
    formData.validityToMonth,
    formData.doesNotExpire,
  ]);

  const validateURL = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.title || formData.title.toString().trim() === "") {
      return false;
    }
    if (formData.url && formData.url.toString().trim() !== "") {
      if (!validateURL(formData.url)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      if (formData._id) {
        const response = await API.put(
          `/api/candidate/accomplishments/update_certificate`,
          formData
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
          toast({
            title: "Success",
            description: response?.data?.message || "",
          });
        } else {
          setSaving(false);
          setError(response.data.message);
        }
      } else {
        const response = await API.post(
          `/api/candidate/accomplishments/add_certificate`,
          formData
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
          toast({
            title: "Success",
            description: response?.data?.message || "",
          });
        } else {
          setSaving(false);
          setError(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error saving certificate:", error);
      setSaving(false);
    }
  };

  const handleBlur = () => {
    if (!validateURL(formData.url)) {
      setUrlError("Please enter a valid URL (include https://)");
    } else {
      setUrlError("");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (!formData._id || !token) return;

    try {
      setSaving(true);
      const response = await API.delete(
        `/api/candidate/accomplishments/delete_certificate`,
        {
          data: { _id: formData._id },
        }
      );

      if (response.data.success) {
        onClose();
        setReload(true);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      setError("An error occurred while deleting the record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  // 3. Compute limits based on DOB year
  const minStartYear = dobYear ;
  const totalYearsFrom = currentYear - minStartYear - 1;

  // "Validity To" lower bound & upper bound (DOB year + 30)
  const validityToStartYear = Number(
    formData.validityFromyear || minStartYear
  );
  const validityToEndYear = currentYear ;
  const totalValidityToYears = Math.max(
    1,
    validityToEndYear - validityToStartYear + 1
  );

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-xl">
            <span>Certifications</span>
            {formData._id && (
              <Trash2
                size={18}
                className="cursor-pointer text-red-500 hover:text-red-600 mt-4"
                onClick={handleConfirmDelete}
              />
            )}
          </DialogTitle>

          <DialogDescription>
            Add details of Certifications you have achieved/completed.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-6 text-center">Loading...</div>
        ) : (
          <div className="space-y-5 pt-2">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Certification name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter Certification name"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            {/* Certification ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Certification completion ID
              </label>
              <input
                type="text"
                className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter Certification completion ID"
                value={formData.certificationId}
                onChange={(e) =>
                  setFormData({ ...formData, certificationId: e.target.value })
                }
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Certification URL</label>
              <input
                type="text"
                className={`w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${
                  urlError ? "border-red-500" : ""
                }`}
                placeholder="Enter Certification URL"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                onBlur={handleBlur}
              />
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
            </div>

            {/* Valid From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Certification validity From
              </label>

              <div className="grid grid-cols-2 gap-4">
                <select
                  className="w-full rounded-md border p-2.5"
                  value={formData.validityFromyear || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validityFromyear: e.target.value,
                      validityFrommonth: "",
                      validityToyear: "",
                      validityToMonth: "",
                    })
                  }
                >
                  <option value="">Select Year</option>

                  
                  {Array.from({ length: Math.max(1, totalYearsFrom) }, (_, i) => {
                    const year = currentYear - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>

                <select
                  className="w-full rounded-md border p-2.5"
                  value={formData.validityFrommonth || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      validityFrommonth: e.target.value,
                    })
                  }
                >
                  <option value="">Select Month</option>
                  {generateMonthOptions(parseInt(formData.validityFromyear))}
                </select>
              </div>
            </div>

            {/* Valid To */}
            {!formData.doesNotExpire && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Certification validity To
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <select
                    className="w-full rounded-md border p-2.5"
                    value={formData.validityToyear || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validityToyear: e.target.value,
                        validityToMonth: "",
                      })
                    }
                  >
                    <option value="">Select Year</option>

                    {/* Options from selected validityFromyear up to (DOB year + 30) */}
                    {Array.from({ length: totalValidityToYears }, (_, i) => {
                      const year = validityToStartYear + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    className="w-full rounded-md border p-2.5"
                    value={formData.validityToMonth || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        validityToMonth: e.target.value,
                      })
                    }
                  >
                    <option value="">Select month</option>
                    {monthNames.map((month, index) => (
                      <option key={index + 1} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {childerror && (
              <div className="text-sm text-red-500">{childerror}</div>
            )}

            {/* Does Not Expire Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="doesNotExpire"
                checked={formData.doesNotExpire}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doesNotExpire: e.target.checked,
                  })
                }
              />
              <label htmlFor="doesNotExpire" className="text-sm font-medium">
                This certification does not expire
              </label>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <div className="relative inline-flex group">
            <button
              onClick={handleSave}
              disabled={!isFormValid || saving || wrongDate}
              className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:bg-[#27406F]/50"
            >
              {item._id
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

            {isFormValid && wrongDate && (
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
                Please enter a valid date.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;