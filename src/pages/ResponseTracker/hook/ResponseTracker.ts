import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export interface UserInfo {
  _id: string;
  name: string;
  profilePicture?: string;
  email: string;
  phone_number?: string;
}

export interface ExternalApiLog {
  _id: string;
  userId?: UserInfo | string;
  provider: string;
  service: string;
  endpoint: string;
  status: "SUCCESS" | "TIMEOUT" | "FAILED";
  httpStatus?: number;
  errorMessage?: string;
  durationMs: number;
  createdAt: string;
  updatedAt: string;
}

export const useResponseTracker = (initialLimit = 10) => {
  const [logs, setLogs] = useState<ExternalApiLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalLogs, setTotalLogs] = useState<number>(0);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/tracker", {    
        params: {
          page,
          limit,
          userId: userIdFilter || undefined,
          status: statusFilter || undefined,
          startDate: startDateFilter || undefined,
          endDate: endDateFilter || undefined,
        },
      });

      if (response.data?.success) {
        const data = response.data.data;
        if (data && typeof data === 'object' && 'apiResponses' in data) {
          setLogs(data.apiResponses || []);
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages || 1);
            setTotalLogs(data.pagination.totalLogs || 0);
          } else {
            setTotalPages(data.totalPages || 1);
            setTotalLogs(data.totalLogs || 0);
          }
        } else {
          setLogs(Array.isArray(data) ? data : []);
          setTotalPages(1);
          setTotalLogs(Array.isArray(data) ? data.length : 0);
        }
      } else {
        throw new Error(response.data?.message || "Failed to fetch logs");
      }
    } catch (err) {
      console.error("Failed to load api tracker logs:", err);
      setError(err);
      toast({
        title: "Error",
        description:
          err.response?.data?.message ||
          err.message ||
          "Failed to load api tracker logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, limit, userIdFilter, statusFilter, startDateFilter, endDateFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSetStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSetStartDateFilter = (date: string) => {
    setStartDateFilter(date);
    setPage(1);
  };

  const handleSetEndDateFilter = (date: string) => {
    setEndDateFilter(date);
    setPage(1);
  };

  const handleSetUserIdFilter = (userId: string) => {
    setUserIdFilter(userId);
    setPage(1);
  };

  return {
    logs,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    userIdFilter,
    setUserIdFilter: handleSetUserIdFilter,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
    startDateFilter,
    setStartDateFilter: handleSetStartDateFilter,
    endDateFilter,
    setEndDateFilter: handleSetEndDateFilter,
    totalPages,
    totalLogs,
    refresh: fetchLogs,
  };
};
