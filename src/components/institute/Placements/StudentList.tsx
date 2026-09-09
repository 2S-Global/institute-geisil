import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import API from "../../../lib/axios";
import { OfferStatusModal, type OfferStatusForm } from "./StatusFrom";
import { useToast } from "@/components/ui/use-toast";

const PAGE_SIZE = 10;

const statusStyles: Record<string, string> = {
  Accepted: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Negotiating: "bg-accent/10 text-accent border-accent/20",
};

interface ApiOffer {
  _id: string;
  studentId: string;
  studentName: string;
  recruiterName: string;
  companyRequirementId: string;
  placement: number;
  role: string;
  ctc: string;
  location: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface OffersResponse {
  success: boolean;
  message: string;
  data: ApiOffer[];
  pagination: Pagination;
}

interface Offer {
  id: string;
  student: string;
  company: string;
  role: string;
  ctc: string;
  location: string;
  status: "Offered" | "Pending" | "Rejected";
}

interface StudentListProps {
  companyRequirementId?: string;
  isSelectedCard?: boolean;
}

function OfferSkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3 sm:px-4">
        <div className="flex min-w-[180px] items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
          <div className="h-4 w-28 rounded bg-muted" />
        </div>
      </td>

      <td className="px-3 py-3 sm:px-4">
        <div className="h-4 w-32 rounded bg-muted" />
      </td>

      <td className="px-3 py-3 sm:px-4">
        <div className="h-4 w-24 rounded bg-muted" />
      </td>

      <td className="px-3 py-3 sm:px-4">
        <div className="h-4 w-16 rounded bg-muted" />
      </td>

      <td className="px-3 py-3 sm:px-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </td>

      <td className="px-3 py-3 text-right sm:px-4">
        <div className="flex justify-end">
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
      </td>

      <td className="px-3 py-3 text-right sm:px-4">
        <div className="ml-auto h-4 w-14 rounded bg-muted" />
      </td>
    </tr>
  );
}

export default function StudentList({
  companyRequirementId,
  isSelectedCard,
}: StudentListProps) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { toast } = useToast();

  const handleOpenOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setOfferModalOpen(true);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [companyRequirementId]);

  useEffect(() => {
    let mounted = true;

    const fetchStudentList = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: {
          page: number;
          limit: number;
          companyRequirementId?: string;
          id?: string;
        } = {
          page,
          limit: PAGE_SIZE,
        };

        if (isSelectedCard) {
          params.id = companyRequirementId
            ? companyRequirementId
            : "No interview yet.";
        }

        const res = await API.get<OffersResponse>(
          "/api/instituteprofile/get_all_companies_institute_placement_student",
          {
            params,
          },
        );

        if (!mounted) return;

        const response = res.data;

        const mappedOffers: Offer[] = (response.data || []).map((item) => ({
          id: item._id,
          student: item.studentName || "-",
          company: item.recruiterName || "-",
          role: item.role || "-",
          ctc: item?.ctc || "-",
          location: item?.location || "-",
          status: item.placement ? "Accepted" : "Pending",
        }));

        setOffers(mappedOffers);
        setTotal(response.pagination?.total || 0);
      } catch (err) {
        if (!mounted) return;

        console.error("Error fetching offers:", err);

        setError("No interview yet.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStudentList();

    return () => {
      mounted = false;
    };
  }, [page, companyRequirementId, isSelectedCard]);

  const handlePageChange = (newPage: number) => {
    if (loading || newPage < 1 || newPage > totalPages) {
      return;
    }

    setPage(newPage);
  };

  const getInitials = (name: string) => {
    if (!name) return "NA";

    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const isInitialLoading = loading && offers.length === 0;

  return (
    <div className="w-full min-w-0">
      <Card className="w-full overflow-hidden border-border/60 shadow-sm">
        <CardHeader className="px-4 py-4 sm:px-6 sm:py-5">
          <CardTitle className="text-lg font-display">Recent Offers</CardTitle>

          <CardDescription>Latest placements and offer status</CardDescription>
        </CardHeader>

        <CardContent className="px-0 sm:px-6">
          {/* Responsive table */}
          <div className="w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[1000px] table-fixed text-sm">
              <thead>
                <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                  <th className="w-[220px] px-3 py-3 text-left font-medium sm:px-4">
                    Student
                  </th>

                  <th className="w-[180px] px-3 py-3 text-left font-medium sm:px-4">
                    Company
                  </th>

                  <th className="w-[160px] px-3 py-3 text-left font-medium sm:px-4">
                    Role
                  </th>

                  <th className="w-[110px] px-3 py-3 text-left font-medium sm:px-4">
                    CTC
                  </th>

                  <th className="w-[180px] px-3 py-3 text-left font-medium sm:px-4">
                    Location
                  </th>

                  <th className="w-[120px] px-3 py-3 text-right font-medium sm:px-4">
                    Status
                  </th>

                  <th className="w-[100px] px-3 py-3 text-right font-medium sm:px-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {isInitialLoading ? (
                  <>
                    {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                      <OfferSkeletonRow key={index} />
                    ))}
                  </>
                ) : error ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-destructive"
                    >
                      {error}
                    </td>
                  </tr>
                ) : offers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No offers found.
                    </td>
                  </tr>
                ) : (
                  offers.map((o) => (
                    <tr
                      key={o?.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      {/* Student */}
                      <td className="w-[220px] px-3 py-3 sm:px-4">
                        <Link
                          to={`/institute/placements/${o?.id}`}
                          className="flex min-w-0 items-center gap-3"
                        >
                          <Avatar className="h-9 w-9 shrink-0 border">
                            <AvatarFallback className="bg-primary-soft text-xs font-semibold text-primary">
                              {getInitials(o?.student)}
                            </AvatarFallback>
                          </Avatar>

                          <span
                            className="min-w-0 truncate font-semibold text-foreground transition-colors group-hover:text-primary"
                            title={o?.student}
                          >
                            {o?.student}
                          </span>
                        </Link>
                      </td>

                      {/* Company */}
                      <td className="w-[180px] px-3 py-3 sm:px-4">
                        <div
                          className="truncate font-medium text-foreground"
                          title={o?.company}
                        >
                          {o?.company}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="w-[160px] px-3 py-3 sm:px-4">
                        <div
                          className="truncate text-muted-foreground"
                          title={o?.role}
                        >
                          {o?.role}
                        </div>
                      </td>

                      {/* CTC */}
                      <td className="w-[110px] whitespace-nowrap px-3 py-3 font-semibold text-foreground sm:px-4">
                        {o?.ctc}
                      </td>

                      {/* Location */}
                      <td className="w-[180px] px-3 py-3 sm:px-4">
                        <div
                          className="flex min-w-0 items-center gap-1.5 text-muted-foreground"
                          title={o?.location}
                        >
                          {o?.location !== "-" && (
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                          )}

                          <span className="truncate">{o?.location}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="w-[120px] px-3 py-3 text-right sm:px-4">
                        <Badge
                          variant="outline"
                          className={`whitespace-nowrap ${statusStyles[o?.status]}`}
                        >
                          {o?.status}
                        </Badge>
                      </td>

                      {/* Action */}
                      <td className="w-[100px] whitespace-nowrap px-3 py-3 text-right font-semibold text-foreground sm:px-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenOffer(o)}
                          className="h-8 gap-1.5"
                          title="Update"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!error && totalPages > 0 && (
            <div className="mt-4 flex flex-col gap-4 border-t border-border/60 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-0">
              <p className="text-center text-sm text-muted-foreground sm:text-left">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {(page - 1) * PAGE_SIZE + 1}
                </span>{" "}
                -{" "}
                <span className="font-medium text-foreground">
                  {Math.min(page * PAGE_SIZE, total)}
                </span>{" "}
                of <span className="font-medium text-foreground">{total}</span>{" "}
                offers
              </p>

              <div className="flex items-center justify-center gap-2 sm:justify-end">
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}

                <button
                  type="button"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4" />

                  <span className="hidden sm:inline">Previous</span>
                </button>

                <span className="whitespace-nowrap px-1 text-sm text-muted-foreground sm:px-2">
                  Page{" "}
                  <span className="font-medium text-foreground">{page}</span> of{" "}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:px-3"
                >
                  <span className="hidden sm:inline">Next</span>

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <OfferStatusModal
        open={offerModalOpen}
        onOpenChange={(open) => {
          setOfferModalOpen(open);

          if (!open) {
            setSelectedOffer(null);
          }
        }}
        offer={selectedOffer}
        onSubmit={async (data) => {
          try {
            console.log("Update data:", data);

            const res = await API.post(
              "/api/instituteprofile/student_placement_timeline",
              { data },
            );

            // Success toast
            toast({
              title: "Success",
              description: "Offer status updated successfully.",
            });

            setOfferModalOpen(false);
            setSelectedOffer(null);

            // Refetch offers if required
            // await fetchOffers();
          } catch (error) {
            console.error("Failed to update offer:", error);

            // Error toast
            toast({
              title: "Update failed",
              description: "Failed to update offer status. Please try again.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
}
