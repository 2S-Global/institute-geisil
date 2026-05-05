import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
const ProtectedRoute = ({ children, role }: any) => {
  const { user,setLogin } = useAuth();
useEffect(()=>{
    setLogin();
},[setLogin])
 /*  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  } */

  return children;
};

export default ProtectedRoute;