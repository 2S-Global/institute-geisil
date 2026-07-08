import { useState, useCallback } from "react";
import API from "@/lib/axios";
import { toast } from "sonner";

export const useBookmarkCandidate = () => {
  const [bookmarkLoading, setBookmarkLoading] = useState<Record<string, boolean>>({});

  const handleBookmark = useCallback(async (candidateId: string, isCurrentlyBookmarked: boolean, onSuccess?: () => void) => {
    setBookmarkLoading((prev) => ({ ...prev, [candidateId]: true }));

    try {
      const res = await API.post(
        "/api/candidatebookmark/add_candidate_bookmark",
        { _id: candidateId, bookmark: !isCurrentlyBookmarked }
      );
      if (res.data?.success) {
        toast.success(res.data?.message || `Candidate ${!isCurrentlyBookmarked ? "bookmarked" : "unbookmarked"} successfully`);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.data?.message || "Failed to toggle bookmark");
      }
    } catch (error: any) {
      console.error("Bookmark toggle failed", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setBookmarkLoading((prev) => ({ ...prev, [candidateId]: false }));
    }
  }, []);

  return { handleBookmark, bookmarkLoading };
};
