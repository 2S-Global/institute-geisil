import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Edit,
  Share2,
  Wallet,
} from "lucide-react";

import { EmployerLayout } from "@/components/EmployerLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { Briefcase, CalendarCheck, TrendingUp } from "lucide-react";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

const candidates = [
  { name: "Priya Menon", stage: "Interview", score: 92 },
  { name: "Rohan Verma", stage: "Screened", score: 87 },
  { name: "Aisha Khan", stage: "Offer", score: 84 },
  { name: "Karthik Iyer", stage: "Interview", score: 78 },
  { name: "Neha Gupta", stage: "Applied", score: 71 },
];

export default function JobDetail() {
  const { id } = useParams();

  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
const [applicants, setApplicants] = useState<any[]>([]);


  const fetchJobDetails = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `/api/jobposting/get_job_preview_details?jobId=${id}`,
      );

      if (response.data.success) {
        setJobDetails(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicants = async () => {
    try {
      const response = await api.get(
        `/api/jobposting/get_all_job_related_candidates?jobId=${id}`,
      );

      if (response.data.success) {
        setApplicants(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
      fetchApplicants();
    }
  }, [id]);

  return (
    <EmployerLayout>
      <Button asChild variant="ghost" size="sm" className="gap-2 mb-4 -ml-2">
        <Link to="/employer/jobs">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>
      </Button>

      <Card className="p-6 mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft to-card">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            {/* <p className="text-xs text-muted-foreground">{id} · Engineering</p> */}
            <h1 className="font-display text-3xl font-bold text-foreground mt-1">
              {jobDetails?.title}
            </h1>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {jobDetails?.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {jobDetails?.jobType?.join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="h-4 w-4" />

                {jobDetails?.salary
                  ? (() => {
                      const { structure, currency, min, max, amount, rate } =
                        jobDetails.salary;

                      switch (structure) {
                        case "range":
                          return `${currency}${min.toLocaleString("en-IN")} - ${currency}${max.toLocaleString("en-IN")} ${rate}`;

                        case "starting amount":
                          return `From ${currency}${amount.toLocaleString("en-IN")} ${rate}`;

                        case "maximum amount":
                          return `Up to ${currency}${amount.toLocaleString("en-IN")} ${rate}`;

                        case "exact amount":
                          return `${currency}${amount.toLocaleString("en-IN")} ${rate}`;

                        default:
                          return "Salary not specified";
                      }
                    })()
                  : "Salary not specified"}
              </span>
              <Badge
                variant="outline"
                className="bg-success/10 text-success border-success/20"
              >
                Open
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Link to={`/employer/edit-jobs/${id}`}>
              <Button className="gap-2 shadow-brand">
                <Edit className="h-4 w-4" /> Edit posting
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard
          label="Applicants"
          value={jobDetails?.totalApplicants || 0}
          delta={18}
          icon={Users}
          tint="primary"
        />
        <StatCard
          label="Shortlisted"
          value={jobDetails?.totalShortlisted || 0}
          delta={12}
          icon={Briefcase}
          tint="accent"
        />
        <StatCard
          label="Interviews"
          value={jobDetails?.totalInterviewScheduled || 0}
          delta={28}
          icon={CalendarCheck}
          tint="success"
        />
        <StatCard
          label="Rejected"
          value={jobDetails?.totalRejected || 0}
          delta={4}
          icon={TrendingUp}
          tint="warning"
        />
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Applicants</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* LEFT SIDE */}
            <Card className="lg:col-span-8 border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-background to-background pb-5">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  Job Description
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Detailed overview of the role, responsibilities, and
                  expectations.
                </p>
              </CardHeader>

              <CardContent className="p-0">
                <div
                  className="
      job-editor-content

      px-8
      py-8

      text-[15px]
      leading-8
      text-muted-foreground

      selection:bg-primary/20

      [&_*]:break-words

      [&_h1]:text-3xl
      [&_h1]:font-bold
      [&_h1]:tracking-tight
      [&_h1]:text-foreground
      [&_h1]:mb-5
      [&_h1]:mt-8
      [&_h1]:leading-tight

      [&_h2]:text-2xl
      [&_h2]:font-bold
      [&_h2]:tracking-tight
      [&_h2]:text-foreground
      [&_h2]:mb-4
      [&_h2]:mt-7
      [&_h2]:leading-tight

      [&_h3]:text-xl
      [&_h3]:font-semibold
      [&_h3]:text-foreground
      [&_h3]:mb-4
      [&_h3]:mt-6
      [&_h3]:leading-snug

      [&_h4]:text-lg
      [&_h4]:font-semibold
      [&_h4]:text-foreground
      [&_h4]:mb-3
      [&_h4]:mt-5

      [&_p]:mb-5
      [&_p]:leading-8
      [&_p]:text-muted-foreground

      [&_strong]:font-semibold
      [&_strong]:text-foreground

      [&_a]:text-primary
      [&_a]:font-medium
      [&_a]:underline
      hover:[&_a]:text-primary/80

      [&_ul]:list-disc
      [&_ul]:pl-7
      [&_ul]:mb-5
      [&_ul]:space-y-2

      [&_ol]:list-decimal
      [&_ol]:pl-7
      [&_ol]:mb-5
      [&_ol]:space-y-2

      [&_li]:pl-1
      [&_li]:leading-8
      [&_li]:text-muted-foreground

      [&_blockquote]:border-l-4
      [&_blockquote]:border-primary
      [&_blockquote]:bg-muted/40
      [&_blockquote]:py-3
      [&_blockquote]:px-5
      [&_blockquote]:rounded-r-xl
      [&_blockquote]:italic
      [&_blockquote]:my-5

      [&_img]:rounded-2xl
      [&_img]:shadow-md
      [&_img]:my-5

      [&_table]:w-full
      [&_table]:border-collapse
      [&_table]:my-6

      [&_th]:border
      [&_th]:bg-muted/50
      [&_th]:p-3
      [&_th]:text-left

      [&_td]:border
      [&_td]:p-3

      [&_.ql-ui]:hidden
    "
                  style={{
                    textAlign: "justify",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      jobDetails?.jobDescription ||
                        "No description available for this job.",
                    ),
                  }}
                />
              </CardContent>
            </Card>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 self-start">
              {/* SKILLS CARD */}
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-background">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    Skills Required
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-3">
                    {jobDetails?.jobSkills?.map(
                      (skill: string, index: number) => (
                        <Badge
                          key={index}
                          className="
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-medium
                    bg-primary/10
                    text-primary
                    border-0
                    hover:bg-primary/20
                    transition-all
                  "
                        >
                          {skill}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ADDITIONAL DETAILS */}
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-background">
                  <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Additional Details
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* DETAILS GRID */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Industry
                      </p>

                      <p className="font-semibold text-base">
                        {jobDetails?.industry || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Experience Level
                      </p>

                      <p className="font-semibold text-base">
                        {jobDetails?.experienceLevel || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Career Level
                      </p>

                      <p className="font-semibold text-base">
                        {jobDetails?.careerLevel || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Company
                      </p>

                      <p className="font-semibold text-base">
                        {jobDetails?.companyName || "N/A"}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-muted/30 p-4">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        Expiry Date
                      </p>

                      <p className="font-semibold text-base text-red-500">
                        {jobDetails?.expiredAt || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* QUALIFICATION */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">
                      Qualification
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {jobDetails?.qualification?.map(
                        (item: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full px-3 py-1.5"
                          >
                            {item}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {/* GENDER */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">
                      Gender Preference
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {jobDetails?.gender?.map(
                        (item: string, index: number) => (
                          <Badge
                            key={index}
                            className="
  rounded-full
  px-4
  py-1.5
  bg-violet-500/10
  text-violet-600
  hover:bg-violet-500/20
  border-0
  font-medium
"
                          >
                            {item}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {/* BENEFITS */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3 text-foreground">
                      Benefits & Perks
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {jobDetails?.benefits?.map(
                        (item: string, index: number) => (
                          <Badge
                            key={index}
                            className="
                      rounded-full
                      px-4
                      py-1.5
                      bg-emerald-500/10
                      text-emerald-600
                      border-0
                    "
                          >
                            {item}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="candidates" className="mt-4">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y divide-border/60">
              {applicants?.length > 0 ? (
                applicants.map((candidate: any) => (
                  <div
                    key={candidate._id}
                    className="
              flex flex-col lg:flex-row
              lg:items-center
              gap-4
              p-4
              hover:bg-muted/30
              transition-colors
            "
                  >
                    {/* LEFT SECTION */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 border shrink-0">
                        <img
                          src={candidate?.profilePicture}
                          alt={candidate?.candidateName}
                          className="h-full w-full object-cover"
                        />

                        <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                          {candidate?.candidateName
                            ?.split(" ")
                            ?.map((w: string) => w[0])
                            ?.join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {candidate?.candidateName}
                        </h3>

                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                          <span>{candidate?.jobRole || "N/A"}</span>

                          <span>
                            {candidate?.experienceLevel || 0} Years Exp
                          </span>

                          <span>
                            {candidate?.currentLocation || "Location N/A"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                          <span className="text-muted-foreground">
                            Notice:
                            <span className="ml-1 font-medium text-foreground">
                              {candidate?.noticePeriod || "N/A"}
                            </span>
                          </span>

                          <span className="text-muted-foreground">
                            Salary:
                            <span className="ml-1 font-medium text-foreground">
                              ₹
                              {candidate?.expectedSalary?.salary?.toLocaleString(
                                "en-IN",
                              ) || 0}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SECTION */}
                    <div className="flex items-center justify-between lg:justify-end gap-3">
                      <Badge
                        variant="outline"
                        className={`
                  capitalize

                  ${
                    candidate?.status === "applied"
                      ? "bg-blue-500/10 text-blue-600 border-blue-200"
                      : ""
                  }

                  ${
                    candidate?.status === "offer_sent"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                      : ""
                  }

                  ${
                    candidate?.status === "offer_letter_rejected"
                      ? "bg-red-500/10 text-red-600 border-red-200"
                      : ""
                  }
                `}
                      >
                        {candidate?.status
                          ?.replace(/_/g, " ")
                          ?.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>

                      <Button asChild size="sm" variant="outline">
                        <Link to={`/employer/candidates/${candidate?.userId}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center">
                  <p className="text-muted-foreground">No applicants found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pipeline" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 grid gap-4 md:grid-cols-5">
              {[
                ["Applied", 84],
                ["Screened", 32],
                ["Interview", 9],
                ["Offer", 3],
                ["Hired", 1],
              ].map(([s, n]) => (
                <div
                  key={s as string}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <p className="text-xs uppercase text-muted-foreground tracking-wider">
                    {s}
                  </p>
                  <p className="font-display text-2xl font-bold text-foreground mt-1">
                    {n}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </EmployerLayout>
  );
}
