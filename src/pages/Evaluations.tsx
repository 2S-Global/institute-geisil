import { Link } from "react-router-dom";
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, Plus, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const monthly = [
  { month: "Nov", count: 142 },
  { month: "Dec", count: 168 },
  { month: "Jan", count: 201 },
  { month: "Feb", count: 234 },
  { month: "Mar", count: 268 },
  { month: "Apr", count: 312 },
];

const evaluations = [
  { id: "EV-2841", student: "Priya Menon", type: "Aptitude + Coding", score: 92, status: "Completed", date: "2 hrs ago" },
  { id: "EV-2840", student: "Rohan Verma", type: "Case Study", score: 87, status: "Completed", date: "5 hrs ago" },
  { id: "EV-2839", student: "Aisha Khan", type: "Technical", score: 81, status: "Reviewing", date: "Yesterday" },
  { id: "EV-2838", student: "Karthik Iyer", type: "Aptitude + Coding", score: 78, status: "Completed", date: "Yesterday" },
  { id: "EV-2837", student: "Neha Gupta", type: "Group Discussion", score: 74, status: "Reviewing", date: "2 days ago" },
  { id: "EV-2836", student: "Arjun Reddy", type: "Technical", score: 0, status: "Pending", date: "Scheduled" },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const Evaluations = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Evaluations"
        description="Configure assessments, monitor results and review pending submissions."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <Plus className="h-4 w-4" /> New evaluation
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total (MTD)" value="1,267" delta={24} icon={ClipboardCheck} tint="primary" />
        <StatCard label="Completed" value="982" delta={18} icon={CheckCircle2} tint="success" />
        <StatCard label="In Review" value="218" delta={6} icon={Clock} tint="warning" />
        <StatCard label="Flagged" value="12" delta={-3} icon={AlertCircle} tint="accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-display">Evaluations per month</CardTitle>
            <CardDescription>Volume trend across the last six months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-display">Score Distribution</CardTitle>
            <CardDescription>Across completed evaluations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "90 – 100", value: 18, color: "bg-success" },
              { label: "75 – 89", value: 42, color: "bg-primary" },
              { label: "60 – 74", value: 28, color: "bg-accent" },
              { label: "Below 60", value: 12, color: "bg-warning" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold text-foreground">{b.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-display">All Evaluations</CardTitle>
          <CardDescription>Most recent submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3">Student</th>
                  <th className="font-medium py-3">Type</th>
                  <th className="font-medium py-3 w-[200px]">Score</th>
                  <th className="font-medium py-3">When</th>
                  <th className="font-medium py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {evaluations.map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="py-3">
                      <Link to={`/evaluations/${e.id}`} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                            {e.student.split(" ").map((w) => w[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{e.student}</p>
                          <p className="text-xs text-muted-foreground">{e.id}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground">{e.type}</td>
                    <td className="py-3">
                      {e.status === "Pending" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Progress value={e.score} className="h-1.5 flex-1" />
                          <span className="text-sm font-semibold text-foreground w-10 text-right">{e.score}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">{e.date}</td>
                    <td className="py-3 text-right">
                      <Badge variant="outline" className={statusStyles[e.status]}>{e.status}</Badge>
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

export default Evaluations;
