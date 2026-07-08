import { useState, useCallback } from "react";
import api from "@/lib/axios";

// dob
// : 
// "21-12-2004"
// email
// : 
// "jhsd@gmail.com"
// father_name
// : 
// "dsd"
// name
// : 
// "wq"
// password
// : 
// "MOhanop@007"
// phone_number
// : 
// "916295631554"



export type Candidatetype = {
  dob: string;
  email: string;
  father_name: string;
  name: string;
  password: string;
  phone_number: string;
}




export function useRegisterCandidate() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const registerCandidate = useCallback(async (payload: Candidatetype) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await api.post("/api/auth/register", payload);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Candidate registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerCandidate, loading, error, success };
}
