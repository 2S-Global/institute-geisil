import { useEffect, useState } from "react"
import API from "@/lib/axios"

export const getAppliedJobsDetails = (jobId: string) => {
    
const [data , setData] = useState([])
const [isLoading , setIsLoading] = useState(false)
const [error , setError] = useState(null)

const FetchAppliedJobs = async (jobId:string) => {
    try {
        setIsLoading(true)
        const response = await API.get(`/api/jobposting/get_job_preview_details?jobId=${jobId}`)
        setData(response.data)
    } catch (error) {
        setError(error)
        console.log(error)
    } finally {
        setIsLoading(false)
    }
}   



useEffect(() => {
    if (jobId) {
        FetchAppliedJobs(jobId)
    }
}, [jobId])

return {data , isLoading ,error, FetchAppliedJobs}

}