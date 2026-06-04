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
interface InterviewInvitationModalProps {
  open: boolean;
  onClose: () => void;
  selectedCandidate: any;
  interviewDate: string;
  setInterviewDate: (value: string) => void;
  interviewTime: string;
  setInterviewTime: (value: string) => void;
  onSuccess: () => void;
}

export default function InterviewInvitationModal({
  open,
  onClose,
  selectedCandidate,
  interviewDate,
  setInterviewDate,
  interviewTime,
  setInterviewTime,
  onSuccess,
}: InterviewInvitationModalProps) {
  const [errors, setErrors] = useState({
    interviewDate: "",
    interviewTime: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
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

      const response = await API.patch(
        "/api/jobposting/accept_shortlisted_candidates",
        {
          applicationId: selectedCandidate._id,
          interviewDate,
          interviewTime,
        },
      );

      if (response.data.success) {
        onSuccess(); // refresh parent data
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to send invitation");
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
          <DialogTitle>Send Interview Invitation</DialogTitle>
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

          <div className="space-y-2">
            <label htmlFor="interviewDate" className="text-sm font-medium">
              Interview Date
            </label>

            <input
              id="interviewDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={interviewDate}
              style={{ position: "relative" }}
              className={`w-full h-10 rounded-md border px-3 text-sm appearance-none ${
                errors.interviewDate ? "border-red-500" : "border-input"
              }`}
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

          <div>
            <label className="text-sm font-medium">Interview Time</label>
            <input
              type="time"
              value={interviewTime}
              className={`mt-1 w-full rounded-md border p-2 ${
                errors.interviewTime ? "border-red-500" : ""
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

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSend} disabled={loading}>
            {loading ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
