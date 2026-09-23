import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  Download,
  Plus,
  FileText,
  CheckCircle,
  XCircle,
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
import { EmployerLayout } from "@/components/EmployerLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import API from "@/lib/axios";

const pipeline = [
  { stage: "Applied", count: 482 },
  { stage: "Screened", count: 268 },
  { stage: "Interview", count: 124 },
  { stage: "Offer", count: 38 },
  { stage: "Hired", count: 22 },
];

const hiringTrend = [
  { m: "May", apps: 120, hires: 6 },
  { m: "Jun", apps: 168, hires: 10 },
  { m: "Jul", apps: 220, hires: 14 },
  { m: "Aug", apps: 256, hires: 18 },
  { m: "Sep", apps: 312, hires: 21 },
  { m: "Oct", apps: 348, hires: 26 },
  { m: "Nov", apps: 402, hires: 30 },
  { m: "Dec", apps: 380, hires: 28 },
  { m: "Jan", apps: 446, hires: 34 },
  { m: "Feb", apps: 482, hires: 36 },
  { m: "Mar", apps: 521, hires: 41 },
  { m: "Apr", apps: 568, hires: 47 },
];

const sources = [
  { name: "Campus Drive", value: 42, color: "hsl(var(--primary))" },
  { name: "Referrals", value: 24, color: "hsl(var(--accent))" },
  { name: "Job Portals", value: 22, color: "hsl(var(--success))" },
  { name: "Direct", value: 12, color: "hsl(var(--warning))" },
];

const jobs = [
  {
    id: "JD-1042",
    title: "Frontend Engineer",
    dept: "Engineering",
    apps: 84,
    status: "Open",
  },
  {
    id: "JD-1041",
    title: "Data Analyst",
    dept: "Analytics",
    apps: 56,
    status: "Open",
  },
  {
    id: "JD-1040",
    title: "Product Manager",
    dept: "Product",
    apps: 39,
    status: "Reviewing",
  },
  {
    id: "JD-1039",
    title: "QA Engineer",
    dept: "Engineering",
    apps: 28,
    status: "Open",
  },
  {
    id: "JD-1038",
    title: "HR Business Partner",
    dept: "People",
    apps: 17,
    status: "Closed",
  },
];

const candidates = [
  {
    name: "Priya Menon",
    role: "Frontend Engineer",
    score: 92,
    stage: "Interview",
  },
  { name: "Rohan Verma", role: "Data Analyst", score: 87, stage: "Screened" },
  { name: "Aisha Khan", role: "Product Manager", score: 84, stage: "Offer" },
  { name: "Karthik Iyer", role: "QA Engineer", score: 78, stage: "Interview" },
  {
    name: "Neha Gupta",
    role: "Frontend Engineer",
    score: 75,
    stage: "Screened",
  },
];

const statusStyles: Record<string, string> = {
  Open: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
  Interview: "bg-accent/10 text-accent border-accent/20",
  Screened: "bg-primary/10 text-primary border-primary/20",
  Offer: "bg-success/10 text-success border-success/20",
};

const EmployerDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState();
  const [monthlyApplicantsStats, setMonthlyApplicantsStats] = useState();
  const [jobListing, setJobListing] = useState();

  const [loading, setLoading] = useState(false);
  const fetchEmployerDashboardStats = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/api/dashboard/getEmployerDashboardStats",
      );

      if (response.data.success && response.status === 200) {
        setDashboardStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching");
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyApplicantsStats = async () => {
    setLoading(true);

    try {
      const response = await API.get(
        "/api/dashboard/getMonthlyApplicantsStats",
      );

      if (response.data.success && response.status === 200) {
        const hiringTrend = response.data?.data?.map((item) => ({
          m: item.month.split(" ")[0],
          Applicant: item.totalApplicants,
        }));
        setMonthlyApplicantsStats(hiringTrend || []);
      }
    } catch (error) {
      console.error("Error fetching");
    } finally {
      setLoading(false);
    }
  };

  const fetchJobListingNotExpir = async () => {
    setLoading(true);

    try {
      const response = await API.get("/api/jobposting/getJobListingNotExpir");
      if (response.data.success && response.status === 200) {
        setJobListing(response.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerDashboardStats();
    fetchMonthlyApplicantsStats();
    fetchJobListingNotExpir();
  }, []);
  return (
    <EmployerLayout>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          {/* <p className="text-sm text-muted-foreground">Welcome back, Acme Corp 👋</p> */}
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-1">
            Employer Dashboard
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Track openings, candidates and hiring performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/*   <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Apr 2026</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button> */}
          <Button
            asChild
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          >
            <Link to="/employer/jobs">
              <Plus className="h-4 w-4" /> Post a job
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Posted Jobs"
          value={dashboardStats?.totalJobs || 0}
          delta={9}
          icon={Briefcase}
          tint="primary"
        />
        <StatCard
          label="Applications"
          value={dashboardStats?.totalApplicants || 0}
          delta={14}
          icon={FileText}
          tint="accent"
        />
        <StatCard
          label="Shortlisted"
          value={dashboardStats?.totalShortlisted || 0}
          delta={21}
          icon={CheckCircle}
          tint="success"
        />
        <StatCard
          label="Rejected"
          value={dashboardStats?.totalRejected || 0}
          delta={-3}
          icon={XCircle}
          tint="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-display">
                Candidate Application Statistics
              </CardTitle>
              {/*  <CardDescription>
                Monthly hiring funnel performance
              </CardDescription> */}
            </div>
            {/*  <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />{" "}
                Applications
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" /> Hires
              </div>
            </div> */}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyApplicantsStats}
                  margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="appsG" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="hiresG" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="100%"
                        stopColor="hsl(var(--accent))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="m"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="apps"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#appsG)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Applicant"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#hiresG)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">Sourcing Mix</CardTitle>
            <CardDescription>Where candidates come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sources}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {sources.map((e, i) => (
                      <Cell key={i} fill={e.color} />
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
              {sources.map((s) => (
                <li
                  key={s.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </span>
                  <span className="font-semibold text-foreground">
                    {s.value}%
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        {/* Active Job Postings Card */}
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
            <div>
              <CardTitle className="text-lg font-display">
                Active Job Postings
              </CardTitle>
              <CardDescription>Currently open requisitions</CardDescription>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary gap-1 self-start sm:self-auto"
            >
              <Link to="/employer/jobs">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px] sm:min-w-full">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                    <th className="font-medium py-3">Job Title</th>
                    <th className="font-medium py-3">Employment Type</th>
                    <th className="font-medium py-3 text-right">
                      Workplace Type
                    </th>
                    <th className="font-medium py-3 text-right">
                      Closing Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {jobListing?.length &&
                    jobListing?.map((j) => (
                      <tr
                        key={j?._id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="py-3">
                          <Link
                            to={`/employer/jobs/${j?._id}`}
                            className="font-semibold text-foreground hover:text-primary"
                          >
                            {j?.jobTitle || ""}
                          </Link>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {j?.jobType?.join(",") || ""}
                        </td>
                        <td className="py-3 text-right font-semibold text-foreground">
                          {j?.jobLocationType || ""}
                        </td>
                        <td className="py-3 text-right">
                          {j?.expiryDate || ""}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Funnel Card */}
        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">
              Hiring Funnel
            </CardTitle>
            <CardDescription>Conversion across stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={pipeline}
                  layout="vertical"
                  margin={{ top: 5, right: 16, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/*   <Card className="shadow-sm border-border/60 mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-display">
              Top Candidates
            </CardTitle>
            <CardDescription>Highest-ranked profiles this week</CardDescription>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
          >
            <Link to="/employer/candidates">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {candidates.map((c) => (
              <Link
                key={c.name}
                to={`/employer/candidates/${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="grid grid-cols-12 items-center gap-3 px-3 py-3 rounded-md hover:bg-muted/40 transition-colors"
              >
                <div className="col-span-12 sm:col-span-4 flex items-center gap-3">
                  <Avatar className="h-9 w-9 border">
                    <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                      {c.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                </div>
                <div className="col-span-7 sm:col-span-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">
                      Match score
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {c.score}/100
                    </span>
                  </div>
                  <Progress value={c.score} className="h-1.5" />
                </div>
                <div className="col-span-5 sm:col-span-3 flex justify-end">
                  <Badge variant="outline" className={statusStyles[c.stage]}>
                    {c.stage}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </EmployerLayout>
  );
};

export default EmployerDashboard;
