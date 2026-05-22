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

const students = [
  {
    id: "STU-10241",
    name: "Priya Menon",
    course: "B.Tech CSE",
    year: "Final",
    score: 92,
    status: "Placed",
  },
  {
    id: "STU-10240",
    name: "Rohan Verma",
    course: "MBA Finance",
    year: "Final",
    score: 87,
    status: "In Process",
  },
  {
    id: "STU-10239",
    name: "Aisha Khan",
    course: "B.Sc Data Sci.",
    year: "Pre-Final",
    score: 81,
    status: "Evaluated",
  },
  {
    id: "STU-10238",
    name: "Karthik Iyer",
    course: "B.Tech ECE",
    year: "Final",
    score: 78,
    status: "In Process",
  },
  {
    id: "STU-10237",
    name: "Neha Gupta",
    course: "BBA",
    year: "Final",
    score: 74,
    status: "Placed",
  },
  {
    id: "STU-10236",
    name: "Arjun Reddy",
    course: "B.Tech Mech",
    year: "Final",
    score: 69,
    status: "Pending",
  },
  {
    id: "STU-10235",
    name: "Sara Joseph",
    course: "M.Sc Stats",
    year: "Final",
    score: 88,
    status: "Placed",
  },
  {
    id: "STU-10234",
    name: "Vikram Singh",
    course: "B.Com Hons",
    year: "Pre-Final",
    score: 71,
    status: "Evaluated",
  },
];

const statusStyles: Record<string, string> = {
  Placed: "bg-success/10 text-success border-success/20",
  "In Process": "bg-accent/10 text-accent border-accent/20",
  Evaluated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const Students = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.course.toLowerCase().includes(query.toLowerCase()) ||
      s.id.toLowerCase().includes(query.toLowerCase()),
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
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Students"
        description="Track enrolment, evaluation progress and placement readiness across all cohorts."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <Plus className="h-4 w-4" /> Add student
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats.total.toString()}
          delta={12}
          icon={GraduationCap}
          tint="primary"
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3">Student</th>
                  <th className="font-medium py-3">Course</th>
                  <th className="font-medium py-3">Year</th>
                  <th className="font-medium py-3 w-[220px]">Employability</th>
                  <th className="font-medium py-3 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3">
                      <Link
                        to={`/students/${s.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                            {s.name
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {s.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {s.id}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3 text-muted-foreground">{s.course}</td>

                    <td className="py-3 text-muted-foreground">{s.year}</td>

                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Progress value={s.score} className="h-1.5 flex-1" />

                        <span className="text-sm font-semibold text-foreground w-10 text-right">
                          {s.score}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 text-right">
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
