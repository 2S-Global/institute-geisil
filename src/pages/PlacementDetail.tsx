import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  MapPin,
  Building2,
  IndianRupee,
  Calendar,
  CheckCircle2,
  FileText,
  Briefcase,
} from "lucide-react";
import { useState, useEffect } from "react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";

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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import API from "@/lib/axios";

/* -------------------------------------------------------------------------- */
/*                              Loading Skeleton                              */
/* -------------------------------------------------------------------------- */

const PlacementDetailSkeleton = () => {
  return (
    <DashboardLayout>
      {/* Back button */}
      <Skeleton className="mb-4 h-8 w-40" />

      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-80 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Summary + Candidate */}
      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        {/* Offer Summary Skeleton */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />

                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-5" />

            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Candidate Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>

            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Timeline + Documents */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Timeline Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>

          <CardContent>
            <div className="space-y-7">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="ml-6 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Documents Skeleton */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>

          <CardContent className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

/* -------------------------------------------------------------------------- */
/*                            Placement Detail                                */
/* -------------------------------------------------------------------------- */

const PlacementDetail = () => {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  /* ------------------------------------------------------------------------ */
  /*                              Fetch Details                              */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const fetchStudentList = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await API.get(
          `/api/instituteprofile/student_offer_update/${id}`,
        );

        if (!mounted) return;

        const response = res?.data?.data;

        console.log("response============>", response);

        /*
         * Only check whether the API returned valid data.
         * Existing API logic is not changed.
         */
        if (!response || !Array.isArray(response) || response.length === 0) {
          setStudent([]);
          setError("No placement details found.");
          return;
        }

        setStudent(response);
      } catch (err) {
        if (!mounted) return;

        console.error("Error fetching offers:", err);

        setStudent([]);
        setError("Failed to load placement details.");
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
  }, [id]);

  /* ------------------------------------------------------------------------ */
  /*                              Data Helpers                               */
  /* ------------------------------------------------------------------------ */

  const offer = student?.[0];

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimelineDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "") => {
    if (!name) return "NA";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  /* ------------------------------------------------------------------------ */
  /*                              Timeline Data                              */
  /* ------------------------------------------------------------------------ */

  const timeline = Array.isArray(offer?.timelines)
    ? [...offer.timelines]
        .sort(
          (a, b) => Number(a?.statusOrder || 0) - Number(b?.statusOrder || 0),
        )
        .map((item) => ({
          id: item?._id,
          date: getTimelineDate(item?.date),
          title: item?.status || "-",
          desc: item?.remark || "",
          color: "text-primary",
          done: true,
        }))
    : [];

  /* ------------------------------------------------------------------------ */
  /*                              Loading State                              */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return <PlacementDetailSkeleton />;
  }

  /* ------------------------------------------------------------------------ */
  /*                               Error State                               */
  /* ------------------------------------------------------------------------ */

  if (error || !offer) {
    return (
      <DashboardLayout>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/institute/placements">
            <ArrowLeft className="h-4 w-4" />
            Back to placements
          </Link>
        </Button>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold text-foreground">
              No placement details found
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error || "Unable to load placement details."}
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=>", timeline);
  }

  return (
    <DashboardLayout>
      {/* Back */}
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/institute/placements">
          <ArrowLeft className="h-4 w-4" />
          Back to placements
        </Link>
      </Button>
      {/* Page Header */}
      {/*  eyebrow={`Offer • ${id ?? offer?._id ?? "-"}`}
      title={`${offer?.role || "-"} — ${offer?.recruiterName || "-"}`}
      description=
      {`Offer extended to ${
        offer?.studentName || "-"
      } on ${formatDate(offer?.date)}`} */}
      <PageHeader
        eyebrow=""
        title=""
        description=""
        actions={
          <>
            {/*   <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Letter
            </Button> */}
            {timeline.some((item) => item?.title === "Joined") && (
              <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                <CheckCircle2 className="h-4 w-4" />
                Mark joined
              </Button>
            )}
          </>
        }
      />
      {/* ------------------------------------------------------------------ */}
      {/*                         Offer + Candidate                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="mb-6 grid gap-5 lg:grid-cols-3">
        {/* Offer Summary */}
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Offer Summary</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Company */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Building2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Company</p>

                  <p className="font-semibold text-foreground">
                    {offer?.recruiterName || "-"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Briefcase className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Role</p>

                  <p className="font-semibold text-foreground">
                    {offer?.role || "-"}
                  </p>
                </div>
              </div>

              {/* CTC */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10 text-success">
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">CTC</p>

                  <p className="font-semibold text-foreground">
                    {offer?.ctc ? `₹ ${offer.ctc} LPA` : "-"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>

                  <p className="font-semibold text-foreground">
                    {offer?.location || "-"}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-4 text-sm sm:grid-cols-3">
              {/* Offer Date */}
              <div>
                <p className="text-xs text-muted-foreground">Offer date</p>

                <p className="font-medium text-foreground">
                  {offer?.status === "Offered"
                    ? formatDate(offer?.offerDate)
                    : "N/A"}
                </p>
              </div>
              {/* 10th */}
              <div>
                <p className="text-xs text-muted-foreground">10th</p>

                <p className="font-medium text-foreground">
                  {offer?.tenTh ?? "-"}
                  {offer?.tenTh !== undefined && offer?.tenTh !== null && "%"}
                </p>
              </div>

              {/* 12th */}
              <div>
                <p className="text-xs text-muted-foreground">12th</p>

                <p className="font-medium text-foreground">
                  {offer?.twelveTh ?? "-"}
                  {offer?.twelveTh !== undefined &&
                    offer?.twelveTh !== null &&
                    "%"}
                </p>
              </div>
            </div>

            <Separator className="my-5" />

            <div className="grid gap-4 text-sm sm:grid-cols-2">
              {/* Course */}
              <div>
                <p className="text-xs text-muted-foreground">Course</p>

                <p className="font-medium text-foreground">
                  {offer?.course || "-"}
                </p>
              </div>

              {/* Phone */}
              {/*  <div>
                <p className="text-xs text-muted-foreground">Phone</p>

                <p className="font-medium text-foreground">
                  {offer?.studentPhone || "-"}
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Candidate */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Candidate</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4 flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary-soft font-semibold text-primary">
                  {getInitials(offer?.studentName)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <Link
                  to={`/students/${offer?.studentId}`}
                  className="font-semibold text-foreground hover:underline"
                >
                  {offer?.studentName || "-"}
                </Link>

                <p className="truncate text-xs text-muted-foreground">
                  {offer?.studentEmail || "-"}
                </p>
              </div>
            </div>

            {offer?.timelines?.some(
              (item) =>
                item?.status?.trim()?.toLowerCase() === "offer accepted",
            ) && (
              <Badge
                variant="outline"
                className="w-full justify-center border-success/20 bg-success/10 py-1.5 text-success"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Offer Accepted
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
      {/* ------------------------------------------------------------------ */}
      {/*                         Timeline + Documents                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid gap-5 lg:grid-cols-1">
        {/* Timeline */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Process Timeline</CardTitle>

            <CardDescription>
              From application to offer acceptance
            </CardDescription>
          </CardHeader>

          <CardContent>
            {timeline.length > 0 ? (
              <ol className="relative ml-3 space-y-6 border-l border-border">
                {timeline.map((t, i) => (
                  <li key={t?.id || i} className="relative ml-6">
                    <span className="absolute -left-9 flex h-6 w-6 items-center justify-center rounded-full border bg-card">
                      <Calendar
                        className={`h-3.5 w-3.5 ${t?.color || "text-primary"}`}
                      />
                    </span>

                    <p className="text-sm font-semibold text-foreground">
                      {t?.title || "-"}
                    </p>

                    {t?.desc && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {t.desc}
                      </p>
                    )}

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t?.date || "-"}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="py-8 text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  No timeline updates available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents */}
        {/* <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {Array.isArray(offer?.documents) && offer.documents.length > 0 ? (
              <div className="divide-y divide-border/60">
                {offer.documents.map((document, index) => (
                  <div
                    key={document?._id || index}
                    className="flex items-center justify-between p-4 hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-primary">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {document?.name || "Document"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {document?.size || "-"}
                        </p>
                      </div>
                    </div>

                    {document?.url && (
                      <Button asChild variant="ghost" size="icon">
                        <a
                          href={document.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[180px] items-center justify-center">
                <div className="text-center">
                  <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    No documents available.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
};

export default PlacementDetail;
