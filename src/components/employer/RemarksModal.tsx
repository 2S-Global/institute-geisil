import { useState } from "react";
import API from "@/lib/axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RemarksModalProps {
  open: boolean;
  onClose: () => void;
  selectedCandidate: any;
  onSuccess?: () => void;
}

export default function RemarksModal({
  open,
  onClose,
  selectedCandidate,
  onSuccess,
}: RemarksModalProps) {
  const [candidateAppeared, setCandidateAppeared] = useState("");

  const [communicationScore, setCommunicationScore] = useState("");
  const [technicalScore, setTechnicalScore] = useState("");
  const [aptitudeScore, setAptitudeScore] = useState("");
  const [overallScore, setOverallScore] = useState("");

  const [lastDrawnSalary, setLastDrawnSalary] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [remarksMessage, setRemarksMessage] = useState("");

  const [remarksLoading, setRemarksLoading] = useState(false);

  const [remarksErrors, setRemarksErrors] = useState({
    appeared: "",
    communication: "",
    technical: "",
    aptitude: "",
    overall: "",
    lastDrawnSalary: "",
    expectedSalary: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setCandidateAppeared("");
    setCommunicationScore("");
    setTechnicalScore("");
    setAptitudeScore("");
    setOverallScore("");
    setLastDrawnSalary("");
    setExpectedSalary("");
    setRemarksMessage("");

    setRemarksErrors({
      appeared: "",
      communication: "",
      technical: "",
      aptitude: "",
      overall: "",
      lastDrawnSalary: "",
      expectedSalary: "",
      message: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSaveRemarks = async () => {
    let errors = {
      appeared: "",
      communication: "",
      technical: "",
      aptitude: "",
      overall: "",
      lastDrawnSalary: "",
      expectedSalary: "",
      message: "",
    };

    if (!candidateAppeared) {
      errors.appeared = "Please select whether candidate appeared";
      setRemarksErrors(errors);
      return;
    }

    if (candidateAppeared === "no") {
      try {
        setRemarksLoading(true);

        await API.post("/api/jobposting/save_interview_feedback", {
          applicationId: selectedCandidate?._id,
          appeared: false,
        });

        onSuccess?.();
        handleClose();
      } catch (error) {
        console.error(error);
      } finally {
        setRemarksLoading(false);
      }

      return;
    }

    if (!communicationScore)
      errors.communication = "Communication score is required";

    if (!technicalScore) errors.technical = "Technical score is required";

    if (!aptitudeScore) errors.aptitude = "Aptitude score is required";

    if (!overallScore) errors.overall = "Overall score is required";

    if (!lastDrawnSalary)
      errors.lastDrawnSalary = "Last drawn salary is required";

    if (!expectedSalary) errors.expectedSalary = "Expected salary is required";

    setRemarksErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    try {
      setRemarksLoading(true);

      await API.post("/api/jobposting/save_interview_feedback", {
        applicationId: selectedCandidate?._id,
        appeared: true,
        communicationSkillScore: communicationScore,
        technicalSkillScore: technicalScore,
        aptitudeScore,
        overallScore,
        lastDrawnSalary,
        expectedSalary,
        message: remarksMessage,
      });

      onSuccess?.();
      handleClose();
    } catch (error) {
      console.error(error);
    } finally {
      setRemarksLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Interview Remarks - {selectedCandidate?.candidateName}
          </DialogTitle>
        </DialogHeader>

        <div>
          <Label>
            Candidate Appeared
            <span className="text-red-500 ml-1">*</span>
          </Label>

          <div className="flex gap-6 mt-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="candidateAppeared"
                value="yes"
                checked={candidateAppeared === "yes"}
                onChange={() => setCandidateAppeared("yes")}
              />
              Yes
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="candidateAppeared"
                value="no"
                checked={candidateAppeared === "no"}
                onChange={() => {
                  setCandidateAppeared("no");

                  setCommunicationScore("");
                  setTechnicalScore("");
                  setAptitudeScore("");
                  setOverallScore("");
                  setLastDrawnSalary("");
                  setExpectedSalary("");
                  setRemarksMessage("");
                }}
              />
              No
            </label>
          </div>

          {remarksErrors.appeared && (
            <p className="text-sm text-red-500 mt-1">
              {remarksErrors.appeared}
            </p>
          )}
        </div>

        {candidateAppeared === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Communication */}
            <div className="space-y-1">
              <Label>Communication</Label>
              <Input
                type="number"
                placeholder="Score (1-10)"
                value={communicationScore}
                min={1}
                max={10}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value === "") {
                    setCommunicationScore("");
                    return;
                  }
                  const num = Number(value);
                  if (num >= 1 && num <= 10) {
                    setCommunicationScore(value);

                    setRemarksErrors((prev) => ({
                      ...prev,
                      communication: "",
                    }));
                  }
                }}
              />
              {remarksErrors.communication && (
                <p className="text-sm text-red-500">
                  {remarksErrors.communication}
                </p>
              )}
            </div>

            {/* Technical */}
            <div className="space-y-1">
              <Label>Technical Skills</Label>
              <Input
                type="number"
                placeholder="Score (1-10)"
                value={technicalScore}
                min={1}
                max={10}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value === "") {
                    setTechnicalScore("");
                    return;
                  }

                  const num = Number(value);
                  if (num >= 1 && num <= 10) {
                    setTechnicalScore(value);

                    setRemarksErrors((prev) => ({
                      ...prev,
                      technical: "",
                    }));
                  }
                }}
              />
              {remarksErrors.technical && (
                <p className="text-sm text-red-500">
                  {remarksErrors.technical}
                </p>
              )}
            </div>

            {/* Aptitude */}
            <div className="space-y-1">
              <Label>Aptitude</Label>
              <Input
                type="number"
                placeholder="Score (1-10)"
                value={aptitudeScore}
                min={1}
                max={10}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "") {
                    setAptitudeScore("");
                    return;
                  }

                  const num = Number(value);

                  if (num >= 1 && num <= 10) {
                    setAptitudeScore(value);

                    setRemarksErrors((prev) => ({
                      ...prev,
                      aptitude: "",
                    }));
                  }
                }}
              />
              {remarksErrors.aptitude && (
                <p className="text-sm text-red-500">{remarksErrors.aptitude}</p>
              )}
            </div>

            {/* Overall */}
            <div className="space-y-1">
              <Label>Overall Score</Label>
              <Input
                type="number"
                placeholder="Score (1-10)"
                value={overallScore}
                min={1}
                max={10}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value === "") {
                    setOverallScore("");
                    return;
                  }
                  const num = Number(value);
                  if (num >= 1 && num <= 10) {
                    setOverallScore(value);
                    setRemarksErrors((prev) => ({
                      ...prev,
                      overall: "",
                    }));
                  }
                  // setOverallScore(e.target.value);
                }}
              />
              {remarksErrors.overall && (
                <p className="text-sm text-red-500">{remarksErrors.overall}</p>
              )}
            </div>

            {/* Last Drawn Salary */}
            <div className="space-y-1">
              <Label>Last Drawn Salary</Label>
              <Input
                value={lastDrawnSalary}
                onChange={(e) => {
                  setLastDrawnSalary(e.target.value);
                  setRemarksErrors((prev) => ({
                    ...prev,
                    lastDrawnSalary: "",
                  }));
                }}
                placeholder="₹6,50,000 / year"
              />
              {remarksErrors.lastDrawnSalary && (
                <p className="text-sm text-red-500">
                  {remarksErrors.lastDrawnSalary}
                </p>
              )}
            </div>

            {/* Expected Salary */}
            <div className="space-y-1">
              <Label>Expected Salary</Label>
              <Input
                value={expectedSalary}
                onChange={(e) => {
                  setExpectedSalary(e.target.value);
                  setRemarksErrors((prev) => ({
                    ...prev,
                    expectedSalary: "",
                  }));
                }}
                placeholder="₹8,00,000 / year"
              />
              {remarksErrors.expectedSalary && (
                <p className="text-sm text-red-500">
                  {remarksErrors.expectedSalary}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="md:col-span-2 space-y-1">
              <Label>Message</Label>
              <Textarea
                rows={4}
                value={remarksMessage}
                onChange={(e) => setRemarksMessage(e.target.value)}
                placeholder="Enter interview remarks"
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={remarksLoading}
          >
            Cancel
          </Button>

          <Button onClick={handleSaveRemarks} disabled={remarksLoading}>
            {remarksLoading ? "Saving..." : "Save Remarks"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
