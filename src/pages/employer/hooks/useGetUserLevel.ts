import { useState, useEffect } from "react";
import api from "@/lib/axios";

export interface UserLevel {
  id: number;
  level: string;
  duration: number;
  type?: string;
}

export interface UserLevelResponse {
  message: string;
  data: UserLevel[];
}

export function useGetUserLevel() {
  const [data, setData] = useState<UserLevel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUserLevel = async () => {
      try {
        setLoading(true);
        const response = await api.get<UserLevelResponse>("/api/userdata/get_user_level");
        if (isMounted) {
          if (response.data && response.data.data) {
            setData(response.data.data);
          } else {
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

    fetchUserLevel();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
export default useGetUserLevel;
