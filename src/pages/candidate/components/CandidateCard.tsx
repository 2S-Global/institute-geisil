import { useState } from "react";
import { Link } from "react-router-dom";
import {
    MapPin,
    Briefcase,
    Bookmark,
    BookmarkCheck,
    Mail,
    Star,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Candidate } from "@/pages/employer/CandidatesList";
import { ContactCandidateModal } from "./ContactCandidateModal";
import { capitalizeWords } from "./SavedJobCard";

export const CandidateCard = ({
    candidate,
    isSaved,
    onToggleSave,
    isSaving
}: {
    candidate: Candidate;
    isSaved: boolean;
    onToggleSave: (id: string, name: string) => void;
    isSaving: boolean;
}) => {

    const { profilePicture, email, phone_number } = candidate
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            <Card className={cn(
                "relative h-full flex flex-col border-border/60 shadow-sm hover:shadow-md transition-all group",
                candidate.featured && "ring-1 ring-primary/30"
            )}>
                <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-4 right-4 h-8 w-8 p-0 z-10 shrink-0 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                    onClick={() => onToggleSave(candidate.id, candidate.name)}
                    aria-label="Shortlist"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : isSaved ? (
                        <BookmarkCheck className="h-5 w-5 fill-primary text-primary" />
                    ) : (
                        <Bookmark className="h-5 w-5" />
                    )}
                </Button>

                <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border shrink-0">
                            <img
                                src={candidate.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"}
                                alt={candidate.name}
                                className="h-full w-full object-cover rounded-full"
                            />
                        </Avatar>

                        {/* flex-1 + flex-col + h-full lets this column stretch to the card's
                            full height, so mt-auto below can pin the footer to the bottom */}
                        <div className="min-w-0 flex-1 flex flex-col h-full">
                            <div className="flex items-start justify-between gap-2 pr-10">
                                <div className="min-w-0">
                                    <Link
                                        to={`/employer/candidates/${candidate.id}`}
                                        className="font-display font-semibold text-base text-foreground group-hover:text-primary transition-colors truncate block"
                                    >
                                        {candidate.name}
                                    </Link>
                                    {/* Don't render a bare "-" placeholder — just omit the line */}
                                    {candidate.title && (
                                        <p className="text-sm text-muted-foreground truncate">{candidate.title}</p>
                                    )}
                                </div>
                                {candidate.featured && (
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 gap-1 shrink-0">
                                        <Star className="h-3 w-3 fill-current" /> Featured
                                    </Badge>
                                )}
                            </div>

                            {(candidate.location || candidate.experienceDisplay) && (
                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                    {candidate.location && (
                                        <span className="inline-flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5" /> {candidate.location}
                                        </span>
                                    )}
                                    {candidate.experienceDisplay && (
                                        <span className="inline-flex items-center gap-1">
                                            <Briefcase className="h-3.5 w-3.5" /> {candidate.experienceDisplay}
                                        </span>
                                    )}
                                </div>
                            )}

                            {candidate.skills?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {candidate.skills.slice(0, 4).map((skill) => (
                                        <Badge key={skill} variant="secondary" className="font-normal">
                                            {capitalizeWords(skill)}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* mt-auto pushes this block to the bottom of the card no matter
                                how tall the content above it is — this is the key fix */}
                            <div className="mt-auto">
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border/60">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                        <span className="inline-flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-success" />
                                            <span className="text-muted-foreground">Available:</span>
                                            <span className="font-semibold text-foreground">{candidate.noticePeriod || "Not disclosed"}</span>
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 sm:justify-end">
                                        <Button size="sm" variant="outline" className="h-8 gap-1.5 flex-1 sm:flex-none" onClick={() => setIsContactOpen(true)}>
                                            <Mail className="h-3.5 w-3.5" /> Contact
                                        </Button>
                                        <Button asChild size="sm" className="h-8 flex-1 sm:flex-none">
                                            <Link to={`/employer/candidates/${candidate.id}`}>View</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ContactCandidateModal
                open={isContactOpen}
                onClose={() => setIsContactOpen(false)}
                candidateName={candidate.name}
                profilePicture={profilePicture}
                email={email}
                phone_number={phone_number}
            />
        </>
    );
};