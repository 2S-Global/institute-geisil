import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Building2,
  Clock,
  IndianRupee,
  Bookmark,
  BookmarkCheck,
  Share2,
  Send,
  CheckCircle2,
  GraduationCap,
  Users,
  Globe,
  Calendar,
  ArrowLeft,
  Flag,
  Star,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const job = {
  id: "69941b53e55513b264bcb358",
  title: "Senior Product Designer",
  company: "Geisil Technologies",
  logo: "https://logo.clearbit.com/figma.com",
  cover:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
  location: "Bengaluru, Karnataka, India",
  type: "Full-time",
  workMode: "Hybrid",
  experience: "4-7 years",
  salary: "₹24 - 36 LPA",
  posted: "Posted 3 days ago",
  applyBy: "Apply by 25 Jul 2026",
  openings: 2,
  applicants: 142,
  match: 92,
  featured: true,
  urgent: false,
  about:
    "We are looking for a Senior Product Designer to craft delightful, accessible, and conversion-optimised experiences across our flagship hiring platform. You will partner closely with PMs, engineers, and researchers to shape end-to-end journeys — from discovery to onboarding — while raising the design quality bar across the org.",
  responsibilities: [
    "Own end-to-end design of major product surfaces, from research to ship.",
    "Drive design systems contributions and component-level quality.",
    "Collaborate with PM and engineering on product strategy and roadmap.",
    "Run usability studies and synthesise insights into design decisions.",
    "Mentor 2-3 mid-level designers and review their work weekly.",
  ],
  requirements: [
    "4+ years of product design experience, ideally in B2B SaaS.",
    "Strong portfolio showcasing end-to-end shipped product work.",
    "Mastery of Figma, prototyping, and modern design systems.",
    "Working knowledge of HTML, CSS, and component libraries.",
    "Excellent written and verbal communication.",
  ],
  niceToHave: [
    "Experience designing AI-assisted workflows.",
    "Background in hiring, HRTech, or marketplaces.",
    "Motion design / micro-interactions skills.",
  ],
  benefits: [
    "Competitive salary + ESOPs",
    "Comprehensive health insurance for you and family",
    "Flexible hybrid work, 4 days WFH/month",
    "Annual learning budget of ₹60,000",
    "Wellness, gym, and home-office stipend",
    "26 days paid leave + 12 public holidays",
  ],
  skills: [
    { name: "Figma", level: 95 },
    { name: "Design Systems", level: 90 },
    { name: "User Research", level: 80 },
    { name: "Prototyping", level: 88 },
    { name: "Interaction Design", level: 85 },
  ],
  tags: ["Figma", "Design Systems", "Prototyping", "User Research", "B2B SaaS"],
};

const company = {
  name: "Geisil Technologies",
  industry: "HR Technology • SaaS",
  size: "201-500 employees",
  founded: 2017,
  hq: "Bengaluru, India",
  website: "geisil.com",
  about:
    "Geisil is building the operating system for modern hiring teams — combining ATS, assessments, and AI screening into one delightful product used by 1,200+ companies across India and SEA.",
};

const similarJobs = [
  {
    id: "s1",
    title: "Lead Product Designer",
    company: "Razorpay",
    logo: "https://logo.clearbit.com/razorpay.com",
    location: "Bengaluru",
    salary: "₹32 - 44 LPA",
    match: 88,
  },
  {
    id: "s2",
    title: "Senior UX Designer",
    company: "Zomato",
    logo: "https://logo.clearbit.com/zomato.com",
    location: "Gurugram",
    salary: "₹26 - 38 LPA",
    match: 84,
  },
  {
    id: "s3",
    title: "Product Designer II",
    company: "Swiggy",
    logo: "https://logo.clearbit.com/swiggy.com",
    location: "Hybrid",
    salary: "₹22 - 30 LPA",
    match: 81,
  },
];

export default function CandidateJobDetail() {
  const { id } = useParams();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setDialogOpen(false);
    toast.success("Application submitted!", {
      description: `Your application for ${job.title} has been sent.`,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <CandidateLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/candidate/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/candidate/jobs" className="hover:text-foreground">Browse Jobs</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium truncate">{job.title}</span>
        </div>

        <Link
          to="/candidate/jobs"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>

        {/* Hero card */}
        <Card className="overflow-hidden">
          <div
            className="h-32 md:h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--primary) / 0.85), hsl(var(--primary) / 0.45)), url(${job.cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <CardContent className="p-5 md:p-6 -mt-12 md:-mt-14 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-card shadow-lg">
                <AvatarImage src={job.logo} alt={job.company} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {job.company.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {job.featured && (
                    <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20">
                      <Sparkles className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  )}
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="outline">{job.workMode}</Badge>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                    <Building2 className="h-4 w-4" /> {job.company}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> {job.posted}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">{job.match}% match</span>
                </div>
                <p className="text-xs text-muted-foreground">{job.applicants} applicants</p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={IndianRupee} label="Salary" value={job.salary} />
              <Stat icon={Briefcase} label="Experience" value={job.experience} />
              <Stat icon={Users} label="Openings" value={String(job.openings)} />
              <Stat icon={Calendar} label="Deadline" value={job.applyBy.replace("Apply by ", "")} />
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" disabled={applied} className="gap-2">
                    {applied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Applied
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Apply now
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Apply for {job.title}</DialogTitle>
                    <DialogDescription>
                      Your profile and resume will be shared with {job.company}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label htmlFor="cover">Cover note (optional)</Label>
                    <Textarea
                      id="cover"
                      placeholder="Tell the hiring team why you're a great fit…"
                      rows={5}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Using resume: <span className="font-medium text-foreground">Riya_Sharma_Resume.pdf</span>
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApply}>Submit application</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setSaved((s) => !s);
                  toast.success(saved ? "Removed from saved" : "Saved to your list");
                }}
                className="gap-2"
              >
                {saved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" /> Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" /> Save
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" /> Share
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-muted-foreground">
                <Flag className="h-4 w-4" /> Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-3 w-full md:w-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="match">My Match</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <Section title="About the role">
                  <p className="text-sm text-muted-foreground leading-relaxed">{job.about}</p>
                </Section>

                <Section title="Key responsibilities">
                  <BulletList items={job.responsibilities} />
                </Section>

                <Section title="Requirements">
                  <BulletList items={job.requirements} />
                </Section>

                <Section title="Nice to have">
                  <BulletList items={job.niceToHave} />
                </Section>

                <Section title="Benefits & perks">
                  <div className="grid sm:grid-cols-2 gap-2">
                    {job.benefits.map((b) => (
                      <div
                        key={b}
                        className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-sm">{b}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </Section>
              </TabsContent>

              <TabsContent value="company" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={job.logo} />
                        <AvatarFallback>GE</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{company.industry}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{company.about}</p>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <InfoRow icon={Users} label="Size" value={company.size} />
                      <InfoRow icon={Calendar} label="Founded" value={String(company.founded)} />
                      <InfoRow icon={MapPin} label="Headquarters" value={company.hq} />
                      <InfoRow icon={Globe} label="Website" value={company.website} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="match" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" /> Your match analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-600">{job.match}%</span>
                      </div>
                      <div>
                        <p className="font-semibold">Excellent match</p>
                        <p className="text-sm text-muted-foreground">
                          You meet most of the requirements for this role.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {job.skills.map((s) => (
                        <div key={s.name}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm font-medium">{s.name}</span>
                            <span className="text-sm text-muted-foreground">{s.level}%</span>
                          </div>
                          <Progress value={s.level} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow icon={Briefcase} label="Role" value={job.title} />
                <InfoRow icon={Clock} label="Type" value={`${job.type} • ${job.workMode}`} />
                <InfoRow icon={GraduationCap} label="Experience" value={job.experience} />
                <InfoRow icon={IndianRupee} label="Salary" value={job.salary} />
                <InfoRow icon={MapPin} label="Location" value={job.location} />
                <InfoRow icon={Calendar} label="Deadline" value={job.applyBy.replace("Apply by ", "")} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" /> Similar jobs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {similarJobs.map((s) => (
                  <Link
                    key={s.id}
                    to={`/candidate/jobs/${s.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={s.logo} />
                      <AvatarFallback>{s.company.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {s.company} • {s.location}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.salary}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {s.match}%
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-5 space-y-3">
                <Sparkles className="h-6 w-6" />
                <h3 className="font-semibold">Boost your profile</h3>
                <p className="text-sm text-primary-foreground/80">
                  Candidates with a complete profile are 4× more likely to be shortlisted.
                </p>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/candidate/profile">Complete profile</Link>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </CandidateLayout>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium text-foreground truncate ml-auto">{value}</span>
    </div>
  );
}
