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
import { Sparkles, X, Pencil } from "lucide-react";
const ResumeHeadline = ({
  show,
  onClose,
  mainresumeHeadline,
  mainsetResumeHeadline,
  setError,
  setSuccess,
  setRefresh
}) => {
  const apiurl = import.meta.env.VITE_API_URL;
  console.log("show", show);
  const { toast } = useToast();
  const [resumeHeadline, setResumeHeadline] = useState(
    mainresumeHeadline || "",
  );
  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token");
  }
  //if (!show) return null;

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setResumeHeadline(""); // Clear text if pressed again
      setIsGenerated(false);
    } else {
      setResumeHeadline(
        "Experienced Software Developer skilled in React, Node.js, and system design.",
      );
      setIsGenerated(true);
    }
  };

  const handelSubmit = async () => {
    console.log("submit");
    console.log(resumeHeadline);
    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await API.post(`/api/useraction/resumeheadline`, {
        resumeHeadline: resumeHeadline,
      });
      if (response.status === 201) {
        mainsetResumeHeadline(resumeHeadline);
        setSuccess("Resume Headline updated successfully");
        if (setRefresh) {
          setRefresh((prev) => prev + 1);
        }
        toast({
          title: "Success",
          description: "Resume Headline updated successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Error updating data:",
      });
      console.error("Error updating data:", error);
    }
    onClose();
  };
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        {/* Modal */}
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Resume Headline
            </h2>

            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p className="mb-4 text-sm leading-6 text-gray-700">
              It is the first thing recruiters notice in your profile. Write a
              concise headline introducing yourself to employers. (Minimum 5
              words)
            </p>

            <div className="relative">
              <textarea
                value={resumeHeadline}
                onChange={(e) => {
                  setResumeHeadline(e.target.value);
                  setIsGenerated(false);
                }}
                maxLength={250}
                placeholder="Minimum 5 words. Sample headlines: Sales Manager well versed in Excel and Dynamics CRM. Senior-level Interior Designer with expertise in 3D modeling."
                className="h-28 w-full rounded-lg border border-gray-300 px-4 py-3 pb-12 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-1 flex justify-between">
                {/* AI Button */}
                
                  <button
                    onClick={handleGenerateHeadline}
                    className="bottom-3 left-3 flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isGenerated ? "Clear" : "Help me write"}
                  </button>
              
                  {/* Character Count */}
                  <span className="text-right text-xs text-gray-500">
                    {250 - resumeHeadline.length} character(s) left
                  </span>
              
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <Button
              variant="outline"
              onClick={onClose}
             
            >
              Cancel
            </Button>

            <Button
              onClick={handelSubmit}
              disabled={resumeHeadline.trim().split(/\s+/).length < 5}
              
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumeHeadline;


