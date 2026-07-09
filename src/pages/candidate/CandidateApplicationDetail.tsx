import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Send,
  Hourglass,
  MessageSquare,
  FileText,
  Download,
  ExternalLink,
  Share2,
  Bookmark,
  Trash2,
  Phone,
  Mail,
  Globe,
  Users,
  Star,
  Video,
  AlertCircle,
} from "lucide-react";
import { getAppliedJobsDetails } from "./hooks/getAppliedJobsDetails";
import { formatSalary } from "./helpers/formatSalary";

const application = {
  id: "app-001",
  title: "Senior Frontend Engineer",
  company: "Razorpay",
  logo: "RP",
  location: "Bengaluru, IN",
  type: "Full-time",
  workMode: "Hybrid",
  salary: "₹28-38 LPA",
  appliedOn: "10 Mar 2026",
  status: "Interview",
  match: 92,
  jobId: "job-1042",
  applicationRef: "APP-2026-001042",
  about:
    "Build delightful payment experiences used by millions of merchants. Own the frontend architecture of the merchant dashboard, mentor engineers, and partner closely with design and product.",
  responsibilities: [
    "Architect modular, accessible React applications at scale",
    "Improve performance, observability, and developer experience",
    "Collaborate with design on a polished, consistent UI system",
    "Mentor mid-level engineers and lead technical reviews",
  ],
  requirements: [
    "5+ years building production React applications",
    "Strong TypeScript, state management and testing skills",
    "Experience with design systems and component libraries",
    "Eye for performance, accessibility and craft",
  ],
};

const timeline = [
  {
    label: "Application submitted",
    date: "10 Mar 2026 · 10:24 AM",
    description: "Resume v3.pdf and cover note sent to Razorpay.",
    status: "done",
    icon: Send,
  },
  {
    label: "Application reviewed",
    date: "11 Mar 2026 · 4:10 PM",
    description: "Recruiter Anjali K. opened your profile.",
    status: "done",
    icon: CheckCircle2,
  },
  {
    label: "Shortlisted",
    date: "12 Mar 2026 · 11:02 AM",
    description: "Moved to hiring manager review.",
    status: "done",
    icon: Star,
  },
  {
    label: "Interview scheduled",
    date: "12 Mar 2026 · 6:45 PM",
    description: "Technical round on 14 Mar, 3:00 PM IST.",
    status: "current",
    icon: CalendarCheck,
  },
  {
    label: "Offer decision",
    date: "Pending",
    description: "Expected within a week of final round.",
    status: "upcoming",
    icon: Hourglass,
  },
];

const interviews = [
  {
    round: "Recruiter Screen",
    date: "11 Mar 2026",
    time: "5:00 PM IST",
    mode: "Phone",
    interviewer: "Anjali K.",
    status: "Completed",
    feedback: "Strong communication. Moved forward.",
  },
  {
    round: "Technical Round 1",
    date: "14 Mar 2026",
    time: "3:00 PM IST",
    mode: "Google Meet",
    interviewer: "Rohit S. · Staff Engineer",
    status: "Upcoming",
    feedback: "",
  },
  {
    round: "System Design",
    date: "TBD",
    time: "—",
    mode: "—",
    interviewer: "—",
    status: "Pending",
    feedback: "",
  },
];

const documents = [
  { name: "Resume_v3.pdf", size: "284 KB", type: "Resume" },
  { name: "Cover_Note_Razorpay.pdf", size: "62 KB", type: "Cover letter" },
  { name: "Portfolio_2026.pdf", size: "1.2 MB", type: "Portfolio" },
];

const recruiter = {
  name: "Anjali Kapoor",
  role: "Senior Talent Partner",
  company: "Razorpay",
  email: "anjali.k@razorpay.com",
  phone: "+91 98765 43210",
};

const initialMessages = [
  {
    from: "Anjali Kapoor",
    initials: "AK",
    role: "Recruiter",
    time: "12 Mar · 6:45 PM",
    text:
      "Hi Riya, your profile looks great! We'd like to schedule a technical round on 14 Mar at 3 PM IST. Does that work?",
  },
  {
    from: "Riya Sharma",
    initials: "RS",
    role: "You",
    time: "12 Mar · 7:12 PM",
    text: "Hi Anjali, thanks! 14 Mar 3 PM IST works perfectly. Looking forward to it.",
  },
];

const statusOrder = ["Applied", "In Review", "Shortlisted", "Interview", "Offered"];

export default function CandidateApplicationDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // custom hook for data fetching
  const { data, isLoading, error } = getAppliedJobsDetails(id);
  console.log("data===>", data);

  //@ts-ignore
  //main Jobdetails Data
  const jobDetails = data?.data;
  console.log("thats the job details", jobDetails)
  // Helper to format salary



  //basic job data 
  const jobTitle = jobDetails?.title
  const companyName = jobDetails?.companyName
  const logoContent = jobDetails?.logoImage ? (
    <img src={jobDetails.logoImage} alt={companyName} className="h-full w-full object-contain p-2" />
  ) : (
    companyName?.[0] || application.logo
  );

  // Status mapping
  const jobStatus = jobDetails?.isApplied ? (jobDetails.totalInterviewScheduled > 0 ? "Interview" : "Applied") : "-"

  //mock 
  const currentStepIndex = statusOrder.indexOf(jobStatus);
  const progressPct = ((currentStepIndex + 1) / statusOrder.length) * 100;



  //on-site - remote - hybrid
  const workMode = jobDetails?.jobLocationType


  //location
  const jobLocation = jobDetails?.location

  //parttime-fulltime
  const jobType = jobDetails?.jobType?.join(", ");

  //salary
  const salaryText = jobDetails?.salary ? formatSalary(jobDetails.salary) : "No disclosed";


  //applied time ago
  const appliedTimeAgo = jobDetails?.createdAgo
    ? `Posted ${jobDetails.createdAgo}`
    : "";

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages((m) => [
      ...m,
      {
        from: "Riya Sharma",
        initials: "RS",
        role: "You",
        time: "Just now",
        text: draft.trim(),
      },
    ]);
    setDraft("");
    toast({ title: "Message sent", description: "The recruiter will be notified." });
  };

  // if (isLoading) {
  //   return (
  //     <CandidateLayout>
  //       <div className="flex items-center justify-center min-h-[400px]">
  //         <div className="flex flex-col items-center gap-2">
  //           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  //           <p className="text-sm text-muted-foreground">Loading application details...</p>
  //         </div>
  //       </div>
  //     </CandidateLayout>
  //   );
  // }

  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* Back link */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="ghost" size="sm" asChild className="gap-2 -ml-2">
            <Link to="/candidate/applications">
              <ArrowLeft className="h-4 w-4" /> Back to applied jobs
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Application ref: <span className="font-mono">{application.applicationRef}</span>
            {id && <> · ID: <span className="font-mono">{id}</span></>}
          </p>
        </div>

        {/* Hero */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <CardContent className="p-5 md:p-6 -mt-12">
            <div className="flex flex-col lg:flex-row lg:items-end gap-5">
              <div className="h-20 w-20 rounded-2xl bg-card border shadow-sm text-primary flex items-center justify-center font-display font-bold text-2xl overflow-hidden">
                {logoContent}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <Badge className="bg-primary/10 text-primary border-primary/20" variant="outline">
                    <CalendarCheck className="h-3 w-3 mr-1" /> {jobStatus}
                  </Badge>
                  {jobDetails?.match !== undefined && (
                    <Badge variant="secondary">{jobDetails.match}% match</Badge>
                  )}
                  <Badge variant="outline">{workMode}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {jobTitle}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" /> {companyName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {jobLocation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" /> {jobType}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IndianRupee className="h-4 w-4" /> {salaryText}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {appliedTimeAgo}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                {/* <Button variant="outline" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" /> Save
                </Button> */}
                <Button size="sm" asChild className="gap-2">
                  <Link to={`/candidate/jobs/${jobDetails?.jobId || application.jobId}`}>
                    <ExternalLink className="h-4 w-4" /> View job
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stage progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Application progress</p>
                <p className="text-xs text-muted-foreground">
                  Stage {currentStepIndex + 1} of {statusOrder.length}
                </p>
              </div>
              <Progress value={progressPct} className="h-2" />
              <div className="mt-3 grid grid-cols-5 gap-2 text-[11px] md:text-xs">
                {statusOrder.map((s, i) => (
                  <div
                    key={s}
                    className={`text-center ${i <= currentStepIndex ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="timeline">
              <TabsList className="w-full justify-start flex-wrap h-auto">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="overview">Job overview</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              {/* Timeline */}
              <TabsContent value="timeline" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity timeline</CardTitle>
                    <CardDescription>Every step of your application, in order.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="relative border-l-2 border-dashed border-border ml-3 space-y-6">
                      {timeline.map((t, i) => {
                        const Icon = t.icon;
                        const isDone = t.status === "done";
                        const isCurrent = t.status === "current";
                        return (
                          <li key={i} className="ml-6">
                            <span
                              className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background ${isDone
                                ? "bg-emerald-500/15 text-emerald-600"
                                : isCurrent
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                                }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-foreground">{t.label}</p>
                              {isCurrent && (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.date}</p>
                            <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Overview */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About the role</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {jobDetails?.jobDescription ? (
                      <div
                        className="text-sm text-muted-foreground leading-relaxed space-y-2 ql-editor"
                        dangerouslySetInnerHTML={{ __html: jobDetails.jobDescription }}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">{application.about}</p>
                    )}

                    {jobDetails?.jobSkills && jobDetails.jobSkills.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="font-medium text-foreground mb-2">Required Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {jobDetails.jobSkills.map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {(jobDetails?.qualification || jobDetails?.experienceLevel || jobDetails?.careerLevel) && (
                      <>
                        <Separator />
                        <div>
                          <p className="font-medium text-foreground mb-2">Requirements & Level</p>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            {jobDetails.experienceLevel && (
                              <li className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Experience:</span> {jobDetails.experienceLevel}
                              </li>
                            )}
                            {jobDetails.careerLevel && (
                              <li className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Career Level:</span> {jobDetails.careerLevel}
                              </li>
                            )}
                            {jobDetails.qualification && jobDetails.qualification.length > 0 && (
                              <li className="flex items-center gap-2">
                                <span className="font-medium text-foreground">Minimum Qualification:</span> {jobDetails.qualification.filter(Boolean).join(", ")}
                              </li>
                            )}
                          </ul>
                        </div>
                      </>
                    )}

                    {jobDetails?.benefits && jobDetails.benefits.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <p className="font-medium text-foreground mb-2">Benefits</p>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {jobDetails.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" /> {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Interviews */}
              <TabsContent value="interviews" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Interview rounds</CardTitle>
                    <CardDescription>
                      Schedule and feedback across each stage of the process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {interviews.map((iv, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-primary" />
                            <p className="font-medium text-foreground">{iv.round}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              iv.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : iv.status === "Upcoming"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground"
                            }
                          >
                            {iv.status}
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                          <div>
                            <p className="text-foreground font-medium">{iv.date}</p>
                            <p>Date</p>
                          </div>
                          <div>
                            <p className="text-foreground font-medium">{iv.time}</p>
                            <p>Time</p>
                          </div>
                          <div>
                            <p className="text-foreground font-medium">{iv.mode}</p>
                            <p>Mode</p>
                          </div>
                          <div>
                            <p className="text-foreground font-medium">{iv.interviewer}</p>
                            <p>Interviewer</p>
                          </div>
                        </div>
                        {iv.feedback && (
                          <p className="mt-3 text-sm text-muted-foreground bg-muted/40 rounded-md p-2.5">
                            <span className="font-medium text-foreground">Feedback:</span> {iv.feedback}
                          </p>
                        )}
                        {iv.status === "Upcoming" && (
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" className="gap-2">
                              <Video className="h-4 w-4" /> Join meeting
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2">
                              <CalendarCheck className="h-4 w-4" /> Add to calendar
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Messages */}
              <TabsContent value="messages" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages with recruiter</CardTitle>
                    <CardDescription>Direct conversation with the hiring team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      {messages.map((m, i) => {
                        const isMe = m.role === "You";
                        return (
                          <div key={i} className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                            <Avatar className="h-9 w-9 shrink-0">
                              <AvatarFallback
                                className={
                                  isMe
                                    ? "bg-primary text-primary-foreground text-xs"
                                    : "bg-muted text-foreground text-xs"
                                }
                              >
                                {m.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`max-w-[78%] ${isMe ? "text-right" : ""}`}>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <span className="font-medium text-foreground">{m.from}</span>
                                <span>· {m.time}</span>
                              </div>
                              <div
                                className={`inline-block text-sm rounded-2xl px-3.5 py-2 ${isMe
                                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                                  : "bg-muted text-foreground rounded-tl-sm"
                                  }`}
                              >
                                {m.text}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Write a message to the recruiter…"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={2}
                      />
                      <Button onClick={sendMessage} className="gap-2 self-end">
                        <Send className="h-4 w-4" /> Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Documents */}
              <TabsContent value="documents" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents shared</CardTitle>
                    <CardDescription>Files attached to this application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {documents.map((d) => (
                      <div
                        key={d.name}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{d.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {d.type} · {d.size}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next step</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-primary font-medium uppercase tracking-wide">
                    Upcoming interview
                  </p>
                  <p className="font-semibold text-foreground mt-1">Technical Round 1</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    14 Mar 2026 · 3:00 PM IST · Google Meet
                  </p>
                </div>
                <Button className="w-full gap-2">
                  <Video className="h-4 w-4" /> Join meeting
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <CalendarCheck className="h-4 w-4" /> Reschedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recruiter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      AK
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{recruiter.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {recruiter.role} · {recruiter.company}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <a
                    href={`mailto:${recruiter.email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" /> {recruiter.email}
                  </a>
                  <a
                    href={`tel:${recruiter.phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" /> {recruiter.phone}
                  </a>
                </div>
                <Button variant="outline" className="w-full gap-2">
                  <MessageSquare className="h-4 w-4" /> Message recruiter
                </Button>
              </CardContent>
            </Card>

            {jobDetails?.match !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Match insight</CardTitle>
                  <CardDescription>How well your profile fits this role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Overall match</span>
                    <span className="text-sm font-semibold text-foreground">{jobDetails.match}%</span>
                  </div>
                  <Progress value={jobDetails.match} className="h-2" />
                  {[
                    { label: "Skills", value: 95 },
                    { label: "Experience", value: 88 },
                    { label: "Location", value: 100 },
                    { label: "Salary fit", value: 82 },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{s.label}</span>
                        <span className="font-medium text-foreground">{s.value}%</span>
                      </div>
                      <Progress value={s.value} className="h-1.5 mt-1" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">About {companyName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {jobDetails?.companyWebsite && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a
                      href={jobDetails.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      {jobDetails.companyWebsite.replace(/(^\w+:|^)\/\//, "")} <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {jobDetails?.industry || "Fintech · Payments"}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> {jobDetails?.totalApplicants !== undefined ? `${jobDetails.totalApplicants} Applicants` : "3,000+ employees"}
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" /> Withdraw application
                </CardTitle>
                <CardDescription>
                  This will remove you from consideration for this role.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-4 w-4" /> Withdraw
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Withdraw application?</DialogTitle>
                      <DialogDescription>
                        You won't be able to reapply for 30 days. The recruiter will be notified.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setWithdrawOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setWithdrawOpen(false);
                          toast({
                            title: "Application withdrawn",
                            description: `${jobTitle} at ${companyName} has been withdrawn.`,
                          });
                        }}
                      >
                        Withdraw application
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </CandidateLayout>
  );
}
