import { useState } from "react";
import {
  Pencil,
  Upload,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Plus,
  CheckCircle2,
  Sparkles,
  Languages,
  Building2,
  Calendar,
  Trash2,
  Download,
  Eye,
  Share2,
} from "lucide-react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const experiences = [
  {
    role: "Frontend Engineer",
    company: "Lumen Labs",
    type: "Full-time",
    period: "Jun 2023 — Present",
    loc: "Bengaluru, India",
    desc: "Building accessible React interfaces for a B2B analytics suite. Led migration to TypeScript and improved Lighthouse scores by 38%.",
  },
  {
    role: "UI Developer Intern",
    company: "Pixel Forge",
    type: "Internship",
    period: "Jan 2023 — May 2023",
    loc: "Remote",
    desc: "Shipped marketing site redesign with Next.js and Tailwind. Collaborated with design on a shared component library.",
  },
];

const education = [
  {
    degree: "B.Tech, Computer Science",
    school: "Indian Institute of Information Technology",
    period: "2019 — 2023",
    grade: "CGPA 8.6 / 10",
  },
  {
    degree: "Higher Secondary (PCM)",
    school: "Delhi Public School",
    period: "2017 — 2019",
    grade: "92.4%",
  },
];

const projects = [
  { name: "Pulse Analytics", desc: "Realtime dashboard with WebSockets, 25k MAUs.", tags: ["React", "Node", "Postgres"] },
  { name: "Atlas UI Kit", desc: "Open-source React + Tailwind component library.", tags: ["TypeScript", "Tailwind", "Storybook"] },
  { name: "FinTrack", desc: "Personal finance PWA with offline support.", tags: ["React", "IndexedDB", "Vite"] },
];

const certifications = [
  { name: "Meta Front-End Developer", issuer: "Coursera", year: "2024" },
  { name: "AWS Cloud Practitioner", issuer: "Amazon", year: "2023" },
  { name: "Google UX Design", issuer: "Coursera", year: "2023" },
];

const skills = {
  Technical: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "GraphQL", "PostgreSQL", "Vite"],
  Tools: ["Figma", "Git", "Jira", "Storybook", "Vercel", "Docker"],
  Soft: ["Communication", "Ownership", "Mentoring", "Problem solving"],
};

const languages = [
  { name: "English", level: "Professional" },
  { name: "Hindi", level: "Native" },
  { name: "Spanish", level: "Conversational" },
];

const checklist = [
  { label: "Basic information", done: true },
  { label: "Resume uploaded", done: true },
  { label: "Work experience", done: true },
  { label: "Education", done: true },
  { label: "Skills & certifications", done: true },
  { label: "Portfolio links", done: false },
  { label: "Video introduction", done: false },
];

export default function CandidateProfile() {
  const [editing, setEditing] = useState(false);
  const completed = checklist.filter((c) => c.done).length;
  const completion = Math.round((completed / checklist.length) * 100);

  return (
    <CandidateLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header / Hero */}
        <Card className="overflow-hidden border-border/60">
          <div className="h-32 md:h-40 bg-gradient-to-r from-primary/80 via-primary to-primary/60 relative">
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-3 right-3 gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit cover
            </Button>
          </div>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 -mt-12 md:-mt-14">
              <Avatar className="h-24 w-24 md:h-28 md:w-28 ring-4 ring-card shadow-md">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  RS
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Riya Sharma
                  </h1>
                  <Badge className="bg-green-500/15 text-green-600 hover:bg-green-500/15 border-0 gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Sparkles className="h-3 w-3" /> Open to work
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  Frontend Engineer · Building accessible, fast web products
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Bengaluru, India</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> 2+ yrs experience</span>
                  <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> IIIT'23</span>
                </div>
              </div>
              <div className="flex items-center gap-2 md:self-center">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" /> Resume
                </Button>
                <Button size="sm" className="gap-1.5" onClick={() => setEditing((v) => !v)}>
                  <Pencil className="h-4 w-4" /> {editing ? "Done" : "Edit profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">About me</CardTitle>
                      <CardDescription>A short summary recruiters see first.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent>
                    {editing ? (
                      <Textarea
                        rows={5}
                        defaultValue="Frontend engineer with 2+ years of experience building production React apps. I care about accessibility, performance, and clean design systems. Currently exploring senior IC roles in product-led companies."
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Frontend engineer with 2+ years of experience building production React apps.
                        I care about accessibility, performance, and clean design systems. Currently
                        exploring senior IC roles in product-led companies.
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Personal information</CardTitle>
                      <CardDescription>Only verified recruiters can view contact details.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Full name" value="Riya Sharma" editing={editing} />
                    <Field label="Headline" value="Frontend Engineer" editing={editing} />
                    <Field label="Email" value="riya.sharma@email.com" icon={Mail} editing={editing} />
                    <Field label="Phone" value="+91 98765 43210" icon={Phone} editing={editing} />
                    <Field label="Location" value="Bengaluru, India" icon={MapPin} editing={editing} />
                    <Field label="Date of birth" value="14 Mar 2001" icon={Calendar} editing={editing} />
                    <Field label="Website" value="riyasharma.dev" icon={Globe} editing={editing} />
                    <Field label="LinkedIn" value="linkedin.com/in/riyasharma" icon={Linkedin} editing={editing} />
                    <Field label="GitHub" value="github.com/riyasharma" icon={Github} editing={editing} />
                    <Field label="Current company" value="Lumen Labs" icon={Building2} editing={editing} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills</CardTitle>
                    <CardDescription>Highlight what you bring to the table.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(skills).map(([group, list]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          {group}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {list.map((s) => (
                            <Badge key={s} variant="secondary" className="font-normal">
                              {s}
                            </Badge>
                          ))}
                          <Button variant="ghost" size="sm" className="h-6 px-2 gap-1 text-xs">
                            <Plus className="h-3 w-3" /> Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2"><Languages className="h-4 w-4" /> Languages</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1"><Plus className="h-3.5 w-3.5" /> Add</Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {languages.map((l) => (
                      <div key={l.name} className="rounded-md border bg-muted/30 px-3 py-2">
                        <p className="font-medium text-sm">{l.name}</p>
                        <p className="text-xs text-muted-foreground">{l.level}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Work experience</h2>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add experience</Button>
                </div>
                <div className="space-y-4">
                  {experiences.map((e, i) => (
                    <Card key={i}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-foreground">{e.role}</p>
                                <p className="text-sm text-muted-foreground">{e.company} · {e.type}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.period}</span>
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.loc}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{e.desc}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Education</h2>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add education</Button>
                </div>
                <div className="space-y-4">
                  {education.map((e, i) => (
                    <Card key={i}>
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{e.degree}</p>
                          <p className="text-sm text-muted-foreground">{e.school}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {e.period}</span>
                            <span>{e.grade}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Certifications</h2>
                  <Button size="sm" variant="outline" className="gap-1.5"><Plus className="h-4 w-4" /> Add</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.map((c, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.issuer} · {c.year}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Projects</h2>
                  <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add project</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p, i) => (
                    <Card key={i}>
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold">{p.name}</p>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.tags.map((t) => (
                            <Badge key={t} variant="outline" className="font-normal text-xs">{t}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="resume" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resume & documents</CardTitle>
                    <CardDescription>Keep your latest resume here. Recruiters can download it instantly.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/20">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                      <p className="font-medium text-sm">Drop your resume here</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or DOCX, up to 5 MB</p>
                      <Button size="sm" className="mt-4">Choose file</Button>
                    </div>

                    <div className="space-y-2">
                      {["Riya_Sharma_Resume_2025.pdf", "Riya_Sharma_Portfolio.pdf"].map((f) => (
                        <div key={f} className="flex items-center gap-3 rounded-md border bg-card px-3 py-2.5">
                          <div className="h-9 w-9 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{f}</p>
                            <p className="text-xs text-muted-foreground">Updated 2 days ago · 248 KB</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile strength</CardTitle>
                <CardDescription>Complete your profile to get noticed by recruiters.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{completion}% complete</span>
                    <Badge variant="secondary" className="text-xs">Strong</Badge>
                  </div>
                  <Progress value={completion} className="h-2" />
                </div>
                <ul className="space-y-2">
                  {checklist.map((c) => (
                    <li key={c.label} className="flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          c.done ? "text-green-500" : "text-muted-foreground/40"
                        }`}
                      />
                      <span className={c.done ? "text-muted-foreground line-through" : "text-foreground"}>
                        {c.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job preferences</CardTitle>
                <CardDescription>Used to match you to the right roles.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <Pref label="Desired role" value="Senior Frontend Engineer" />
                <Pref label="Employment type" value="Full-time · Remote" />
                <Pref label="Expected salary" value="₹18 – 24 LPA" />
                <Pref label="Notice period" value="30 days" />
                <Pref label="Preferred locations" value="Bengaluru, Remote" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Visibility</CardTitle>
                <CardDescription>Control who can find your profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Toggle label="Open to opportunities" desc="Recruiters can reach out to you" defaultChecked />
                <Toggle label="Show profile in search" desc="Appear in candidate searches" defaultChecked />
                <Toggle label="Hide from current employer" desc="Lumen Labs won't see your profile" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  editing,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  editing: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {editing ? (
        <Input defaultValue={value} />
      ) : (
        <div className="flex items-center gap-2 text-sm text-foreground">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
          <span className="truncate">{value}</span>
        </div>
      )}
    </div>
  );
}

function Pref({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  desc,
  defaultChecked,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
