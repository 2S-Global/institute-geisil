import api from "@/lib/axios"
import { useEffect, useState, useCallback } from "react"

export const useGetAppliedJobs = () => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<any>(null)

  const fetchAppliedJobs = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get("/api/jobposting/get_all_my_applied_job")
      if (res.data.success) {
        setData(res.data.data || [])
      } else {
        setError(res.data.message || "Failed to fetch applied jobs")
      }
    } catch (err: any) {
      console.error(err)
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppliedJobs()
  }, [fetchAppliedJobs])

  return {
    data,
    loading,
    error,
    refetch: fetchAppliedJobs
  }
}