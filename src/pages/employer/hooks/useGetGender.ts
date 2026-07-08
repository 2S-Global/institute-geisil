import { useState, useEffect } from "react";
import api from "@/lib/axios";

export interface Gender {
  id: string;
  name: string;
}

export interface GenderResponse {
  success: boolean;
  data: Gender[];
  message: string;
}

export function useGetGender() {
  const [data, setData] = useState<Gender[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchGender = async () => {
      try {
        setLoading(true);
        const response = await api.get<GenderResponse>("/api/sql/dropdown/All_gender");
        if (isMounted) {
          if (response.data && response.data.success) {
            setData(response.data.data || []);
          } else {
            // Fallback for direct array or other response format
            setData((response.data as any) || []);
          }
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGender();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
export default useGetGender;
