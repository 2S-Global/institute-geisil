import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Award,
  TrendingUp,
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Target,
  BookOpen,
  Code2,
  Brain,
  Sparkles,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "Assigned", value: 6, icon: ClipboardList, tone: "text-primary bg-primary-soft" },
  { label: "In progress", value: 1, icon: PlayCircle, tone: "text-warning bg-warning/10" },
  { label: "Completed", value: 12, icon: CheckCircle2, tone: "text-success bg-success/10" },
  { label: "Avg. score", value: "86%", icon: Award, tone: "text-primary bg-primary-soft" },
];

const iconFor = (type: string) => {
  if (type === "Coding") return Code2;
  if (type === "Aptitude") return Brain;
  if (type === "Domain") return BookOpen;
  return Target;
};

const upcoming = [
  {
    id: "AS-2041",
    title: "Frontend Engineer — Coding Challenge",
    company: "Northwind Labs",
    type: "Coding",
    duration: "90 min",
    questions: 4,
    dueDate: "May 08, 2026",
    dueIn: "in 2 days",
    difficulty: "Medium",
    proctored: true,
    status: "assigned",
  },
  {
    id: "AS-2039",
    title: "General Aptitude & Reasoning",
    company: "GEISIL Placement Cell",
    type: "Aptitude",
    duration: "60 min",
    questions: 40,
    dueDate: "May 12, 2026",
    dueIn: "in 6 days",
    difficulty: "Easy",
    proctored: false,
    status: "assigned",
  },
  {
    id: "AS-2036",
    title: "Data Structures Deep-Dive",
    company: "Vertex Systems",
    type: "Coding",
    duration: "120 min",
    questions: 6,
    dueDate: "May 14, 2026",
    dueIn: "in 8 days",
    difficulty: "Hard",
    proctored: true,
    status: "assigned",
  },
];

const inProgress = {
  id: "AS-2044",
  title: "React & TypeScript Practical",
  company: "Aurora Digital",
  type: "Coding",
  duration: "75 min",
  progress: 42,
  answered: 3,
  total: 7,
  timeLeft: "38 min left",
  savedAt: "Auto-saved 2 min ago",
};

const completed = [
  { id: "AS-1998", title: "System Design Basics", company: "Vertex Systems", type: "Domain", score: 92, percentile: 96, date: "Apr 28, 2026", status: "Passed" },
  { id: "AS-1985", title: "SQL & Databases", company: "GEISIL Placement Cell", type: "Domain", score: 88, percentile: 91, date: "Apr 22, 2026", status: "Passed" },
  { id: "AS-1972", title: "Verbal Ability", company: "Northwind Labs", type: "Aptitude", score: 74, percentile: 68, date: "Apr 14, 2026", status: "Passed" },
  { id: "AS-1961", title: "Java Fundamentals", company: "Kestrel Technologies", type: "Coding", score: 65, percentile: 54, date: "Apr 06, 2026", status: "Review" },
];

const practice = [
  { title: "DSA — Arrays & Strings", questions: 45, difficulty: "Easy", tag: "Coding" },
  { title: "Dynamic Programming Sprint", questions: 20, difficulty: "Hard", tag: "Coding" },
  { title: "Logical Reasoning Drills", questions: 60, difficulty: "Medium", tag: "Aptitude" },
  { title: "SQL Query Patterns", questions: 30, difficulty: "Medium", tag: "Domain" },
];

const diffTone: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/20",
  Medium: "bg-warning/10 text-warning border-warning/20",
  Hard: "bg-destructive/10 text-destructive border-destructive/20",
};

const CandidateAssessments = () => {
  const { toast } = useToast();

  return (
    <CandidateLayout>
      <PageHeader
        eyebrow="My Assessments"
        title="Test your skills, showcase your strengths"
        description="Track assigned tests, resume in-progress attempts, and review your past performance."
        actions={
          <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
            <Sparkles className="h-4 w-4" /> Take practice test
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
                <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resume in-progress */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary-soft/40 to-transparent shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="h-14 w-14 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-brand shrink-0">
                <PlayCircle className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <Badge className="bg-warning/15 text-warning border-warning/20 mb-2">In progress</Badge>
                <h3 className="font-display font-bold text-lg text-foreground truncate">{inProgress.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {inProgress.company} • {inProgress.type} • {inProgress.duration}
                </p>
              </div>
            </div>
            <div className="lg:w-72">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>{inProgress.answered} of {inProgress.total} answered</span>
                <span className="text-warning font-semibold flex items-center gap-1"><Clock className="h-3 w-3" />{inProgress.timeLeft}</span>
              </div>
              <Progress value={inProgress.progress} className="h-2" />
              <p className="text-[11px] text-muted-foreground mt-1.5">{inProgress.savedAt}</p>
            </div>
            <Button
              onClick={() => toast({ title: "Resuming assessment", description: inProgress.title })}
              className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
            >
              Resume test <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, company or type…" className="pl-9 bg-card" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="md:w-44 bg-card"><Filter className="h-4 w-4 mr-1.5" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="aptitude">Aptitude</SelectItem>
            <SelectItem value="domain">Domain</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="due">
          <SelectTrigger className="md:w-44 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="due">Sort: Due date</SelectItem>
            <SelectItem value="new">Newest</SelectItem>
            <SelectItem value="diff">Difficulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="bg-muted/60">
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
          <TabsTrigger value="practice">Practice</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-5 space-y-4">
          {upcoming.map((a) => {
            const Icon = iconFor(a.type);
            return (
              <Card
                key={a.id}
                className="border-border/60 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className="bg-muted/50 text-muted-foreground text-[10px]"
                          >
                            {a.id}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={diffTone[a.difficulty]}
                          >
                            {a.difficulty}
                          </Badge>
                          {a.proctored && (
                            <Badge
                              variant="outline"
                              className="bg-primary-soft text-primary border-primary/20 text-[10px]"
                            >
                              Proctored
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-foreground truncate">
                          {a.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {a.company} • {a.type}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {a.duration}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ClipboardList className="h-3 w-3" />
                            {a.questions} questions
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due {a.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                      <Badge className="bg-warning/10 text-warning border-warning/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Due {a.dueIn}
                      </Badge>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/candidate/assessments/${a.id}`}>
                            Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            toast({
                              title: "Starting assessment",
                              description: a.title,
                            })
                          }
                          className="gap-1.5 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground"
                        >
                          Start <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="completed" className="mt-5">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0 divide-y divide-border/60">
              {completed.map((c) => {
                const Icon = iconFor(c.type);
                const passed = c.status === "Passed";
                return (
                  <div key={c.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="h-11 w-11 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{c.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{c.company} • {c.type} • {c.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-display text-xl font-bold text-foreground leading-tight">{c.score}%</p>
                        <p className="text-[11px] text-muted-foreground">{c.percentile}th percentile</p>
                      </div>
                      <Badge variant="outline" className={passed ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}>
                        {passed ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                        {c.status}
                      </Badge>
                      <Button asChild variant="ghost" size="sm" className="gap-1">
                        <Link to={`/evaluations/${c.id}`}>View report <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm mt-5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" /> Your strengths</CardTitle>
              <CardDescription>Based on your last 12 completed assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { skill: "Data Structures & Algorithms", value: 92 },
                { skill: "SQL & Databases", value: 88 },
                { skill: "System Design", value: 82 },
                { skill: "Verbal Ability", value: 74 },
                { skill: "Quantitative Aptitude", value: 71 },
              ].map((s) => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-foreground font-medium">{s.skill}</span>
                    <span className="text-muted-foreground font-semibold">{s.value}%</span>
                  </div>
                  <Progress value={s.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {practice.map((p) => {
              const Icon = iconFor(p.tag);
              return (
                <Card key={p.title} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display font-bold text-foreground">{p.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.questions} questions • Self-paced</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className={diffTone[p.difficulty]}>{p.difficulty}</Badge>
                          <Badge variant="outline" className="bg-muted/50 text-muted-foreground">{p.tag}</Badge>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => toast({ title: "Practice started", description: p.title })}
                    >
                      <PlayCircle className="h-4 w-4" /> Start practice
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </CandidateLayout>
  );
};

export default CandidateAssessments;
