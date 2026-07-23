import api from "@/lib/axios"
import { useCallback, useState } from "react"

export const useHandleProfilePictureRemove = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [data, setData] = useState<string>("")

  const removeImage = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await api.delete("/api/useraction/remove-profile-picture")
      const message = response.data?.message || "Profile picture removed successfully"
      setData(message)
      return { success: true, message }
    } catch (err: any) {
      console.error(err)
      const errMsg = err?.response?.data?.message || err?.message || "Failed to remove profile picture"
      setError(errMsg)
      return { success: false, error: errMsg }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    removeImage,
    isLoading,
    error,
    data
  }
}