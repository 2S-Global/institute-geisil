import { useEffect } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
const Loading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
      if(localStorage.getItem("role" )==='2'){
        navigate('/employer')
      }
      if(localStorage.getItem("role" )==='3'){
        navigate('/institute')
      }

}, [navigate]); 


  return (
   <>
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-10">
        {/*   <h1 className="text-5xl font-bold text-white tracking-tight">
            MyApp
          </h1> */}
          {/* <p className="text-slate-400 mt-3">
            Loading your workspace...
          </p> */}
        </div>

        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-indigo-500 animate-spin"></div>

          {/* Center Glow */}
          <div className="absolute inset-5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 blur-md opacity-70"></div>
        </div>

        {/* Loading Text */}
        <div className="mt-8">
          <p className="text-white text-lg font-medium">Loading</p>

          <div className="flex justify-center gap-2 mt-3">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
            <span
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>

        {/* Progress Bar */}
       {/*  <div className="w-72 h-2 bg-white/10 rounded-full overflow-hidden mt-8 mx-auto">
          <div className="h-full w-1/2 bg-gradient-to-r from-cyan-400 to-indigo-500 animate-pulse rounded-full"></div>
        </div> */}
      </div>
    </div>
   
   </>
  );
};

export default Loading;
