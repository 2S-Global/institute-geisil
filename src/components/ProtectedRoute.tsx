import { Navigate,Outlet,useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "./context/AuthContext";
import { useEffect,useState } from "react";
const ProtectedRoute = ({ children, role }: any) => {
/*   const { user,setLogin } = useAuth();
useEffect(()=>{
    setLogin();
},[setLogin]) */
 /*  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  } */
/* if(localStorage.getItem("token" ) && localStorage.getItem("role" )!==role){
        return <Navigate to="/unauthorized" replace />
    }

  return children; */
 const location = useLocation();

  const token =
    localStorage.getItem("token") ||
    Cookies.get("token");

  const userRole = localStorage.getItem("role");

  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (role && userRole !== role) {
    return (
      <Navigate
        to="/unauthorized"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};



export default ProtectedRoute;