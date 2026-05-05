import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Edit, Share2 } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { Briefcase, CalendarCheck, TrendingUp } from "lucide-react";

const candidates = [
  { name: "Priya Menon", stage: "Interview", score: 92 },
  { name: "Rohan Verma", stage: "Screened", score: 87 },
  { name: "Aisha Khan", stage: "Offer", score: 84 },
  { name: "Karthik Iyer", stage: "Interview", score: 78 },
  { name: "Neha Gupta", stage: "Applied", score: 71 },
];

export default function JobDetail() {
  const { id } = useParams();
  return (
    <EmployerLayout>
      <Button asChild variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
        <Link to="/employer/jobs"><ArrowLeft className="h-4 w-4" /> Back to jobs</Link>
      </Button>

      <Card className="p-6 mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft to-card">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{id} · Engineering</p>
            <h1 className="font-display text-3xl font-bold text-foreground mt-1">Frontend Engineer</h1>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Bengaluru</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Full-time</span>
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> ₹18-28 LPA</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">Open</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Share2 className="h-4 w-4" /> Share</Button>
            <Button className="gap-2 shadow-brand"><Edit className="h-4 w-4" /> Edit posting</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard label="Applicants" value="84" delta={18} icon={Users} tint="primary" />
        <StatCard label="Shortlisted" value="22" delta={12} icon={Briefcase} tint="accent" />
        <StatCard label="Interviews" value="9" delta={28} icon={CalendarCheck} tint="success" />
        <StatCard label="Match Quality" value="82%" delta={4} icon={TrendingUp} tint="warning" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60 shadow-sm">
              <CardHeader><CardTitle className="font-display">Job Description</CardTitle></CardHeader>
              <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-3">
                <p>We are looking for a Frontend Engineer with strong React and TypeScript fundamentals to join our product team in Bengaluru.</p>
                <h4 className="text-foreground font-semibold">Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Build accessible, performant UI for our SaaS platform</li>
                  <li>Own features end-to-end and partner with design</li>
                  <li>Improve our component library and dev tooling</li>
                </ul>
                <h4 className="text-foreground font-semibold">Requirements</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>3+ years experience with React, TypeScript</li>
                  <li>Strong sense for UI/UX and performance</li>
                  <li>Familiar with testing and CI/CD</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardHeader><CardTitle className="font-display">Skills required</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[["React", 90], ["TypeScript", 85], ["CSS / Tailwind", 80], ["Testing", 70], ["Performance", 65]].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-foreground">{k}</span><span className="text-muted-foreground">{v}%</span></div>
                    <Progress value={v as number} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="candidates" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0 divide-y divide-border/60">
              {candidates.map((c) => (
                <div key={c.name} className="flex items-center gap-3 p-4 hover:bg-muted/30">
                  <Avatar className="h-10 w-10 border"><AvatarFallback className="bg-primary-soft text-primary font-semibold">{c.name.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">Match {c.score}/100</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{c.stage}</Badge>
                  <Button asChild size="sm" variant="outline"><Link to={`/employer/candidates/${c.name.toLowerCase().replace(/\s+/g,"-")}`}>View</Link></Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pipeline" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 grid gap-4 md:grid-cols-5">
              {[["Applied", 84], ["Screened", 32], ["Interview", 9], ["Offer", 3], ["Hired", 1]].map(([s, n]) => (
                <div key={s as string} className="rounded-lg border border-border/60 p-4">
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">{s}</p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">{n}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
}
