import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import {
  Download,
  Filter,
  Plus,
  Search,
  GraduationCap,
  UserCheck,
  Award,
  Clock,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImportModal from "@/components/student/importModal";
import StudentModal from "@/components/student/addModal";
import ImportMarksModal from "@/components/student/importMarksModal";

const statusStyles: Record<string, string> = {
  Placed: "bg-success/10 text-success border-success/20",
  "In Process": "bg-accent/10 text-accent border-accent/20",
  Evaluated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const Students = () => {
  const [query, setQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [importMarksOpen, setImportMarksOpen] = useState(false);
  const [addStudentOpen, setStudentOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentList, setStudentList] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const itemsPerPage = 10;
  const filtered = studentList?.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.programDetails.name.toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [stats, setStats] = useState({
    total: 0,
    placementReady: 0,
    avgScore: 0,
    pending: 0,
  });

  const fetchStudentList = async () => {
    try {
      const res = await api.get(
        "/api/institutestudent/institute-student-list-by-placement-ready",
      );
      const data = res?.data?.data || [];
      setStudentList(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/institutestudent/get_students_counts");

        const data = res.data;

        setStats({
          total: data?.totalStudents || 0,
          placementReady: data?.placement_ready || 0,
          avgScore: data?.avg_score || 0,
          pending: data?.pending_eval || 0,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
    fetchStudentList();
  }, [refresh]);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Students"
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setImportOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Import Student
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setImportMarksOpen(true)}
            >
              <Upload className="h-4 w-4" />
              Import Student Marks
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
              onClick={() => setStudentOpen(true)}
            >
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </>
        }
      />
      <ImportModal open={importOpen} setOpen={setImportOpen} />
      <StudentModal open={addStudentOpen} setOpen={setStudentOpen} setRefresh={setRefresh}/>
      <ImportMarksModal open={importMarksOpen} setOpen={setImportMarksOpen} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats.total.toString()}
          delta={12}
          icon={GraduationCap}
          tint="primary"
          link="/institute/all-student"
        />

        <StatCard
          label="Placement Ready"
          value={stats.placementReady.toString()}
          delta={9}
          icon={UserCheck}
          tint="accent"
        />

        <StatCard
          label="Avg. Score"
          value={stats.avgScore.toString()}
          delta={4}
          icon={Award}
          tint="success"
        />

        <StatCard
          label="Pending Eval."
          value={stats.pending.toString()}
          delta={-6}
          icon={Clock}
          tint="warning"
        />
      </div>

      <Card className="shadow-sm border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="placed">Placed</TabsTrigger>
                <TabsTrigger value="process">In Process</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search students…"
                  className="pl-9 w-full md:w-72"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/40">
                <tr className="text-center text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3 px-4 whitespace-nowrap">
                    Student
                  </th>

                  <th className="font-medium py-3 px-4 whitespace-nowrap">
                    Course
                  </th>

                  <th className="font-medium py-3 px-4 whitespace-nowrap">
                    Gender
                  </th>

                  <th className="font-medium py-3 px-4 min-w-[220px] whitespace-nowrap">
                    Employability
                  </th>

                  <th className="font-medium py-3 px-4 whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-center">
                {paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <Link
                        to={`/institute/students/${s._id}`}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground uppercase group-hover:text-primary transition-colors truncate">
                            {s.name}
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                            {s.id}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                      {s.programDetails.name}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground uppercase whitespace-nowrap">
                      {s.gender}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-3 min-w-[180px]">
                        <Progress
                          value={s.score}
                          className="h-1.5 flex-1 max-w-[120px]"
                        />

                        <span className="text-sm font-semibold text-foreground w-10 text-right shrink-0">
                          {s.score}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={statusStyles[s.status]}
                      >
                        {s.status}
                      </Badge>
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
    </DashboardLayout>
  );
};

export default Students;
