import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
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
const getComparableDateValue = (year, month) => {
  if (!year || !month) return null;
  return parseInt(year) * 100 + parseInt(month); // e.g., 202405
};
const FormModal = ({ formData, setFormData, apiurl, setWrongDate }) => {
  //const apiurl =  import.meta.env.VITE_API_URL;
  const [careerBreakOptions, setCareerBreakOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  useEffect(() => {
    /* /api/sql/dropdown/career_break_reason */
    const fetchCareerBreakOptions = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/career_break_reason`
        );
        setCareerBreakOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching career break options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCareerBreakOptions();
  }, [apiurl]);

  // Validation logic
  useEffect(() => {
    const startValue = getComparableDateValue(
      formData.career_break_start_year,
      formData.career_break_start_month
    );
    const endValue = getComparableDateValue(
      formData.career_break_end_year,
      formData.career_break_end_month
    );

    if (startValue && endValue) {
      if (startValue > endValue) {
        setError("Break start date cannot be after break end date.");
        setWrongDate(true);
      } else {
        setError("");
        setWrongDate(false);
      }
    }
  },[
    formData?.career_break_start_year,
    formData?.career_break_start_month,
    formData?.career_break_end_year,
    formData?.career_break_end_month,
    formData?.currently_on_career_break,
    setWrongDate
  ]);

  useEffect(() => {
    if (formData?.currently_on_career_break) {
      setError("");
    }
  }, [formData?.currently_on_career_break]);

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

  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  return (
<>
  {loading ? (
    'loading........'
  ) : (
    <div className="space-y-5">

      {/* Reason of Break */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Reason of break <span className="text-red-500">*</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {careerBreakOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() =>
                setFormData({
                  ...formData,
                  career_break_reason: option.id,
                })
              }
              className={`px-4 py-1.5 rounded-full border text-sm transition-all
                ${
                  formData.career_break_reason == option.id
                    ? "bg-indigo-100 border-indigo-500 font-semibold text-gray-900"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Break Started From */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Break started from <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={formData.career_break_start_year || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                career_break_start_year: e.target.value,
                career_break_start_month: "",
              })
            }
          >
            <option value="">Select Year</option>
            {Array.from({ length: 30 }, (_, i) => {
              const year = currentYear - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            value={formData.career_break_start_month || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                career_break_start_month: e.target.value,
              })
            }
          >
            <option value="">Select Month</option>
            {generateMonthOptions(
              parseInt(formData.career_break_start_year)
            )}
          </select>
        </div>
      </div>

      {/* Break Ended In */}
      {!formData.currently_on_career_break && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            Break ended in <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={formData.career_break_end_year || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  career_break_end_year: e.target.value,
                  career_break_end_month: "",
                })
              }
            >
              <option value="">Select Year</option>
              {Array.from({ length: 30 }, (_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={formData.career_break_end_month || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  career_break_end_month: e.target.value,
                })
              }
            >
              <option value="">Select Month</option>
              {generateMonthOptions(
                parseInt(formData.career_break_end_year)
              )}
            </select>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* Present Field */}
      {formData.currently_on_career_break && (
        <div>
          <label className="block text-sm font-semibold mb-2">
            To <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            value="Present"
            readOnly
            className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-600 cursor-not-allowed"
          />
        </div>
      )}

      {/* Currently On Break */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="careerBreak"
          checked={formData.currently_on_career_break}
          onChange={(e) =>
            setFormData({
              ...formData,
              currently_on_career_break: e.target.checked,
            })
          }
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />

        <label
          htmlFor="careerBreak"
          className="text-sm font-medium text-gray-700"
        >
          Currently on a break
        </label>
      </div>

      {/* Warning Note */}
      {formData.currently_on_career_break && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm text-yellow-800">
          <span className="font-semibold">Note:</span> If you are currently on
          a break, please ensure to update your profile when you return to work.
        </div>
      )}
    </div>
  )}
</>
  );
};

export default FormModal;
