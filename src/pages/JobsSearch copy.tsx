import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  TrendingUp,
  Send,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import Cookies from "js-cookie";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import API from "@/lib/axios";
import { useBookmarkJob } from "./candidate/hooks/useBookmarkJob";
import { JobCardSkeleton } from "./candidate/components/JobCardSkeleton";
import NoData from "@/components/common/NoData";

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

const workModes = ["Remote", "On-site"];

const modeStyles: Record<string, string> = {
  Remote: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Hybrid: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "On-site": "bg-amber-500/10 text-amber-700 border-amber-500/20",
};

/**
 * Normalize experience values so URL/API values match
 * even if casing or URL encoding is different.
 */
const normalizeExperience = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace("years", "")
    .replace("year", "");

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
  const toggle = (arr: string[], v: string, set: (x: string[]) => void) => {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  };

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
        {items.map((item) => {
          const isExperience = title === "Experience";

          const isSelected = isExperience
            ? selected.some(
                (selectedItem) =>
                  normalizeExperience(selectedItem) ===
                  normalizeExperience(item),
              )
            : selected.includes(item);

          return (
            <label
              key={item}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                isSelected
                  ? "text-[#17396F]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(item)}
                className={cn(
                  isSelected &&
                    "border-[#17396F] bg-[#17396F] text-white data-[state=checked]:border-[#17396F] data-[state=checked]:bg-[#17396F]",
                )}
              />

              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display flex items-center gap-2 text-base font-semibold">
          <SlidersHorizontal className="h-4 w-4 text-[#17396F]" />
          Filters
        </h3>

        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-xs text-[#17396F] hover:bg-[#17396F]/10 hover:text-[#17396F]"
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

      <Section
        title="Work Mode"
        items={workModes}
        selected={selectedModes}
        onToggle={(v) => toggle(selectedModes, v, setSelectedModes)}
      />

      <Separator />

      {/* EXPERIENCE */}
      <Section
        title="Experience"
        items={experienceLevels}
        selected={selectedExp}
        onToggle={(v) => {
          setSelectedExp((prev) => {
            const exists = prev.some(
              (item) => normalizeExperience(item) === normalizeExperience(v),
            );

            if (exists) {
              return prev.filter(
                (item) => normalizeExperience(item) !== normalizeExperience(v),
              );
            }

            return [...prev, v];
          });
        }}
      />

      <Separator />
    </div>
  );
}

export default function CandidateJobs() {
  const { handleBookmark, bookmarkLoading } = useBookmarkJob();

  const [searchParams, setSearchParams] = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || searchParams.get("q") || "";

  const urlLocation = searchParams.get("location") || "";

  const urlExperience = searchParams.get("experience") || "";

  const getExperienceFromUrl = (value: string) => {
    if (!value) return [];

    return [
      ...new Set(
        value
          .split(",")
          .map((item) => decodeURIComponent(item).trim())
          .filter(Boolean),
      ),
    ];
  };

  const [query, setQuery] = useState(urlKeyword);

  const [location, setLocation] = useState(urlLocation || "all");

  const [sort, setSort] = useState("recent");

  const [view, setView] = useState<"grid" | "list">("list");

  const [selectedDatePosted, setSelectedDatePosted] = useState<string[]>([]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [selectedModes, setSelectedModes] = useState<string[]>([]);

  /**
   * Experience is always an array.
   *
   * Example:
   * ?experience=3-6%20years,6-10%20years
   */
  const [selectedExp, setSelectedExp] = useState<string[]>(
    getExperienceFromUrl(urlExperience),
  );

  /**
   * Experience options coming from API.
   */
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);

  /**
   * Sync keyword/location from URL.
   *
   * Experience is intentionally handled separately below
   * because experienceLevels comes from the API.
   */
  useEffect(() => {
    setQuery(urlKeyword);
    setLocation(urlLocation || "all");
  }, [urlKeyword, urlLocation]);

  useEffect(() => {
    const urlExperiences = getExperienceFromUrl(urlExperience);

    if (!urlExperiences.length) {
      setSelectedExp([]);
      return;
    }

    /**
     * API not loaded yet.
     *
     * Keep URL values temporarily so they don't disappear.
     */
    if (!experienceLevels.length) {
      setSelectedExp(urlExperiences);
      return;
    }

    /**
     * Match URL experience values against API values.
     * The API value is used as the final selected value.
     */
    const matchedExperiences = urlExperiences.map((urlExp) => {
      const matched = experienceLevels.find(
        (level) => normalizeExperience(level) === normalizeExperience(urlExp),
      );

      return matched || urlExp;
    });

    setSelectedExp([...new Set(matchedExperiences)]);
  }, [urlExperience, experienceLevels]);

  /**
   * Sync state -> URL.
   *
   * Keyword removed when cleared.
   * Location removed when cleared.
   * Experience removed when all values are cleared.
   */
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    // Keyword
    if (query.trim()) {
      params.set("keyword", query.trim());
    } else {
      params.delete("keyword");
      params.delete("q");
    }

    // Multiple Experience
    if (selectedExp.length > 0) {
      params.set("experience", selectedExp.join(","));
    } else {
      params.delete("experience");
    }

    // Location
    if (location && location !== "all" && location.trim()) {
      params.set("location", location.trim());
    } else {
      params.delete("location");
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [query, location, selectedExp]);

  const [salary, setSalary] = useState<number[]>([0, 50]);

  const [saved, setSaved] = useState<Set<string>>(new Set(["j2", "j6"]));

  const [jobTypes, setJobTypes] = useState<string[]>([]);

  const [allJobs, setAllJobs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [visibleJobs, setVisibleJobs] = useState(6);

  const [applyingJob, setApplyingJob] = useState<any | null>(null);

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const [token, setToken] = useState<string | null>(null);

  const [role, setRole] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") ?? Cookies.get("token") ?? null;

    const role = localStorage.getItem("role") ?? null;

    setToken(token);
    setRole(role);
  }, []);

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
      const res = await API.get("/api/candidate/joblisting/get_all_jobist");

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
    if (!salary) {
      return "Salary not disclosed";
    }

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
          job._id === id
            ? {
                ...job,
                isBookmarked: !isCurrentlyBookmarked,
              }
            : job,
        ),
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
        !selectedExp.length ||
        selectedExp.some(
          (experience) =>
            normalizeExperience(experience) ===
            normalizeExperience(j.jobExperienceLevel || ""),
        );

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
    const isSaved = job?.isBookmarked;

    const workMode =
      job?.jobLocationType?.toLowerCase() === "remote" ? "Remote" : "On-site";

    const isApplied = job?.isApplied || appliedJobIds.has(job?._id);

    return (
      <Card className="group relative overflow-hidden border-border/60 transition-all hover:border-primary/40 hover:shadow-lg">
        <Link to={`/jobs/${job._id}`}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
                <img
                  src={
                    job.logo || "https://abdaa.net/storage/2022/04/download.png"
                  }
                  alt={job.company}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                      {job.jobTitle}
                    </h3>

                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5" />
                      {job.companyName}
                    </p>
                  </div>

                  {token && Number(role) === 1 && (
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
                        "flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800",
                        bookmarkLoading[job._id] && "opacity-50",
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
                  )}

                  {!token && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        navigate("/login");
                      }}
                      className="flex items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                      aria-label="Save job"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
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

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", modeStyles[workMode])}
                  >
                    {workMode}
                  </Badge>

                  {job.urgent && (
                    <Badge className="border border-destructive/20 bg-destructive/10 text-[10px] text-destructive">
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

                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                  {job.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="flex items-center gap-1.5"></div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link to={`/jobs/${job._id}`}>View</Link>
                    </Button>

                    {token && Number(role) === 1 && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setApplyingJob(job);
                        }}
                        disabled={isApplied}
                        className="gap-1.5 bg-[#17396F] hover:bg-[#102e5e]"
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
                    )}

                    {!token && (
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          navigate("/login");
                        }}
                        className="gap-1.5 bg-[#17396F] hover:bg-[#102e5e]"
                      >
                        <Send className="h-3.5 w-3.5" />
                        Apply
                      </Button>
                    )}
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
    <>
      <Header url="true" />

      <div className="min-h-screen w-full bg-[#f8fafc]">
        {/* ================= HERO / SEARCH ================= */}
        <section className="w-full bg-gradient-to-r from-[#17396f] via-[#17488f] to-[#1853a0]">
          <div className="mx-auto w-full max-w-[1220px] px-4 py-7 sm:px-6 sm:py-8 md:py-10 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight text-white sm:text-3xl md:text-[32px]">
                Find your dream job now
              </h1>

              <p className="mt-1 text-sm text-blue-100">
                {allJobs.length}+ jobs across top companies in India
              </p>
            </div>

            {/* ================= SEARCH ================= */}
            <div className="mt-6 w-full">
              <div className="rounded-2xl bg-white p-3 shadow-[0_8px_30px_rgba(15,35,75,0.12)] sm:p-4 md:rounded-[28px] md:p-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                  {/* ================= KEYWORD ================= */}
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Designation or company"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[14px] text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-100 md:h-11 md:rounded-full"
                    />
                  </div>

                  {/* ================= EXPERIENCE MULTI SELECT ================= */}
                  <div className="min-w-0 flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-12 w-full justify-start rounded-xl border-slate-200 bg-slate-50 px-4 text-[14px] font-normal text-slate-900 shadow-none hover:bg-white focus:ring-2 focus:ring-blue-100 md:h-11 md:rounded-full",
                            selectedExp.length > 0 &&
                              "border-[#17396F]/30 bg-[#17396F]/5",
                          )}
                        >
                          <Briefcase
                            className={cn(
                              "mr-2 h-[18px] w-[18px] shrink-0",
                              selectedExp.length > 0
                                ? "text-[#17396F]"
                                : "text-slate-400",
                            )}
                          />

                          <span className="truncate">
                            {selectedExp.length === 0
                              ? "Select experience"
                              : selectedExp.length === 1
                                ? selectedExp[0]
                                : `${selectedExp.length} experiences selected`}
                          </span>
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="start"
                        className="w-[var(--radix-popover-trigger-width)] p-2"
                      >
                        <div className="space-y-1">
                          {experienceLevels.map((level) => {
                            const isSelected = selectedExp.some(
                              (item) =>
                                normalizeExperience(item) ===
                                normalizeExperience(level),
                            );

                            return (
                              <label
                                key={level}
                                className={cn(
                                  "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                                  isSelected
                                    ? "bg-[#17396F]/10 text-[#17396F]"
                                    : "text-slate-700 hover:bg-slate-100",
                                )}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    setSelectedExp((prev) => {
                                      if (checked) {
                                        const exists = prev.some(
                                          (item) =>
                                            normalizeExperience(item) ===
                                            normalizeExperience(level),
                                        );

                                        if (exists) {
                                          return prev;
                                        }

                                        return [...prev, level];
                                      }

                                      return prev.filter(
                                        (item) =>
                                          normalizeExperience(item) !==
                                          normalizeExperience(level),
                                      );
                                    });
                                  }}
                                  className="data-[state=checked]:border-[#17396F] data-[state=checked]:bg-[#17396F] data-[state=checked]:text-white"
                                />

                                <span>{level}</span>
                              </label>
                            );
                          })}

                          {experienceLevels.length === 0 && (
                            <p className="px-2 py-2 text-sm text-muted-foreground">
                              No experience levels available
                            </p>
                          )}

                          {selectedExp.length > 0 && (
                            <>
                              <Separator className="my-2" />

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="w-full text-[#17396F] hover:bg-[#17396F]/10 hover:text-[#17396F]"
                                onClick={() => setSelectedExp([])}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Clear experience
                              </Button>
                            </>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* ================= LOCATION ================= */}
                  <div className="relative min-w-0 flex-1">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                    <Input
                      value={location === "all" ? "" : location}
                      onChange={(e) => {
                        setLocation(e.target.value || "all");
                      }}
                      placeholder="Location"
                      className="h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 pr-4 text-[14px] text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:border-blue-400 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-100 md:h-11 md:rounded-full"
                    />
                  </div>

                  {/* ================= SEARCH BUTTON ================= */}
                  <Button
                    type="button"
                    className="h-12 w-full shrink-0 rounded-xl bg-[#17396F] px-7 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#102e5e] active:scale-[0.98] md:h-11 md:w-auto md:rounded-full"
                  >
                    <Search className="mr-2 h-4 w-4 md:hidden" />
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* ================= QUICK FILTERS ================= */}
            <div className="mt-4 -mx-4 overflow-hidden sm:-mx-6 lg:mx-0">
              <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 sm:px-6 lg:px-0">
                {["React", "Data Analyst"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:bg-white/25"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN CONTENT ================= */}
        <div className="mx-auto w-full max-w-[1220px] px-4 sm:px-6 lg:px-8">
          <main className="py-6 md:py-7 lg:py-8">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-6">
              {/* ================= SIDEBAR ================= */}
              <aside className="hidden lg:block">
                <Card className="sticky top-20 rounded-xl border border-slate-200 bg-white shadow-none">
                  <CardContent className="p-4">
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

              {/* ================= JOB LISTING ================= */}
              <div className="min-w-0 space-y-4">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Mobile filters */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5 rounded-lg border-slate-200 bg-white lg:hidden"
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                      </SheetTrigger>

                      <SheetContent
                        side="left"
                        className="w-[300px] overflow-y-auto sm:w-[340px]"
                      >
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                        </SheetHeader>

                        <div className="mt-5">
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

                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-900">
                        {jobs.length}
                      </span>{" "}
                      jobs found
                    </p>
                  </div>

                  {/* Sort */}
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="h-9 w-[145px] shrink-0 rounded-lg border-slate-200 bg-white text-sm">
                      <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-slate-500" />

                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>

                      <SelectItem value="salary">Highest Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ================= LOADING ================= */}
                {loading ? (
                  <div
                    className={cn(
                      "grid gap-4",
                      view === "grid"
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1",
                    )}
                  >
                    <JobCardSkeleton count={6} />
                  </div>
                ) : jobs.length === 0 ? (
                  <NoData
                    title="No jobs match your filters"
                    description="Try adjusting search terms or resetting filters."
                    actionLabel="Reset filters"
                    onAction={reset}
                    className="rounded-xl border border-slate-200 bg-white p-12"
                  />
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

                {/* ================= LOAD MORE ================= */}
                {!loading && visibleJobs < jobs.length && (
                  <div className="flex justify-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleJobs((prev) => prev + 6)}
                      className="rounded-lg border-slate-200 bg-white"
                    >
                      Load More Jobs
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* ================= APPLY MODAL ================= */}
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
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
