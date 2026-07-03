import React, { useState, ChangeEvent, useEffect } from "react";
import { Sparkles } from "lucide-react";
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

export interface WorkProfileType {
  _id?: string;
  workTitle: string;
  url: string;
  description: string;
  durationFromYear: number | string;
  durationFromMonth: number | string;
  durationToYear: number | string;
  durationToMonth: number | string;
  currentlyWorking: boolean;
  companyName?: string;
  employmentType?: string;
  location?: string;
}

interface WorkProfileModalProps {
  show: boolean;
  onClose: () => void;
  item: WorkProfileType | null;
  setReload: () => void;
}

const WorkProfileModal: React.FC<WorkProfileModalProps> = ({
  show,
  onClose,
  item,
  setReload,
}) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const stripHtml = (htmlString: string) => {
    if (!htmlString) return "";
    return htmlString.replace(/<\/?[^>]+(>|$)/g, "").trim();
  };

  

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

  useEffect(() => {
    if (item) {
      setFormData({
        _id: item._id || "",
        workTitle: item.workTitle || "",
        url: item.url || "",
        description: stripHtml(item.description || ""),
        durationFromYear: String(item.durationFromYear ?? ""),
        durationFromMonth: String(item.durationFromMonth ?? ""),
        durationToYear: String(item.durationToYear ?? ""),
        durationToMonth: String(item.durationToMonth ?? ""),

        currentlyWorking: item.currentlyWorking || false,
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
  }, [item, show]);

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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
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
        description:
          "Please enter a work title first so AI can write a description.",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      description: `Responsible for managing core assignments, designing execution layouts for ${prev.workTitle}, scaling analytics tracking workflows, and pushing higher delivery standards.`,
    }));
  };

  const handleInsert = async (payload: any) => {
    try {
      setSaving(true);
      const response = await API.post(
        "/api/candidate/accomplishments/add_work_samples",
        payload,
      );

      if (response.status === 200 || response.data?.success) {
        toast({
          title: "Success",
          description: "Work profile saved successfully.",
        });
        setReload();
        onClose();
      }
    } catch (error) {
      console.error("Error inserting work profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save work profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload: any) => {
    try {
      setSaving(true);
      const response = await API.put(
        "/api/candidate/accomplishments/edit_work_samples",
        payload,
      );

      if (response.status === 200 || response.data?.success) {
        toast({
          title: "Success",
          description: "Work profile saved successfully.",
        });
        setReload();
        onClose();
      }
    } catch (error) {
      console.error("Error updating work profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save work profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (formData.workTitle.trim() === "" || formData.url.trim() === "") {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in both the Title and URL fields.",
      });
      return;
    }

    let wrappedDescription = "";
    if (formData.description.trim() !== "") {
      wrappedDescription = "<p>" + formData.description.trim() + "</p>";
    }

    const payload = {
      _id: formData._id || undefined,
      workTitle: formData.workTitle,
      url: formData.url,
      description: wrappedDescription,
      currentlyWorking: formData.currentlyWorking,
      durationFromYear: formData.durationFromYear
        ? Number(formData.durationFromYear)
        : null,
      durationFromMonth: formData.durationFromMonth
        ? Number(formData.durationFromMonth)
        : null,
      durationToYear:
        formData.currentlyWorking || !formData.durationToYear
          ? null
          : Number(formData.durationToYear),
      durationToMonth:
        formData.currentlyWorking || !formData.durationToMonth
          ? null
          : Number(formData.durationToMonth),
    };

    if (formData._id) {
      handleUpdate(payload);
    } else {
      handleInsert(payload);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden rounded-xl border-none shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Work Profiles
          </DialogTitle>
        </div>

        <div className="px-6 py-4 max-h-[75vh] overflow-y-auto space-y-4 text-left">
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
                {Array.from({ length: 25 }, (_, i) => currentYear - i).map(
                  (yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ),
                )}
              </select>

              <select
                name="durationFromMonth"
                value={formData.durationFromMonth}
                onChange={handleInputChange}
                className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Month</option>
                {monthNames.map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!formData.currentlyWorking && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-900 tracking-wide">
                Duration To
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="durationToYear"
                  value={formData.durationToYear}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 25 }, (_, i) => currentYear - i).map(
                    (yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ),
                  )}
                </select>

                <select
                  name="durationToMonth"
                  value={formData.durationToMonth}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-md bg-[#F4F8FA] border-none px-3 text-sm text-gray-600 outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select Month</option>
                  {monthNames.map((m, idx) => (
                    <option key={idx + 1} value={idx + 1}>
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

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-900 tracking-wide">
              Description
            </label>
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <div className="flex items-center gap-1 bg-white border-b border-gray-100 p-1">
                {["B", "I", "U", "S"].map((btn) => (
                  <Button
                    key={btn}
                    type="button"
                    variant="ghost"
                    className="h-7 w-7 p-0 font-serif font-bold text-xs text-gray-700"
                  >
                    {btn === "S" ? (
                      <span className="line-through">S</span>
                    ) : (
                      btn
                    )}
                  </Button>
                ))}
              </div>
              <textarea
                name="description"
                placeholder="Type here ..."
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
              />
            </div>
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

        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="bg-[#6C757D] hover:bg-[#5A6268] text-white hover:text-white rounded-md px-4 h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-md px-5 h-9"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WorkProfileModal;
