import { Link } from "react-router-dom";
import { Building2, IndianRupee, TrendingUp, Users, Download, Plus, MapPin } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const trend = [
  { month: "Nov", offers: 124, accepted: 98 },
  { month: "Dec", offers: 168, accepted: 142 },
  { month: "Jan", offers: 198, accepted: 168 },
  { month: "Feb", offers: 234, accepted: 201 },
  { month: "Mar", offers: 286, accepted: 248 },
  { month: "Apr", offers: 322, accepted: 281 },
];

const offers = [
  { student: "Priya Menon", company: "Google India", role: "SWE I", ctc: "32 LPA", location: "Bengaluru", status: "Accepted" },
  { student: "Rohan Verma", company: "Goldman Sachs", role: "Analyst", ctc: "24 LPA", location: "Mumbai", status: "Accepted" },
  { student: "Aisha Khan", company: "Microsoft", role: "Data Scientist", ctc: "28 LPA", location: "Hyderabad", status: "Pending" },
  { student: "Karthik Iyer", company: "Qualcomm", role: "Hardware Eng.", ctc: "22 LPA", location: "Bengaluru", status: "Accepted" },
  { student: "Neha Gupta", company: "Deloitte", role: "Consultant", ctc: "14 LPA", location: "Gurugram", status: "Negotiating" },
];

const statusStyles: Record<string, string> = {
  Accepted: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Negotiating: "bg-accent/10 text-accent border-accent/20",
};

const Placements = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Placements"
        description="Track offers extended, accepted and overall placement performance."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <Plus className="h-4 w-4" /> Log offer
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Offers Extended" value="1,438" delta={16} icon={Building2} tint="primary" />
        <StatCard label="Offers Accepted" value="1,182" delta={11} icon={Users} tint="success" />
        <StatCard label="Avg. CTC" value="₹ 9.4 LPA" delta={7} icon={IndianRupee} tint="accent" />
        <StatCard label="Placement Rate" value="86.4%" delta={-2} icon={TrendingUp} tint="warning" />
      </div>

      <Card className="shadow-sm border-border/60 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-display">Offers vs Acceptances</CardTitle>
          <CardDescription>Six-month rolling trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ofGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="acGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
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
                  }}
                />
                <Area type="monotone" dataKey="offers" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#ofGrad)" />
                <Area type="monotone" dataKey="accepted" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#acGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-display">Recent Offers</CardTitle>
          <CardDescription>Latest placements and offer status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3">Student</th>
                  <th className="font-medium py-3">Company</th>
                  <th className="font-medium py-3">Role</th>
                  <th className="font-medium py-3">CTC</th>
                  <th className="font-medium py-3">Location</th>
                  <th className="font-medium py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {offers.map((o) => (
                  <tr key={o.student} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3">
                      <Link to={`/placements/${encodeURIComponent(o.student.toLowerCase().replace(/\s+/g, "-"))}`} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                            {o.student.split(" ").map((w) => w[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{o.student}</span>
                      </Link>
                    </td>
                    <td className="py-3 font-medium text-foreground">{o.company}</td>
                    <td className="py-3 text-muted-foreground">{o.role}</td>
                    <td className="py-3 font-semibold text-foreground">{o.ctc}</td>
                    <td className="py-3 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{o.location}</span>
                    </td>
                    <td className="py-3 text-right">
                      <Badge variant="outline" className={statusStyles[o.status]}>{o.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Placements;
