import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Calendar, FileText, Filter, Share2, Play } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const data = [
  { m: "Nov", v: 124 }, { m: "Dec", v: 168 }, { m: "Jan", v: 198 },
  { m: "Feb", v: 234 }, { m: "Mar", v: 286 }, { m: "Apr", v: 322 },
];

const ReportDetail = () => {
  const { id } = useParams();
  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/reports"><ArrowLeft className="h-4 w-4" /> Back to reports</Link>
      </Button>

      <PageHeader
        eyebrow={`Template • ${id ?? "placement-summary"}`}
        title="Placement Summary"
        description="Configure parameters and generate a downloadable report for stakeholders."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" /> Schedule</Button>
            <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <Play className="h-4 w-4" /> Generate
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4 text-primary" /> Parameters</CardTitle>
            <CardDescription>Refine the report scope</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Period</Label>
              <Select defaultValue="q4"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="q4">Q4 FY26 (Jan – Mar)</SelectItem>
                  <SelectItem value="q3">Q3 FY26 (Oct – Dec)</SelectItem>
                  <SelectItem value="ytd">Year to date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cohort</Label>
              <Select defaultValue="all"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All cohorts</SelectItem>
                  <SelectItem value="2026">Class of 2026</SelectItem>
                  <SelectItem value="2025">Class of 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Format</Label>
              <Select defaultValue="pdf"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Sections to include</Label>
              {["Executive summary", "Sector breakdown", "CTC bands", "Recruiter mix", "Top offers"].map(s => (
                <div key={s} className="flex items-center gap-2"><Checkbox defaultChecked id={s} /><label htmlFor={s} className="text-sm text-foreground cursor-pointer">{s}</label></div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div><CardTitle className="text-base">Live Preview</CardTitle><CardDescription>Updates as you change parameters</CardDescription></div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Draft</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/60 p-6 bg-muted/20">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">GEISIL Institute</p>
                <h3 className="font-display text-2xl font-bold text-foreground mt-1">Placement Summary — Q4 FY26</h3>
                <p className="text-sm text-muted-foreground mt-1">Generated for Class of 2026 • All cohorts</p>
                <Separator className="my-5" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div><p className="text-xs text-muted-foreground">Offers</p><p className="font-display text-2xl font-bold text-foreground">1,438</p></div>
                  <div><p className="text-xs text-muted-foreground">Accepted</p><p className="font-display text-2xl font-bold text-foreground">1,182</p></div>
                  <div><p className="text-xs text-muted-foreground">Avg. CTC</p><p className="font-display text-2xl font-bold text-foreground">₹ 9.4 L</p></div>
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                      <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                      <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader><CardTitle className="text-base">Previous runs</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border/60 p-0">
              {[
                { n: "Q3 FY26 Placement Report", d: "Jan 12, 2026", s: "2.1 MB" },
                { n: "Q2 FY26 Placement Report", d: "Oct 14, 2025", s: "1.9 MB" },
              ].map(r => (
                <div key={r.n} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary-soft text-primary flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                    <div><p className="font-medium text-foreground text-sm">{r.n}</p><p className="text-xs text-muted-foreground">{r.d} · {r.s}</p></div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportDetail;
