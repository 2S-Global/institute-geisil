import { Link } from "react-router-dom";
import { Plus, Calendar as CalIcon, Video, MapPin } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const interviews = [
  { id: "IV-501", name: "Priya Menon", role: "Frontend Engineer", time: "Today · 3:00 PM", mode: "Video", status: "Confirmed" },
  { id: "IV-500", name: "Rohan Verma", role: "Data Analyst", time: "Today · 5:30 PM", mode: "Video", status: "Confirmed" },
  { id: "IV-499", name: "Aisha Khan", role: "Product Manager", time: "Tomorrow · 11:00 AM", mode: "On-site", status: "Pending" },
  { id: "IV-498", name: "Karthik Iyer", role: "QA Engineer", time: "May 6 · 2:00 PM", mode: "Video", status: "Confirmed" },
  { id: "IV-497", name: "Neha Gupta", role: "Frontend Engineer", time: "May 7 · 10:00 AM", mode: "On-site", status: "Confirmed" },
];

const styles: Record<string, string> = {
  Confirmed: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
};

export default function Interviews() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Interviews"
        description="Schedule and track upcoming candidate interviews."
        actions={<Button className="gap-2 shadow-brand"><Plus className="h-4 w-4" /> Schedule interview</Button>}
      />
      <div className="grid gap-3 md:grid-cols-4 mb-6">
        {[["Today", 4], ["This week", 12], ["Pending", 3], ["Completed (MTD)", 86]].map(([k, v]) => (
          <Card key={k as string} className="p-4 border-border/60 shadow-sm">
            <p className="text-xs uppercase text-muted-foreground tracking-wider">{k}</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{v}</p>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        {interviews.map((iv) => (
          <Card key={iv.id} className="p-4 border-border/60 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-11 w-11 border"><AvatarFallback className="bg-primary-soft text-primary font-semibold">{iv.name.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{iv.name}</p>
              <p className="text-xs text-muted-foreground">{iv.role} · {iv.id}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalIcon className="h-4 w-4" /> {iv.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {iv.mode === "Video" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />} {iv.mode}
            </div>
            <Badge variant="outline" className={styles[iv.status]}>{iv.status}</Badge>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Reschedule</Button>
              <Button asChild size="sm"><Link to={`/employer/candidates/${iv.name.toLowerCase().replace(/\s+/g,"-")}`}>Open</Link></Button>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
