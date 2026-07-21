
import React, { useState, useEffect } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import API from "@/lib/axios";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WorkProfileModal = ({ show, onClose, item, setReload, onDelete }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

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
  const currentYear = new Date().getFullYear();

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ script: "super" }, { script: "sub" }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "script",
    "list",
    "bullet",
    "link",
  ];

  const [formData, setFormData] = useState({
    _id: "",
    workTitle: "",
    url: "",
    description: "",
    durationFromYear: "",
    durationFromMonth: "",
    durationToYear: "",
    durationToMonth: "",
    currentlyWorking: false,
  });

  // Populates data when the modal opens
  useEffect(() => {
    if (show) {
      if (item) {
        const fromYear =
          item.durationFromYear || item.durationFrom?.year || item.year || "";
        const toYear =
          item.durationToYear || item.durationTo?.year || item.toYear || "";

        const rawFromMonth =
          item.durationFromMonth ||
          item.durationFrom?.month ||
          item.month ||
          "";
        const rawToMonth =
          item.durationToMonth || item.durationTo?.month || item.toMonth || "";

        const parseMonthValue = (monthValue) => {
          if (!monthValue) return "";
          if (monthNames.includes(monthValue)) return monthValue;

          const index = Number(monthValue);
          if (!isNaN(index) && index >= 1 && index <= 12) {
            return monthNames[index - 1];
          }
          return "";
        };

        setFormData({
          _id: item._id || "",
          workTitle: item.workTitle || "",
          url: item.url || "",
          description: item.description || "",
          durationFromYear: String(fromYear),
          durationFromMonth: parseMonthValue(rawFromMonth),
          durationToYear: String(toYear),
          durationToMonth: parseMonthValue(rawToMonth),
          currentlyWorking:
            item.currentlyWorking === "true" ||
            item.currentlyWorking === true ||
            false,
        });
      } else {
        setFormData({
          _id: "",
          workTitle: "",
          url: "",
          description: "",
          durationFromYear: "",
          durationFromMonth: "",
          durationToYear: "",
          durationToMonth: "",
          currentlyWorking: false,
        });
      }
    }
  }, [show, item]);

  // Handle Input changes and reset target values if conditions change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // Reset 'To' fields if the 'From' date moves past the selected 'To' date
      if (name === "durationFromYear" && updated.durationToYear && parseInt(value, 10) > parseInt(updated.durationToYear, 10)) {
        updated.durationToYear = "";
        updated.durationToMonth = "";
      }
      
      if (name === "durationFromMonth" && updated.durationFromYear === updated.durationToYear && updated.durationToMonth) {
        const fromIdx = monthNames.indexOf(value);
        const toIdx = monthNames.indexOf(updated.durationToMonth);
        if (fromIdx > toIdx) {
          updated.durationToMonth = "";
        }
      }

      return updated;
    });
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      currentlyWorking: checked,
      durationToYear: checked ? "" : prev.durationToYear,
      durationToMonth: checked ? "" : prev.durationToMonth,
    }));
  };

  const handleAIHelp = () => {
    if (!formData.workTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Profile Title Required",
        description: "Please enter a work title first so AI can write a description.",
      });
      return;
    }
    setFormData((prev) => ({
      ...prev,
      description:
        prev.description +
        `<p>Responsible for managing core assignments, designing execution layouts for ${prev.workTitle}, scaling analytics tracking workflows, and pushing higher delivery standards.</p>`,
    }));
  };

  const handleSave = async () => {
    if (!formData.workTitle.trim() || !formData.url.trim()) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in both the Title and URL fields.",
      });
      return;
    }

    const fromYear = formData.durationFromYear ? parseInt(formData.durationFromYear, 10) : null;
    const fromMonthIndex = formData.durationFromMonth ? monthNames.indexOf(formData.durationFromMonth) : -1;
    
    const toYear = formData.durationToYear ? parseInt(formData.durationToYear, 10) : null;
    const toMonthIndex = formData.durationToMonth ? monthNames.indexOf(formData.durationToMonth) : -1;

    if ((fromYear && fromMonthIndex === -1) || (!fromYear && fromMonthIndex !== -1)) {
      toast({
        variant: "destructive",
        title: "Incomplete Start Date",
        description: "Please select both a year and a month for your start date.",
      });
      return;
    }

    if (!formData.currentlyWorking) {
      if ((toYear && toMonthIndex === -1) || (!toYear && toMonthIndex !== -1)) {
        toast({
          variant: "destructive",
          title: "Incomplete End Date",
          description: "Please select both a year and a month for your end date.",
        });
        return;
      }

      if (fromYear && toYear) {
        if (toYear < fromYear || (toYear === fromYear && toMonthIndex < fromMonthIndex)) {
          toast({
            variant: "destructive",
            title: "Invalid Date Range",
            description: "The end date cannot be earlier than the start date.",
          });
          return;
        }
      }
    }

    const fromMonthValue = formData.durationFromMonth
      ? String(monthNames.indexOf(formData.durationFromMonth) + 1)
      : "";

    const toMonthValue = formData.durationToMonth
      ? String(monthNames.indexOf(formData.durationToMonth) + 1)
      : "";

    const payload = {
      _id: formData._id || undefined,
      workTitle: formData.workTitle.trim(),
      url: formData.url.trim(),
      description: formData.description,
      currentlyWorking: formData.currentlyWorking,
      durationFromYear: formData.durationFromYear || "",
      durationFromMonth: fromMonthValue,
      durationToYear: formData.currentlyWorking ? "" : formData.durationToYear || "",
      durationToMonth: formData.currentlyWorking ? "" : toMonthValue,
    };

    try {
      setSaving(true);
      let response;

      if (formData._id) {
        response = await API.put("/api/candidate/accomplishments/edit_work_samples", payload);
      } else {
        response = await API.post("/api/candidate/accomplishments/add_work_samples", payload);
      }

      if (response.status === 200 || response.data?.success) {
        toast({
          title: "Success",
          description: formData._id ? "Work profile updated successfully." : "Work profile saved successfully.",
        });
        setReload();
        onClose();
      }
    } catch (error) {
      console.error("Error saving work profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data. Please check connection routing.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            {formData._id ? "Edit Work Profile" : "Add Work Profile"}
          </DialogTitle>
        </div>
        <div className="px-6 py-4 max-h-[75vh] overflow-y-auto space-y-4 text-left">
          <div className="flex justify-end">
            {formData._id && (
              <Trash2
                className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-600"
                onClick={() => onDelete(formData._id)}
              />
            )}
          </div>
          <p className="text-sm text-gray-700">
            Link relevant work profiles (e.g. Github, Behance)
          </p>
            
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 tracking-wide">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              name="workTitle"
              placeholder="Enter Work title"
              value={formData.workTitle}
              onChange={handleInputChange}
              className="bg-[#F4F8FA] border-none h-11 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 tracking-wide">
              URL<span className="text-red-500">*</span>
            </label>
            <Input
              name="url"
              placeholder="Enter Your URL"
              value={formData.url}
              onChange={handleInputChange}
              className="bg-[#F4F8FA] border-none h-11 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          {/* DURATION FROM */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-900 tracking-wide">
              Duration From
            </label>
            <div className="grid grid-cols-2 gap-3">
              <select
                name="durationFromYear"
                value={formData.durationFromYear}
                onChange={handleInputChange}
                className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Year</option>
                {Array.from({ length: 25 }, (_, i) => currentYear - i).map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>

              <select
                name="durationFromMonth"
                value={formData.durationFromMonth}
                onChange={handleInputChange}
                className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Month</option>
                {monthNames.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DURATION TO */}
          {!formData.currentlyWorking && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 tracking-wide">
                Duration To
              </label>
              <div className="grid grid-cols-2 gap-3">
                {/* Dynamically hides years below selected Duration From Year */}
                <select
                  name="durationToYear"
                  value={formData.durationToYear}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 25 }, (_, i) => currentYear - i)
                    .filter((yr) => !formData.durationFromYear || yr >= parseInt(formData.durationFromYear, 10))
                    .map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))}
                </select>

                {/* Dynamically hides months below selected Duration From Month if target year matches */}
                <select
                  name="durationToMonth"
                  value={formData.durationToMonth}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Month</option>
                  {monthNames
                    .filter((m) => {
                      if (!formData.durationFromYear || !formData.durationToYear || !formData.durationFromMonth) return true;
                      if (formData.durationFromYear !== formData.durationToYear) return true;
                      return monthNames.indexOf(m) >= monthNames.indexOf(formData.durationFromMonth);
                    })
                    .map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="currently_working"
              checked={formData.currentlyWorking}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="currently_working"
              className="text-sm font-medium text-gray-700 cursor-pointer select-none"
            >
              I am currently working on this
            </label>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-900 tracking-wide">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Type here..."
              style={{ height: "180px", marginBottom: "50px" }}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleAIHelp}
            className="rounded-full bg-[#EBF3FF] hover:bg-[#DCE9FF] border-none text-[#2563EB] text-xs h-8 px-4 gap-1.5 font-medium shadow-none"
          >
            <Sparkles className="h-3.5 w-3.5 fill-[#2563EB]" />
            Help me write
          </Button>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end sm:justify-end gap-2 w-full">
          <div className="flex items-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save "}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkProfileModal;