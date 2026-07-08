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
} from "lucide-react";

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
  skills: string[];
  match: number;
  noticePeriod: string;
  salary: string;
  availability: string;
  workMode: string;
  category: string;
  featured: boolean;
};

// 2. Extracted Helper Functions
const formatNoticePeriod = (days?: string | number | null): string => {
  if (days == null || days === "") return "Not Disclosed";
  const numDays = Number(days);
  if (numDays < 30) return `${numDays} Day${numDays === 1 ? "" : "s"}`;
  const months = Math.floor(numDays / 30);
  return `${months} Month${months === 1 ? "" : "s"}`;
};

const getExperienceDisplay = (candidateData: any): string => {
  if (candidateData.candidateDetails?.totalExperience) {
    const { year, month } = candidateData.candidateDetails.totalExperience;
    return `${year}Y ${month}M`;
  }
  if (typeof candidateData.experience === "number") return `${candidateData.experience} yrs`;
  return candidateData.exp || "-";
};

// 3. Extracted UI Component for the Card

// 4. Main Component
export default function CandidatesList() {
  // Ideally, update your hook to use the correct type instead of <any>
  const { data: rawCandidates, loading, error } = useGetAllCandidates<any>();
  const { handleBookmark, bookmarkLoading } = useBookmarkCandidate();
  
  // State: Descriptively named
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [experienceRange, setExperienceRange] = useState<number[]>([0, 15]);
  const [sortOption, setSortOption] = useState<string>("match");
  const [savedCandidates, setSavedCandidates] = useState<Set<string>>(new Set());

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
    setSortOption("match");
  };

  // Memo 1: Normalize Data ONLY when raw data changes (Separation of concerns)
  const normalizedCandidates: Candidate[] = useMemo(() => {
    if (!rawCandidates || rawCandidates.length === 0) return []; // Fallback to seed data if needed here


   
    return rawCandidates.map((c: any, index: number) => ({
      id:  c._id ,// Avoid Math.random() for stable keys
      name: c.name || "-",
      profilePicture: c.profilePicture,
      email: c.email,
      phone_number: c.phone_number,
      title: c.JobRole || "-",
      location: c.candidateDetails?.currentLocation || c.candidateDetails?.hometown || "-",
      experienceDisplay: getExperienceDisplay(c),
      experienceYears: typeof c.experience === "number" ? c.experience : (c.candidateDetails?.totalExperience?.year || parseInt(c.exp) || 0),
      education: c.education || c.academicDetails?.[0]?.educationLevel || "N/A",
      skills: Array.isArray(c.skills) ? c.skills : (c.personalData?.skills || []),
      match: typeof c.match === "number" ? c.match : (c.score || 0),
      noticePeriod: formatNoticePeriod(c?.employments?.[0]?.NoticePeriod),
      salary: c.salary || "N/A",
      availability: c.availability || "-",
      workMode: c.workMode || "-",
      category: c.category,
      featured: !!c.featured,
    }));
  }, [rawCandidates]);

  // Memo 2: Filter and Sort Data
  const filteredAndSortedCandidates = useMemo(() => {
    let result = normalizedCandidates.filter((candidate) => {
      const searchLower = searchQuery.toLowerCase().trim();
      const locationLower = locationQuery.toLowerCase().trim();

      const matchesSearch = !searchLower || 
        candidate.name.toLowerCase().includes(searchLower) ||
        candidate.title.toLowerCase().includes(searchLower) ||
        candidate.skills.some((s) => s.toLowerCase().includes(searchLower));

      const matchesLocation = !locationLower || candidate.location.toLowerCase().includes(locationLower);
      const matchesExperience = candidate.experienceYears >= experienceRange[0] && candidate.experienceYears <= experienceRange[1];

      return matchesSearch && matchesLocation && matchesExperience;
    });

    switch (sortOption) {
      case "match": return result.sort((a, b) => b.match - a.match);
      case "exp": return result.sort((a, b) => b.experienceYears - a.experienceYears);
      case "name": return result.sort((a, b) => a.name.localeCompare(b.name));
      default: return result;
    }
  }, [normalizedCandidates, searchQuery, locationQuery, experienceRange, sortOption]);

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
    <div className="space-y-6">
      <div>
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experience (years)</Label>
        <div className="mt-4 px-1">
          <Slider value={experienceRange} onValueChange={setExperienceRange} min={0} max={15} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>{experienceRange[0]} yrs</span><span>{experienceRange[1]}+ yrs</span>
          </div>
        </div>
      </div>
      <Button variant="outline" className="w-full gap-2" onClick={clearAllFilters}>
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
                  <SelectItem value="match">Sort: Best match</SelectItem>
                  <SelectItem value="exp">Sort: Experience</SelectItem>
                  <SelectItem value="name">Sort: Name (A–Z)</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="space-y-3">
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