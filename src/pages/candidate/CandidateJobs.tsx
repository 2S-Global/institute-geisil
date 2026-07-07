import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Clock,
  IndianRupee,
  Bookmark,
  BookmarkCheck,
  Filter,
  SlidersHorizontal,
  Star,
  TrendingUp,
  Send,
  Grid3x3,
  List,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CandidateApplyModal from "@/components/candidate/CandidateApplyModal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import API from "@/lib/axios";
import { useBookmarkJob } from "./hooks/useBookmarkJob";
type Job = {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  workMode: "Remote" | "Hybrid" | "On-site";
  experience: string;
  salary: string;
  salaryNum: number;
  posted: string;
  match: number;
  tags: string[];
  category: string;
  featured?: boolean;
  urgent?: boolean;
  description: string;
};

const datePosted = [
  { id: 1, name: "All", value: "all", isChecked: false },
  { id: 2, name: "Last Hour", value: "last-hour", isChecked: false },
  { id: 3, name: "Last 24 Hours", value: "last-24-hour", isChecked: false },
  { id: 4, name: "Last 7 Days", value: "last-7-days", isChecked: false },
  { id: 5, name: "Last 14 Days", value: "last-14-days", isChecked: false },
  { id: 6, name: "Last 30 Days", value: "last-30-days", isChecked: false },
];
// const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const workModes = ["Remote", "On-site"];

const locations = ["Remote"];

const modeStyles: Record<string, string> = {
  Remote: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Hybrid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "On-site": "bg-amber-500/10 text-amber-700 border-amber-500/20",
};

function FilterPanel({
  jobTypes,
  experienceLevels,
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
  selectedModes,
  setSelectedModes,
  selectedExp,
  setSelectedExp,
  salary,
  setSalary,
  onReset,
}: {
  jobTypes: string[];
  selectedCategories: string[];
  experienceLevels: string[];
  setSelectedCategories: (v: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (v: string[]) => void;
  selectedModes: string[];
  setSelectedModes: (v: string[]) => void;
  selectedExp: string[];
  setSelectedExp: (v: string[]) => void;
  salary: number[];
  setSalary: (v: number[]) => void;
  onReset: () => void;
}) {
  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const Section = ({
    title,
    items,
    selected,
    onToggle,
  }: {
    title: string;
    items: string[];
    selected: string[];
    onToggle: (v: string) => void;
  }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="space-y-2">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Checkbox
              checked={selected.includes(item)}
              onCheckedChange={() => onToggle(item)}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs"
        >
          Reset
        </Button>
      </div>
      <Separator />
      <Section
        title="Job Type"
        items={jobTypes}
        selected={selectedTypes}
        onToggle={(v) => toggle(selectedTypes, v, setSelectedTypes)}
      />
      <Section
        title="Date Posted"
        items={datePosted.map((item) => item.name)}
        selected={selectedCategories}
        onToggle={(v) => toggle(selectedCategories, v, setSelectedCategories)}
      />
      <Separator />

      <Separator />
      <Section
        title="Work Mode"
        items={workModes}
        selected={selectedModes}
        onToggle={(v) => toggle(selectedModes, v, setSelectedModes)}
      />
      <Separator />
      <Section
        title="Experience"
        items={experienceLevels}
        selected={selectedExp}
        onToggle={(v) => toggle(selectedExp, v, setSelectedExp)}
      />
      <Separator />
      {/* <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Salary (LPA)</h4>
          <span className="text-xs text-muted-foreground">
            ₹{salary[0]} - ₹{salary[1]}
          </span>
        </div>
        <Slider
          value={salary}
          onValueChange={setSalary}
          min={0}
          max={50}
          step={1}
          className="mt-2"
        />
      </div> */}
    </div>
  );
}

export default function CandidateJobs() {
  //custom hook for bookmark
  const { handleBookmark, bookmarkLoading } = useBookmarkJob();

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "list">("list");
  const [selectedDatePosted, setSelectedDatePosted] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);
  const [salary, setSalary] = useState<number[]>([0, 50]);
  const [saved, setSaved] = useState<Set<string>>(new Set(["j2", "j6"]));

  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState(6);
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetchJobTypes();
    fetchExperienceLevels();
    fetchJobs();
  }, []);

  useEffect(() => {
    setVisibleJobs(6);
  }, [
    query,
    location,
    selectedTypes,
    selectedModes,
    selectedExp,
    selectedDatePosted,
  ]);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/api/candidate/joblisting/get_all_job_list");

      if (res.data.success) {
        setAllJobs(res.data.data);
      }
    } catch (error) {
      console.error(error);
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobTypes = async () => {
    try {
      const res = await API.get("/api/jobposting/all_job_types");

      if (res.data.success) {
        setJobTypes(res.data.data.map((item: any) => item.name));
      }
    } catch (error) {
      console.error("Job Types API Error:", error);
      setJobTypes([]);
    }
  };

  const formatSalary = (salary: any) => {
    if (!salary) return "Salary not disclosed";

    if (salary.structure === "range") {
      return `${salary.currency}${salary.min.toLocaleString()} - ${salary.currency}${salary.max.toLocaleString()} ${salary.rate}`;
    }

    return `${salary.currency}${salary.amount.toLocaleString()} ${salary.rate}`;
  };

  const fetchExperienceLevels = async () => {
    try {
      const res = await API.get("/api/jobposting/all_job_experience_levels");

      if (res.data.success) {
        setExperienceLevels(res.data.data.map((item: any) => item.name));
      }
    } catch (error) {
      console.error("Experience Levels API Error:", error);
      setExperienceLevels([]);
    }
  };

  const reset = () => {
    setSelectedDatePosted([]);
    setSelectedTypes([]);
    setSelectedModes([]);
    setSelectedExp([]);
    setSalary([0, 50]);
    setLocation("all");
    setQuery("");
  };



  const toggleSave = async (id: string, isCurrentlyBookmarked: boolean) => {
    await handleBookmark(id, isCurrentlyBookmarked, () => {
      setAllJobs((prev) =>
        prev.map((job) =>
          job._id === id ? { ...job, isBookmarked: !isCurrentlyBookmarked } : job
        )
      );
    });
  };

  const jobs = useMemo(() => {
    const now = new Date();

    let list = allJobs.filter((j) => {
      const q = query.toLowerCase();

      // Search
      const matchQ =
        !q ||
        j.jobTitle.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q);

      // Location
      const matchLoc =
        location === "all" ||
        (j.location || "").toLowerCase().includes(location.toLowerCase());

      // Job Type
      const matchType =
        !selectedTypes.length ||
        j.jobType.some((type: string) => selectedTypes.includes(type));

      // Work Mode
      const matchMode =
        !selectedModes.length ||
        selectedModes.some(
          (mode) =>
            mode.toLowerCase().trim() ===
            j.jobLocationType?.toLowerCase().trim(),
        );

      // Experience
      const matchExp =
        !selectedExp.length || selectedExp.includes(j.jobExperienceLevel);

      // Date Posted
      let matchDate = true;

      if (selectedDatePosted.length && !selectedDatePosted.includes("All")) {
        const created = new Date(j.createdDate);
        const diffHours =
          (now.getTime() - created.getTime()) / (1000 * 60 * 60);

        matchDate = selectedDatePosted.some((item) => {
          switch (item) {
            case "Last Hour":
              return diffHours <= 1;

            case "Last 24 Hours":
              return diffHours <= 24;

            case "Last 7 Days":
              return diffHours <= 24 * 7;

            case "Last 14 Days":
              return diffHours <= 24 * 14;

            case "Last 30 Days":
              return diffHours <= 24 * 30;

            default:
              return true;
          }
        });
      }

      return (
        matchQ && matchLoc && matchType && matchMode && matchExp && matchDate
      );
    });

    // Sorting
    switch (sort) {
      case "recent":
        list.sort(
          (a, b) =>
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime(),
        );
        break;

      case "salary":
        list.sort((a, b) => {
          const salaryA =
            a.salary?.max ?? a.salary?.amount ?? a.salary?.min ?? 0;

          const salaryB =
            b.salary?.max ?? b.salary?.amount ?? b.salary?.min ?? 0;

          return salaryB - salaryA;
        });
        break;

      default:
        break;
    }

    return list;
  }, [
    allJobs,
    query,
    location,
    sort,
    selectedTypes,
    selectedModes,
    selectedExp,
    selectedDatePosted,
  ]);

  const JobCard = ({ job }: { job: any }) => {

    //destructure
    const isSaved = job?.isBookmarked
    const workMode = job?.jobLocationType?.toLowerCase() === "remote" ? "Remote" : "On-site";
    const isApplied = job?.isApplied || appliedJobIds.has(job?._id);
    return (
      <Card className="group relative overflow-hidden border-border/60 hover:border-primary/40 hover:shadow-lg transition-all">
        {/* {job.featured && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-primary/70 text-primary-foreground text-[10px] font-semibold px-3 py-1 rounded-bl-md uppercase tracking-wider">
            Featured
          </div>
        )} */}
        <Link to={`/candidate/jobs/${job._id}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-lg border bg-muted/40 flex items-center justify-center overflow-hidden">
              <img
                src={job.logo}
                alt={job.company}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-display font-semibold text-base text-foreground truncate group-hover:text-primary transition-colors">
                    {job.jobTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {job.companyName}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (!bookmarkLoading[job._id]) {
                      toggleSave(job._id, !!isSaved);
                    }
                  }}
                  disabled={bookmarkLoading[job._id]}
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors",
                    bookmarkLoading[job._id] && "opacity-50 "
                  )}
                  aria-label="Save job"
                >
                  {bookmarkLoading[job._id] ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : isSaved ? (
                    <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.jobLocationType === "remote"
                    ? "Remote"
                    : job.location || job.advertiseCityName || "On-site"}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {job.jobExperienceLevel}
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {formatSalary(job.salary)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {job.createdAgo}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", modeStyles[workMode])}
                >
                  {workMode}
                </Badge>

                {job.urgent && (
                  <Badge className="text-[10px] bg-destructive/10 text-destructive border-destructive/20 border">
                    Urgent
                  </Badge>
                )}
                {job.jobType?.map((type: string) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-[10px] font-normal"
                  >
                    {type}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {job.description}
              </p>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  {/* <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Star className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                  </div> */}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                    <Link to={`/candidate/jobs/${job._id}`}>View</Link>
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setApplyingJob(job);
                    }}
                    disabled={isApplied}
                    className="gap-1.5"
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Applied
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Apply
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        </Link>
      </Card>
    );
  };
  
  return (
    <CandidateLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero search */}
        <Card className="border-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-6 md:p-8">
            <div className="max-w-3xl">
              <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Find your next opportunity
              </h1>
              <p className="text-muted-foreground mt-1.5">
                {allJobs.length}+ jobs from top companies, curated for your
                profile.
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-[1fr_220px_auto] gap-2 max-w-5xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, company"
                  className="pl-9 h-11 bg-background"
                />
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="h-11 bg-background">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  {locations.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block">
            <Card className="sticky top-20">
              <CardContent className="p-5">
                <FilterPanel
                  jobTypes={jobTypes}
                  experienceLevels={experienceLevels}
                  selectedCategories={selectedDatePosted}
                  setSelectedCategories={setSelectedDatePosted}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedModes={selectedModes}
                  setSelectedModes={setSelectedModes}
                  selectedExp={selectedExp}
                  setSelectedExp={setSelectedExp}
                  salary={salary}
                  setSalary={setSalary}
                  onReset={reset}
                />
              </CardContent>
            </Card>
          </aside>

          {/* Job listing */}
          <div className="space-y-4 min-w-0">
            <Card>
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="lg:hidden gap-1.5"
                      >
                        <Filter className="h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[300px] overflow-y-auto"
                    >
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-4">
                        <FilterPanel
                          jobTypes={jobTypes}
                          experienceLevels={experienceLevels}
                          selectedCategories={selectedDatePosted}
                          setSelectedCategories={setSelectedDatePosted}
                          selectedTypes={selectedTypes}
                          setSelectedTypes={setSelectedTypes}
                          selectedModes={selectedModes}
                          setSelectedModes={setSelectedModes}
                          selectedExp={selectedExp}
                          setSelectedExp={setSelectedExp}
                          salary={salary}
                          setSalary={setSalary}
                          onReset={reset}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {jobs.length}
                    </span>{" "}
                    of {allJobs.length} jobs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="h-9 w-[170px]">
                      <TrendingUp className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="match">Best Match</SelectItem> */}
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="salary">Highest Salary</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex border rounded-md p-0.5">
                    <Button
                      variant={view === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={view === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("grid")}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {jobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold">
                    No jobs match your filters
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting search terms or resetting filters.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={reset}
                  >
                    Reset filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  view === "grid"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1",
                )}
              >
                {jobs.slice(0, visibleJobs).map((j) => (
                  <JobCard key={j._id} job={j} />
                ))}
              </div>
            )}

            {visibleJobs < jobs.length && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  onClick={() => setVisibleJobs((prev) => prev + 6)}
                >
                  Load More Jobs
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>



      <CandidateApplyModal
        open={applyingJob !== null}
        onClose={() => setApplyingJob(null)}
        job={applyingJob}
        onSuccess={(jobId) => {
          setAppliedJobIds((prev) => {
            const next = new Set(prev);
            next.add(jobId);
            return next;
          });
        }}
      />
    </CandidateLayout>
  );
}
