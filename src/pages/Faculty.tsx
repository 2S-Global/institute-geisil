import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Mail, Phone, Users, BookOpen, Award } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface FacultyItem {
  name: string;
  role: string;
  dept: string;
  email: string;
  students: number;
  courses: number;
}

const initialFaculty: FacultyItem[] = [
  { name: "Dr. A. Sharma", role: "Head — Placements", dept: "Administration", email: "a.sharma@geisil.in", students: 412, courses: 4 },
  { name: "Prof. R. Iyer", role: "Faculty Coordinator", dept: "Engineering", email: "r.iyer@geisil.in", students: 286, courses: 3 },
  { name: "Dr. M. Banerjee", role: "Senior Evaluator", dept: "Management", email: "m.banerjee@geisil.in", students: 198, courses: 5 },
  { name: "Prof. S. Patel", role: "Faculty Coordinator", dept: "Sciences", email: "s.patel@geisil.in", students: 224, courses: 3 },
  { name: "Dr. K. Nair", role: "Industry Mentor", dept: "Engineering", email: "k.nair@geisil.in", students: 156, courses: 2 },
  { name: "Prof. L. Das", role: "Faculty Coordinator", dept: "Commerce", email: "l.das@geisil.in", students: 174, courses: 4 },
];

const Faculty = () => {
  const { toast } = useToast();
  const [facultyList, setFacultyList] = useState<FacultyItem[]>(initialFaculty);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [dept, setDept] = useState("");
  const [email, setEmail] = useState("");
  const [students, setStudents] = useState("");
  const [courses, setCourses] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !dept.trim() || !email.trim()) {
      toast({ title: "Missing info", description: "Name, role, department and email are required.", variant: "destructive" });
      return;
    }
    const newFaculty: FacultyItem = {
      name: name.trim(),
      role: role.trim(),
      dept: dept.trim(),
      email: email.trim(),
      students: Number(students) || 0,
      courses: Number(courses) || 0,
    };
    setFacultyList((prev) => [newFaculty, ...prev]);
    toast({ title: "Faculty added", description: `${newFaculty.name} has been added.` });
    setOpen(false);
    setName(""); setRole(""); setDept(""); setEmail(""); setStudents(""); setCourses("");
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Manage"
        title="Faculty"
        description="Coordinators, evaluators and mentors driving the placement programme."
        actions={
          <Button
            className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
            onClick={() => setOpen(true)}
          >
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
        {facultyList.map((f) => (
          <Card key={f.name} className="shadow-sm hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="flex flex-row items-start gap-3 space-y-0">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                  {f.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <Link to={`/institute/faculty/${encodeURIComponent(f.name.toLowerCase().replace(/[^a-z]+/g, "-"))}`} className="font-semibold text-foreground truncate hover:text-primary transition-colors block">
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
                  <Link to={`/institute/faculty/${encodeURIComponent(f.name.toLowerCase().replace(/[^a-z]+/g, "-"))}`}>View profile</Link>
                </Button>
                <Button variant="outline" size="icon"><Mail className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="icon"><Phone className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add faculty dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Add faculty</DialogTitle>
            <DialogDescription>Add a new coordinator, evaluator or mentor.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="f-name">Full name</Label>
              <Input id="f-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. P. Kumar" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="f-role">Role</Label>
                <Input id="f-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Faculty Coordinator" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-dept">Department</Label>
                <Input id="f-dept" value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Engineering" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-email">Email</Label>
              <Input id="f-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kumar@geisil.in" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="f-students">Students</Label>
                <Input id="f-students" type="number" value={students} onChange={(e) => setStudents(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-courses">Courses</Label>
                <Input id="f-courses" type="number" value={courses} onChange={(e) => setCourses(e.target.value)} placeholder="0" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add faculty</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Faculty;
