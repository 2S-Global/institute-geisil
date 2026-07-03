import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import API from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

interface RescheduleInterviewModalProps {
  open: boolean;
  onClose: () => void;
  selectedCandidate: any;
  interviewDate: string;
  setInterviewDate: (value: string) => void;
  interviewTime: string;
  setInterviewTime: (value: string) => void;
  onSuccess: () => void;
}

export default function RescheduleInterviewModal({
  open,
  onClose,
  selectedCandidate,
  interviewDate,
  setInterviewDate,
  interviewTime,
  setInterviewTime,
  onSuccess,
}: RescheduleInterviewModalProps) {
  const [errors, setErrors] = useState({
    interviewDate: "",
    interviewTime: "",
  });

  const { toast } = useToast()

  const [loading, setLoading] = useState(false);

  const handleReschedule = async () => {
    const newErrors = {
      interviewDate: "",
      interviewTime: "",
    };

    let isValid = true;

    if (!interviewDate) {
      newErrors.interviewDate = "Interview date is required";
      isValid = false;
    }

    if (!interviewTime) {
      newErrors.interviewTime = "Interview time is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      setLoading(true);

      const response = await API.patch("api/jobposting/accept_shortlisted_candidates_reschedule", {
        applicationId: selectedCandidate._id,
        interviewDate,
        interviewTime,
      });

      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      // alert(error?.response?.data?.message || "Failed to reschedule interview");
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to reschedule interview",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reschedule Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm">
              <span className="font-semibold">Candidate:</span>{" "}
              {selectedCandidate?.candidateName}
            </p>

            <p className="text-sm mt-2">
              <span className="font-semibold">Designation For:</span>{" "}
              {selectedCandidate?.jobTitle}
            </p>
          </div>

          {selectedCandidate?.requestReschedule && (
            <div className="rounded-md border bg-muted p-3">
              <p className="text-sm">
                <strong>Requested Date:</strong>{" "}
                {new Date(selectedCandidate.requestDate).toLocaleDateString()}
              </p>

              <p className="text-sm mt-1">
                <strong>Available Time:</strong>{" "}
                {selectedCandidate.requestStartTime} -{" "}
                {selectedCandidate.requestEndTime}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Date</label>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={interviewDate}
              className={`w-full rounded-md border px-3 py-2 ${errors.interviewDate ? "border-red-500" : "border-input"
                }`}
              style={{ position: "relative" }}
              onChange={(e) => {
                setInterviewDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  interviewDate: "",
                }));
              }}
            />

            {errors.interviewDate && (
              <p className="text-sm text-red-500">{errors.interviewDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interview Time</label>

            <input
              type="time"
              value={interviewTime}
              className={`w-full rounded-md border px-3 py-2 ${errors.interviewTime ? "border-red-500" : "border-input"
                }`}
              onChange={(e) => {
                setInterviewTime(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  interviewTime: "",
                }));
              }}
            />

            {errors.interviewTime && (
              <p className="text-sm text-red-500">{errors.interviewTime}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleReschedule} disabled={loading}>
            {loading ? "Rescheduling..." : "Reschedule Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
