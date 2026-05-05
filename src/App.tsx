import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Students from "./pages/Students.tsx";
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
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
