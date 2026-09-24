import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import {
  Filter,
  Plus,
  Search,
  Edit,
  Trash,
  ArrowLeft,
  Eye,
  FileText,
  Download,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  Calendar,
  CircleSlash,
} from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmployerLayout } from "@/components/EmployerLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesFormModal from "@/components/institute/courses/FormModal";
import { useToast } from "@/hooks/use-toast";
import { nameFormate } from "../../lib/utils";
import StudentModal from "@/components/student/addModal";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import API from "@/lib/axios";
import DISCModal from "@/components/candidate/TestOne/Modal";
import OCEANModal from "@/components/candidate/TestTwo/Modal";
const statusStyles: Record<string, string> = {
  Placed: "bg-success/10 text-success border-success/20",
  "In Process": "bg-accent/10 text-accent border-accent/20",
  Evaluated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  try {
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const Reports = () => {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);

  const [refresh, setRefresh] = useState(0);
  const navigate = useNavigate();

  const [scoreData, setScoreData] = useState(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [isScore, setIsScore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDISC, setOpenDISC] = useState<boolean>(false);
  const [openOCEAN, setOpenOCEAN] = useState<boolean>(false);

  const fetchScore = async (url, type) => {
    try {
      setLoading(true);
      const response = await API.get(url);

      if (response.data.success && response.data.data?.[0] && type === "DISC") {
        const data = response.data.data[0];
        if (data.score !== undefined && data.totalQuestions) {
          const calculatedPercentage =
            Math.round((data.score / data.totalQuestions) * 100) || 0;
          setPercentage(calculatedPercentage);
        }
        setScoreData(data);
        setIsScore(true);
      } else if (
        response.data.success &&
        response.data.data &&
        type === "OCEAN"
      ) {
        const data = response.data.data;
        setScoreData(data);
        setIsScore(true);
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to fetch behavioral assessment score:", e);
    } finally {
      setLoading(false);
    }
  };

  const modalOpen = (type, data) => {
    if (type === "DISC") {
      let url = `/api/mental-test/attempt-history?id=${data?.userId || ""}`;
      fetchScore(url, "DISC");
      setOpenDISC(true);
    } else if (type === "OCEAN") {
      let url = `/api/mental-feedback/details?id=${data?.user || ""}`;
      setOpenOCEAN(true);
      fetchScore(url, "OCEAN");
    }
  };

  const itemsPerPage = 10;
  const filtered = list?.filter(
    (s) =>
      s?.name.toLowerCase().includes(query.toLowerCase()) ||
      String(s?.admissionYear)?.includes(query) ||
      String(s?.USN)?.includes(query) ||
      String(s?.tenTh)?.includes(query) ||
      String(s?.twelveTh)?.includes(query),
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLists = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchList = async () => {
    try {
      const res = await api.get(
        "/api/institutestudent/institute-student-assessment-list",
      );
      const data = res?.data?.data || [];
      setList(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };
  useEffect(() => {
    fetchList();
  }, []);
  useEffect(() => {
    if (refresh) {
      window.location.reload();
    }
  }, [refresh]);

  return (
    <EmployerLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Reports"
        description="Generate, manage, and share insightful behavioral and personality assessment reports."
        actions={<></>}
      />

      <Card className="shadow-sm border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div></div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search student…"
                  className="pl-9 w-full md:w-72"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium py-3 px-4 text-left">Name</th>
                  <th className="font-medium py-3 px-4 text-center">
                    Workplace Behavioral Style Assessment (DISC)
                  </th>
                  <th className="font-medium py-3 px-4 text-center">
                    Big 5 Personality Assessment (OCEAN)
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedLists.map((s) => (
                  <tr
                    key={"allStudent" + s?.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4 text-center">
                      <div className="">
                        <div className="text-left sm:text-left max-w-[260px]">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {s?.name?.length > 35
                              ? `${nameFormate(s?.name?.slice(0, 35))}...`
                              : nameFormate(s?.name) || ""}
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                            {s?.id?.length > 25
                              ? `${s?.id?.slice(0, 25)}...`
                              : s?.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Completed:{" "}
                        {formatDate(s?.mentaltestattempts?.[0]?.createdAt) ||
                          "N/A"}
                      </span>
                      {s?.mentaltestattempts?.[0]?.createdAt ? (
                        <h6
                          className="text-base  text-blue-600 underline cursor-pointer hover:text-blue-800"
                          onClick={() =>
                            modalOpen("DISC", s?.mentaltestattempts?.[0])
                          }
                        >
                          Assessment Report
                        </h6>
                      ) : (
                        <h6 className="text-base text-blue-600 underline hover:cursor-not-allowed">
                          Assessment Report
                        </h6>
                      )}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Completed:{" "}
                        {formatDate(
                          s?.attemptedmentaltestfeedbacks?.[0]?.createdAt,
                        ) || "N/A"}
                      </span>
                      {s?.attemptedmentaltestfeedbacks?.[0]?.createdAt ? (
                        <h6
                          className="text-base text-blue-600 underline cursor-pointer hover:text-blue-800"
                          onClick={() =>
                            modalOpen(
                              "OCEAN",
                              s?.attemptedmentaltestfeedbacks?.[0],
                            )
                          }
                        >
                          Assessment Report
                        </h6>
                      ) : (
                        <h6 className="text-base text-blue-600 underline hover:cursor-not-allowed">
                          Assessment Report
                        </h6>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <DISCModal open={openDISC} setOpen={setOpenDISC} data={scoreData} />
      <OCEANModal open={openOCEAN} setOpen={setOpenOCEAN} data={scoreData} />
    </EmployerLayout>
  );
};

export default Reports;
