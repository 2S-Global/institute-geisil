import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ExternalLink,
  Mail,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Copy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useToast } from "@/hooks/use-toast";
import FormModal from "@/components/institute/Recruiters/FormModal";
import { useSidebar } from "@/components/ui/sidebar"

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

const sectors = [
  "IT Services",
  "Consulting",
  "Banking",
  "Manufacturing",
  "Healthcare",
  "E-commerce",
  "Education",
  "Other",
];


const ITEMS_PER_PAGE = 9;

const List = ({refresh,recruiters}) => {
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const {toggleSidebarOpen}=useSidebar()
  const totalPages = Math.ceil(recruiters.length / ITEMS_PER_PAGE);

  // Current page data
  const paginatedRecruiters = recruiters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const generatePagination = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left dots
    if (currentPage > 3) {
      pages.push("...");
    }

    // Middle pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Right dots
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
    //return [...new Set(pages)];
  };

  return (
    

      
        <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedRecruiters?.map((r, i) => (
          <Card
            key={r?.companyName + i}
            className="shadow-sm hover:shadow-md transition-shadow border-border/60"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11 border">
                  <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                    {r?.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">
                    {r?.companyName}
                  </CardTitle>
                  <CardDescription>{r.sector}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={statusStyles[r?.status]}>
                {r.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Openings</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.openings}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hired</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.hired}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.rating}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
              
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {setContact(r)}}
                >
                  
                  <Mail className="h-3.5 w-3.5" /> Contact
                </Button>
               
                  <Link
                    to={`/institute/recruiters/${r?._id}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary flex-1 gap-1"
                    >
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                   
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() =>{openModalEdit(r)}}
                >
                  <Mail className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Numbers */}
            {generatePagination().map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`${page}-${index}`}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      </>

     
  );
};

export default List;
