import { useMemo, useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Send,
  ExternalLink,
  Trash2,
  IndianRupee,
  BookmarkX,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

type Job = {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  savedOn: string;
  match: number;
  tags: string[];
  deadline?: string;
};

const jobsData: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Razorpay",
    logo: "RP",
    location: "Bengaluru, IN",
    type: "Full-time",
    salary: "₹28-38 LPA",
    posted: "2 days ago",
    savedOn: "Today",
    match: 92,
    tags: ["React", "TypeScript", "Next.js"],
    deadline: "Closes in 5 days",
  },
  {
    id: 2,
    title: "React Developer",
    company: "Zoho",
    logo: "ZH",
    location: "Chennai, IN",
    type: "Hybrid",
    salary: "₹18-24 LPA",
    posted: "3 days ago",
    savedOn: "Yesterday",
    match: 86,
    tags: ["React", "Redux", "Node.js"],
    deadline: "Closes in 12 days",
  },
  {
    id: 3,
    title: "UI Engineer",
    company: "Swiggy",
    logo: "SW",
    location: "Remote",
    type: "Full-time",
    salary: "₹22-30 LPA",
    posted: "5 days ago",
    savedOn: "3 days ago",
    match: 78,
    tags: ["Figma", "Design Systems", "CSS"],
  },
  {
    id: 4,
    title: "Frontend Lead",
    company: "Cred",
    logo: "CR",
    location: "Bengaluru, IN",
    type: "Full-time",
    salary: "₹40-55 LPA",
    posted: "1 week ago",
    savedOn: "1 week ago",
    match: 71,
    tags: ["React", "System Design", "Leadership"],
    deadline: "Closes in 2 days",
  },
  {
    id: 5,
    title: "Product Designer (UI)",
    company: "Freshworks",
    logo: "FW",
    location: "Chennai, IN",
    type: "Full-time",
    salary: "₹16-22 LPA",
    posted: "2 weeks ago",
    savedOn: "2 weeks ago",
    match: 88,
    tags: ["UI/UX", "Figma", "Prototyping"],
  },
  {
    id: 6,
    title: "Full Stack Developer",
    company: "Postman",
    logo: "PM",
    location: "Bengaluru, IN",
    type: "Remote",
    salary: "₹24-32 LPA",
    posted: "3 weeks ago",
    savedOn: "3 weeks ago",
    match: 64,
    tags: ["React", "Node.js", "MongoDB"],
  },
];

const sortOptions = [
  { value: "recent", label: "Recently saved" },
  { value: "match", label: "Best match" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
  { value: "deadline", label: "Closing soon" },
];

export default function CandidateSavedJobs() {
  const [jobs, setJobs] = useState<Job[]>(jobsData);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [removeId, setRemoveId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case "match":
        list.sort((a, b) => b.match - a.match);
        break;
      case "salary-high":
        list.sort((a, b) => parseInt(b.salary.replace(/\D/g, "")) - parseInt(a.salary.replace(/\D/g, "")));
        break;
      case "salary-low":
        list.sort((a, b) => parseInt(a.salary.replace(/\D/g, "")) - parseInt(b.salary.replace(/\D/g, "")));
        break;
      case "deadline":
        list.sort((a, b) => (a.deadline ? -1 : 1));
        break;
      default:
        break;
    }
    return list;
  }, [jobs, query, sort]);

  const stats = [
    {
      label: "Saved Jobs",
      value: jobs.length,
      icon: BookmarkCheck,
      tint: "text-primary bg-primary/10",
    },
    {
      label: "High Match (>80%)",
      value: jobs.filter((j) => j.match > 80).length,
      icon: Bookmark,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Closing Soon",
      value: jobs.filter((j) => j.deadline).length,
      icon: CalendarDays,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Applied",
      value: 2,
      icon: Send,
      tint: "text-violet-600 bg-violet-500/10",
    },
  ];

  const handleRemove = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setRemoveId(null);
    toast.success("Job removed from saved list");
  };

  const handleApply = (job: Job) => {
    toast.success(`Application started for ${job.title} at ${job.company}`);
  };

  return (
    <CandidateLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Saved Jobs
            </h1>
            <p className="text-muted-foreground mt-1">
              Keep track of jobs you are interested in and apply when ready.
            </p>
          </div>
          <Button className="gap-2">
            <Briefcase className="h-4 w-4" /> Browse Jobs
          </Button>
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
          <CardContent className="p-4 flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, location, or skill…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[190px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <BookmarkX className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="font-medium text-foreground">No saved jobs found</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or browse new opportunities.
                </p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((j) => (
              <Card key={j.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-display font-bold shrink-0">
                      {j.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{j.title}</h3>
                        <Badge variant="secondary" className="font-normal">
                          {j.match}% match
                        </Badge>
                        {j.deadline && (
                          <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/10 gap-1">
                            <Clock className="h-3 w-3" />
                            {j.deadline}
                          </Badge>
                        )}
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
                          <Clock className="h-3.5 w-3.5" /> Posted {j.posted}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {j.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="font-normal text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Saved {j.savedOn}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-2">
                      <Button size="sm" className="gap-2" onClick={() => handleApply(j)}>
                        <Send className="h-4 w-4" /> Apply
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="gap-2">
                          <ExternalLink className="h-4 w-4" /> View
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setRemoveId(j.id)}
                        >
                          <BookmarkX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {filtered.length > 0 && (
          <>
            <Separator />
            <p className="text-center text-sm text-muted-foreground">
              Showing {filtered.length} of {jobs.length} saved jobs
            </p>
          </>
        )}

        {/* Remove confirmation */}
        <Dialog open={removeId !== null} onOpenChange={() => setRemoveId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remove from saved?</DialogTitle>
              <DialogDescription>
                This job will be removed from your saved list. You can always find it again by browsing jobs.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row gap-2 justify-end">
              <Button variant="outline" onClick={() => setRemoveId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => removeId !== null && handleRemove(removeId)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CandidateLayout>
  );
}
