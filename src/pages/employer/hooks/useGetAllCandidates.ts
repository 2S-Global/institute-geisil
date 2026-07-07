import { useState, useEffect } from "react";
import api from "@/lib/axios";

export interface Candidate {
  id: string;
  name: string;
  title?: string;
  location?: string;
  experience?: number;
  education?: string;
  skills?: string[];
  match?: number;
  salary?: string;
  availability?: string;
  workMode?: string;
  category?: string;
  featured?: boolean;
  [key: string]: any;
}

export interface AllCandidatesResponse {
  success?: boolean;
  data: Candidate[];
  message?: string;
}

export function useGetAllCandidates<T = Candidate>() {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await api.get<any>("/api/candidate/candidateDetails/get_all_candidates");
        if (isMounted) {
          if (response.data && response.data.data) {
            setData(response.data.data);
          } else if (Array.isArray(response.data)) {
            setData(response.data);
          } else {
            setData([]);
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

    fetchCandidates();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}

export default useGetAllCandidates;
