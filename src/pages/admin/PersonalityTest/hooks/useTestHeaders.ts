import { useEffect, useState } from "react"

import api from "@/lib/axios"

export const useTestHeaders = ()=>{
    const [data, setData] = useState([])
    const [loading, isLoading] = useState(false)
    const [error, setError] = useState(false)


    const getData = async()=>{
        isLoading(true)
            try{
                const response = await api.get(`/api/mental-feedback/get-all-test-header`)
                setData(response.data.data)
            }catch(error){
                setError(error)
            }finally{
                isLoading(false)
            }
        }

    useEffect(() => {
       
        
        getData()
    }, [])

    return {
        data,
        loading,
        error
    }
}