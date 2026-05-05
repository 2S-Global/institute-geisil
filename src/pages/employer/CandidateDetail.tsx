import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, Linkedin, Download, MessageSquare } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CandidateDetail() {
  const { id } = useParams();
  const name = (id || "candidate").split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  return (
    <EmployerLayout>
      <Button asChild variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
        <Link to="/employer/candidates"><ArrowLeft className="h-4 w-4" /> Back to candidates</Link>
      </Button>

      <Card className="p-6 mb-6 border-border/60 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <Avatar className="h-20 w-20 border"><AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{name.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-foreground">{name}</h1>
            <p className="text-muted-foreground">Frontend Engineer · 4 yrs experience</p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {name.split(" ")[0].toLowerCase()}@example.com</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +91 98765 43210</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Bengaluru</span>
              <span className="flex items-center gap-1"><Linkedin className="h-3.5 w-3.5" /> linkedin/in/{name.split(" ")[0].toLowerCase()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Resume</Button>
            <Button variant="outline" className="gap-2"><MessageSquare className="h-4 w-4" /> Message</Button>
            <Button className="gap-2 shadow-brand">Move to interview</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[["Match score", "92"], ["Interviews", "3"], ["Assessments", "2"], ["Status", "Interview"]].map(([k, v]) => (
          <Card key={k as string} className="p-5 border-border/60 shadow-sm">
            <p className="text-xs uppercase text-muted-foreground tracking-wider">{k}</p>
            <p className="font-display text-2xl font-bold text-foreground mt-2">{v}</p>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2 border-border/60 shadow-sm">
              <CardHeader><CardTitle className="font-display">Summary</CardTitle></CardHeader>
              <CardContent className="text-muted-foreground text-sm">
                Frontend engineer with 4 years of React/TypeScript experience building consumer SaaS products. Strong on UX, accessibility, and performance.
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm">
              <CardHeader><CardTitle className="font-display">Skills</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[["React", 92], ["TypeScript", 86], ["UI/UX", 80], ["Node.js", 65]].map(([k, v]) => (
                  <div key={k as string}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-foreground">{k}</span><span className="text-muted-foreground">{v}%</span></div>
                    <Progress value={v as number} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="experience" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-5">
              {[
                { co: "Razorpay", role: "Senior Frontend Engineer", years: "2023 — Present" },
                { co: "Freshworks", role: "Frontend Engineer", years: "2021 — 2023" },
                { co: "Zoho", role: "Software Engineer Intern", years: "2020 — 2021" },
              ].map((e) => (
                <div key={e.co} className="flex gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-semibold">{e.co[0]}</div>
                  <div>
                    <p className="font-semibold text-foreground">{e.role}</p>
                    <p className="text-sm text-muted-foreground">{e.co} · {e.years}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 space-y-4">
              {[
                ["Today", "Round 2 interview scheduled"],
                ["2d ago", "Cleared technical assessment (88%)"],
                ["5d ago", "Application moved to Screened"],
                ["1w ago", "Applied to Frontend Engineer (JD-1042)"],
              ].map(([t, m]) => (
                <div key={m} className="flex gap-3">
                  <Badge variant="outline" className="shrink-0">{t}</Badge>
                  <p className="text-sm text-foreground">{m}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
}
