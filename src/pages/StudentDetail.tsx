import { Link, useParams } from "react-router-dom";
import {useState,useEffect} from "react"
import {
  ArrowLeft, Mail, Phone, MapPin, GraduationCap, Award, Briefcase, Calendar,
  Download, MessageSquare, FileText, CheckCircle2, Clock, XCircle,User
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

import API from "../lib/axios";
import {nameFormate} from "../lib/utils"
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
     const [loading, setLoading] = useState(false);
     const [profile, setProfile] = useState();
  const { id } = useParams();
  const name = "Priya Menon";
  const initials = name.split(" ").map(w => w[0]).join("");

    const FetchDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/institutestudent/institute-student-details-by-id?id=${id}`,
      );

      if (response.data.success) {
        const data = response.data.data;
        setProfile(data);

        //setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    FetchDetails()
  },[])

  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/students"><ArrowLeft className="h-4 w-4" /> Back to students</Link>
      </Button>

      <PageHeader
        eyebrow={""}
        title={nameFormate(profile?.name || "")}
        description=""
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
  {/* Header */}
  <div className="bg-[#1b4498] px-6 pt-6 pb-6">
    <div className="flex flex-col md:flex-row md:items-end gap-4">
      
      <Avatar className="h-20 w-20 border-4 border-card shadow-md">
        <AvatarFallback className="bg-primary-soft text-white font-display font-bold text-2xl">
        { profile?.name.split(" ").map(w => w[0]).join("").toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-xl font-bold text-white">
            {nameFormate(profile?.name||"")}
          </h2>
{/* 
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/20"
          >
            Placed
          </Badge>

          <Badge variant="outline" className="gap-1 bg-white">
            Employability 92
          </Badge> */}
        </div>

        <p className="text-sm text-white mt-1">
          {profile?.programDetails?.name||""}
        </p>
      </div>
    </div>
  </div>

  {/* Content */}
  <CardContent className="pt-0">
    <Separator className="mb-5" />

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
      
      <div className="flex items-start gap-3">
        <Mail className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Email</p>
          <p className="text-foreground truncate">
            {profile?.email||""}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Phone</p>
          <p className="text-foreground truncate">
            {profile?.phoneNumber||""}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0"/>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Gender</p>
          
          <p className="text-foreground">
            {nameFormate(profile?.gender||"")}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs">Admission Year</p>
          <p className="text-foreground">
            {profile?.admissionYear||""}
            
          </p>
        </div>
      </div>
    </div>

    {/* Optional Skills / Tags */}
   {/*  <div className="mt-5 flex flex-wrap gap-2">
      {["React", "Node.js", "AI/ML", "TypeScript"].map((skill) => (
        <Badge
          key={skill}
          variant="outline"
          className="bg-muted/40"
        >
          {skill}
        </Badge>
      ))}
    </div> */}
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
              <CardHeader><CardTitle className="text-base">Semester/Yearly Marks</CardTitle><CardDescription></CardDescription></CardHeader>
              <CardContent className="space-y-5">
                {profile?.semesters.length > 0 && profile?.semesters.map(s => (
                  <div key={s.semester}>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-muted-foreground">{s?.courseStructure==='semester'?"Sem":"Year"}{s.semester}</span><span className="font-semibold text-foreground">{s?.convertedMarks}</span></div>
                    <Progress value={s?.convertedMarks} className="h-2" />
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
