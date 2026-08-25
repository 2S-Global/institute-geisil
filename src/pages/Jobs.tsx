import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import {
  Search,
  MapPin,
  ChevronRight,
  Star,
  Home,
  Building2,
  Users,
  GraduationCap,
  BarChart3,
  Sparkles,
  Truck,
  Rocket,
  Landmark,
  PieChart,
  Briefcase,
  Smartphone,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CHIPS = [
  { label: "Remote", icon: Home },
  { label: "MNC", icon: Building2 },
  { label: "HR", icon: Users },
  { label: "Internship", icon: GraduationCap },
  { label: "Data Science", icon: BarChart3 },
  { label: "Fresher", icon: Sparkles },
  { label: "Supply Chain", icon: Truck },
  { label: "Startup", icon: Rocket },
  { label: "Banking & Finance", icon: Landmark },
  { label: "Analytics", icon: PieChart },
  { label: "Sales", icon: Briefcase },
];

const CATEGORIES = [
  {
    title: "MNCs",
    note: "2.3K+ are actively hiring",
    brands: ["IBM", "TCS", "Infosys", "Wipro"],
  },
  {
    title: "Fintech",
    note: "164 are actively hiring",
    brands: ["Kredit", "PayU", "Razor", "Jupiter"],
  },
  {
    title: "FMCG & Retail",
    note: "199 are actively hiring",
    brands: ["Britannia", "Nestle", "ITC", "Dabur"],
  },
  {
    title: "Startups",
    note: "748 are actively hiring",
    brands: ["Meesho", "Zepto", "Netcore", "Cred"],
  },
  {
    title: "Edtech",
    note: "172 are actively hiring",
    brands: ["Byjus", "Unacad", "Vedantu", "UpGrad"],
  },
];

const FEATURED = [
  {
    name: "Cognizant",
    rating: 3.7,
    reviews: "40.9K+",
    blurb: "Leading IT&S company with global presence.",
  },
  {
    name: "Optum",
    rating: 4.0,
    reviews: "6.3K+",
    blurb: "Leading digital health tech company in India.",
  },
  {
    name: "Genpact",
    rating: 3.6,
    reviews: "44.1K+",
    blurb: "Global professional services firm.",
  },
  {
    name: "Nagarro",
    rating: 3.6,
    reviews: "4.1K+",
    blurb: "Leader in digital product engineering.",
  },
  {
    name: "Schneider",
    rating: 4.1,
    reviews: "9.4K+",
    blurb: "Where purpose meets sustainability.",
  },
];

const ROLES = [
  { role: "Full Stack Developer", jobs: "20.3K+ Jobs" },
  { role: "Mobile / App Developer", jobs: "2.9K+ Jobs" },
  { role: "Front End Developer", jobs: "5.8K+ Jobs" },
  { role: "DevOps Engineer", jobs: "3.1K+ Jobs" },
  { role: "Engineering Manager", jobs: "1.4K+ Jobs" },
  { role: "Technical Lead", jobs: "9.8K+ Jobs" },
];

const SPONSORED = [
  {
    name: "Thermo Fisher Scientific",
    rating: 3.8,
    reviews: "1.1K+",
    tags: [
      "Forbes Global 2000",
      "B2C",
      "B2B",
      "Foreign MNC",
      "Fortune Global 500",
    ],
  },
  {
    name: "Actin Technologies",
    rating: 3.6,
    reviews: "18",
    tags: ["IT Services & Consulting"],
  },
  {
    name: "BT Group",
    rating: 3.8,
    reviews: "2.7K+",
    tags: ["B2B", "Foreign MNC", "Telecom / ISP", "Work-Life Balance"],
  },
  {
    name: "Freyr",
    rating: 3.8,
    reviews: "460",
    tags: [
      "IT Services & Consulting",
      "Service",
      "B2B",
      "Foreign MNC",
      "Legal",
    ],
  },
  {
    name: "DEXCOM INC",
    rating: 4.3,
    reviews: "3",
    tags: ["Forbes Global 2000", "Foreign MNC", "Medical Devices"],
  },
  {
    name: "Omnicom Global Solutions",
    rating: 3.4,
    reviews: "409",
    tags: ["Advertising & Marketing", "Corporate", "B2B", "Private"],
  },
  {
    name: "DTCC",
    rating: 3.7,
    reviews: "118",
    tags: ["Private", "B2B", "Foreign MNC", "Financial Services"],
  },
  {
    name: "OKAYA",
    rating: 3.9,
    reviews: "644",
    tags: ["Electrical Equipment", "B2B", "Corporate", "Private"],
  },
];

const SPONSOR_FILTERS = [
  "All",
  "IT Services",
  "Technology",
  "Healthcare & Life Sciences",
  "Manufacturing & Production",
  "Infrastructure, Transport & Real Estate",
  "BFSI",
  "BPM",
];

const IQ_COMPANY = [
  { name: "Byjus", n: "816 Interviews" },
  { name: "Accenture", n: "2K+ Interviews" },
  { name: "Amazon", n: "1.7K+ Interviews" },
  { name: "Flipkart", n: "488 Interviews" },
  { name: "TCS", n: "2.5K+ Interviews" },
  { name: "Cognizant", n: "1.6K+ Interviews" },
];
const IQ_ROLE = [
  "Software Engineer (7.2K+ questions)",
  "Business Analyst (2.8K+ questions)",
  "Consultant (2.4K+ questions)",
  "Financial Analyst (894 questions)",
  "Sales & Marketing (991 questions)",
  "Quality Engineer (1.3K+ questions)",
];

function Initials({ name }: { name: string }) {
  const t = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary-soft text-primary grid place-items-center text-xs font-bold">
      {t}
    </div>
  );
}

export default function JobPortal() {
  const { toast } = useToast();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [sponsorFilter, setSponsorFilter] = useState("All");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header url="true" />
      {/* Hero */}
      <section className="bg-[#113068] pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-display text-[46px] leading-[1.1] md:text-[46px] font-extrabold tracking-tight text-white">
            Find your dream job now
          </h1>

          <p className="mt-3 text-lg md:text-xl text-white/70">
            5 lakh+ jobs for you to explore
          </p>

          <Card className="mt-8 p-2 rounded-full shadow-lg flex flex-col md:flex-row md:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter skills / designations / companies"
                className="pl-12 h-12 border-0 shadow-none focus-visible:ring-0 rounded-full text-base"
              />
            </div>

            <Separator orientation="vertical" className="hidden md:block h-7" />

            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger className="md:w-[180px] h-12 border-0 shadow-none focus:ring-0 rounded-full text-base text-muted-foreground">
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>

              <SelectContent>
                {[
                  "Fresher",
                  "1-3 years",
                  "3-6 years",
                  "6-10 years",
                  "10+ years",
                ].map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="hidden md:block h-7" />

            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground md:hidden" />

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="pl-12 md:pl-3 h-12 border-0 shadow-none focus-visible:ring-0 rounded-full text-base"
              />
            </div>

            <Button
              asChild
              className="rounded-full h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground text-base"
            >
              <Link
                to="/job-list"
                className="bg-[#113068] hover:bg-[#1a4385] transition-colors"
              >
                Search
              </Link>
            </Button>
          </Card>

          <p className="mt-5 text-sm text-white/70">
            react.js{" "}
            <span className="text-accent font-semibold">24707 new</span>
          </p>
        </div>

        {/* Quick chips */}
        <div className="mx-auto max-w-5xl px-4 mt-10 flex flex-wrap justify-center gap-3">
          {CHIPS.map(({ label, icon: Icon }) => (
            <Link
              key={label}
              to="/job-search"
              className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white px-5 py-3 text-sm font-medium text-foreground shadow-sm hover:border-accent/50 hover:shadow-md transition"
            >
              <Icon className="h-4 w-4 text-accent" />

              <span className="max-w-[110px] truncate">{label}</span>

              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Top companies hiring */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-center font-display text-xl font-bold text-foreground">
          Top companies hiring now
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Card
              key={c.title}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <Link
                to="/job-list"
                className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-accent"
              >
                {c.title} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>
              <div className="mt-4 flex items-center gap-2">
                {c.brands.map((b) => (
                  <div
                    key={b}
                    className="h-9 w-9 rounded-full border bg-muted grid place-items-center text-[10px] font-bold text-muted-foreground"
                  >
                    {b.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured companies */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center font-display text-xl font-bold text-foreground">
          Featured companies actively hiring
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {FEATURED.map((f) => (
            <Card
              key={f.name}
              className="p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className="h-12 grid place-items-center">
                <span className="font-display text-lg font-extrabold text-primary">
                  {f.name}
                </span>
              </div>
              <Separator className="my-4" />
              <p className="text-sm font-semibold text-foreground">{f.name}</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {f.rating}
                <span className="text-muted-foreground/70">
                  | {f.reviews} reviews
                </span>
              </p>
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                {f.blurb}
              </p>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-4 text-accent hover:text-accent"
              >
                <Link to="/job-list">View jobs</Link>
              </Button>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full text-accent border-accent/40"
          >
            <Link to="/job-list">View all companies</Link>
          </Button>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card className="overflow-hidden border-0 bg-[image:var(--gradient-brand)] p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-primary-foreground">
              Stand out to leading recruiters nationwide
            </h3>
            <p className="mt-2 text-sm text-primary-foreground/75 max-w-lg">
              Compete in India's biggest skill contest and win from ₹20L prize
              pool.
            </p>
            <Button
              className="mt-4 rounded-full bg-warning text-warning-foreground hover:bg-warning/90"
              onClick={() =>
                toast({
                  title: "Contest details sent",
                  description: "Check your inbox for registration steps.",
                })
              }
            >
              Tell me more
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["Zydus", "AI/ML", "Infosys", "AIS", "AIS", "Infosys"].map(
              (b, i) => (
                <div
                  key={i}
                  className="h-14 w-20 rounded-lg bg-card grid place-items-center text-xs font-bold text-primary"
                >
                  {b}
                </div>
              ),
            )}
          </div>
        </Card>
      </section>

      {/* Popular roles */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card className="grid gap-0 md:grid-cols-2 overflow-hidden">
          <div className="bg-[hsl(28_60%_96%)] p-8 flex flex-col justify-center">
            <h3 className="font-display text-xl font-extrabold text-foreground">
              Discover jobs across popular roles
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Select a role and we'll show you relevant jobs for it!
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <Link
                key={r.role}
                to="/job-list"
                className="rounded-lg border bg-card p-3 hover:border-accent/50 hover:shadow-sm transition"
              >
                <p className="text-sm font-semibold text-foreground">
                  {r.role}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {r.jobs} <ChevronRight className="h-3 w-3" />
                </p>
              </Link>
            ))}
          </div>
        </Card>
      </section>

      {/* Sponsored companies */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-center font-display text-xl font-bold text-foreground">
          Sponsored companies
        </h2>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {SPONSOR_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setSponsorFilter(f)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                sponsorFilter === f
                  ? "border-accent bg-accent/10 text-accent"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPONSORED.map((s) => (
            <Card
              key={s.name}
              className="p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className="flex justify-center">
                <Initials name={s.name} />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {s.name}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                {s.rating}
                <span className="text-muted-foreground/70">
                  | {s.reviews} reviews
                </span>
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="rounded-full text-accent border-accent/40"
          >
            <Link to="/job-list">View all companies</Link>
          </Button>
        </div>
      </section>

      {/* Interview prep */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1.2fr]">
          <Card className="bg-[hsl(28_60%_96%)] p-6 flex flex-col justify-end">
            <p className="text-xs text-muted-foreground">by AmbitionBox</p>
            <h3 className="mt-2 font-display text-lg font-extrabold text-foreground">
              Prepare for your next interview
            </h3>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-bold text-foreground">
              Interview questions by company
            </p>
            <div className="mt-4 grid sm:grid-cols-2 gap-2">
              {IQ_COMPANY.map((c) => (
                <Link
                  key={c.name}
                  to="/blog-list"
                  className="flex items-center gap-3 rounded-lg border p-2.5 hover:border-accent/50"
                >
                  <Initials name={c.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {c.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{c.n}</p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
            <Link
              to="/blog-list"
              className="mt-4 block text-center text-xs font-semibold text-accent hover:underline"
            >
              View all companies →
            </Link>
          </Card>
          <Card className="p-5">
            <p className="text-sm font-bold text-foreground">
              Interview questions by role
            </p>
            <ul className="mt-4 space-y-2.5">
              {IQ_ROLE.map((r) => (
                <li key={r}>
                  <Link
                    to="/blog-list"
                    className="text-sm text-muted-foreground hover:text-accent"
                  >
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/blog-list"
              className="mt-4 block text-center text-xs font-semibold text-accent hover:underline"
            >
              View all roles →
            </Link>
          </Card>
        </div>
      </section>

      {/* Premium services */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card className="p-6 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold text-foreground">
              Accelerate your job search with premium services
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Services to help you get hired faster: from preparing your CV,
              getting recruiter attention, finding the right jobs, and more!
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              {["Resume writing", "Priority applicant", "Resume display"].map(
                (s) => (
                  <span key={s} className="flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-accent" />
                    {s}
                  </span>
                ),
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">
              by GEISIL FastForward
            </p>
            <Button
              asChild
              className="mt-2 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Link to="/candidate/resume">Learn more</Link>
            </Button>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Includes paid services
            </p>
          </div>
        </Card>
      </section>

      {/* App download */}
      {/*  <section className="mx-auto max-w-6xl px-4 pb-14">
        <Card className="bg-primary-soft border-0 p-8 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h3 className="font-display text-xl font-extrabold text-foreground">
              10M+ users are on the GEISIL app
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Get real-time job updates & more!
            </p>
            <form
              className="mt-4 flex max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast({
                  title: "Link sent",
                  description: "Check your SMS for the app link.",
                });
              }}
            >
              <Input
                placeholder="Enter mobile number..."
                className="h-10 rounded-full bg-card"
              />
              <Button
                type="submit"
                className="rounded-full h-10 px-5 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Get link
              </Button>
            </form>
            <div className="mt-4 flex gap-3">
              {["Google Play", "App Store"].map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background"
                >
                  <Smartphone className="h-4 w-4" />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className="grid place-items-center">
            <div className="rounded-xl bg-card p-3 shadow-sm">
              <QrCode className="h-20 w-20 text-foreground" />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Scan to download
            </p>
          </div>
        </Card>
      </section> */}

      {/* Footer */}
      <Footer />
    </div>
  );
}
