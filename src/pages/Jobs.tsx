import { useEffect, useState } from "react";
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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/axios";

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
    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
      {t}
    </div>
  );
}

export default function JobPortal() {
  const { toast } = useToast();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  // API experience levels
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);

  // Selected API experience values
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);

  const [sponsorFilter, setSponsorFilter] = useState("All");

  /**
   * Fetch experience levels from API
   */
  const fetchExperienceLevels = async () => {
    try {
      const res = await API.get("/api/jobposting/all_job_experience_levels");

      if (res.data.success) {
        const levels = res.data.data
          .map((item: any) => item.name)
          .filter(Boolean);

        setExperienceLevels(levels);
      } else {
        setExperienceLevels([]);
      }
    } catch (error) {
      console.error("Experience Levels API Error:", error);
      setExperienceLevels([]);
    }
  };

  /**
   * Fetch experience levels when page loads
   */
  useEffect(() => {
    fetchExperienceLevels();
  }, []);

  /**
   * Toggle experience
   */
  const toggleExperience = (level: string, checked: boolean) => {
    setSelectedExperience((prev) => {
      if (checked) {
        return prev.includes(level) ? prev : [...prev, level];
      }

      return prev.filter((item) => item !== level);
    });
  };

  /**
   * Build search URL
   *
   * Example:
   *
   * /job-search?keyword=developer&experience=2-3%20Years,3-5%20Years&location=Kolkata
   */
  const searchParams = new URLSearchParams();

  if (keyword.trim()) {
    searchParams.set("keyword", keyword.trim());
  }

  if (selectedExperience.length > 0) {
    searchParams.set("experience", selectedExperience.join(","));
  }

  if (location.trim()) {
    searchParams.set("location", location.trim());
  }

  const searchUrl = `/job-search${
    searchParams.toString() ? `?${searchParams.toString()}` : ""
  }`;

  return (
    <div className="min-h-screen bg-background">
      <Header url="true" />

      {/* Hero */}
      <section className="bg-[#113068] pb-12 pt-12 sm:pb-14 sm:pt-16 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-[46px] md:leading-[1.1]">
            Find your dream job now
          </h1>

          <p className="mt-3 text-base text-white/70 sm:text-lg md:text-xl">
            5 lakh+ jobs for you to explore
          </p>

          {/* Search Box */}
          <Card className="mx-auto mt-7 w-full max-w-4xl rounded-2xl p-2 shadow-xl sm:mt-8 sm:rounded-3xl md:rounded-full">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-1">
              {/* Keyword */}
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter designations / companies"
                  className="
                    h-12 w-full rounded-xl pl-12 pr-4
                    text-sm shadow-none
                    focus-visible:outline-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                    sm:text-base
                    md:rounded-full
                  "
                />
              </div>

              <Separator
                orientation="vertical"
                className="hidden h-7 md:block"
              />

              {/* ================= EXPERIENCE API DROPDOWN ================= */}
              <div className="min-w-0 flex-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="
                        h-12 w-full justify-start rounded-xl
                        border-slate-200 bg-slate-50 px-4
                        text-[14px] font-normal text-slate-900
                        shadow-none hover:bg-white
                        focus:ring-2 focus:ring-blue-100
                        sm:text-base
                        md:h-11 md:rounded-full
                      "
                    >
                      <Briefcase className="mr-2 h-[18px] w-[18px] shrink-0 text-slate-400" />

                      <span className="truncate">
                        {selectedExperience.length === 0
                          ? "Select experience"
                          : selectedExperience.length === 1
                            ? selectedExperience[0]
                            : `${selectedExperience.length} experiences selected`}
                      </span>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-[var(--radix-popover-trigger-width)] p-2"
                  >
                    <div className="space-y-1">
                      {experienceLevels.map((level) => {
                        const checked = selectedExperience.includes(level);

                        return (
                          <label
                            key={level}
                            className={`
                              flex cursor-pointer items-center gap-2
                              rounded-md px-2 py-2 text-sm
                              transition-colors
                              ${
                                checked
                                  ? "bg-[#17396F]/10 text-[#17396F]"
                                  : "text-slate-700 hover:bg-slate-100"
                              }
                            `}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                toggleExperience(level, value === true)
                              }
                              className="
                                data-[state=checked]:border-[#17396F]
                                data-[state=checked]:bg-[#17396F]
                                data-[state=checked]:text-white
                              "
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

                      {selectedExperience.length > 0 && (
                        <>
                          <Separator className="my-2" />

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="
                              w-full text-[#17396F]
                              hover:bg-[#17396F]/10
                              hover:text-[#17396F]
                            "
                            onClick={() => setSelectedExperience([])}
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

              <Separator
                orientation="vertical"
                className="hidden h-7 md:block"
              />

              {/* Location */}
              <div className="relative min-w-0 flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground md:hidden" />

                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"
                  className="
                    h-12 w-full rounded-xl
                    pl-12 pr-4 text-sm shadow-none
                    focus-visible:outline-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                    sm:text-base
                    md:rounded-full md:pl-3
                  "
                />
              </div>

              {/* Search */}
              <Button
                asChild
                className="
                  h-12 w-full rounded-xl
                  bg-[#17396F] px-8
                  text-base text-white
                  transition-colors
                  hover:bg-[#102d5a]
                  md:w-auto md:rounded-full
                "
              >
                <Link to={searchUrl}>Search</Link>
              </Button>
            </div>
          </Card>

          {/* <p className="mt-4 text-xs text-white/70 sm:mt-5 sm:text-sm">
            react.js{" "}
            <span className="font-semibold text-accent">24707 new</span>
          </p> */}
        </div>

        {/* Quick Chips */}
        <div className="mx-auto mt-8 max-w-6xl px-4 sm:mt-10 sm:px-6">
          <div
            className="
              flex gap-3 overflow-x-auto pb-2
              sm:flex-wrap sm:justify-center sm:overflow-visible
            "
          >
            {CHIPS.map(({ label, icon: Icon }) => (
              <Link
                key={label}
                to="/job-search"
                className="
                  group flex shrink-0 items-center gap-2
                  rounded-xl border border-white/10
                  bg-white px-4 py-3
                  text-sm font-medium text-foreground
                  shadow-sm transition
                  hover:border-accent/50 hover:shadow-md
                  sm:px-5
                "
              >
                <Icon className="h-4 w-4 shrink-0 text-accent" />

                <span className="max-w-[120px] truncate">{label}</span>

                <ChevronRight
                  className="
                    h-3.5 w-3.5 shrink-0
                    text-muted-foreground
                    transition-transform
                    group-hover:translate-x-0.5
                  "
                />
              </Link>
            ))}
          </div>
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
              className="p-4 transition-shadow hover:shadow-md"
            >
              <Link
                to="/job-list"
                className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-accent"
              >
                {c.title}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <p className="mt-0.5 text-xs text-muted-foreground">{c.note}</p>

              <div className="mt-4 flex items-center gap-2">
                {c.brands.map((b) => (
                  <div
                    key={b}
                    className="grid h-9 w-9 place-items-center rounded-full border bg-muted text-[10px] font-bold text-muted-foreground"
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
              className="p-5 text-center transition-shadow hover:shadow-md"
            >
              <div className="grid h-12 place-items-center">
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

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
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
            className="rounded-full border-accent/40 text-accent"
          >
            <Link to="/job-list">View all companies</Link>
          </Button>
        </div>
      </section>

      {/* Promo banner */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card className="flex flex-col gap-6 overflow-hidden border-0 bg-[image:var(--gradient-brand)] p-6 md:flex-row md:items-center md:p-8">
          <div className="flex-1">
            <h3 className="font-display text-xl font-extrabold text-primary-foreground md:text-2xl">
              Stand out to leading recruiters nationwide
            </h3>

            <p className="mt-2 max-w-lg text-sm text-primary-foreground/75">
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
                  className="grid h-14 w-20 place-items-center rounded-lg bg-card text-xs font-bold text-primary"
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
        <Card className="grid overflow-hidden md:grid-cols-2">
          <div className="flex flex-col justify-center bg-[hsl(28_60%_96%)] p-8">
            <h3 className="font-display text-xl font-extrabold text-foreground">
              Discover jobs across popular roles
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Select a role and we'll show you relevant jobs for it!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 p-6 sm:grid-cols-2">
            {ROLES.map((r) => (
              <Link
                key={r.role}
                to="/job-list"
                className="rounded-lg border bg-card p-3 transition hover:border-accent/50 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-foreground">
                  {r.role}
                </p>

                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {r.jobs}
                  <ChevronRight className="h-3 w-3" />
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
                  ? "border-[#17396F] bg-[#17396F]/10 text-[#17396F]"
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
              className="p-5 text-center transition-shadow hover:shadow-md"
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
            className="rounded-full border-accent/40 text-accent"
          >
            <Link to="/job-list">View all companies</Link>
          </Button>
        </div>
      </section>

      {/* Interview prep */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr_1.2fr]">
          <Card className="flex flex-col justify-end bg-[hsl(28_60%_96%)] p-6">
            <p className="text-xs text-muted-foreground">by AmbitionBox</p>

            <h3 className="mt-2 font-display text-lg font-extrabold text-foreground">
              Prepare for your next interview
            </h3>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-bold text-foreground">
              Interview questions by company
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
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
        <Card className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
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
              className="mt-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/candidate/resume">Learn more</Link>
            </Button>

            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Includes paid services
            </p>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
