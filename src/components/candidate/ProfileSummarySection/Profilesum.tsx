

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Sparkles } from "lucide-react";
import API from "../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const FormModal = ({
  show,
  onClose,
  data = {},
  mainprofilesummary,
  mainsetProfilesummary,
  setError,
  setRefresh,
  setSuccess,
}) => {
  const { toast } = useToast();
  const [profilesummary, setProfilesummary] = useState(
    mainprofilesummary || "",
  );

  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  
  const token = localStorage.getItem("token");

  // Keep local state synced when modal re-opens or prop updates
  useEffect(() => {
    setProfilesummary(mainprofilesummary || "");
    setIsGenerated(false);
  }, [mainprofilesummary, show]);

  if (!token) {
    console.log("No token");
  }

  // Check if current text differs from the original saved value
  const hasChanges = profilesummary !== (mainprofilesummary || "");

  const handleGenerateHeadline = () => {
    if (isGenerated) {
      setProfilesummary(mainprofilesummary || ""); 
      setIsGenerated(false);
    } else {
      setProfilesummary(
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.",
      );
      setIsGenerated(true);
    }
  };

  if (!show) return null;

  const handelSubmit = async () => {
    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setLoading(true);
      const response = await API.post(`/api/useraction/profilesummary`, {
        profileSummary: profilesummary,
      });
      if (response.status === 201) {
        mainsetProfilesummary(profilesummary);
      }
      setSuccess("Profile Summary updated successfully");
      toast({
        title: "Success",
        description: "Profile Summary updated successfully",
      });
      if (setRefresh) {
        setRefresh((prev) => prev + 1);
      }
      onClose();
    } catch (error) {
      console.error("Error uploading data:", error);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Error updating data:",
      });
      setError("Error uploading data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await API.delete(
        `/api/useraction/delete_profile_summary`,
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete record");
      }
      mainsetProfilesummary("");
      if (setRefresh) {
        setRefresh((prev) => prev + 1);
      }
      onClose();
      setError("Profile Summary deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
  };

  return (
    <>
      <style>
        {`
          .custom-textarea::placeholder {
            color: #c7c5c5 !important;
            font-size: 15px !important;
          }

          .suggestion-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            background-color: #e8f0fe;
            color: #1a73e8;
            border-radius: 20px;
            padding: 6px 14px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }

          .suggestion-btn:hover {
            background-color: #d2e3fc;
          }

          .suggestion-btn svg {
            width: 16px;
            height: 16px;
          }
        `}
      </style>

      <Dialog open={show} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center justify-between">
              <span>Profile Summary</span>
              <span className="pr-5">
                {mainprofilesummary && (
                  <Trash2
                    size={18}
                    className="cursor-pointer text-red-500 hover:text-red-600"
                    onClick={handleConfirmDelete}
                  />
                )}
              </span>
            </DialogTitle>

            <DialogDescription>
              Give recruiters a brief overview of the highlights of your career,
              key achievements, and career goals to help recruiters know your
              profile better.
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="space-y-4 pt-2">
            <textarea
              className="w-full rounded-md border p-3 custom-textarea focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Type here..."
              value={profilesummary}
              onChange={(e) => {
                setProfilesummary(e.target.value);
                setIsGenerated(false);
              }}
              maxLength={1000}
              rows={6}
            />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                className="suggestion-btn"
                onClick={handleGenerateHeadline}
              >
                <Sparkles size={16} />
                {isGenerated ? "Revert" : "Help me write"}
              </button>

              <small className="text-right text-xs text-gray-500">
                {1000 - profilesummary.length} character(s) left
              </small>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handelSubmit}
              // Disabled if loading, empty text, OR if no edits were made
              disabled={loading || !profilesummary.trim() || !hasChanges}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormModal;