import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Filter,
  Bookmark,
  BookmarkCheck,
  Mail,
  Star,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  Users,
} from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number;
  education: string;
  skills: string[];
  match: number;
  salary: string;
  availability: "Immediate" | "15 days" | "30 days" | "60 days";
  workMode: "Remote" | "Hybrid" | "On-site";
  category: string;
  featured?: boolean;
};

const seed: Candidate[] = [
  { id: "c1", name: "Priya Menon", title: "Senior Frontend Engineer", location: "Bengaluru", experience: 5, education: "B.Tech, CSE", skills: ["React", "TypeScript", "Next.js", "GraphQL"], match: 94, salary: "₹18–24 LPA", availability: "30 days", workMode: "Hybrid", category: "Engineering", featured: true },
  { id: "c2", name: "Rohan Verma", title: "Data Analyst", location: "Hyderabad", experience: 3, education: "M.Sc, Statistics", skills: ["SQL", "Python", "Tableau", "PowerBI"], match: 88, salary: "₹9–12 LPA", availability: "Immediate", workMode: "On-site", category: "Data" },
  { id: "c3", name: "Aisha Khan", title: "Product Manager", location: "Remote", experience: 6, education: "MBA, IIM-B", skills: ["Roadmapping", "Analytics", "SQL", "Figma"], match: 91, salary: "₹28–34 LPA", availability: "60 days", workMode: "Remote", category: "Product", featured: true },
  { id: "c4", name: "Karthik Iyer", title: "QA Automation Engineer", location: "Pune", experience: 2, education: "B.Tech, IT", skills: ["Cypress", "Selenium", "Java", "CI/CD"], match: 82, salary: "₹7–9 LPA", availability: "15 days", workMode: "Hybrid", category: "Engineering" },
  { id: "c5", name: "Neha Gupta", title: "UI/UX Designer", location: "Bengaluru", experience: 4, education: "B.Des, NID", skills: ["Figma", "Design Systems", "Prototyping"], match: 86, salary: "₹12–16 LPA", availability: "30 days", workMode: "Hybrid", category: "Design" },
  { id: "c6", name: "Arjun Rao", title: "DevOps Engineer", location: "Bengaluru", experience: 5, education: "B.Tech, ECE", skills: ["AWS", "Kubernetes", "Terraform", "Docker"], match: 90, salary: "₹20–26 LPA", availability: "Immediate", workMode: "Remote", category: "Engineering" },
  { id: "c7", name: "Sara Joseph", title: "Data Scientist", location: "Mumbai", experience: 4, education: "M.Sc, Data Science", skills: ["Python", "ML", "TensorFlow", "SQL"], match: 89, salary: "₹16–22 LPA", availability: "30 days", workMode: "Hybrid", category: "Data" },
  { id: "c8", name: "Vikram Singh", title: "Backend Engineer", location: "Delhi NCR", experience: 3, education: "B.E, CSE", skills: ["Node.js", "Postgres", "Redis", "AWS"], match: 84, salary: "₹12–16 LPA", availability: "15 days", workMode: "On-site", category: "Engineering" },
  { id: "c9", name: "Ananya Bose", title: "Marketing Lead", location: "Kolkata", experience: 7, education: "MBA, Marketing", skills: ["SEO", "Growth", "Content", "Analytics"], match: 80, salary: "₹18–24 LPA", availability: "60 days", workMode: "Hybrid", category: "Marketing" },
];

const categories = ["Engineering", "Data", "Product", "Design", "Marketing", "Operations", "Sales"];
const workModes: Candidate["workMode"][] = ["Remote", "Hybrid", "On-site"];
const availabilities: Candidate["availability"][] = ["Immediate", "15 days", "30 days", "60 days"];

export default function CandidatesList() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [exp, setExp] = useState<number[]>([0, 15]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>("any");
  const [sort, setSort] = useState<string>("match");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleMode = (m: string) =>
    setSelectedModes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  const toggleCat = (c: string) =>
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearAll = () => {
    setQ(""); setLoc(""); setExp([0, 15]); setSelectedModes([]); setSelectedCats([]); setAvailability("any");
  };

  const filtered = useMemo(() => {
    let list = seed.filter((c) => {
      const query = q.toLowerCase().trim();
      const l = loc.toLowerCase().trim();
      if (query && !(
        c.name.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.skills.some((s) => s.toLowerCase().includes(query))
      )) return false;
      if (l && !c.location.toLowerCase().includes(l)) return false;
      if (c.experience < exp[0] || c.experience > exp[1]) return false;
      if (selectedModes.length && !selectedModes.includes(c.workMode)) return false;
      if (selectedCats.length && !selectedCats.includes(c.category)) return false;
      if (availability !== "any" && c.availability !== availability) return false;
      return true;
    });
    if (sort === "match") list = [...list].sort((a, b) => b.match - a.match);
    if (sort === "exp") list = [...list].sort((a, b) => b.experience - a.experience);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [q, loc, exp, selectedModes, selectedCats, availability, sort]);

  const toggleSave = (id: string, name: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.info(`${name} removed from shortlist`); }
      else { next.add(id); toast.success(`${name} shortlisted`); }
      return next;
    });
  };

  const FiltersPanel = (
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience (years)</Label>
        <div className="mt-4 px-1">
          <Slider value={exp} onValueChange={setExp} min={0} max={15} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{exp[0]} yrs</span><span>{exp[1]}+ yrs</span>
          </div>
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Work mode</Label>
        <div className="mt-3 space-y-2">
          {workModes.map((m) => (
            <label key={m} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedModes.includes(m)} onCheckedChange={() => toggleMode(m)} />
              <span>{m}</span>
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
        <div className="mt-3 space-y-2 max-h-52 overflow-auto pr-1">
          {categories.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox checked={selectedCats.includes(c)} onCheckedChange={() => toggleCat(c)} />
              <span>{c}</span>
            </label>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Availability</Label>
        <Select value={availability} onValueChange={setAvailability}>
          <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {availabilities.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" className="w-full gap-2" onClick={clearAll}>
        <X className="h-4 w-4" /> Clear filters
      </Button>
    </div>
  );

  return (
    <EmployerLayout>
      <PageHeader
        eyebrow="Talent pool"
        title="Search candidates"
        description="Discover, filter and shortlist candidates matching your open roles."
        actions={
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" /> Shortlist ({saved.size})
          </Button>
        }
      />

      {/* Hero search */}
      <Card className="mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft/40 to-transparent">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, role, or skill" className="pl-9 h-11" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="Location" className="pl-9 h-11" />
            </div>
            <Button className="h-11 gap-2 shadow-brand sm:col-span-2 md:col-span-1"><Search className="h-4 w-4" /> Search</Button>
          </div>

        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <Card className="border-border/60 shadow-sm sticky top-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  <h3 className="font-display font-semibold">Filters</h3>
                </div>
              </div>
              {FiltersPanel}
            </CardContent>
          </Card>
        </aside>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> candidates found
            </p>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-96 overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="mt-6">{FiltersPanel}</div>
                </SheetContent>
              </Sheet>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[140px] sm:w-[170px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Sort: Best match</SelectItem>
                  <SelectItem value="exp">Sort: Experience</SelectItem>
                  <SelectItem value="name">Sort: Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden md:flex items-center rounded-md border border-border overflow-hidden">
                <button onClick={() => setView("grid")} className={cn("p-2", view === "grid" ? "bg-muted text-foreground" : "text-muted-foreground")} aria-label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setView("list")} className={cn("p-2 border-l border-border", view === "list" ? "bg-muted text-foreground" : "text-muted-foreground")} aria-label="List view">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <Card className="border-dashed border-border p-12 text-center">
              <p className="font-display font-semibold text-lg">No candidates match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">Try broadening the search or clearing some filters.</p>
              <Button variant="outline" className="mt-4" onClick={clearAll}>Reset filters</Button>
            </Card>
          ) : (
            <div className={cn(view === "grid" ? "grid gap-4 sm:grid-cols-1 md:grid-cols-2" : "space-y-3")}>
              {filtered.map((c) => (
                <Card key={c.id} className={cn("border-border/60 shadow-sm hover:shadow-md transition-all group", c.featured && "ring-1 ring-primary/30")}>
                  <CardContent className={cn("p-4 sm:p-5", view === "list" && "md:flex md:items-center md:gap-5")}>

                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border shrink-0">
                        <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                          {c.name.split(" ").map((w) => w[0]).join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link to={`/employer/candidates/${c.id}`} className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate block">
                              {c.name}
                            </Link>
                            <p className="text-sm text-muted-foreground truncate">{c.title}</p>
                          </div>
                          {c.featured && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 shrink-0">
                              <Star className="h-3 w-3 fill-current" /> Featured
                            </Badge>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.location}</span>
                          <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {c.experience} yrs</span>
                          <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {c.education}</span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {c.skills.slice(0, 4).map((s) => (
                            <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                          ))}
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/60">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="h-2 w-2 rounded-full bg-success" />
                              <span className="text-muted-foreground">Available:</span>
                              <span className="font-semibold text-foreground">{c.availability}</span>
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-semibold text-foreground">{c.match}% match</span>
                          </div>
                          <div className="flex items-center gap-1.5 sm:justify-end">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 shrink-0" onClick={() => toggleSave(c.id, c.name)} aria-label="Shortlist">
                              {saved.has(c.id) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 gap-1.5 flex-1 sm:flex-none" onClick={() => toast.success(`Message sent to ${c.name}`)}>
                              <Mail className="h-3.5 w-3.5" /> Contact
                            </Button>
                            <Button asChild size="sm" className="h-8 flex-1 sm:flex-none">
                              <Link to={`/employer/candidates/${c.id}`}>View</Link>
                            </Button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </EmployerLayout>
  );
}
