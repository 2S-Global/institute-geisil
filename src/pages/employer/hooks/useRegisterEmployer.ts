import { useState, useCallback } from "react";
import api from "@/lib/axios";



// company_type
// : 
// "6939031d982dce2468347cf5"
// email
// : 
// "techgrrat@gmail.com"
// name
// : 
// "tech great"
// password
// : 
// "Mohanop@007"
// phone_number
// : 
// "916295631554"


export type EmployerType = {
  company_type : String
  email : String
  name : String
  password : String
  phone_number : String
}


export function useRegisterEmployer() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const registerEmployer = useCallback(async (payload: EmployerType) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      const response = await api.post("/api/auth/company-register", payload);
      setSuccess(true);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Employer registration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { registerEmployer, loading, error, success };
}
