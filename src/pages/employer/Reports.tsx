import { Download, FileBarChart, Users, Briefcase, TrendingUp } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { m: "Nov", v: 28 }, { m: "Dec", v: 32 }, { m: "Jan", v: 41 },
  { m: "Feb", v: 38 }, { m: "Mar", v: 47 }, { m: "Apr", v: 52 },
];

const templates = [
  { icon: Users, name: "Candidate funnel", desc: "Conversion at every stage" },
  { icon: Briefcase, name: "Job performance", desc: "Apps, time-to-fill, cost" },
  { icon: TrendingUp, name: "Diversity report", desc: "Hiring breakdown across groups" },
  { icon: FileBarChart, name: "Source effectiveness", desc: "ROI across sourcing channels" },
];

export default function Reports() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Reports"
        description="Hiring insights and downloadable analytics."
        actions={<Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export all</Button>}
      />
      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-display">Hires by month</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="font-display">Key metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[["Time-to-fill", "28 days"], ["Cost per hire", "₹42,800"], ["Offer acceptance", "78.2%"], ["Quality of hire", "4.2 / 5"]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{k}</span>
                <span className="font-display text-lg font-bold text-foreground">{v}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <h2 className="font-display text-xl font-bold text-foreground mb-3">Report templates</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((t) => (
          <Card key={t.name} className="p-5 border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <t.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground">{t.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
            <Button size="sm" variant="outline" className="mt-4 w-full">Generate</Button>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
