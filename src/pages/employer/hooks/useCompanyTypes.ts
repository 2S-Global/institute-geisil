import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
export interface CompanyType {
  _id: string;
  Legal_Structure: string;
  Has_CIN: boolean;
}

export function useCompanyTypes() {
  const [data, setData] = useState<CompanyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyTypes = useCallback(async () => {
    try{
      setLoading(true);
      setError(null);
      const response = await api.get("/api/companyprofile/get_company_types");
      console.log(response.data.data)
      setData(response.data.data);
    }catch(error){
      setError("Failed to fetch company types");
    }finally{
      setLoading(false);
    }
  },[])

  useEffect(() => {
  fetchCompanyTypes();
}, [fetchCompanyTypes]);

  return { data, loading, error };
}


//oldhttps://api.geisil.com/api/companyprofile/get_company_types
//newhttp://localhost:8080/companyprofile/get_company_types