import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, MapPin, GraduationCap, Award, Briefcase, Calendar,
  Download, MessageSquare, FileText, CheckCircle2, Clock, XCircle,
} from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const skills = [
  { skill: "Aptitude", value: 88 },
  { skill: "Coding", value: 92 },
  { skill: "Communication", value: 78 },
  { skill: "Domain", value: 84 },
  { skill: "Problem Solving", value: 90 },
  { skill: "Teamwork", value: 82 },
];

const evaluations = [
  { id: "EV-2841", type: "Aptitude + Coding", score: 92, status: "Completed", date: "Apr 28" },
  { id: "EV-2812", type: "Technical", score: 86, status: "Completed", date: "Apr 14" },
  { id: "EV-2780", type: "Group Discussion", score: 78, status: "Completed", date: "Mar 30" },
  { id: "EV-2741", type: "Case Study", score: 81, status: "Completed", date: "Mar 12" },
];

const applications = [
  { company: "Google India", role: "SWE I", stage: "Offered", date: "Apr 28" },
  { company: "Microsoft", role: "Data Scientist", stage: "Final Round", date: "Apr 24" },
  { company: "TCS", role: "Software Engineer", stage: "Hired", date: "Apr 18" },
  { company: "Deloitte", role: "Analyst", stage: "Rejected", date: "Apr 10" },
];

const stage: Record<string, { cls: string; icon: any }> = {
  Hired: { cls: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  Offered: { cls: "bg-primary/10 text-primary border-primary/20", icon: CheckCircle2 },
  "Final Round": { cls: "bg-accent/10 text-accent border-accent/20", icon: Clock },
  Rejected: { cls: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle },
};

const StudentDetail = () => {
  const { id } = useParams();
  const name = "Priya Menon";
  const initials = name.split(" ").map(w => w[0]).join("");

  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/students"><ArrowLeft className="h-4 w-4" /> Back to students</Link>
      </Button>

      <PageHeader
        eyebrow={`Student • ${id ?? "STU-10241"}`}
        title={name}
        description="B.Tech Computer Science • Final Year • Cohort 2026"
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Resume</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <MessageSquare className="h-4 w-4" /> Message
            </Button>
          </>
        }
      />

      <Card className="mb-6 border-border/60 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-[hsl(var(--primary-hover))]" />
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-10">
            <Avatar className="h-20 w-20 border-4 border-card shadow-md">
              <AvatarFallback className="bg-primary-soft text-primary font-display font-bold text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 md:pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-foreground">{name}</h2>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">Placed</Badge>
                <Badge variant="outline">Employability 92</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">B.Tech CSE • CGPA 9.2 • Specialization: AI / ML</p>
            </div>
          </div>
          <Separator className="my-5" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="flex items-start gap-3"><Mail className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Email</p><p className="text-foreground truncate">priya.menon@geisil.in</p></div></div>
            <div className="flex items-start gap-3"><Phone className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Phone</p><p className="text-foreground">+91 98765 43210</p></div></div>
            <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Location</p><p className="text-foreground">Bengaluru, KA</p></div></div>
            <div className="flex items-start gap-3"><Calendar className="h-4 w-4 text-muted-foreground mt-0.5" /><div><p className="text-xs text-muted-foreground">Enrolled</p><p className="text-foreground">Aug 2022</p></div></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Employability" value="92" delta={6} icon={Award} tint="primary" />
        <StatCard label="Evaluations" value="14" delta={3} icon={GraduationCap} tint="accent" />
        <StatCard label="Applications" value="8" delta={2} icon={Briefcase} tint="success" />
        <StatCard label="Offers" value="3" delta={1} icon={CheckCircle2} tint="warning" />
      </div>

      <Tabs defaultValue="skills">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="mt-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-border/60 shadow-sm">
              <CardHeader><CardTitle className="text-base">Skill Radar</CardTitle><CardDescription>Composite assessment results</CardDescription></CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={skills}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                      <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardHeader><CardTitle className="text-base">Detailed Breakdown</CardTitle><CardDescription>Score per competency</CardDescription></CardHeader>
              <CardContent className="space-y-5">
                {skills.map(s => (
                  <div key={s.skill}>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">{s.skill}</span><span className="font-semibold text-foreground">{s.value}</span></div>
                    <Progress value={s.value} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="evaluations" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Type</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {evaluations.map(e => (
                    <TableRow key={e.id}>
                      <TableCell><Link to={`/evaluations/${e.id}`} className="text-primary hover:underline font-medium">{e.id}</Link></TableCell>
                      <TableCell className="text-muted-foreground">{e.type}</TableCell>
                      <TableCell className="font-semibold">{e.score}</TableCell>
                      <TableCell><Badge variant="outline" className="bg-success/10 text-success border-success/20">{e.status}</Badge></TableCell>
                      <TableCell className="text-right text-muted-foreground">{e.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Company</TableHead><TableHead>Role</TableHead><TableHead>Stage</TableHead><TableHead className="text-right">Updated</TableHead></TableRow></TableHeader>
                <TableBody>
                  {applications.map(a => {
                    const s = stage[a.stage];
                    return (
                      <TableRow key={a.company}>
                        <TableCell className="font-medium text-foreground">{a.company}</TableCell>
                        <TableCell className="text-muted-foreground">{a.role}</TableCell>
                        <TableCell><Badge variant="outline" className={s.cls}><s.icon className="h-3 w-3 mr-1" />{a.stage}</Badge></TableCell>
                        <TableCell className="text-right text-muted-foreground">{a.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="divide-y divide-border/60 p-0">
              {[
                { name: "Resume — Apr 2026.pdf", size: "412 KB" },
                { name: "Academic Transcripts.pdf", size: "1.2 MB" },
                { name: "Internship Certificate — Infosys.pdf", size: "286 KB" },
                { name: "Recommendation Letter — Dr. Sharma.pdf", size: "198 KB" },
              ].map(d => (
                <div key={d.name} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-primary-soft text-primary flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                    <div><p className="font-medium text-foreground">{d.name}</p><p className="text-xs text-muted-foreground">{d.size}</p></div>
                  </div>
                  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default StudentDetail;
