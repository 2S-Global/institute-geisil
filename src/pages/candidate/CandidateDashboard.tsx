import { Link } from "react-router-dom";
import {
  Briefcase,
  FileText,
  CalendarCheck,
  Eye,
  ArrowUpRight,
  MapPin,
  Building2,
  Clock,
  Video,
  CheckCircle2,
  Circle,
  Bookmark,
  Sparkles,
  Upload,
  GraduationCap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CandidateLayout } from "@/components/CandidateLayout";
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
import { useEffect, useState } from "react";
import API from "@/lib/axios";
import { formatStatus } from "./helpers/formatStatus";

const activity = [
  { d: "Mon", views: 4, apps: 1 },
  { d: "Tue", views: 7, apps: 2 },
  { d: "Wed", views: 12, apps: 1 },
  { d: "Thu", views: 9, apps: 0 },
  { d: "Fri", views: 15, apps: 3 },
  { d: "Sat", views: 18, apps: 2 },
  { d: "Sun", views: 22, apps: 4 },
];





const interviews = [
  {
    role: "Frontend Engineer",
    company: "Acme Corp",
    when: "Tomorrow · 11:00 AM",
    mode: "Video",
    with: "Anita Rao",
  },
  {
    role: "UI Engineer",
    company: "Northwind",
    when: "Fri · 03:30 PM",
    mode: "Onsite",
    with: "Vikram S.",
  },
  {
    role: "Product Designer",
    company: "Lumen Labs",
    when: "Mon · 10:00 AM",
    mode: "Video",
    with: "Tara M.",
  },
];

const checklist = [
  { label: "Basic information", done: true },
  { label: "Upload resume", done: true },
  { label: "Add work experience", done: true },
  { label: "Add education", done: true },
  { label: "Skills & certifications", done: false },
  { label: "Portfolio links", done: false },
];

const statusStyles: Record<string, string> = {
  Interview: "bg-accent/10 text-accent border-accent/20",
  Shortlisted: "bg-primary/10 text-primary border-primary/20",
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  Offer: "bg-success/10 text-success border-success/20",
};

const CandidateDashboard = () => {
  const [stats, setStats] = useState({
    appliedJobs: 0,
    shortlistedJobs: 0,
    interviewScheduled: 0,
    offersReceived: 0,
  });

  const [progress, setProgress] = useState(0);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const statusStyles: Record<string, string> = {
    applied: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "in review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    in_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "under review": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    under_review: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    shortlisted: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    interview: "bg-primary/10 text-primary border-primary/20",
    invitation_sent: "bg-primary/10 text-primary border-primary/20",
    offered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offer: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offer_sent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offer_letter_sent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    offer_letter_accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    offer_letter_rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    completed: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  };


  const completion = progress;
  useEffect(() => {
    fetchDashboardData();
    fetchUserData();
    fetchAppliedJobs();
      fetchRecommendedJobs();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await API.get(
        "/api/candidate/candidateDetails/get_candidate_dashboard_data",
      );

      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const res = await API.get("/api/userdata/userdata");

      if (res.data?.progress !== undefined) {
        setProgress(res.data.progress);
      }
    } catch (error) {
      console.error("User Data API Error:", error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await API.get("/api/jobposting/get_all_my_applied_job");

      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (error) {
      console.error("Applied Jobs API Error:", error);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const res = await API.get(
        "/api/candidate/joblisting/get_job_recommendation",
      );

      if (res.data.success) {
        setRecommended(res.data.jobs || []);
      }
    } catch (error) {
      console.error("Recommended Jobs API Error:", error);
    }
  };

  
  return (
    <CandidateLayout>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back, Riya 👋</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-1">
            Candidate Dashboard
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Track your applications, interviews and personalised opportunities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Update Resume
          </Button>
          <Button
            asChild
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          >
            <Link to="/candidate/jobs">
              <Briefcase className="h-4 w-4" /> Browse Jobs
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={stats.appliedJobs}
          delta={12}
          icon={FileText}
          tint="primary"
        />
        <StatCard
          label="Shortlisted"
          value={stats.shortlistedJobs}
          delta={20}
          icon={CalendarCheck}
          tint="accent"
        />
        <StatCard
          label="Interviews"
          value={stats.interviewScheduled}
          delta={32}
          icon={Eye}
          tint="success"
        />
        <StatCard
          label="Offers Received"
          value={stats.offersReceived}
          delta={-5}
          icon={Bookmark}
          tint="warning"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-display">
                Activity This Week
              </CardTitle>
              <CardDescription>
                Profile views and applications submitted
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Views
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />{" "}
                Applications
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activity}
                  margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="cv" x1="0" y1="0" x2="0" y2="1">
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
                    <linearGradient id="ca" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="d"
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
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#cv)"
                  />
                  <Area
                    type="monotone"
                    dataKey="apps"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    fill="url(#ca)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">
              Profile Completion
            </CardTitle>
            <CardDescription>
              Stronger profiles get noticed more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-3xl font-bold text-foreground">
                {completion}%
              </span>
            </div>
            <Progress value={completion} className="h-2 mt-3" />
            <ul className="mt-4 space-y-2.5">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span
                    className={
                      c.done
                        ? "text-muted-foreground line-through"
                        : "text-foreground"
                    }
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" size="sm" className="w-full mt-4">
              <Link to="/candidate/profile">Complete profile</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Roles matched to your Industry Type
              </CardDescription>
            </div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary gap-1"
            >
              <Link to="/candidate/jobs">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {recommended.length > 0 ? (
              recommended.map((j) => (
                <div
                  key={j._id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/candidate/jobs/${j._id}`}
                        className="font-semibold text-foreground hover:text-primary truncate"
                      >
                        {j.jobTitle}
                      </Link>

                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success/20 text-xs"
                      >
                        Recommended
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {j.userId?.name || "Company"}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {j.jobLocationType || "N/A"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {j.jobType?.map((t: any) => t.name).join(", ")}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {j.salary?.currency}
                      {j.salary?.min?.toLocaleString()} - {j.salary?.currency}
                      {j.salary?.max?.toLocaleString()}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {j.salary?.rate}
                    </p>
                  </div>

                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                No recommended jobs found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-display">
              Upcoming Interviews
            </CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {interviews.map((i) => (
              <div
                key={i.role + i.when}
                className="p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-foreground text-sm">
                    {i.role}
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      i.mode === "Video"
                        ? "bg-accent/10 text-accent border-accent/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    }
                  >
                    {i.mode === "Video" ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <MapPin className="h-3 w-3 mr-1" />
                    )}
                    {i.mode}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {i.company}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 border">
                      <AvatarFallback className="text-[10px] bg-muted">
                        {i.with
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {i.with}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {i.when}
                  </span>
                </div>
              </div>
            ))}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-full text-primary"
            >
              <Link to="/candidate/interviews">View schedule</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/60 mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-lg font-display">
              Recent Applications
            </CardTitle>
            <CardDescription>
              Track where each application stands
            </CardDescription>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-primary gap-1"
          >
            <Link to="/candidate/applications">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-center text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3">Role</th>
                  <th className="font-medium py-3">Company</th>
                  <th className="font-medium py-3">Applied</th>
                  <th className="font-medium py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-muted/30 transition-colors text-center"
                    >
                      <td className="py-3 font-semibold text-foreground">
                        {app.jobId?.jobTitle}
                      </td>

                      <td className="py-3 text-muted-foreground">
                        {app.jobId?.userId?.name}
                      </td>

                      <td className="py-3 text-muted-foreground">
                        {new Date(app.appliedAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </td>

                      <td className="py-3">
                        <Badge
                          variant="outline"
                          className={statusStyles[app.status?.toLowerCase()] || ""}
                        >
                          {formatStatus(app.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

     
    </CandidateLayout>
  );
};

export default CandidateDashboard;
