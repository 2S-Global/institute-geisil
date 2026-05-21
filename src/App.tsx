import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Students from "./pages/Students.tsx";
import ManageCourses from "./pages/ManageCourses.tsx";
import StudentDetail from "./pages/StudentDetail.tsx";
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
import NotFound from "./pages/NotFound.tsx";
import { AuthProvider } from "@/components/context/AuthContext.tsx";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
const queryClient = new QueryClient();
const App = ()=>{ 
 
  useEffect(()=>{
         const token = Cookies.get("token");
          if(token){
              localStorage.setItem("token", token);
          }
  },[])
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
             <Route path="/institute/*" element={
              <ProtectedRoute role="2">
                 <Routes>
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
                    <Route path="/settings" element={<EmployerSettings />} />
                </Routes>
              </ProtectedRoute>
              } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);
}
export default App;
