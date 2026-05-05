import { Link } from "react-router-dom";
import { Plus, Search, Filter, MapPin, Users, Clock } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const jobs = [
  { id: "JD-1042", title: "Frontend Engineer", dept: "Engineering", loc: "Bengaluru", type: "Full-time", apps: 84, posted: "3d ago", status: "Open" },
  { id: "JD-1041", title: "Data Analyst", dept: "Analytics", loc: "Hyderabad", type: "Full-time", apps: 56, posted: "5d ago", status: "Open" },
  { id: "JD-1040", title: "Product Manager", dept: "Product", loc: "Remote", type: "Full-time", apps: 39, posted: "1w ago", status: "Reviewing" },
  { id: "JD-1039", title: "QA Engineer", dept: "Engineering", loc: "Pune", type: "Contract", apps: 28, posted: "1w ago", status: "Open" },
  { id: "JD-1038", title: "HR Business Partner", dept: "People", loc: "Mumbai", type: "Full-time", apps: 17, posted: "2w ago", status: "Closed" },
  { id: "JD-1037", title: "DevOps Engineer", dept: "Platform", loc: "Bengaluru", type: "Full-time", apps: 64, posted: "2w ago", status: "Open" },
];

const styles: Record<string, string> = {
  Open: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

export default function Jobs() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Job Postings"
        description="Manage open requisitions across teams."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
            <Button className="gap-2 shadow-brand"><Plus className="h-4 w-4" /> Post a job</Button>
          </>
        }
      />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, ID, or department…" className="pl-9 h-10" />
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((j) => (
          <Card key={j.id} className="p-5 border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">{j.id} · {j.dept}</p>
                <Link to={`/employer/jobs/${j.id}`} className="font-display text-lg font-bold text-foreground hover:text-primary">{j.title}</Link>
              </div>
              <Badge variant="outline" className={styles[j.status]}>{j.status}</Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {j.loc}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {j.type}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {j.apps} applicants</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <span className="text-xs text-muted-foreground">Posted {j.posted}</span>
              <Button asChild size="sm" variant="outline"><Link to={`/employer/jobs/${j.id}`}>Manage</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
