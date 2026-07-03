import api from "@/lib/axios";
import { useState, useCallback } from "react";

//Accept/Reject Interview Invitation
export const useAcceptInterviewInvitation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const acceptInterview = useCallback(
    async (applicationId: string, jobId: string, accept: boolean) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await api.post("/api/jobposting/accept_interview_invitation", {
          applicationId,
          jobId,
          accept,
        });
        setSuccess(res.data?.success || true);
        return res.data;
      } catch (err: any) {
        console.error("Error accepting interview invitation:", err);
        setError(err.response?.data?.message || err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { acceptInterview, loading, error, success };
};

//Accept/Reject Offer Letter
export const useAcceptRejectOfferLetter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const acceptRejectOffer = useCallback(
    async (applicationId: string, isAccepted: boolean) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await api.post("/api/jobposting/accept_reject_offer_letter", {
          applicationId,
          accept: isAccepted,
        });
        setSuccess(res.data?.success || true);
        return res.data;
      } catch (err: any) {
        console.error("Error updating offer letter status:", err);
        setError(err.response?.data?.message || err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { acceptRejectOffer, loading, error, success };
};

//Request Reschedule by Candidate
export const useRequestReschedule = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const requestReschedule = useCallback(
    async (
      applicationId: string,
      requestDate: string,
      requestStartTime: string,
      requestEndTime: string
    ) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const res = await api.post("/api/jobposting/request_reschedule_by_candidate", {
          applicationId,
          requestDate,
          requestStartTime,
          requestEndTime,
        });
        setSuccess(res.data?.success || true);
        return res.data;
      } catch (err: any) {
        console.error("Error requesting reschedule:", err);
        setError(err.response?.data?.message || err.message || "Something went wrong");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { requestReschedule, loading, error, success };
};
