import { Link } from "react-router-dom";
import { FileText, Download, Calendar, BarChart3, PieChart as PieIcon, TrendingUp, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const templates = [
  { title: "Placement Summary", desc: "Offers, acceptances, sector mix, CTC bands.", icon: TrendingUp, tag: "Quarterly" },
  { title: "Student Employability", desc: "Cohort-wise employability scores and skill gaps.", icon: Users, tag: "Monthly" },
  { title: "Recruiter Engagement", desc: "Hiring partner activity, conversion and SLAs.", icon: BarChart3, tag: "Monthly" },
  { title: "Evaluation Insights", desc: "Score distributions and assessment performance.", icon: PieIcon, tag: "Weekly" },
];

const recent = [
  { name: "Q4 FY26 Placement Report", type: "PDF", date: "Apr 28, 2026", size: "2.4 MB" },
  { name: "March Employability Index", type: "XLSX", date: "Apr 02, 2026", size: "812 KB" },
  { name: "Recruiter Engagement – Mar", type: "PDF", date: "Apr 01, 2026", size: "1.1 MB" },
  { name: "Cohort Skill Audit – B.Tech CSE", type: "PDF", date: "Mar 24, 2026", size: "3.6 MB" },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Reports"
        description="Generate, schedule and download institutional reports for stakeholders."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Calendar className="h-4 w-4" />Schedule</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <FileText className="h-4 w-4" /> New report
            </Button>
          </>
        }
      />

      <h2 className="font-display text-lg font-semibold text-foreground mb-3">Templates</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {templates.map((t) => (
          <Link key={t.title} to={`/reports/${t.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <Card className="shadow-sm hover:shadow-md transition-shadow border-border/60 cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-11 w-11 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-muted/60 text-muted-foreground border-border text-[10px]">{t.tag}</Badge>
                </div>
                <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <p className="text-primary mt-3 text-sm font-medium group-hover:underline">Generate report →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-display">Recent reports</CardTitle>
          <CardDescription>Generated and downloaded in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {recent.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-3 hover:bg-muted/30 px-3 -mx-3 rounded-md transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {r.type}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Reports;
