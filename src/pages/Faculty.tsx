import { Link } from "react-router-dom";
import { Plus, Mail, Phone, Users, BookOpen, Award } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const faculty = [
  { name: "Dr. A. Sharma", role: "Head — Placements", dept: "Administration", email: "a.sharma@geisil.in", students: 412, courses: 4 },
  { name: "Prof. R. Iyer", role: "Faculty Coordinator", dept: "Engineering", email: "r.iyer@geisil.in", students: 286, courses: 3 },
  { name: "Dr. M. Banerjee", role: "Senior Evaluator", dept: "Management", email: "m.banerjee@geisil.in", students: 198, courses: 5 },
  { name: "Prof. S. Patel", role: "Faculty Coordinator", dept: "Sciences", email: "s.patel@geisil.in", students: 224, courses: 3 },
  { name: "Dr. K. Nair", role: "Industry Mentor", dept: "Engineering", email: "k.nair@geisil.in", students: 156, courses: 2 },
  { name: "Prof. L. Das", role: "Faculty Coordinator", dept: "Commerce", email: "l.das@geisil.in", students: 174, courses: 4 },
];

const Faculty = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Manage"
        title="Faculty"
        description="Coordinators, evaluators and mentors driving the placement programme."
        actions={
          <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
            <Plus className="h-4 w-4" /> Add faculty
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <StatCard label="Total Faculty" value="48" delta={4} icon={Users} tint="primary" />
        <StatCard label="Courses Covered" value="62" delta={6} icon={BookOpen} tint="accent" />
        <StatCard label="Avg. Student Rating" value="4.6/5" delta={2} icon={Award} tint="success" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {faculty.map((f) => (
          <Card key={f.name} className="shadow-sm hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                  {f.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Link to={`/faculty/${encodeURIComponent(f.name.toLowerCase().replace(/[^a-z]+/g, "-"))}`} className="font-semibold text-foreground truncate hover:text-primary transition-colors block">
                  {f.name}
                </Link>
                <p className="text-sm text-muted-foreground">{f.role}</p>
                <Badge variant="outline" className="mt-1.5 bg-muted/50 text-muted-foreground border-border text-[10px]">
                  {f.dept}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm py-3 border-t border-border/60">
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="font-display text-lg font-bold text-foreground">{f.students}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Courses</p>
                  <p className="font-display text-lg font-bold text-foreground">{f.courses}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1 gap-1.5">
                  <Link to={`/faculty/${encodeURIComponent(f.name.toLowerCase().replace(/[^a-z]+/g, "-"))}`}>View profile</Link>
                </Button>
                <Button variant="outline" size="icon"><Mail className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="icon"><Phone className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Faculty;
