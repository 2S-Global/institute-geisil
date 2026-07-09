import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  Hourglass,
  CalendarSync,
  CalendarX2,
  Loader2,
} from "lucide-react";
import { useGetAppliedJobs } from "./hooks/getAppliedJobs";
import { getTimeAgo } from "./helpers/getTimeAgo";
import { formatDate } from "./helpers/formatDate";
import { useToast } from "@/hooks/use-toast";
import {
  useAcceptInterviewInvitation,
  useAcceptRejectOfferLetter,
} from "./hooks/useCandidateOptions";
import type { Status } from "./helpers/statusMeta";
import { statusMeta } from "./helpers/statusMeta";
import CandidateRescheduleModal from "@/components/candidate/CandidateRescheduleModal";
import NoData from "@/components/common/NoData";

const statusFilters: ("All" | Status)[] = [
  "All",
  "Applied",
  "Shortlisted",
  "Interview",
  "Offered",
  "Rejected",
];

export default function CandidateAppliedJobs() {
  const [tab, setTab] = useState<(typeof statusFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState<{
    open: boolean;
    applicationId: string;
    jobTitle: string;
    companyName: string;
  }>({
    open: false,
    applicationId: "",
    jobTitle: "",
    companyName: "",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const { acceptRejectOffer } = useAcceptRejectOfferLetter();
  const { acceptInterview } = useAcceptInterviewInvitation();

  // Custom hook to get all applied jobs
  const { loading, error, data, refetch } = useGetAppliedJobs();

  // Offer accept / reject Function
  const handleAcceptRejectOffer = async (applicationId: string, accept: boolean) => {
    try {
      setActionLoadingId(applicationId);
      await acceptRejectOffer(applicationId, accept);
      toast({
        title: accept ? "Offer Accepted" : "Offer Rejected",
        description: `Successfully ${accept ? "accepted" : "rejected"} the offer letter.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to update offer status.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Interview accept / reject Function
  const handleAcceptRejectInterview = async (applicationId: string, jobId: string, accept: boolean) => {
    try {
      setActionLoadingId(applicationId);
      await acceptInterview(applicationId, jobId, accept);
      toast({
        title: accept ? "Interview Accepted" : "Interview Rejected",
        description: `Successfully ${accept ? "accepted" : "rejected"} the interview invitation.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message || "Failed to update interview status.",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Extracting only displayable data
  const jobs = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((app: any) => {
      let status: Status = "Applied";
      const s = app.status?.toLowerCase();

      if (s === "applied") status = "Applied";
      else if (s === "in review" || s === "in_review" || s === "under review" || s === "under_review") status = "In Review";
      else if (s === "shortlisted") status = "Shortlisted";
      else if (s === "interview" || s === "invitation_sent") status = "Interview";
      else if (s === "offered" || s === "offer" || s === "offer_sent" || s === "offer_letter_sent") status = "Offered";
      else if (s === "rejected") status = "Rejected";
      else if (s === "offer_letter_accepted") status = "Offer Accepted";
      else if (s === "offer_letter_rejected") status = "Offer Rejected";
      else if (s === "completed") status = "Completed";

      const company = app.jobId?.userId?.name || "-";

      let salaryStr = "Salary not disclosed";

      if (app.jobId?.salary) {
        const sal = app.jobId.salary;

        if (typeof sal === "object" && sal !== null) {
          switch (sal.structure) {
            case "range":
              if (sal.min != null && sal.max != null) {
                salaryStr = `${sal.currency || ""}${sal.min.toLocaleString()} - ${sal.currency || ""}${sal.max.toLocaleString()} ${sal.rate || ""}`;
              }
              break;

            case "starting amount":
            case "maximum amount":
            case "exact amount":
              if (sal.amount != null) {
                salaryStr = `${sal.currency || ""}${sal.amount.toLocaleString()} ${sal.rate || ""}`;
              }
              break;

            default:
              if (sal.min != null && sal.max != null) {
                salaryStr = `${sal.currency || ""}${sal.min.toLocaleString()} - ${sal.currency || ""}${sal.max.toLocaleString()} ${sal.rate || ""}`;
              } else if (sal.amount != null) {
                salaryStr = `${sal.currency || ""}${sal.amount.toLocaleString()} ${sal.rate || ""}`;
              }
          }
        } else {
          salaryStr = String(sal);
        }
      }

      // Safe location parsing
      const rawLocation = app.jobId?.jobLocationType;
      let locationStr = "-";
      if (Array.isArray(rawLocation) && rawLocation.length > 0) {
        locationStr = rawLocation.map((loc: string) => loc.charAt(0).toUpperCase() + loc.slice(1)).join(", ");
      } else if (typeof rawLocation === "string" && rawLocation.length > 0) {
        locationStr = rawLocation.charAt(0).toUpperCase() + rawLocation.slice(1);
      }

      return {
        id: app._id,
        jobId: app.jobId?._id || "",
        title: app.jobId?.jobTitle || "-",
        company: company,
        logo: app.jobId?.userId?.companyLogo || company.substring(0, 2).toUpperCase(),
        location: locationStr,
        type: app.jobId?.jobExperienceLevel || "Full-time",
        salary: salaryStr,
        appliedOn: app.appliedAt ? getTimeAgo(app.appliedAt) : "N/A",
        status: status,
        match: app.match || 0,
        nextStep: app.nextStep || undefined,
        interviewInvitationStatus: app.interviewInvitationStatus || "pending",
        interviewDate: app.interviewDate ? formatDate(app.interviewDate) : undefined,
        interviewTime: app.interviewTime || undefined,
      };
    });
  }, [data]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: jobs.length };
    jobs.forEach((j) => (c[j.status] = (c[j.status] || 0) + 1));
    c["Offered"] = (c["Offered"] || 0) + (c["Offer Accepted"] || 0) + (c["Offer Rejected"] || 0);
    return c;
  }, [jobs]);

  const filtered = useMemo(() => {
    let list = jobs.filter((j) => {
      if (tab === "All") return true;
      if (tab === "Offered") {
        return j.status === "Offered" || j.status === "Offer Accepted" || j.status === "Offer Rejected";
      }
      return j.status === tab;
    });
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q)
      );
    }
    if (sort === "match") list = [...list].sort((a, b) => (b.match || 0) - (a.match || 0));
    return list;
  }, [tab, query, sort, jobs]);

  const stats = [
    { label: "Total Applied", value: jobs.length, icon: Briefcase, tint: "text-primary bg-primary/10" },
    {
      label: "In Process",
      value: (counts["Shortlisted"] || 0) + (counts["Interview"] || 0),
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

  const handleNavigate = () => {
    navigate("/candidate/jobs");
  };

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading applied jobs...</p>
        </div>
      </CandidateLayout>
    );
  }

  if (error) {
    return (
      <CandidateLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-destructive font-medium">Failed to load applied jobs.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="space-y-6">
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
            <Button onClick={handleNavigate} className="gap-2">
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
              {/* <div className="flex items-center gap-2">
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
              </div> */}
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
            <NoData
              title="No applications found"
              description="Try adjusting your filters or browse new jobs."
              className="border border-border bg-card rounded-xl p-12"
            />
          ) : (
            filtered.map((j) => {
              const meta = statusMeta[j.status as Status] || { icon: Briefcase, color: "bg-gray-100 text-gray-800" };
              const StatusIcon = meta.icon;

              const showInterviewActions = j.status === "Interview" && j.interviewInvitationStatus === "pending";
              const showOfferActions = j.status === "Offered";

              return (
                <Card key={j.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-display font-bold shrink-0 overflow-hidden">
                        {j.logo && j.logo.length > 2 ? (
                          <img
                            src={j.logo}
                            alt={j.company}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          j.company.substring(0, 2).toUpperCase()
                        )}
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
                          {/* <Badge variant="secondary" className="font-normal">
                            {j.match}% match
                          </Badge> */}
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
                            {j.salary}
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
                        {(j.interviewDate || j.interviewTime) && (
                          <div className="mt-2 ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-purple-600 bg-purple-500/10 px-2 py-1 rounded-md">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            Interview: {j.interviewDate || ""}{j.interviewTime ? ` at ${j.interviewTime}` : ""}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <Button size="sm" variant="outline" className="gap-2" asChild>
                          <Link to={`/candidate/applied-jobs/${j.jobId}`}>
                            <Eye className="h-4 w-4" /> View
                          </Link>
                        </Button>
                        <div className="flex items-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" disabled={actionLoadingId === j.id}>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="cursor-pointer" asChild>
                                <Link to={`/candidate/jobs/${j.jobId}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Open Job
                                </Link>
                              </DropdownMenuItem>

                              {/* Conditional Offer Actions */}
                              {showOfferActions && (
                                <>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleAcceptRejectOffer(j.id, true)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                                    Accept Offer
                                  </DropdownMenuItem>

                                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleAcceptRejectOffer(j.id, false)}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                    Reject Offer
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Conditional Interview Actions */}
                              {showInterviewActions && (
                                <>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleAcceptRejectInterview(j.id, j.jobId, true)}>
                                    <CalendarCheck className="h-4 w-4 mr-2 text-green-600" />
                                    Accept Interview
                                  </DropdownMenuItem>

                                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleAcceptRejectInterview(j.id, j.jobId, false)}>
                                    <CalendarX2 className="h-4 w-4 mr-2 text-red-600" />
                                    Reject Interview
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      setRescheduleData({
                                        open: true,
                                        applicationId: j.id,
                                        jobTitle: j.title,
                                        companyName: j.company,
                                      })
                                    }
                                  >
                                    <CalendarSync className="h-4 w-4 mr-2 text-amber-600" />
                                    Reschedule Interview
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {actionLoadingId === j.id && (
                            <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                          )}
                        </div>
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
      <CandidateRescheduleModal
        open={rescheduleData.open}
        onClose={() =>
          setRescheduleData((prev) => ({ ...prev, open: false }))
        }
        applicationId={rescheduleData.applicationId}
        jobTitle={rescheduleData.jobTitle}
        companyName={rescheduleData.companyName}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Reschedule request submitted successfully.",
          });
          refetch();
        }}
      />
    </CandidateLayout>
  );
}