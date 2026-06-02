import { Navigate,Outlet,useLocation,useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
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
if (!localStorage.getItem("token")) {
   window.location.replace("https://geisil.com/");
  }

  if (localStorage.getItem("token") && localStorage.getItem("role" )!==role) {
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