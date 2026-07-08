import { useState, useCallback } from "react";
import api from "@/lib/axios";


export type Institutetype ={
  
  email : String,
  name : String,
  password : String,
  phone_number : String,
}

export function useRegisterInstitute() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const registerInstitute = useCallback(async (payload: Institutetype) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      // Using standard endpoint /api/auth/register-institute as requested
      const response = await api.post("/api/auth/register-institute", payload);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Institute registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerInstitute, loading, error, success };
}
