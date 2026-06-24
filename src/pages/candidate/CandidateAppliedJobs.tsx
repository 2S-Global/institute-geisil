import { useMemo, useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  CalendarCheck,
  MoreVertical,
  FileText,
  ExternalLink,
  Trash2,
  Send,
  Hourglass,
  IndianRupee,
  Bookmark,
} from "lucide-react";

type Status = "Applied" | "In Review" | "Shortlisted" | "Interview" | "Offered" | "Rejected";

const statusMeta: Record<Status, { color: string; icon: any }> = {
  Applied: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Send },
  "In Review": {
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: Hourglass,
  },
  Shortlisted: {
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    icon: CheckCircle2,
  },
  Interview: {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: CalendarCheck,
  },
  Offered: {
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  Rejected: { color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: XCircle },
};

const jobs: {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  appliedOn: string;
  status: Status;
  match: number;
  nextStep?: string;
}[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Razorpay",
    logo: "RP",
    location: "Bengaluru, IN",
    type: "Full-time",
    salary: "₹28-38 LPA",
    appliedOn: "2 days ago",
    status: "Interview",
    match: 92,
    nextStep: "Technical round • 12 Mar, 3:00 PM",
  },
  {
    id: 2,
    title: "React Developer",
    company: "Zoho",
    logo: "ZH",
    location: "Chennai, IN",
    type: "Hybrid",
    salary: "₹18-24 LPA",
    appliedOn: "4 days ago",
    status: "Shortlisted",
    match: 86,
    nextStep: "Awaiting recruiter call",
  },
  {
    id: 3,
    title: "UI Engineer",
    company: "Swiggy",
    logo: "SW",
    location: "Remote",
    type: "Full-time",
    salary: "₹22-30 LPA",
    appliedOn: "1 week ago",
    status: "In Review",
    match: 78,
  },
  {
    id: 4,
    title: "Frontend Lead",
    company: "Cred",
    logo: "CR",
    location: "Bengaluru, IN",
    type: "Full-time",
    salary: "₹40-55 LPA",
    appliedOn: "1 week ago",
    status: "Applied",
    match: 71,
  },
  {
    id: 5,
    title: "Product Designer (UI)",
    company: "Freshworks",
    logo: "FW",
    location: "Chennai, IN",
    type: "Full-time",
    salary: "₹16-22 LPA",
    appliedOn: "2 weeks ago",
    status: "Offered",
    match: 88,
    nextStep: "Review offer letter",
  },
  {
    id: 6,
    title: "Full Stack Developer",
    company: "Postman",
    logo: "PM",
    location: "Bengaluru, IN",
    type: "Remote",
    salary: "₹24-32 LPA",
    appliedOn: "3 weeks ago",
    status: "Rejected",
    match: 64,
  },
];

const statusFilters: ("All" | Status)[] = [
  "All",
  "Applied",
  "In Review",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
];

export default function CandidateAppliedJobs() {
  const [tab, setTab] = useState<(typeof statusFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => (c[j.status] = (c[j.status] || 0) + 1));
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => (tab === "All" ? true : j.status === tab));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q),
      );
    }
    if (sort === "match") list = [...list].sort((a, b) => b.match - a.match);
    return list;
  }, [tab, query, sort]);

  const stats = [
    { label: "Total Applied", value: jobs.length, icon: Briefcase, tint: "text-primary bg-primary/10" },
    {
      label: "In Process",
      value:
        (counts["In Review"] || 0) + (counts["Shortlisted"] || 0) + (counts["Interview"] || 0),
      icon: Hourglass,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Interviews",
      value: counts["Interview"] || 0,
      icon: CalendarCheck,
      tint: "text-violet-600 bg-violet-500/10",
    },
    {
      label: "Offers",
      value: counts["Offered"] || 0,
      icon: CheckCircle2,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
  ];

  return (
    <CandidateLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Applied Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Track every application, interview, and offer in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" /> Export
            </Button>
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" /> Browse Jobs
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${s.tint}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-semibold text-foreground leading-tight">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by job title, company, or location…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most recent</SelectItem>
                    <SelectItem value="match">Best match</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50">
                {statusFilters.map((s) => (
                  <TabsTrigger key={s} value={s} className="gap-2">
                    {s}
                    <Badge
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] bg-background/80"
                    >
                      {counts[s] || 0}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Briefcase className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">No applications found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your filters or browse new jobs.
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((j) => {
              const meta = statusMeta[j.status];
              const StatusIcon = meta.icon;
              return (
                <Card key={j.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-display font-bold shrink-0">
                        {j.logo}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate">{j.title}</h3>
                          <Badge
                            variant="outline"
                            className={`gap-1 font-medium ${meta.color}`}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {j.status}
                          </Badge>
                          <Badge variant="secondary" className="font-normal">
                            {j.match}% match
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" /> {j.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> {j.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" /> {j.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5" /> {j.salary}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Applied {j.appliedOn}
                          </span>
                        </div>
                        {j.nextStep && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-md">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            Next: {j.nextStep}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" /> View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" /> Open job
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" /> Save for later
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" /> View resume sent
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" /> Withdraw
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {filtered.length > 0 && (
          <>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {jobs.length} applications
            </p>
          </>
        )}
      </div>
    </CandidateLayout>
  );
}
