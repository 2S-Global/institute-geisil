import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Building2,
  MapPin,
  Briefcase,
  IndianRupee,
  CheckCircle2,
  Send,
  ExternalLink,
  Loader2,
  BookmarkCheck,
} from "lucide-react";

export interface SavedJobCard {
  id: string;
  jobId: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  savedOn: string;
  match: number;
  tags: string[];
  deadline: string;
  rawJob: any;
}

interface SavedJobCardProps {
  j: SavedJobCard;
  isApplied: boolean;
  isBookmarkLoading: boolean;
  onApply: () => void;
  onRemove: () => void;
}

export const capitalizeWords = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

export const SavedJobCardComponent = ({
  j,
  isApplied,
  isBookmarkLoading,
  onApply,
  onRemove,
}: SavedJobCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow relative">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-stretch">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Logo */}
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-display font-bold shrink-0 overflow-hidden border border-border/40">
              {j.logo ? (
                <img
                  src={j.logo}
                  alt={j.company}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                j.company.substring(0, 2).toUpperCase()
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{j.title}</h3>
                {/* <Badge variant="secondary" className="font-normal">
                  {j.match}% match
                </Badge> */}
                {j.deadline && (
                  <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/10 gap-1">
                    <Clock className="h-3 w-3" />
                    {j.deadline}
                  </Badge>
                )}
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
                  <IndianRupee className="h-3.5 w-3.5" /> {j.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Posted {j.posted}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {j.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="font-normal text-xs">
                    {capitalizeWords(tag)}
                  </Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Saved {j.savedOn}
              </p>
            </div>
          </div>

          {/* Right Actions side */}
          <div className="flex flex-row md:flex-col md:items-end justify-between items-center gap-4 shrink-0 min-h-[90px]">
            {/* Bookmark button on top right */}
            <div className="md:order-1">
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive hover:bg-muted h-9 w-9"
                onClick={onRemove}
                disabled={isBookmarkLoading}
              >
                {isBookmarkLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : (
                  <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                )}
              </Button>
            </div>

            {/* Apply and View side-by-side on bottom right */}
            <div className="flex items-center gap-2 md:order-2">
              <Button size="sm" variant="outline" className="gap-2 h-9" asChild>
                <Link to={`/candidate/jobs/${j.jobId}`}>
                  <ExternalLink className="h-4 w-4" /> View
                </Link>
              </Button>
              <Button
                size="sm"
                className="gap-2 h-9"
                onClick={onApply}
                disabled={isApplied}
              >
                {isApplied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Applied
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Apply
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
