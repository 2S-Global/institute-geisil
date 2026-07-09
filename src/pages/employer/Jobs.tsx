import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MapPin, Users, Clock } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { JobCardSkeleton } from "./JobCardSkeleton";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
interface Job {
  id: string;
  title: string;
  dept: string;
  loc: string;
  type: string;
  apps: number;
  posted: string;
  expiryDate: string;
  status: "draft" | "active";
}

const initialJobs: Job[] = [
  {
    id: "JD-1042",
    title: "Frontend Engineer",
    dept: "Engineering",
    loc: "Bengaluru",
    type: "Full-time",
    apps: 84,
    posted: "3d ago",
    status: "Open",
  },
  {
    id: "JD-1041",
    title: "Data Analyst",
    dept: "Analytics",
    loc: "Hyderabad",
    type: "Full-time",
    apps: 56,
    posted: "5d ago",
    status: "Open",
  },
  {
    id: "JD-1040",
    title: "Product Manager",
    dept: "Product",
    loc: "Remote",
    type: "Full-time",
    apps: 39,
    posted: "1w ago",
    status: "Reviewing",
  },
  {
    id: "JD-1039",
    title: "QA Engineer",
    dept: "Engineering",
    loc: "Pune",
    type: "Contract",
    apps: 28,
    posted: "1w ago",
    status: "Open",
  },
  {
    id: "JD-1038",
    title: "HR Business Partner",
    dept: "People",
    loc: "Mumbai",
    type: "Full-time",
    apps: 17,
    posted: "2w ago",
    status: "Closed",
  },
  {
    id: "JD-1037",
    title: "DevOps Engineer",
    dept: "Platform",
    loc: "Bengaluru",
    type: "Full-time",
    apps: 64,
    posted: "2w ago",
    status: "Open",
  },
];

const styles: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  draft: "bg-warning/10 text-warning border-warning/20",
};

export default function Jobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("Full-time");
  const [status, setStatus] = useState<Job["status"]>("Open");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      j.title.toLowerCase().includes(q) ||
      j.id.toLowerCase().includes(q) ||
      j.dept.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dept.trim() || !loc.trim()) {
      toast({
        title: "Missing info",
        description: "Title, department and location are required.",
        variant: "destructive",
      });
      return;
    }
    const nextNum =
      jobs.reduce(
        (m, j) => Math.max(m, parseInt(j.id.split("-")[1] || "1000", 10)),
        1000,
      ) + 1;
    const newJob: Job = {
      id: `JD-${nextNum}`,
      title: title.trim(),
      dept: dept.trim(),
      loc: loc.trim(),
      type,
      apps: 0,
      posted: "Just now",
      status,
    };
    setJobs((prev) => [newJob, ...prev]);
    toast({
      title: "Job posted",
      description: `${newJob.title} (${newJob.id}) has been published.`,
    });
    setOpen(false);
    setTitle("");
    setDept("");
    setLoc("");
    setType("Full-time");
    setStatus("Open");
    setDescription("");
  };

  const fetchAllJobListing = async () => {
    setLoading(true);

    try {
      const response = await api.get("/api/jobposting/get_all_job_listing");

      console.log("Job listing response:", response.data);

      if (response.data.success && response.status === 200) {
        const formattedJobs = response.data.data.map((item: any) => ({
          id: item._id,
          title: item.jobTitle,
          dept: item.advertiseCityName || "General",
          loc: item.location || item.jobLocationType,
          type: item.jobType?.join(", "),
          apps: item.appliedCount || 0,
          posted: item.createdAt,
          expiryDate: item.expiryDate,
          status: item.status === "draft" ? "draft" : "active",
        }));

        setJobs(formattedJobs);
      }
    } catch (error) {
      console.error("Error fetching job listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllJobListing();
  }, []);

  return (
    <EmployerLayout>
      <PageHeader
        title="Job Postings"
        description="Manage open requisitions across teams."
        actions={
          <>
            {/* <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button> */}
           {/*  <Button
              className="gap-2 shadow-brand"
              onClick={() => setOpen(true)}
            >
              <Plus className="h-4 w-4" /> Post a job
            </Button> */}
          </>
        }
      />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, ID, or department…"
            className="pl-9 h-10"
          />
        </div>
      </Card>
      {loading ? (
        <JobCardSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j) => (
            <Card
              key={j.id}
              className="p-5 border-border/60 shadow-sm hover:shadow-md transition-shadow min-h-[220px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <Link
                      to={`/employer/jobs/${j.id}`}
                      className="font-display text-lg font-bold text-foreground hover:text-primary"
                    >
                      {j.title}
                    </Link>
                  </div>
                  <Badge variant="outline" className={styles[j.status]}>
                    {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {j.loc}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {j.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> {j.apps} applicants
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">
                    Posted: {j.posted}
                  </span>

                  <span className="text-xs text-red-500">
                    Expiry: {j.expiryDate}
                  </span>
                </div>

                <Button asChild size="sm" variant="outline">
                  <Link to={`/employer/jobs/${j.id}`}>Manage</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Post a job</DialogTitle>
            <DialogDescription>
              Create a new requisition visible to candidates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="j-title">Job title</Label>
              <Input
                id="j-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Backend Engineer"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="j-dept">Department</Label>
                <Input
                  id="j-dept"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="j-loc">Location</Label>
                <Input
                  id="j-loc"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                  placeholder="e.g. Bengaluru / Remote"
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Job["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Reviewing">Reviewing</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="j-desc">Description (optional)</Label>
              <Textarea
                id="j-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Responsibilities, requirements, perks…"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Post job</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  );
}
