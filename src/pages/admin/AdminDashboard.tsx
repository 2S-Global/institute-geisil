import { AdminLayout } from "@/components/AdminLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Briefcase,
  GraduationCap,
  ClipboardList,
  ArrowUpRight,
  Download,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
  Legend,
} from "recharts";
import { Link } from "react-router-dom";

const growth = [
  { m: "Jan", candidates: 420, employers: 32 },
  { m: "Feb", candidates: 610, employers: 41 },
  { m: "Mar", candidates: 820, employers: 55 },
  { m: "Apr", candidates: 990, employers: 63 },
  { m: "May", candidates: 1180, employers: 78 },
  { m: "Jun", candidates: 1420, employers: 91 },
  { m: "Jul", candidates: 1720, employers: 104 },
];

const jobsByCategory = [
  { name: "IT & Software", jobs: 420 },
  { name: "BFSI", jobs: 310 },
  { name: "Sales", jobs: 260 },
  { name: "Healthcare", jobs: 190 },
  { name: "Manufacturing", jobs: 150 },
  { name: "Retail", jobs: 120 },
];

const pie = [
  { name: "Active", value: 62, color: "hsl(var(--primary))" },
  { name: "Shortlisted", value: 22, color: "hsl(var(--accent))" },
  { name: "Rejected", value: 16, color: "hsl(var(--muted-foreground))" },
];

const recentUsers = [
  { name: "Priya Sharma", role: "Candidate", email: "priya.s@mail.com", when: "2m ago", status: "Active" },
  { name: "Infosys BPM", role: "Employer", email: "hr@infosysbpm.com", when: "18m ago", status: "Pending" },
  { name: "IIT Delhi", role: "Institute", email: "placements@iitd.ac.in", when: "1h ago", status: "Active" },
  { name: "Rahul Verma", role: "Candidate", email: "rahul.v@mail.com", when: "3h ago", status: "Active" },
  { name: "Tata Consultancy", role: "Employer", email: "careers@tcs.com", when: "5h ago", status: "Active" },
];

const activity = [
  { icon: CheckCircle2, tint: "text-success", text: "Employer verification approved for HDFC Bank", when: "10 min ago" },
  { icon: Plus, tint: "text-primary", text: "12 new candidates registered from IIT Bombay", when: "45 min ago" },
  { icon: AlertCircle, tint: "text-warning", text: "3 job postings flagged for review", when: "2 hrs ago" },
  { icon: Clock, tint: "text-muted-foreground", text: "Monthly payout run scheduled for tomorrow 09:00 IST", when: "6 hrs ago" },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Admin"
        title="Platform overview"
        description="Monitor users, jobs, applications and platform health across GEISIL."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Export report
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add admin
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
        <StatCard label="Total candidates" value="24,812" delta={12} icon={Users} tint="primary" link="/admin/candidates" />
        <StatCard label="Active employers" value="1,942" delta={8} icon={Briefcase} tint="accent" link="/admin/employers" />
        <StatCard label="Partner institutes" value="318" delta={4} icon={GraduationCap} tint="success" link="/admin/institutes" />
        <StatCard label="Open jobs" value="6,204" delta={-3} icon={ClipboardList} tint="warning" link="/admin/jobs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">User growth</h3>
              <p className="text-sm text-muted-foreground">Candidates & employers onboarded over last 7 months</p>
            </div>
            <Badge variant="secondary">Last 7 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={growth} margin={{ left: -12, right: 6, top: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="m" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="candidates" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="employers" stroke="hsl(var(--accent))" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-lg text-foreground">Application status</h3>
            <p className="text-sm text-muted-foreground">Distribution across all jobs</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pie} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                {pie.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-lg text-foreground">Jobs by category</h3>
              <p className="text-sm text-muted-foreground">Live openings on the platform</p>
            </div>
            <Link to="/admin/jobs" className="text-xs font-semibold text-primary inline-flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={jobsByCategory} margin={{ left: -12, right: 6, top: 6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="jobs" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="font-display font-semibold text-lg text-foreground">Recent activity</h3>
            <p className="text-sm text-muted-foreground">System events</p>
          </div>
          <ul className="space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <a.icon className={`h-4 w-4 ${a.tint}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground leading-snug">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.when}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-5 mt-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-foreground">Recently registered users</h3>
            <p className="text-sm text-muted-foreground">Latest sign-ups across roles</p>
          </div>
          <Button variant="outline" size="sm">View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-3 pr-4 font-semibold">User</th>
                <th className="py-3 pr-4 font-semibold">Role</th>
                <th className="py-3 pr-4 font-semibold">Email</th>
                <th className="py-3 pr-4 font-semibold">Joined</th>
                <th className="py-3 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u) => (
                <tr key={u.email} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant="secondary">{u.role}</Badge>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{u.when}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      className={
                        u.status === "Active"
                          ? "bg-success/10 text-success hover:bg-success/10"
                          : "bg-warning/10 text-warning hover:bg-warning/10"
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AdminLayout>
  );
}
