import { Link } from "react-router-dom";
import { Plus, Briefcase, Building2, Users, TrendingUp, ExternalLink, Mail } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const recruiters = [
  { name: "Tata Consultancy Services", sector: "IT Services", openings: 42, hired: 28, rating: 4.8, status: "Active" },
  { name: "Infosys Limited", sector: "IT Services", openings: 36, hired: 22, rating: 4.6, status: "Active" },
  { name: "Deloitte India", sector: "Consulting", openings: 18, hired: 14, rating: 4.7, status: "Reviewing" },
  { name: "Wipro Technologies", sector: "IT Services", openings: 24, hired: 19, rating: 4.5, status: "Active" },
  { name: "HDFC Bank", sector: "Banking", openings: 14, hired: 11, rating: 4.4, status: "Closed" },
  { name: "Accenture", sector: "Consulting", openings: 30, hired: 21, rating: 4.6, status: "Active" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

const Recruiters = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Recruiters"
        description="Manage hiring partners, open positions and engagement across sectors."
        actions={
          <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
            <Plus className="h-4 w-4" /> Invite recruiter
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Active Recruiters" value="184" delta={8} icon={Briefcase} tint="primary" />
        <StatCard label="Open Positions" value="612" delta={14} icon={Building2} tint="accent" />
        <StatCard label="Hires (MTD)" value="248" delta={11} icon={Users} tint="success" />
        <StatCard label="Conversion" value="41.2%" delta={3} icon={TrendingUp} tint="warning" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recruiters.map((r) => (
          <Card key={r.name} className="shadow-sm hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11 border">
                  <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                    {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{r.name}</CardTitle>
                  <CardDescription>{r.sector}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={statusStyles[r.status]}>{r.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Openings</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.openings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hired</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.hired}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.rating}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Mail className="h-3.5 w-3.5" /> Contact</Button>
                <Button asChild variant="ghost" size="sm" className="text-primary gap-1">
                  <Link to={`/recruiters/${encodeURIComponent(r.name.toLowerCase().replace(/\s+/g, "-"))}`}>
                    View <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Recruiters;
