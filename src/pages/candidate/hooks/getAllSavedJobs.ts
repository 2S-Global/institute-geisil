import api from "@/lib/axios"
import { useCallback, useEffect, useState } from "react"


export interface JobData {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  jobExpiryDate: string;
  logo: string;
  jobSkills: string[];
  specialization: string[];
  jobType: string[];
  positionAvailable: string;
  jobExperienceLevel: string;
  salary: {
    structure: string;
    currency: string;
    min: number;
    max: number;
    amount: number | null;
    rate: string;
  };
}

interface SavedJob {
  savedJobId: string;
  savedAt: string;
  job: JobData;
}



export const useGetAllSavedJobs = () => {
 

    
    const [data , setData] = useState<SavedJob[]>([])
    const [totalApplied, setTotalApplied] = useState<number>(0)
    const [isLoading , SetIsLoading] = useState(false)
    const [error , SetError] = useState(null)

    const fetchAllSavedJobs =useCallback( async(silent?: boolean)=> {

        
    try {
    if (!silent) SetIsLoading(true)

     const res = await api.get("/api/candidate/joblisting/get_saved_job")
      if (res.data.success) {
        setData(res.data.data)
        setTotalApplied(res.data.totalApplied || 0)
      }
    
   } catch (error) {
    SetError(error)
   }finally{
    if (!silent) SetIsLoading(false)
   }


    },[])


    useEffect(()=>{
        fetchAllSavedJobs()
    },[fetchAllSavedJobs])
  


   return { data , isLoading  , error , fetchAllSavedJobs, totalApplied }

}
