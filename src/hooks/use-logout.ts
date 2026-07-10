import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";

export function useLogout() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Backend logout API
      await api.post("/api/auth/logout", {}, { withCredentials: true });

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear normal cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });

      // Redirect
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { logout };
}
