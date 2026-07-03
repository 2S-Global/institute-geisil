import { useState, useCallback } from "react";
import API from "@/lib/axios";

export const useApplyJob = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const applyJob = useCallback(async (jobId: string, applyData: any) => {
    setLoading(true);
    setError(null);
    setData(null);

    // const token = localStorage.getItem("candidate_token");
    // if (!token) {
    //   const errMessage = "Authentication required. Please login.";
    //   setError(errMessage);
    //   setLoading(false);
    //   throw new Error(errMessage);
    // }

    try {
      const res = await API.post(
        `/api/jobposting/apply-job-application?jobId=${jobId}`,
        applyData,
      );
      setData(res.data);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.error(err);
      const errMessage = err.response?.data?.message || err.message || "Something went wrong";
      setError(errMessage);
      setLoading(false);
      throw new Error(errMessage);
    }
  }, []);

  return { applyJob, loading, error, data };
};
