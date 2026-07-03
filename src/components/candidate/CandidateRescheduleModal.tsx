import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRequestReschedule } from "@/pages/candidate/hooks/useCandidateOptions";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface CandidateRescheduleModalProps {
  open: boolean;
  onClose: () => void;
  applicationId: string;
  jobTitle?: string;
  companyName?: string;
  onSuccess: () => void;
}

export default function CandidateRescheduleModal({
  open,
  onClose,
  applicationId,
  jobTitle,
  companyName,
  onSuccess,
}: CandidateRescheduleModalProps) {
  const { requestReschedule, loading, error } = useRequestReschedule();

  const [requestDate, setRequestDate] = useState("");
  const [requestStartTime, setRequestStartTime] = useState("");
  const [requestEndTime, setRequestEndTime] = useState("");

  const { toast } = useToast()


  const [errors, setErrors] = useState({
    requestDate: "",
    requestStartTime: "",
    requestEndTime: "",
  });

  const handleRequest = async () => {
    const newErrors = {
      requestDate: "",
      requestStartTime: "",
      requestEndTime: "",
    };

    let isValid = true;

    if (!requestDate) {
      newErrors.requestDate = "Proposed date is required";
      isValid = false;
    }

    if (!requestStartTime) {
      newErrors.requestStartTime = "Start time is required";
      isValid = false;
    }

    if (!requestEndTime) {
      newErrors.requestEndTime = "End time is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    try {
      const result = await requestReschedule(
        applicationId,
        requestDate,
        requestStartTime,
        requestEndTime
      );

      if (result?.success || result) {
        onSuccess();
        onClose();
        // Reset states
        setRequestDate("");
        setRequestStartTime("");
        setRequestEndTime("");
      }
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to request reschedule.",
      });
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
          <DialogTitle>Request Interview Reschedule</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {(jobTitle || companyName) && (
            <div className="text-sm border-b pb-3 mb-2">
              {jobTitle && (
                <p>
                  <span className="font-semibold">Role:</span> {jobTitle}
                </p>
              )}
              {companyName && (
                <p className="mt-1">
                  <span className="font-semibold">Company:</span> {companyName}
                </p>
              )}
            </div>
          )}

          {/* {error && (
            <p className="text-sm text-red-500 bg-red-50 p-2.5 rounded border border-red-200">
              {error}
            </p>
          )} */}

          <div className="space-y-2">
            <label className="text-sm font-medium">Proposed Date</label>
            <Input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={requestDate}
              className={errors.requestDate ? "border-red-500" : ""}
              style={{ position: "relative" }}
              onChange={(e) => {
                setRequestDate(e.target.value);
                setErrors((prev) => ({
                  ...prev,
                  requestDate: "",
                }));
              }}
            />
            {errors.requestDate && (
              <p className="text-sm text-red-500">{errors.requestDate}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Available From</label>
              <Input
                type="time"
                value={requestStartTime}
                className={errors.requestStartTime ? "border-red-500" : ""}
                onChange={(e) => {
                  setRequestStartTime(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    requestStartTime: "",
                  }));
                }}
              />
              {errors.requestStartTime && (
                <p className="text-sm text-red-500">{errors.requestStartTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Available Until</label>
              <Input
                type="time"
                value={requestEndTime}
                className={errors.requestEndTime ? "border-red-500" : ""}
                onChange={(e) => {
                  setRequestEndTime(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    requestEndTime: "",
                  }));
                }}
              />
              {errors.requestEndTime && (
                <p className="text-sm text-red-500">{errors.requestEndTime}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button  loading={loading} onClick={handleRequest} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
