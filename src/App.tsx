import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import API from "@/lib/axios";
import { useEffect,useState } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Route, Routes ,useNavigate} from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Students from "./pages/Students.tsx";
import ManageCourses from "./pages/ManageCourses.tsx";
import StudentSearch from "./pages/SearchStudent.tsx";
import StudentDetail from "./pages/StudentDetail.tsx";
import AllStudentList from "./pages/allStudentList.tsx";
import Recruiters from "./pages/Recruiters.tsx";
import RecruiterDetail from "./pages/RecruiterDetail.tsx";
import Evaluations from "./pages/Evaluations.tsx";
import EvaluationDetail from "./pages/EvaluationDetail.tsx";
import Placements from "./pages/Placements.tsx";
import PlacementDetail from "./pages/PlacementDetail.tsx";
import Reports from "./pages/Reports.tsx";
import ReportDetail from "./pages/ReportDetail.tsx";
import Faculty from "./pages/Faculty.tsx";
import FacultyDetail from "./pages/FacultyDetail.tsx";
import Settings from "./pages/Settings.tsx";
import StudentVerification from "./pages/StudentVerification.tsx";
import InstituteProfile from "./pages/InstituteProfile.tsx";
import InstituteProfileDetails from "./pages/InstituteProfileDetails.tsx";
import EmployerDashboard from "./pages/employer/EmployerDashboard.tsx";
import Jobs from "./pages/employer/Jobs.tsx";
import JobDetail from "./pages/employer/JobDetail.tsx";
import Candidates from "./pages/employer/Candidates.tsx";
import CandidateDetail from "./pages/employer/CandidateDetail.tsx";
import Applications from "./pages/employer/Applications.tsx";
import Interviews from "./pages/employer/Interviews.tsx";
import Assessments from "./pages/employer/Assessments.tsx";
import EmployerReports from "./pages/employer/Reports.tsx";
import Company from "./pages/employer/Company.tsx";
import EmployerSettings from "./pages/employer/Settings.tsx";
import CompanyProfile from "./pages/employer/CompanyProfile.tsx";
import PostNewJob from "./pages/employer/PostNewJob.tsx";
import ReviewJobs from "./pages/employer/ReviewJobs.tsx";
import ReviewEditJobs from "./pages/employer/ReviewEditJobs.tsx";
import PostEditJob from "./pages/employer/PostEditJob.tsx";
import { AuthProvider } from "@/components/context/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import VerifyEmployee from "./pages/employer/VerifyEmployee.tsx";
import PayNow from "./pages/employer/PayNow.tsx";
import AadharVerification from "./pages/employer/AadharVerification.tsx";
import DownloadCenter from "./pages/employer/DownloadCenter";
import VerificationDetails from "./pages/employer/VerificationDetails.tsx";
import VerifiedDetailsPage from "./pages/employer/VerifiedDetailsPage.tsx";
import VerifiedAadharPage from "./pages/employer/VerifiedAadharPage.tsx";
import EmployeeVerification from "./pages/employer/EmployeeVerification.tsx";
import NotFound from "./pages/NotFound.tsx";
import Loading from "./pages/Loading.tsx";
import Unauthorized from "./pages/Unauthorized.tsx";

const queryClient = new QueryClient();
const App = ()=>{ 
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);
  const [isSuccess, setSuccess] = useState(false);
   const FetchCompanyDetails = async () => {
    try {
      const response = await API.get(
        `/api/auth/get-user-details`,
      );

      if (response.data.success) {
         const data = response.data.data;
         localStorage.setItem("role",data?.role)
         setProfile(data);
         setSuccess(true);
        //setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } 
  };
  useEffect(()=>{
         const token = Cookies.get("token");
          if(token){
              localStorage.setItem("token", token);
          }
        FetchCompanyDetails()
  },[])

   useEffect(()=>{
    if(isSuccess){
          localStorage.setItem("name",profile?.name||localStorage.getItem("name"))
          localStorage.setItem("role",profile?.role||localStorage.getItem("role"))
          setLoading(false)
    }
            
  },[profile])


 if (loading) {
    return  <>
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
  } 
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
       
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<NotFound />} /> */}
           {/*  <Route path="/login" element={<Login />} /> */}

             <Route path="/" element={<Loading />} />

             <Route path="/institute/*" element={
              <ProtectedRoute role="3">
                 <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/students/:id" element={<StudentDetail />} />
                    <Route path="/recruiters" element={<Recruiters />} />
                    <Route path="/recruiters/:id" element={<RecruiterDetail />} />
                    <Route path="/evaluations" element={<Evaluations />} />
                    <Route path="/evaluations/:id" element={<EvaluationDetail />} />
                    <Route path="/placements" element={<Placements />} />
                    <Route path="/placements/:id" element={<PlacementDetail />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports/:id" element={<ReportDetail />} />
                    <Route path="/faculty" element={<Faculty />} />
                    <Route path="/faculty/:id" element={<FacultyDetail />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/institute-profile" element={<InstituteProfile />} />
                    <Route path="/institute-profile-details" element={<InstituteProfileDetails />} />
                    <Route path="/manage-courses" element={<ManageCourses />} />
                    <Route path="/student-verification" element={<StudentVerification />} />
                    <Route path="/all-student" element={<AllStudentList />} />
                    <Route path="/search-student" element={<StudentSearch />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </ProtectedRoute>
               } />
            <Route path="/employer/*" element={
              <ProtectedRoute role="2">
                  <Routes>
                    <Route path="/" element={<EmployerDashboard />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/jobs/:id" element={<JobDetail />} />
                    <Route path="/candidates" element={<Candidates />} />
                    <Route path="/candidates/:id" element={<CandidateDetail />} />
                    <Route path="/applications" element={<Applications />} />
                    <Route path="/interviews" element={<Interviews />} />
                    <Route path="/assessments" element={<Assessments />} />
                    <Route path="/reports" element={<EmployerReports />} />
                    <Route path="/company" element={<Company />} />
                    <Route path="/company-profile" element={<CompanyProfile />} />
                    <Route path="/post-jobs" element={<PostNewJob />} />
                    <Route path="/review-jobs/:id" element={<ReviewJobs />} />
                    <Route path="/review-edit-jobs/:id" element={<ReviewEditJobs />} />
                    <Route path="/edit-jobs/:id" element={<PostEditJob />} />
                    <Route path="/settings" element={<EmployerSettings />} />
                    <Route path="/verify-employee" element={<VerifyEmployee />} />
                    <Route path="/paynow" element={<PayNow />} />
                    <Route path="/download-center" element={<DownloadCenter />} />
                    <Route path="/verification-details" element={<VerificationDetails />} />
                    <Route path="/verified-details" element={<VerifiedDetailsPage />} />
                    <Route path="/verified-aadhar" element={<VerifiedAadharPage />} />
                    <Route path="/aadhar-verification" element={<AadharVerification />} />
                    <Route path="/employee-verification" element={<EmployeeVerification />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
              </ProtectedRoute>
              } />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
       
      </AuthProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);
}
export default App; 
