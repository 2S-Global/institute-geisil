import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Users,
  TrendingUp,
  Star,
  Building2,
  Calendar,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const recruitersDB: Record<string, any> = {
  default: {
    name: "Tata Consultancy Services",
    sector: "IT Services",
    status: "Active",
    rating: 4.8,
    website: "tcs.com",
    email: "campus@tcs.com",
    phone: "+91 22 6778 9999",
    location: "Mumbai, Maharashtra",
    since: "Jan 2019",
    description:
      "Global leader in IT services, consulting and business solutions. Long-standing hiring partner across engineering and management programs.",
    openings: 42,
    hired: 28,
    interviews: 96,
    offerRate: 67,
    sectors: ["Software Engineering", "Data & Analytics", "Cloud", "Consulting"],
  },
};

function websiteName(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return "";
  }
}

const hiringTrend = [
  { month: "Nov", offers: 6, hires: 4 },
  { month: "Dec", offers: 9, hires: 7 },
  { month: "Jan", offers: 12, hires: 9 },
  { month: "Feb", offers: 15, hires: 11 },
  { month: "Mar", offers: 18, hires: 14 },
  { month: "Apr", offers: 22, hires: 17 },
];

const positions = [
  { role: "Software Engineer", dept: "Engineering", openings: 18, applicants: 142, status: "Open" },
  { role: "Data Analyst", dept: "Analytics", openings: 8, applicants: 86, status: "Open" },
  { role: "Cloud Engineer", dept: "Infrastructure", openings: 6, applicants: 54, status: "Interviewing" },
  { role: "Business Consultant", dept: "Consulting", openings: 5, applicants: 38, status: "Open" },
  { role: "QA Engineer", dept: "Engineering", openings: 5, applicants: 41, status: "Closed" },
];

const candidates = [
  { name: "Priya Sharma", role: "Software Engineer", stage: "Offered", date: "Apr 28" },
  { name: "Arjun Mehta", role: "Data Analyst", stage: "Final Round", date: "Apr 27" },
  { name: "Neha Kapoor", role: "Cloud Engineer", stage: "Technical", date: "Apr 26" },
  { name: "Vikram Singh", role: "Software Engineer", stage: "Hired", date: "Apr 24" },
  { name: "Ananya Iyer", role: "Consultant", stage: "Rejected", date: "Apr 22" },
];

const activities = [
  { icon: CheckCircle2, color: "text-success", text: "Offer extended to Priya Sharma — Software Engineer", time: "2h ago" },
  { icon: Calendar, color: "text-primary", text: "Campus drive scheduled for May 12, 2026", time: "1d ago" },
  { icon: Users, color: "text-accent", text: "Shortlisted 24 candidates for technical round", time: "2d ago" },
  { icon: Building2, color: "text-warning", text: "New requisition raised: 6 Cloud Engineers", time: "4d ago" },
];

const positionStatus: Record<string, string> = {
  Open: "bg-success/10 text-success border-success/20",
  Interviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

const stageStyles: Record<string, { cls: string; icon: any }> = {
  Hired: { cls: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  Offered: { cls: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  "Final Round": { cls: "bg-accent/10 text-accent border-accent/20", icon: Clock },
  Technical: { cls: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  Rejected: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};
import API from "../lib/axios";
const RecruiterDetail = () => {
  const [recruiter,setRecruiter]=useState()
  const { id } = useParams();
  const r = recruitersDB[id ?? "default"] ?? recruitersDB.default;
  const initials = r.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("");


    const fetchRecruiter= async () => {
    try {
      const res = await API.get(
        `/api/instituteprofile/get_all_companies_by_institute?id=${id}`,
      );
      const data = res?.data?.data || {};
      console.log(data)
      setRecruiter(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchRecruiter();
  }, []);
  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/recruiters"><ArrowLeft className="h-4 w-4" /> Back to recruiters</Link>
      </Button>

      <PageHeader
        eyebrow="Recruiter profile"
        title={recruiter?.companyName||""}
        description={recruiter?.description}
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </>
        }
      />

      {/* Profile summary */}
      <Card className="mb-6 border-border/60 shadow-sm overflow-hidden">
       {/*  <div className="h-24 bg-[#516295] "/> */}
        <CardContent className="pt-20">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10">
            <Avatar className="h-20 w-20 border-4 border-card shadow-md">
              <AvatarFallback className="bg-primary-soft text-primary font-display font-bold text-2xl">
                {recruiter?.companyName?.charAt(0)||""}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 md:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-foreground">{recruiter?.companyName||""}</h2>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">{recruiter?.status||""}</Badge>
                <Badge variant="outline" className="gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{recruiter?.rating||""}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{recruiter?.sector||""} • since {recruiter?.since||""}</p>
            </div>
          </div>

          <Separator className="my-5" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0"><p className="text-muted-foreground text-xs">Email</p><p className="text-foreground truncate">{recruiter?.email||""}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0"><p className="text-muted-foreground text-xs">Phone</p><p className="text-foreground truncate">{recruiter?.phone||""}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0"><p className="text-muted-foreground text-xs">Website</p><p className="text-foreground truncate">{websiteName(recruiter?.website)||""}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0"><p className="text-muted-foreground text-xs text-wrap">Location</p><p className="text-foreground ">{recruiter?.address||""}</p></div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {r.sectors.map((s: string) => (
              <Badge key={s} variant="outline" className="bg-muted/40">{s}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Open Positions" value={String(r.openings)} delta={12} icon={Briefcase} tint="primary" />
        <StatCard label="Total Hires" value={String(r.hired)} delta={9} icon={Users} tint="success" />
        <StatCard label="Interviews" value={String(r.interviews)} delta={6} icon={Calendar} tint="accent" />
        <StatCard label="Offer Rate" value={`${r.offerRate}%`} delta={4} icon={TrendingUp} tint="warning" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Hiring Trend</CardTitle>
                <CardDescription>Offers extended vs candidates hired (last 6 months)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hiringTrend}>
                      <defs>
                        <linearGradient id="offers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="hires" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Area type="monotone" dataKey="offers" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#offers)" />
                      <Area type="monotone" dataKey="hires" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#hires)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Engagement Score</CardTitle>
                <CardDescription>Partnership health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: "Response time", value: 92 },
                  { label: "Offer-to-hire ratio", value: 78 },
                  { label: "Candidate satisfaction", value: 88 },
                  { label: "Process adherence", value: 95 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-semibold text-foreground">{m.value}%</span>
                    </div>
                    <Progress value={m.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="positions" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Open Positions</CardTitle>
              <CardDescription>Currently active requisitions from this recruiter</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Openings</TableHead>
                    <TableHead className="text-right">Applicants</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map((p) => (
                    <TableRow key={p.role}>
                      <TableCell className="font-medium text-foreground">{p.role}</TableCell>
                      <TableCell className="text-muted-foreground">{p.dept}</TableCell>
                      <TableCell className="text-right">{p.openings}</TableCell>
                      <TableCell className="text-right">{p.applicants}</TableCell>
                      <TableCell><Badge variant="outline" className={positionStatus[p.status]}>{p.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="candidates" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent Candidates</CardTitle>
              <CardDescription>Students currently in this recruiter's pipeline</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Applied for</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((c) => {
                    const s = stageStyles[c.stage];
                    return (
                      <TableRow key={c.name}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">{c.name.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
                            <span className="font-medium text-foreground">{c.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{c.role}</TableCell>
                        <TableCell><Badge variant="outline" className={s.cls}><s.icon className="h-3 w-3 mr-1" />{c.stage}</Badge></TableCell>
                        <TableCell className="text-right text-muted-foreground">{c.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
              <CardDescription>Recent interactions and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-border ml-3 space-y-6">
                {activities.map((a, i) => (
                  <li key={i} className="ml-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-card border">
                      <a.icon className={`h-3.5 w-3.5 ${a.color}`} />
                    </span>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default RecruiterDetail;
