

import React, { useState, useEffect, ChangeEvent } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import API from "@/lib/axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProjectItem {
  _id?: string;
  project_title?: string;
  project_name?: string;
  title?: string;
  taggedWith?: string;
  client?: string;
  status?: string;
  workfromyear?: string | number;
  workfrommonth?: string | number;
  worktoyear?: string | number;
  worktomonth?: string | number;
  project_description?: string;
  description?: string;
}

interface TagOption {
  _id: string;
  name: string;
}

interface FormDataState {
  _id: string;
  title: string;
  taggedWith: string;
  client: string;
  status: string;
  workfromyear: string;
  workfrommonth: string;
  worktoyear: string;
  worktomonth: string;
  description: string;
}

interface ProjectModalProps {
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  show: boolean;
  onClose: () => void;
  item: ProjectItem | null;
}

const getComparableDateValue = (year: string, month: string): number | null => {
  if (!year || !month) return null;
  return parseInt(year, 10) * 100 + parseInt(month, 10);
};

const ProjectModal: React.FC<ProjectModalProps> = ({
  setReload,
  show,
  onClose,
  item,
}) => {
  const { toast } = useToast();
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [childerror, setChildError] = useState<string | null>(null);
  const [wrongDate, setWrongDate] = useState<boolean>(false);

  const initialTitle = item?.project_title || item?.project_name || item?.title || "";
  const initialDescription = item?.project_description || item?.description || "";

  const [formData, setFormData] = useState<FormDataState>({
    _id: item?._id || "",
    title: initialTitle,
    taggedWith: item?.taggedWith || "",
    client: item?.client || "",
    status: item?.status || "finished",
    workfromyear: item?.workfromyear?.toString() || "",
    workfrommonth: item?.workfrommonth?.toString() || "",
    worktoyear: item?.worktoyear?.toString() || "",
    worktomonth: item?.worktomonth?.toString() || "",
    description: initialDescription,
  });

  useEffect(() => {
    const updatedTitle = item?.project_title || item?.project_name || item?.title || "";
    const updatedDescription = item?.project_description || item?.description || "";

    setFormData({
      _id: item?._id || "",
      title: updatedTitle,
      taggedWith: item?.taggedWith || "",
      client: item?.client || "",
      status: item?.status || "finished",
      workfromyear: item?.workfromyear?.toString() || "",
      workfrommonth: item?.workfrommonth?.toString() || "",
      worktoyear: item?.worktoyear?.toString() || "",
      worktomonth: item?.worktomonth?.toString() || "",
      description: updatedDescription,
    });
    setIsGenerated(false);
  }, [item]);

  const apiurl = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "";
  
  const [tagoptions, setTagoptions] = useState<TagOption[]>([]);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (apiurl) {
      fetchtagoptions();
    }
  }, [apiurl]);

  const fetchtagoptions = async () => {
    try {
      const response = await API.get<{ success: boolean; data: TagOption[] }>(
        `${apiurl}/api/candidate/project/get_project_tag`
      );
      if (response.data.success) {
        setTagoptions(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setFormData((prev) => ({ ...prev, description: "" }));
      setIsGenerated(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        description:
          "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.",
      }));
      setIsGenerated(true);
    }
  };

  useEffect(() => {
    if (formData.status === "in-progress" || formData.status === "currently working") {
      setChildError(null);
      setWrongDate(false);
    } else {
      const startValue = getComparableDateValue(formData.workfromyear, formData.workfrommonth);
      const endValue = getComparableDateValue(formData.worktoyear, formData.worktomonth);

      if (startValue && endValue) {
        if (startValue > endValue) {
          setChildError("End date cannot be before start date.");
          setWrongDate(true);
        } else {
          setChildError(null);
          setWrongDate(false);
        }
      } else {
        setChildError(null);
        setWrongDate(false);
      }
    }
  }, [formData.workfromyear, formData.workfrommonth, formData.worktoyear, formData.worktomonth, formData.status]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const renderYearOptions = (isEndDate: boolean) => {
    return Array.from({ length: 30 }, (_, i) => {
      const year = currentYear - i;
      const yearValue = year.toString();
      const isDisabled = Boolean(
        isEndDate &&
          formData.workfromyear &&
          Number(yearValue) < Number(formData.workfromyear)
      );

      return (
        <option key={year} value={yearValue} disabled={isDisabled}>
          {year}
        </option>
      );
    });
  };

  const generateMonthOptions = (selectedYear: number) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  useEffect(() => {
    setIsFormValid(!!(formData.title && formData.title.trim() !== ""));
  }, [formData.title]);

  useEffect(() => {
    if (!formData.workfromyear || !formData.worktoyear) return;

    const startYear = Number(formData.workfromyear);
    const endYear = Number(formData.worktoyear);

    if (!Number.isNaN(startYear) && !Number.isNaN(endYear) && endYear < startYear) {
      setFormData((prev) => ({
        ...prev,
        worktoyear: "",
        worktomonth: "",
      }));
    }
  }, [formData.workfromyear, formData.worktoyear]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Clear end dates if project is marked ongoing
    const payload = { ...formData };
    if (payload.status === "in-progress" || payload.status === "currently working") {
      payload.worktoyear = "";
      payload.worktomonth = "";
    }

    try {
      if (formData._id) {
        const response = await API.put<{ success: boolean; message: string }>(
          `${apiurl}/api/candidate/project/edit_project_details`,
          payload
        );
        if (response.data.success) {
          toast({
            title: "Success",
            description: response.data.message || "Project details updated successfully.",
          });
          onClose();
          setReload((prev) => !prev); // Fixes UI not updating on modification
        } else {
          toast({
            variant: "destructive",
            title: "Failed to update",
            description: response.data.message,
          });
        }
      } else {
        const response = await API.post<{ success: boolean; message: string }>(
          `${apiurl}/api/candidate/project/add_project_details`,
          payload
        );
        if (response.data.success) {
          toast({
            title: "Success",
            description: response.data.message || "Project added successfully.",
          });
          onClose();
          setReload((prev) => !prev); // Fixes UI not updating on creation
        } else {
          toast({
            variant: "destructive",
            title: "Failed to save",
            description: response.data.message,
          });
        }
      }
    } catch (error) {
      console.error("Error saving details:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while saving. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData._id) return;
    setSaving(true);
    try {
      const response = await API.delete<{ success: boolean; message: string }>(
        `${apiurl}/api/candidate/project/delete_project_details`,
        {
          data: { _id: formData._id },
        }
      );
      if (response.data.success) {
        toast({
          title: "Deleted",
          description: response.data.message || "Project has been deleted.",
        });
        onClose();
        setReload((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative pr-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">Project</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-start gap-4 text-sm text-muted-foreground mt-2">
          <span>
            Stand out for employers by adding details about projects you have done in college, internships, or at work.
          </span>
          {formData._id && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 h-8 w-8 shrink-0"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 my-4">
          <div className="space-y-1.5">
            <label htmlFor="projectTitle" className="text-sm font-medium leading-none">
              Project Title <span className="text-destructive">*</span>
            </label>
            <Input
              type="text"
              id="projectTitle"
              name="title"
              placeholder="Enter project title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          {tagoptions.length > 0 && (
            <div className="space-y-1.5">
              <label htmlFor="projectTag" className="text-sm font-medium leading-none">
                Tag this project with your employment/education
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                id="projectTag"
                name="taggedWith"
                value={formData.taggedWith}
                onChange={handleInputChange}
              >
                <option value="">Select your role/education</option>
                {tagoptions.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="projectClient" className="text-sm font-medium leading-none">Client</label>
            <Input
              type="text"
              id="projectClient"
              name="client"
              placeholder="Enter client name"
              value={formData.client}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none block">Project Status</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="finished"
                  checked={formData.status === "finished"}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
                />
                Finished
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="in-progress"
                  checked={formData.status === "in-progress" || formData.status === "currently working"}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
                />
                In progress / Ongoing
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Worked from</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                name="workfromyear"
                value={formData.workfromyear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workfromyear: e.target.value,
                    workfrommonth: "",
                  }))
                }
              >
                <option value="">Select Year</option>
                {renderYearOptions(false)}
              </select>

              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                name="workfrommonth"
                value={formData.workfrommonth}
                onChange={handleInputChange}
                disabled={!formData.workfromyear}
              >
                <option value="">Select Month</option>
                {formData.workfromyear && generateMonthOptions(parseInt(formData.workfromyear, 10))}
              </select>
            </div>
          </div>

          {(formData.status !== "in-progress" && formData.status !== "currently working") && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium leading-none">Worked till</label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  name="worktoyear"
                  value={formData.worktoyear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      worktoyear: e.target.value,
                      worktomonth: "",
                    }))
                  }
                >
                  <option value="">Select Year</option>
                  {renderYearOptions(true)}
                </select>

                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  name="worktomonth"
                  value={formData.worktomonth}
                  onChange={handleInputChange}
                  disabled={!formData.worktoyear}
                >
                  <option value="">Select Month</option>
                  {formData.worktoyear && generateMonthOptions(parseInt(formData.worktoyear, 10))}
                </select>
              </div>
              {childerror && <p className="text-xs font-medium text-destructive mt-1">{childerror}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
              placeholder="Type here ..."
              rows={3}
              name="description"
              value={formData.description}
              onChange={(e) => {
                handleInputChange(e);
                setIsGenerated(false);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full gap-1.5 text-primary bg-primary/5 border-primary/20 hover:bg-primary/10"
              onClick={handleGenerateHeadline}
            >
              <Sparkles className="h-4 w-4" />
              {isGenerated ? "Clear" : "Help me write"}
            </Button>
          </div>
        </form>

        <DialogFooter className="flex items-center gap-2 sm:justify-end border-t pt-4 mt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          
          <div className="relative group">
            {!isFormValid && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover text-destructive text-xs font-semibold border border-destructive rounded px-2.5 py-1 whitespace-nowrap shadow-md z-50">
                Please fill all required fields
              </div>
            )}
            {isFormValid && wrongDate && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-popover text-destructive text-xs font-semibold border border-destructive rounded px-2.5 py-1 whitespace-nowrap shadow-md z-50">
                Please enter a valid date
              </div>
            )}
            <Button
              type="button"
              onClick={handleSave}
              disabled={!isFormValid || saving || wrongDate}
              className="w-full sm:w-auto"
            >
              {formData._id ? (saving ? "Updating..." : "Update") : (saving ? "Saving..." : "Save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;