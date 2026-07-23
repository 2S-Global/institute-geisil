import { useState, useEffect, useCallback } from "react";
import API from "@/lib/axios";

export const useProfileMetrics = (refreshTrigger = 0) => {
  const [profileProgress, setProfileProgress] = useState<number>(0);
  const [geisilScore, setGeisilScore] = useState<number>(0);
  const [cibilScore, setCibilScore] = useState<number>(0);

  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const [scoresLoading, setScoresLoading] = useState<boolean>(true);

  // Fetch User Progress Data
  const fetchUserData = useCallback(async () => {
    try {
      setProfileLoading(true);
      const userDataRes = await API.get("api/userdata/userdata");
      const progressValue =
        userDataRes.data?.progress ?? userDataRes.data?.data?.progress ?? 0;
      setProfileProgress(Number(progressValue) || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Fetch Scores Data
  const fetchScoresData = useCallback(async () => {
    try {
      setScoresLoading(true);
      const scoreRes = await API.get("api/userdata/getscore");
      const resData = scoreRes.data?.data || scoreRes.data || {};

      const scoreValue = resData.GeisilScore ?? resData.score ?? 0;
      const cibilValue = resData.CibilScore ?? 0;

      setGeisilScore(Number(scoreValue) || 0);
      setCibilScore(Number(cibilValue) || 0);
    } catch (error) {
      console.error("Error fetching scores data:", error);
    } finally {
      setScoresLoading(false);
    }
  }, []);

  // Combined fetch handler
  const refetchAll = useCallback(() => {
    fetchUserData();
    fetchScoresData();
  }, [fetchUserData, fetchScoresData]);

  // Re-fetch automatically when refreshTrigger updates
  useEffect(() => {
    refetchAll();
  }, [refetchAll, refreshTrigger]);

  return {
    profileProgress,
    geisilScore,
    cibilScore,
    profileLoading,
    scoresLoading,
    refetchAll,
  };
};