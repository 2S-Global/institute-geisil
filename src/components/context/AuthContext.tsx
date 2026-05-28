import { createContext, useContext ,useState} from "react";
import Cookies from "js-cookie";
import api from "@/lib/axios";
const AuthContext = createContext<any>(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: any) => {
   
const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });


  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
     /*  let newData={
          token:res?.data?.token,
          user:{
            role:res?.data?.data.role,
            isAuthenticated:  res?.data?.data.role?true:false,
        }
      } */

      let newData={
          token:'',
          user:{
            role:2,
            isAuthenticated:  true,
        }
      }
     // const { token, user } = res.data;
      const { token, user } = newData

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const setLogin = () => {
    try {
      const token = Cookies.get("token");
      if(token){
           localStorage.setItem("user", token);
      }
      setUser(user);
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{   
        user,
        login,
        logout,
        setLogin,
        isAuthenticated: !!user, }}>
      {children}
    </AuthContext.Provider>
  );
};