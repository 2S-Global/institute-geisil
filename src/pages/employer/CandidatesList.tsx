import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  Filter,
  Bookmark,
  BookmarkCheck,
  Mail,
  Star,
  SlidersHorizontal,
  X,
  Loader2,
  List,
  Grid3x3,
} from "lucide-react";



import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { EmployerLayout } from "@/components/EmployerLayout";
import { useGetAllCandidates } from "./hooks/useGetAllCandidates";
import { useBookmarkCandidate } from "./hooks/useBookmarkCandidate";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CandidateCard } from "../candidate/components/CandidateCard";

import { useGetGender } from "./hooks/useGetGender";
import { useGetUserLevel } from "./hooks/useGetUserLevel";
import { normalizeCandidate, filterCandidate } from "./utils/candidateUtils";

// 1. Better Type Definitions
export type Candidate = {
  id: string;
  name: string;
  profilePicture?: string;
  email?: string;
  phone_number?: string;
  title: string;
  location: string;
  experienceDisplay: string;
  experienceYears: number;
  education: string;
  qualifications: string[];
  gender: string;
  skills: string[];
  match: number;
  noticePeriod: string;
  salary: string;
  availability: string;
  workMode: string;
  category: string;
  featured: boolean;
};

// 2. Extracted Helper Functions (Moved to utils/candidateUtils.ts)

// 3. Extracted UI Component for the Card

// 4. Main Component
export default function CandidatesList() {
  const { data: rawCandidates, loading, error } = useGetAllCandidates<any>();
  const { handleBookmark, bookmarkLoading } = useBookmarkCandidate();

  // Custom hooks for filter data
  const { data: genderData, loading: genderLoading, error: genderError } = useGetGender();
  const { data: levelData, loading: levelLoading, error: levelError } = useGetUserLevel();

  // State: Descriptively named
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 15]);
  const [sortOption, setSortOption] = useState<string>("exp");
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());
  const [view, setView] = useState<"list" | "grid">("list");

  const [gender, setGender] = useState("all");
  const [qualification, setQualification] = useState("all");

  // Initialize saved candidates
  useEffect(() => {
    if (rawCandidates?.length) {
      const bookmarkedIds = rawCandidates
        .filter((c: any) => c.isBookmarked)
        .map((c: any) => c.id || c._id)
        .filter(Boolean);

      setSavedCandidates(new Set(bookmarkedIds));
    }
  }, [rawCandidates]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setExperienceRange([0, 15]);
    setSortOption("exp");
    setGender("all");
    setQualification("all");
  };

  // Memo 1: Normalize Data ONLY when raw data changes (Separation of concerns)
  const normalizedCandidates: Candidate[] = useMemo(() => {
    if (!rawCandidates || rawCandidates.length === 0) return []; // Fallback to seed data if needed here

    return rawCandidates.map(normalizeCandidate);
  }, [rawCandidates]);

  // Memo 2: Filter and Sort Data
  const filteredAndSortedCandidates = useMemo(() => {
    let result = normalizedCandidates.filter((candidate) =>
       filterCandidate(candidate, {
        searchQuery,
        locationQuery,
        experienceRange,
        gender,
        qualification,
        genderData,
        levelData,
      })
    );

    switch (sortOption) {
      case "match": return result.sort((a, b) => b.match - a.match);
      case "exp": return result.sort((a, b) => b.experienceYears - a.experienceYears);
      case "name": return result.sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [normalizedCandidates, searchQuery, locationQuery, experienceRange, sortOption, gender, qualification, genderData, levelData]);

  

  const toggleSave = async (id: string, name: string) => {
    const isCurrentlyBookmarked = savedCandidates.has(id);
    await handleBookmark(id, isCurrentlyBookmarked, () => {
      setSavedCandidates((prev) => {
        const next = new Set(prev);
        isCurrentlyBookmarked ? next.delete(id) : next.add(id);
        return next;
      });
    });
  };

  const FiltersPanel = (
    <div className="space-y-4">
      {/* Experience Card */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Experience (years)
          </Label>

          <div className="mt-4 px-1">
            <Slider
              value={experienceRange}
              onValueChange={setExperienceRange}
              min={0}
              max={15}
              step={1}
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{experienceRange[0]} yrs</span>
              <span>{experienceRange[1]}+ yrs</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender Card */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Candidate Gender
          </Label>

          {genderLoading ? (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading genders...
            </div>
          ) : genderError ? (
            <div className="text-xs text-destructive mt-3">Error loading genders.</div>
          ) : (
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="mt-3">
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {genderData?.map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Qualification Card */}
      <Card>
        <CardContent className="p-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Qualification
          </Label>

          {levelLoading ? (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading qualifications...
            </div>
          ) : levelError ? (
            <div className="text-xs text-destructive mt-3">Error loading qualifications.</div>
          ) : (
            <RadioGroup
              value={qualification}
              onValueChange={setQualification}
              className="mt-3 space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="q-all" />
                <Label htmlFor="q-all" className="cursor-pointer">All</Label>
              </div>

              {levelData?.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={String(item.id)}
                    id={`q-${item.id}`}
                  />
                  <Label htmlFor={`q-${item.id}`} className="cursor-pointer">{item.level}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full gap-2"
        onClick={clearAllFilters}
      >
        <X className="h-4 w-4" />
        Clear Filters
      </Button>
    </div>
  );

  return (
    <EmployerLayout>
      <PageHeader
        eyebrow="Talent pool"
        title="Search candidates"
        description="Discover, filter and shortlist candidates matching your open roles."
      />

      <Card className="mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft/40 to-transparent">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, role, or skill" className="pl-9 h-11" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="Location" className="pl-9 h-11" />
            </div>
            <Button className="h-11 gap-2 shadow-brand sm:col-span-2 md:col-span-1">
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
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
              <span className="font-semibold text-foreground">{filteredAndSortedCandidates.length}</span> candidates found
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

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[140px] sm:w-[170px] h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="match">Sort: Best match</SelectItem> */}
                  <SelectItem value="exp">Sort: Experience</SelectItem>
                  <SelectItem value="name">Sort: Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex border rounded-md p-0.5">
                <Button
                  variant={view === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setView("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-4 text-sm">
              Failed to load candidates from server. Showing local preview data.
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground mt-2">Loading candidates...</p>
            </div>
          ) : filteredAndSortedCandidates.length === 0 ? (
            <Card className="border-dashed border-border p-12 text-center">
              <p className="font-display font-semibold text-lg">No candidates match your filters</p>
              <p className="text-sm text-muted-foreground mt-1">Try broadening the search or clearing some filters.</p>
              <Button variant="outline" className="mt-4" onClick={clearAllFilters}>Reset filters</Button>
            </Card>
          ) : (
            <div
              className={cn(
                view === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                  : "space-y-3"
              )}
            >
              {filteredAndSortedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSaved={savedCandidates.has(candidate.id)}
                  onToggleSave={toggleSave}
                  isSaving={bookmarkLoading[candidate.id]}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </EmployerLayout>
  );
}