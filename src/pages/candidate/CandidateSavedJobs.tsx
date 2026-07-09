import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  Search,
  Filter,
  BookmarkCheck,
  Send,
  ExternalLink,
  Trash2,
  IndianRupee,
  BookmarkX,
  Loader2,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { JobData, useGetAllSavedJobs } from "./hooks/getAllSavedJobs";
import { useBookmarkJob } from "./hooks/useBookmarkJob";
import { useGetAppliedJobs } from "./hooks/getAppliedJobs";
import { formatSalary } from "./helpers/formatSalary";
import { getTimeAgo } from "./helpers/getTimeAgo";
import { getJobDeadline } from "./helpers/getJobDeadline";
import { formatText } from "./helpers/formatText";
import { compareJobsByDeadline } from "./helpers/compareJobsByDeadline";
import CandidateApplyModal from "@/components/candidate/CandidateApplyModal";
import { SavedJobCardComponent } from "./components/SavedJobCard";
import { RemoveSavedJobDialog } from "./components/RemoveSavedJobDialog";
import { SavedJobsFilters } from "./components/SavedJobsFilters";

const sortOptions = [
  { value: "recent", label: "Recently saved" },
  // { value: "match", label: "Best match" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
  { value: "deadline", label: "Closing soon" },
];

interface SavedJobCard {
  id: string;
  jobId: string;
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
  deadline: string;
  rawJob: any;
}

// interface SavedJobCardProps {
//   j: SavedJobCard;
//   isApplied: boolean;
//   isBookmarkLoading: boolean;
//   onApply: () => void;
//   onRemove: () => void;
// }


export default function CandidateSavedJobs() {
  const [jobs, setJobs] = useState<SavedJobCard[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [removeId, setRemoveId] = useState<string | number | null>(null);
  const [applyingJob, setApplyingJob] = useState<any | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());

  const { data, isLoading, error, fetchAllSavedJobs, totalApplied } = useGetAllSavedJobs();
  const { handleBookmark, bookmarkLoading } = useBookmarkJob();
  const { data: appliedJobs } = useGetAppliedJobs();

  useEffect(() => {
    if (appliedJobs && Array.isArray(appliedJobs)) {
      setAppliedJobIds(new Set(appliedJobs.map((app: any) => app.jobId?._id).filter(Boolean)));
    }
  }, [appliedJobs]);

  //data building based on UI
  useEffect(() => {
    if (!Array.isArray(data)) {
      setJobs([]);
      return;
    }

    const mapped = data.map((item: any) => {
      //actual job
      const job = item.job ?? {};

      //extracted tags
      const tags = [
        ...(job.jobSkills ?? []),
        ...(job.specialization ?? []),
      ];

      //deadline
      const deadline = getJobDeadline(job.jobExpiryDate);

      return {
        id: item.savedJobId,
        jobId: job._id ?? "",
        title: job.jobTitle ?? "-",
        company: job.companyName ?? "-",
        logo: job.logo ?? "",
        location: formatText(job.jobLocationType),
        type: job.jobType?.join(", ") || "-",
        salary: formatSalary(job.salary),
        posted: job.createdAt ? getTimeAgo(job.createdAt) : "-",
        savedOn: item.savedAt ? getTimeAgo(item.savedAt) : "-",
        match: job.match ?? 90,//mock
        tags,
        deadline,
        rawJob: job,
      };
    });

    setJobs(mapped);
  }, [data]);

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
        list.sort(compareJobsByDeadline);
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
      label: "Remote Jobs",
      value: jobs.filter((j) => j.rawJob?.jobLocationType?.toLowerCase() === "remote").length,
      icon: Globe,
      tint: "text-emerald-600 bg-emerald-500/10",
    },
    {
      label: "Full-Time Jobs",
      value: jobs.filter((j) =>
        j.rawJob?.jobType?.some((t: string) => t.toLowerCase().includes("full-time"))
      ).length,
      icon: Briefcase,
      tint: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Applied",
      value: totalApplied,
      icon: Send,
      tint: "text-violet-600 bg-violet-500/10",
    },
  ];

  const handleRemove = async (id: string | number) => {
    setRemoveId(null);
    await handleBookmark(id.toString(), true, () => {
      fetchAllSavedJobs(true);
    });
  };

  return (
    <CandidateLayout>
      <div className="space-y-6">
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
            <Link to={`/candidate/jobs`} >
              <Briefcase className="h-4 w-4 inline " /> Browse Jobs
            </Link>
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
        <SavedJobsFilters
          query={query}
          setQuery={setQuery}
          sort={sort}
          setSort={setSort}
          sortOptions={sortOptions}
        />

        {/* List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Loading saved jobs…</p>
              </CardContent>
            </Card>
          ) : filtered.length === 0 ? (
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
              <SavedJobCardComponent
                key={j.id}
                j={j}
                isApplied={appliedJobIds.has(j.jobId)}
                isBookmarkLoading={!!bookmarkLoading[j.jobId]}
                onApply={() => setApplyingJob(j.rawJob)}
                onRemove={() => setRemoveId(j.jobId)}
              />
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
        <RemoveSavedJobDialog
          open={removeId !== null}
          onClose={() => setRemoveId(null)}
          onConfirm={() => removeId !== null && handleRemove(removeId)}
        />
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
          fetchAllSavedJobs(true);
        }}
      />
    </CandidateLayout>
  );
}
