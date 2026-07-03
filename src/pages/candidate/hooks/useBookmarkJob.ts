import { useState, useCallback } from "react";
import API from "@/lib/axios";
import { toast } from "sonner";

export const useBookmarkJob = () => {
  const [bookmarkLoading, setBookmarkLoading] = useState<Record<string, boolean>>({});

  const handleBookmark = useCallback(async (jobId: string, isCurrentlyBookmarked: boolean, onSuccess?: () => void) => {
    setBookmarkLoading((prev) => ({ ...prev, [jobId]: true }));

    try {
      if (isCurrentlyBookmarked) {
        // 🔴 REMOVE saved job
        const res = await API.post(
          "/api/candidate/joblisting/remove_saved_job",
          { savedJobId: jobId }
        );
        if (res.data?.success) {
          toast.success("Removed from saved jobs");
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.data?.message || "Failed to remove job from saved list");
        }
      } else {
        // 🟢 SAVE job
        const res = await API.post(
          "/api/candidate/joblisting/save_job",
          { jobId }
        );
        if (res.data?.success) {
          toast.success("Job saved successfully");
          if (onSuccess) onSuccess();
        } else {
          toast.error(res.data?.message || "Failed to save job");
        }
      }
    } catch (error: any) {
      console.error("Bookmark toggle failed", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  }, []);

  return { handleBookmark, bookmarkLoading };
};
