import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  ClipboardList,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Code2,
  Brain,
  BookOpen,
  Target,
  Building2,
  Info,
  ListChecks,
  Laptop,
  Wifi,
  Camera,
  Mic,
  ArrowRight,
  Download,
  MessageSquare,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const iconFor = (type: string) => {
  if (type === "Coding") return Code2;
  if (type === "Aptitude") return Brain;
  if (type === "Domain") return BookOpen;
  return Target;
};

const diffTone: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const assessment = {
  id: "AS-2041",
  title: "Frontend Engineer — Coding Challenge",
  company: "Northwind Labs",
  role: "Frontend Engineer II",
  type: "Coding",
  difficulty: "Medium",
  duration: "90 min",
  questions: 4,
  totalPoints: 100,
  passingScore: 60,
  attemptsAllowed: 1,
  attemptsUsed: 0,
  dueDate: "May 08, 2026 • 11:59 PM IST",
  dueIn: "in 2 days",
  proctored: true,
  language: "English",
  status: "assigned",
  description:
    "This challenge evaluates your practical skills in modern frontend engineering with a focus on React, TypeScript, accessibility, and performance. You'll build small features, debug real-world issues, and answer conceptual multiple-choice questions.",
  topics: [
    "React & Hooks",
    "TypeScript",
    "State Management",
    "Web Accessibility",
    "Performance Optimisation",
    "CSS Layout",
  ],
  sections: [
    { name: "Multiple choice — React & TS", questions: 2, points: 20, duration: "15 min", type: "MCQ" },
    { name: "Bug fix — Controlled form", questions: 1, points: 30, duration: "25 min", type: "Coding" },
    { name: "Build feature — Data table", questions: 1, points: 50, duration: "50 min", type: "Coding" },
  ],
  instructions: [
    "Once started, the timer cannot be paused — plan your time before beginning.",
    "You can navigate between questions freely within the allotted time.",
    "Your answers auto-save every 30 seconds. A stable internet connection is required.",
    "Do not switch tabs or exit fullscreen — this will be logged and may end your attempt.",
    "Use of external AI assistants or third-party code is strictly prohibited.",
  ],
  requirements: [
    { label: "Desktop / Laptop", icon: Laptop, ok: true },
    { label: "Stable Internet (2+ Mbps)", icon: Wifi, ok: true },
    { label: "Webcam access", icon: Camera, ok: true },
    { label: "Microphone access", icon: Mic, ok: false },
  ],
  history: [
    { date: "Apr 12, 2026", event: "Assessment assigned by recruiter", by: "Riya Menon — Northwind Labs" },
    { date: "Apr 12, 2026", event: "Invitation email sent", by: "System" },
    { date: "Apr 30, 2026", event: "Reminder — Due in 7 days", by: "System" },
  ],
  similar: [
    { id: "AS-2044", title: "React & TypeScript Practical", company: "Aurora Digital", type: "Coding" },
    { id: "AS-2036", title: "Data Structures Deep-Dive", company: "Vertex Systems", type: "Coding" },
  ],
};

const CandidateAssessmentDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [open, setOpen] = useState(false);

  const Icon = iconFor(assessment.type);

  return (
    <CandidateLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 gap-1.5">
        <Link to="/candidate/assessments"><ArrowLeft className="h-4 w-4" /> Back to assessments</Link>
      </Button>

      {/* Hero */}
      <Card className="border-border/60 shadow-sm mb-6 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-primary via-primary/70 to-primary/40" />
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="h-16 w-16 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-brand shrink-0">
              <Icon className="h-8 w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-muted/50 text-muted-foreground text-[10px]">{id ?? assessment.id}</Badge>
                <Badge variant="outline" className={diffTone[assessment.difficulty]}>{assessment.difficulty}</Badge>
                <Badge variant="outline" className="bg-primary-soft text-primary border-primary/20">{assessment.type}</Badge>
                {assessment.proctored && (
                  <Badge variant="outline" className="bg-primary-soft text-primary border-primary/20 gap-1">
                    <ShieldCheck className="h-3 w-3" /> Proctored
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">{assessment.title}</h1>
              <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{assessment.company}</span>
                <span>•</span>
                <span>{assessment.role}</span>
              </p>

              <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Duration", value: assessment.duration, icon: Clock },
                  { label: "Questions", value: assessment.questions, icon: ClipboardList },
                  { label: "Total points", value: assessment.totalPoints, icon: Target },
                  { label: "Passing", value: `${assessment.passingScore}%`, icon: CheckCircle2 },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-lg border border-border/60 bg-muted/30">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground uppercase tracking-wider">
                      <s.icon className="h-3 w-3" /> {s.label}
                    </div>
                    <p className="font-display text-lg font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-64 shrink-0 space-y-3">
              <div className="p-4 rounded-xl border border-warning/30 bg-warning/5">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Due date</p>
                <p className="font-semibold text-foreground text-sm">{assessment.dueDate}</p>
                <Badge className="mt-2 bg-warning/10 text-warning border-warning/20">
                  <AlertCircle className="h-3 w-3 mr-1" /> Due {assessment.dueIn}
                </Badge>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                    <PlayCircle className="h-4 w-4" /> Start assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ready to begin?</DialogTitle>
                    <DialogDescription>
                      Once you start, the {assessment.duration} timer begins and cannot be paused. You have {assessment.attemptsAllowed} attempt.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border/60">
                      <Checkbox id="agree" checked={agreed} onCheckedChange={(v) => setAgreed(!!v)} className="mt-0.5" />
                      <label htmlFor="agree" className="text-sm text-foreground leading-snug cursor-pointer">
                        I confirm I have read the instructions and agree to the honor code. I will not use external help or AI tools.
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                      disabled={!agreed}
                      onClick={() => {
                        setOpen(false);
                        toast({ title: "Assessment started", description: assessment.title });
                      }}
                      className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground"
                    >
                      Start now
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full gap-2" onClick={() => toast({ title: "Instructions downloaded" })}>
                <Download className="h-4 w-4" /> Download brief
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="bg-muted/60">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-5 space-y-5">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> About this assessment</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  <p>{assessment.description}</p>
                </CardContent>
              </Card>

              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Topics covered</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {assessment.topics.map((t) => (
                    <Badge key={t} variant="outline" className="bg-muted/40 text-foreground border-border">{t}</Badge>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sections" className="mt-5">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><ListChecks className="h-4 w-4 text-primary" /> Section breakdown</CardTitle>
                  <CardDescription>{assessment.sections.length} sections • {assessment.questions} total questions</CardDescription>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/60">
                  {assessment.sections.map((s, i) => (
                    <div key={s.name} className="p-5 flex items-center gap-4">
                      <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-display font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{s.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-3">
                          <span>{s.questions} {s.questions === 1 ? "question" : "questions"}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                          <span>•</span>
                          <span>{s.type}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-foreground leading-tight">{s.points}</p>
                        <p className="text-[11px] text-muted-foreground">points</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="instructions" className="mt-5">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Read carefully before starting</CardTitle>
                  <CardDescription>Failure to comply may end your attempt</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {assessment.instructions.map((ins, i) => (
                      <li key={i} className="flex gap-3 text-sm text-foreground">
                        <span className="h-6 w-6 rounded-full bg-primary-soft text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed pt-0.5">{ins}</span>
                      </li>
                    ))}
                  </ol>
                  <Separator className="my-5" />
                  <div className="p-4 rounded-lg bg-primary-soft/40 border border-primary/20 flex gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Honor code</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        By starting this test you agree to complete it independently. Violations may result in disqualification from the hiring process.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-5">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="relative border-l border-border/60 pl-5 space-y-5">
                    {assessment.history.map((h, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[26px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-primary-soft" />
                        <p className="text-sm font-semibold text-foreground">{h.event}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{h.date} • {h.by}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">System requirements</CardTitle>
              <CardDescription>Check readiness before you start</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.requirements.map((r) => (
                <div key={r.label} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${r.ok ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    <r.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-foreground flex-1">{r.label}</span>
                  {r.ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => toast({ title: "System check complete" })}>
                Run system check
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Used</span>
                <span className="font-semibold text-foreground">{assessment.attemptsUsed} / {assessment.attemptsAllowed}</span>
              </div>
              <Progress value={(assessment.attemptsUsed / assessment.attemptsAllowed) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-3">Language: {assessment.language}</p>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Similar assessments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assessment.similar.map((s) => {
                const I = iconFor(s.type);
                return (
                  <Link
                    key={s.id}
                    to={`/candidate/assessments/${s.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <I className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm text-foreground truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.company}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground">Need help?</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">Reach out to support if you face any technical issue during the test.</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Support ticket opened" })}>
                    Contact support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateAssessmentDetail;
