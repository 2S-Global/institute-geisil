import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {nameFormate,timeAgo} from "../lib/utils"
import {
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Download,
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Modal from "@/components/student/modal"
const placementData = [
  { month: "May", placed: 42, offers: 58 },
  { month: "Jun", placed: 61, offers: 79 },
  { month: "Jul", placed: 88, offers: 110 },
  { month: "Aug", placed: 124, offers: 152 },
  { month: "Sep", placed: 156, offers: 188 },
  { month: "Oct", placed: 198, offers: 240 },
  { month: "Nov", placed: 234, offers: 286 },
  { month: "Dec", placed: 271, offers: 322 },
  { month: "Jan", placed: 289, offers: 348 },
  { month: "Feb", placed: 312, offers: 376 },
  { month: "Mar", placed: 348, offers: 412 },
  { month: "Apr", placed: 392, offers: 458 },
];

const departmentData = [
  { name: "Engineering", students: 1240 },
  { name: "Management", students: 860 },
  { name: "Sciences", students: 640 },
  { name: "Arts", students: 480 },
  { name: "Commerce", students: 720 },
];

const skillData = [
  { name: "Technical", value: 38, color: "hsl(var(--primary))" },
  { name: "Communication", value: 24, color: "hsl(var(--accent))" },
  { name: "Analytical", value: 20, color: "hsl(var(--success))" },
  { name: "Leadership", value: 18, color: "hsl(var(--warning))" },
];

const recruiters = [
  { name: "Tata Consultancy Services", role: "Software Engineer", students: 28, status: "Active" },
  { name: "Infosys Limited", role: "Systems Engineer", students: 22, status: "Active" },
  { name: "Deloitte India", role: "Business Analyst", students: 14, status: "Reviewing" },
  { name: "Wipro Technologies", role: "Project Engineer", students: 19, status: "Active" },
  { name: "HDFC Bank", role: "Management Trainee", students: 11, status: "Closed" },
];

const evaluations = [
  { id: "EV-2841", student: "Priya Menon", course: "B.Tech CSE", score: 92, trend: 8 },
  { id: "EV-2840", student: "Rohan Verma", course: "MBA Finance", score: 87, trend: 5 },
  { id: "EV-2839", student: "Aisha Khan", course: "B.Sc Data Sci.", score: 81, trend: -2 },
  { id: "EV-2838", student: "Karthik Iyer", course: "B.Tech ECE", score: 78, trend: 3 },
  { id: "EV-2837", student: "Neha Gupta", course: "BBA", score: 74, trend: 6 },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};
const date = new Date();

const formatted = date.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    placementReady: 0,
    avgScore: 0,
    pending: 0,
  });
 const [recruiters, setRecruiters] = useState([]);
   const [evaluations, setEvaluations] = useState([]);
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

      const fetchRecruiterList = async () => {
    try {
      const res = await api.get(
        "/api/instituteprofile/get_all_companies_by_institute",
      );
      const data = res?.data?.data || [];
      const newData=data.slice(0,5)
      setRecruiters(newData);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

 const fetchEvaluationList = async () => {
    try {
      const res = await api.get(
        "/api/instituteprofile/get_evaluation_by_decending",
      );
      const data = res?.data?.data || [];
     const newData=data.slice(0,5)
      setEvaluations(newData);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

      useEffect(() => {
    fetchStats();
    fetchRecruiterList()
    fetchEvaluationList()
  }, []);
  return (
    <DashboardLayout>
    
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back 👋</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-1">
            Institute Dashboard  
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Overview of student employability, evaluations and placements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatted}</span>
          </Button>
       {/*    <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
            <Plus className="h-4 w-4" />
            New evaluation
          </Button> */}
        </div>
      </div>

       {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students"   value={stats.total.toString()} delta={12} icon={GraduationCap} tint="primary" link="/institute/all-student" />
        <StatCard label="Active Recruiters" value="184" delta={8} icon={Briefcase} tint="accent" />
        <StatCard label="Evaluations (MTD)" value="1,267" delta={24} icon={ClipboardCheck} tint="success" />
        <StatCard label="Placement Rate" value="86.4%" delta={-2} icon={TrendingUp} tint="warning" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-display">Placements & Offers</CardTitle>
              <CardDescription>Cumulative trend across the academic year</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Placed
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Offers
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={placementData} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="placedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="offersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <Area type="monotone" dataKey="offers" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#offersGrad)" />
                  <Area type="monotone" dataKey="placed" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#placedGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Skill Distribution</CardTitle>
            <CardDescription>Across evaluated cohorts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={skillData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="hsl(var(--card))" strokeWidth={2}>
                    {skillData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-3 space-y-2">
              {skillData.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="font-semibold text-foreground">{s.value}%</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Lower row */}
      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-display">Top Recruiters</CardTitle>
              <CardDescription>Active hiring partners this quarter</CardDescription>
            </div>
             <Link to='/institute/recruiters'>
             <Button variant="ghost" size="sm" className="text-primary gap-1">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                    <th className="font-medium py-3">Company</th>
                   {/*  <th className="font-medium py-3">Role</th>
                    <th className="font-medium py-3 text-right">Students</th> */}
                    <th className="font-medium py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recruiters.map((r) => (
                    <tr key={r?.companyName} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border">
                            <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold text-uppercase">
                              {r?.companyName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-foreground">{nameFormate(r?.companyName)}</span>
                        </div>
                      </td>
                     {/*  <td className="py-3 text-muted-foreground">{r.role}</td>
                      <td className="py-3 text-right font-semibold text-foreground">{r.students}</td> */}
                      <td className="py-3 text-right">
                        <Badge variant="outline" className={statusStyles[r?.status]}>
                          {r?.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Students by Department</CardTitle>
            <CardDescription>Distribution of enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={90} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="students" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent evaluations */}
      <Card className="shadow-sm border-border/60 mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-display">Recent Evaluations</CardTitle>
            <CardDescription>Latest student employability assessments</CardDescription>
          </div>
           <Link to='/institute/evaluations'>
          <Button variant="ghost" size="sm" className="text-primary gap-1">
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {evaluations?.map((e) =>{ const last=e?.evaluations?.length-1;
                let lastEvaluation=last>0?e?.evaluations[last]:e?.evaluations[0];
                
                return(
              <div
                key={e.id}
                className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-md hover:bg-muted/40 transition-colors"
              >
                <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                      {e?.student_name?.split(" ").map((w) => w[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{nameFormate(e?.student_name)}</p>
                   {/*  <p className="text-xs text-muted-foreground">{e?.id} · {e?.course}</p> */}
                  </div>
                </div>
                <div className="col-span-7 sm:col-span-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Score</span>
                    <span className="text-sm font-semibold text-foreground">{lastEvaluation?.score}/100</span>
                  </div>
                  <Progress value={lastEvaluation?.score} className="h-1.5" />
                </div>
                <div className="col-span-5 sm:col-span-3 flex justify-end">
                 {/*  <Badge
                    variant="outline"
                    className={
                      e.trend >= 0
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }
                  >
                    {e.trend >= 0 ? "+" : ""}
                    {e.trend}% trend
                  </Badge> */}
                    <Badge
                                          variant="outline"
                                          className={`${statusStyles[lastEvaluation?.status]} whitespace-nowrap`}
                                        >
                                          {lastEvaluation?.status}
                                        </Badge>
                </div>
              </div>
                )
              }
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
