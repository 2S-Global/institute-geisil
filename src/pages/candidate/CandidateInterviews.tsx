import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Video,
  MapPin,
  Clock,
  Building2,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Users,
  MessageSquare,
  Download,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import NoData from "@/components/common/NoData";

type Status = "upcoming" | "completed" | "cancelled";
type Mode = "Video" | "Onsite" | "Phone";

interface Interview {
  id: string;
  company: string;
  role: string;
  round: string;
  date: string;
  time: string;
  duration: string;
  mode: Mode;
  location?: string;
  meetingLink?: string;
  interviewers: { name: string; title: string }[];
  status: Status;
  notes?: string;
  feedback?: string;
  outcome?: "Passed" | "Rejected" | "On Hold";
}

const initial: Interview[] = [
  {
    id: "iv-001",
    company: "Innovate Corp",
    role: "Senior Product Designer",
    round: "Technical Round",
    date: "2026-07-08",
    time: "10:30",
    duration: "45 min",
    mode: "Video",
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    interviewers: [
      { name: "Ananya Rao", title: "Design Lead" },
      { name: "Karan Mehta", title: "Sr. Engineer" },
    ],
    status: "upcoming",
    notes: "Prepare portfolio walkthrough + a case study on onboarding redesign.",
  },
  {
    id: "iv-002",
    company: "Fintrust Bank",
    role: "UX Researcher",
    round: "HR Round",
    date: "2026-07-10",
    time: "15:00",
    duration: "30 min",
    mode: "Phone",
    interviewers: [{ name: "Priya Nair", title: "HR Partner" }],
    status: "upcoming",
  },
  {
    id: "iv-003",
    company: "Skyline Tech",
    role: "Frontend Engineer",
    round: "Onsite Panel",
    date: "2026-07-14",
    time: "11:00",
    duration: "2 hrs",
    mode: "Onsite",
    location: "Skyline HQ, Sector 62, Noida",
    interviewers: [
      { name: "Rohan Kapoor", title: "Engineering Manager" },
      { name: "Sara Iyer", title: "Principal Engineer" },
    ],
    status: "upcoming",
    notes: "System design + React deep-dive. Carry govt. ID.",
  },
  {
    id: "iv-004",
    company: "Northwind Labs",
    role: "Product Analyst",
    round: "Case Study",
    date: "2026-06-22",
    time: "14:00",
    duration: "60 min",
    mode: "Video",
    interviewers: [{ name: "Devika Sen", title: "Head of Analytics" }],
    status: "completed",
    outcome: "Passed",
    feedback:
      "Strong problem framing and analytical rigor. Moving to the final round with the hiring manager.",
  },
  {
    id: "iv-005",
    company: "Bluewave Studios",
    role: "Motion Designer",
    round: "Portfolio Review",
    date: "2026-06-18",
    time: "12:00",
    duration: "40 min",
    mode: "Video",
    interviewers: [{ name: "Ishaan Verma", title: "Creative Director" }],
    status: "completed",
    outcome: "On Hold",
    feedback: "Great craft. Team is reprioritizing hiring for Q3 — will revert in 2 weeks.",
  },
  {
    id: "iv-006",
    company: "Quantum Systems",
    role: "Data Engineer",
    round: "Technical Screen",
    date: "2026-06-10",
    time: "17:30",
    duration: "45 min",
    mode: "Video",
    interviewers: [{ name: "Aarav Malhotra", title: "Staff Engineer" }],
    status: "cancelled",
    notes: "Cancelled by recruiter — role paused.",
  },
];

const modeIcon: Record<Mode, typeof Video> = {
  Video: Video,
  Onsite: MapPin,
  Phone: Clock,
};

const statusStyle: Record<Status, string> = {
  upcoming: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

const outcomeStyle: Record<NonNullable<Interview["outcome"]>, string> = {
  Passed: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  "On Hold": "bg-warning/10 text-warning border-warning/20",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CandidateInterviews() {
  const [items, setItems] = useState<Interview[]>(initial);
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [tab, setTab] = useState<Status>("upcoming");
  const [reschedule, setReschedule] = useState<Interview | null>(null);
  const [rescheduleReason, setRescheduleReason] = useState("");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (i.status !== tab) return false;
      if (modeFilter !== "all" && i.mode !== modeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !i.company.toLowerCase().includes(q) &&
          !i.role.toLowerCase().includes(q) &&
          !i.round.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, tab, modeFilter, query]);

  const counts = useMemo(
    () => ({
      upcoming: items.filter((i) => i.status === "upcoming").length,
      completed: items.filter((i) => i.status === "completed").length,
      cancelled: items.filter((i) => i.status === "cancelled").length,
    }),
    [items]
  );

  const nextUp = useMemo(
    () =>
      items
        .filter((i) => i.status === "upcoming")
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0],
    [items]
  );

  const handleReschedule = () => {
    if (!reschedule) return;
    toast({
      title: "Reschedule request sent",
      description: `We've notified ${reschedule.company} about your request.`,
    });
    setReschedule(null);
    setRescheduleReason("");
  };

  const handleCancel = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "cancelled" as Status } : i))
    );
    toast({ title: "Interview cancelled" });
  };

  return (
    <CandidateLayout>
      <PageHeader
        eyebrow="Career"
        title="My Interviews"
        description="Track upcoming rounds, join meetings, and review feedback from past interviews."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button size="sm">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              Sync calendar
            </Button>
          </>
        }
      />

      {/* Next up highlight */}
      {nextUp && (
        <Card className="p-5 md:p-6 mb-6 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Next up
                </p>
                <p className="font-display font-bold text-lg text-foreground truncate">
                  {nextUp.round} · {nextUp.company}
                </p>
                <p className="text-sm text-muted-foreground truncate">{nextUp.role}</p>
              </div>
            </div>
            <div className="md:ml-auto flex flex-wrap items-center gap-3 text-sm">
              <div className="inline-flex items-center gap-1.5 text-foreground">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {formatDate(nextUp.date)}
              </div>
              <div className="inline-flex items-center gap-1.5 text-foreground">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {nextUp.time} · {nextUp.duration}
              </div>
              <Badge variant="outline" className="gap-1">
                {(() => {
                  const Icon = modeIcon[nextUp.mode];
                  return <Icon className="h-3 w-3" />;
                })()}
                {nextUp.mode}
              </Badge>
              {nextUp.meetingLink && (
                <Button size="sm" asChild>
                  <a href={nextUp.meetingLink} target="_blank" rel="noreferrer">
                    <Video className="h-4 w-4 mr-1.5" />
                    Join meeting
                  </a>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, role, or round…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={modeFilter} onValueChange={setModeFilter}>
            <SelectTrigger className="md:w-[180px]">
              <Filter className="h-4 w-4 mr-1.5" />
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All modes</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Onsite">Onsite</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Status)}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming ({counts.upcoming})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({counts.cancelled})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="space-y-4 mt-0">
          {filtered.length === 0 ? (
            <NoData
              title="No interviews here"
              description="Try changing filters or check another tab."
              className="border border-border bg-card rounded-xl p-12"
            />
          ) : (
            filtered.map((iv) => {
              const ModeIcon = modeIcon[iv.mode];
              return (
                <Card key={iv.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-5">
                    {/* Left: main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center flex-wrap gap-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {iv.role}
                            </h3>
                            <Badge variant="outline" className={statusStyle[iv.status]}>
                              {iv.status.charAt(0).toUpperCase() + iv.status.slice(1)}
                            </Badge>
                            {iv.outcome && (
                              <Badge variant="outline" className={outcomeStyle[iv.outcome]}>
                                {iv.outcome === "Passed" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                                {iv.outcome === "Rejected" && <XCircle className="h-3 w-3 mr-1" />}
                                {iv.outcome}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {iv.company} · {iv.round}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid sm:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                        <div className="inline-flex items-center gap-1.5 text-foreground">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          {formatDate(iv.date)}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-foreground">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          {iv.time} · {iv.duration}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-foreground">
                          <ModeIcon className="h-4 w-4 text-muted-foreground" />
                          {iv.mode}
                          {iv.location ? ` · ${iv.location}` : ""}
                        </div>
                        <div className="inline-flex items-center gap-1.5 text-foreground">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {iv.interviewers.length} interviewer
                          {iv.interviewers.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      {iv.interviewers.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap">
                          {iv.interviewers.map((p) => (
                            <div
                              key={p.name}
                              className="inline-flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border bg-muted/40"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                  {initialsOf(p.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-foreground">
                                {p.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                · {p.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(iv.notes || iv.feedback) && (
                        <div className="mt-4 rounded-md border bg-muted/30 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {iv.feedback ? "Feedback" : "Notes"}
                          </p>
                          <p className="text-sm text-foreground">
                            {iv.feedback || iv.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right: actions */}
                    <div className="lg:w-56 flex lg:flex-col gap-2 flex-wrap lg:border-l lg:pl-5">
                      {iv.status === "upcoming" && (
                        <>
                          {iv.meetingLink && (
                            <Button size="sm" className="w-full" asChild>
                              <a href={iv.meetingLink} target="_blank" rel="noreferrer">
                                <Video className="h-4 w-4 mr-1.5" />
                                Join meeting
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setReschedule(iv)}
                          >
                            Reschedule
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => handleCancel(iv.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {iv.status === "completed" && (
                        <>
                          <Button size="sm" variant="outline" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-1.5" />
                            Message recruiter
                          </Button>
                          <Button size="sm" variant="ghost" className="w-full" asChild>
                            <Link to="/candidate/applied-jobs">
                              View application
                              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                            </Link>
                          </Button>
                        </>
                      )}
                      {iv.status === "cancelled" && (
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <Link to="/candidate/jobs">Browse similar jobs</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Reschedule dialog */}
      <Dialog open={!!reschedule} onOpenChange={(o) => !o && setReschedule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request reschedule</DialogTitle>
            <DialogDescription>
              {reschedule
                ? `${reschedule.round} with ${reschedule.company} on ${formatDate(
                    reschedule.date
                  )} at ${reschedule.time}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Reason (optional)</label>
            <Textarea
              placeholder="Share a brief reason and preferred time slots…"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReschedule(null)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CandidateLayout>
  );
}
