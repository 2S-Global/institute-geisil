import { Link } from "react-router-dom";
import { Filter, Download } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Eye,
  Check,
  X,
  Send,
  Loader2,
  CalendarClock,
  MessageSquare,
  FileText,
} from "lucide-react";
import API from "@/lib/axios";
import { useEffect, useState } from "react";
import ShortlistInvitationModal from "@/components/employer/ShortlistedInvitationModal";
import RescheduleInvitationModal from "@/components/employer/RescheduleModal";
import RemarksModal from "@/components/employer/RemarksModal";
import OfferLetterModal from "@/components/employer/OfferLetterModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const styles: Record<string, string> = {
  applied: "bg-amber-50 text-amber-700 border-amber-200",

  shortlisted: "bg-indigo-50 text-indigo-700 border-indigo-200",

  invitation_sent: "bg-sky-50 text-sky-700 border-sky-200",

  offer_sent: "bg-emerald-50 text-emerald-700 border-emerald-200",

  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "applied":
      return "Applied";

    case "shortlisted":
      return "Shortlisted";

    case "offer_sent":
      return "Send Offer";

    case "invitation_sent":
      return "Invitation Sent";

    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

function ApplicationTable({
  data,
  handleApplicationAction,
  setSelectedCandidate,
  setIsInterviewModalOpen,
  setIsRescheduleModalOpen,
  isShortlistedTab,
  actionLoading,
  setShowRemarksModal,
  setIsOfferLetterModalOpen,
}: {
  data: Applicant[];
  handleApplicationAction: (
    applicationId: string,
    actionType: "accept" | "reject",
  ) => Promise<void>;
  setSelectedCandidate: React.Dispatch<any>;
  setIsInterviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRescheduleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isShortlistedTab: boolean;
  isInterviewTab: boolean;
  actionLoading: string | null;
  setShowRemarksModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOfferLetterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {/* Desktop Table */}
      <Card className="hidden md:block border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-center text-xs uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-4 py-3">Profile Image</th>
                <th className="font-medium px-4 py-3">Candidate</th>
                <th className="font-medium px-4 py-3">Applied Job</th>
                <th className="font-medium px-4 py-3">Notice Period</th>
                <th className="font-medium px-4 py-3">Stage</th>
                <th className="font-medium px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                data.map((a) => (
                  <tr key={a._id} className="hover:bg-muted/30 text-center">
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <img
                          src={a.profilePicture}
                          alt={a.candidateName}
                          className="h-10 w-10 rounded-full object-cover border"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-foreground">
                      {a.candidateName}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {a.jobTitle}
                    </td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {a.noticePeriod
                        ?.toLowerCase()
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={styles[a.status] || ""}
                        >
                          {getStatusLabel(a.status)}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex justify-center gap-1">
                        {/* View */}
                        <Button
                          asChild
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          title="View Application"
                        >
                          <Link to={`/employer/candidates/${a._id}`}>
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* Accept */}
                        {a.status === "applied" && (
                          <Button
                            size="icon"
                            disabled={actionLoading === a._id}
                            className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              handleApplicationAction(a._id, "accept")
                            }
                            title="Accept Application"
                          >
                            {actionLoading === a._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}

                        {/* Shortlisted -> Send Interview */}
                        {a.status === "shortlisted" && (
                          <Button
                            size="icon"
                            className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => {
                              setSelectedCandidate(a);
                              setIsInterviewModalOpen(true);
                            }}
                            title="Send Interview Invitation"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        )}

                        {/* Invitation Sent -> Reschedule Interview */}
                        {a.status === "invitation_sent" && (
                          <>
                            {/* Reschedule Interview */}
                            <Button
                              size="icon"
                              className="h-8 w-8 bg-orange-500 hover:bg-orange-600 text-white"
                              onClick={() => {
                                setSelectedCandidate(a);
                                setIsRescheduleModalOpen(true);
                              }}
                              title="Reschedule Interview"
                            >
                              <CalendarClock className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              size="icon"
                              disabled={a.isInterviewFeedbackSubmitted}
                              className={`h-8 w-8 text-white ${
                                a.isInterviewFeedbackSubmitted
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                              onClick={() => {
                                if (a.isInterviewFeedbackSubmitted) return;

                                setSelectedCandidate(a);
                                setShowRemarksModal(true);
                              }}
                              title={
                                a.isInterviewFeedbackSubmitted
                                  ? "Interview Feedback Already Submitted"
                                  : "Interview Remarks"
                              }
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              size="icon"
                              className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => {
                                setSelectedCandidate(a);
                                setIsOfferLetterModalOpen(true); // open offer letter modal
                              }}
                              title="Send Offer Letter"
                            >
                              <FileText className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                        {/* Reject */}
                        {a.status !== "rejected" && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            disabled={actionLoading === a._id}
                            onClick={() =>
                              handleApplicationAction(a._id, "reject")
                            }
                            title="Reject Application"
                          >
                            {actionLoading === a._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <X className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}

      <div className="md:hidden space-y-3">
        {data.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No records found
          </Card>
        ) : (
          data.map((a) => (
            <Card key={a._id} className="p-4 border-border/60 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={a.profilePicture}
                    alt={a.candidateName}
                    className="h-12 w-12 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />

                  <div>
                    <h3 className="font-semibold text-base">
                      {a.candidateName}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {a.jobTitle}
                    </p>
                  </div>
                </div>

                <Badge variant="outline" className={styles[a.status] || ""}>
                  {getStatusLabel(a.status)}
                </Badge>
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium">Notice Period:</span>{" "}
                  {a.noticePeriod
                    ?.toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {/* View */}
                <Button
                  asChild
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  title="View Application"
                >
                  <Link to={`/employer/candidates/${a._id}`}>
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>

                {/* Accept */}
                {a.status === "applied" && (
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApplicationAction(a._id, "accept")}
                    title="Accept Application"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                )}

                {/* Send Interview */}
                {a.status === "shortlisted" && (
                  <Button
                    size="icon"
                    className="h-8 w-8 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => {
                      setSelectedCandidate(a);
                      setIsInterviewModalOpen(true);
                    }}
                    title="Send Interview Invitation"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                )}

                {a.status === "invitation_sent" && (
                  <>
                    <Button
                      size="icon"
                      className="h-8 w-8 bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => {
                        console.log("Opening reschedule modal");
                        setSelectedCandidate(a);
                        setIsRescheduleModalOpen(true);
                      }}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="icon"
                      className="h-8 w-8 bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => {
                        setSelectedCandidate(a);
                        setShowRemarksModal(true);
                      }}
                      title="Interview Remarks"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      size="icon"
                      className="h-8 w-8 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        setSelectedCandidate(a);
                        setIsOfferLetterModalOpen(true);
                      }}
                      title="Send Offer Letter"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}

                {/* Reject */}
                {a.status !== "rejected" && (
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleApplicationAction(a._id, "reject")}
                    title="Reject Application"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </>
  );
}

export default function Applications() {
  interface Applicant {
    _id: string;
    candidateName: string;
    jobRole: string;
    status: string;
    currentLocation: string;
    experienceLevel: string;
    profilePicture: string;
    noticePeriod: string;
    expectedSalary: {
      currency: string;
      salary: number;
    };
  }
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [isOfferLetterModalOpen, setIsOfferLetterModalOpen] = useState(false);
  const closeInterviewModal = () => {
    setIsInterviewModalOpen(false);
    setSelectedCandidate(null);
    setInterviewDate("");
    setInterviewTime("");
  };
  const handleApplicationAction = async (
    applicationId: string,
    actionType: "accept" | "reject",
  ) => {
    try {
      setActionLoading(applicationId);

      const apiMap = {
        accept: "/api/jobposting/accept_job_application_status",
        reject: "/api/jobposting/reject_job_application_status",
      };

      const response = await API.patch(apiMap[actionType], {
        applicationId,
      });

      if (response.data.success) {
        FetchApplicationDetails();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const FetchApplicationDetails = async () => {
    setLoading(true);

    try {
      const response = await API.get("/api/dashboard/getAllJobApplicantsList");

      if (response.data.success) {
        setApplications(response.data.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchApplicationDetails();
  }, []);
  return (
    <EmployerLayout>
      <PageHeader
        title="Applications"
        description="All applications received across your job postings."
        actions={
          <div className="flex flex-col sm:flex-row gap-2">
            {/* <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button> */}

            {/* <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button> */}
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {[
          ["Total", applications.length],
          [
            "Applied",
            applications.filter((a) => a.status === "applied").length,
          ],
          [
            "Shortlisted",
            applications.filter((a) => a.status === "shortlisted").length,
          ],
          [
            "Interview",
            applications.filter((a) => a.status === "invitation_sent").length,
          ],
          [
            "Offer",
            applications.filter((a) => a.status === "offer_sent").length,
          ],
        ].map(([label, value]) => (
          <Card key={String(label)} className="p-4 border-border/60 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </p>

            <p className="font-display text-2xl font-bold mt-1">{value}</p>
          </Card>
        ))}
      </div>

      {/* Tabs */}

      <Tabs defaultValue="all" className="space-y-4">
        <div className="overflow-x-auto">
          <TabsList className="inline-flex w-max">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
            <TabsTrigger value="interview">Interview</TabsTrigger>
            <TabsTrigger value="offer">Offer Letter</TabsTrigger>
          </TabsList>
        </div>

        {/* All Applications */}
        <TabsContent value="all">
          <ApplicationTable
            data={applications}
            handleApplicationAction={handleApplicationAction}
            setSelectedCandidate={setSelectedCandidate}
            setIsInterviewModalOpen={setIsInterviewModalOpen}
            setIsRescheduleModalOpen={setIsRescheduleModalOpen}
            isShortlistedTab={false}
            isInterviewTab={false}
            actionLoading={actionLoading}
            setShowRemarksModal={setShowRemarksModal}
            setIsOfferLetterModalOpen={setIsOfferLetterModalOpen}
          />
        </TabsContent>

        {/* Shortlisted Applications */}
        <TabsContent value="shortlisted">
          <ApplicationTable
            data={applications.filter((a) => a.status === "shortlisted")}
            handleApplicationAction={handleApplicationAction}
            setSelectedCandidate={setSelectedCandidate}
            setIsInterviewModalOpen={setIsInterviewModalOpen}
            setIsRescheduleModalOpen={setIsRescheduleModalOpen}
            isShortlistedTab={true}
            isInterviewTab={false}
            actionLoading={actionLoading}
            setShowRemarksModal={setShowRemarksModal}
            setIsOfferLetterModalOpen={setIsOfferLetterModalOpen}
          />
        </TabsContent>

        {/* Interview Invitations Sent */}
        <TabsContent value="interview">
          <ApplicationTable
            data={applications.filter((a) => a.status === "invitation_sent")}
            handleApplicationAction={handleApplicationAction}
            setSelectedCandidate={setSelectedCandidate}
            setIsInterviewModalOpen={setIsInterviewModalOpen}
            setIsRescheduleModalOpen={setIsRescheduleModalOpen}
            isShortlistedTab={false}
            isInterviewTab={true}
            actionLoading={actionLoading}
            setShowRemarksModal={setShowRemarksModal}
            setIsOfferLetterModalOpen={setIsOfferLetterModalOpen}
          />
        </TabsContent>

        {/* Offer Letters Sent */}
        <TabsContent value="offer">
          <ApplicationTable
            data={applications.filter((a) => a.status === "offer_sent")}
            handleApplicationAction={handleApplicationAction}
            setSelectedCandidate={setSelectedCandidate}
            setIsInterviewModalOpen={setIsInterviewModalOpen}
            setIsRescheduleModalOpen={setIsRescheduleModalOpen}
            isShortlistedTab={false}
            isInterviewTab={false}
            actionLoading={actionLoading}
            setShowRemarksModal={setShowRemarksModal}
            setIsOfferLetterModalOpen={setIsOfferLetterModalOpen}
          />
        </TabsContent>
      </Tabs>

      <ShortlistInvitationModal
        open={isInterviewModalOpen}
        onClose={closeInterviewModal}
        selectedCandidate={selectedCandidate}
        interviewDate={interviewDate}
        setInterviewDate={setInterviewDate}
        interviewTime={interviewTime}
        setInterviewTime={setInterviewTime}
        onSuccess={FetchApplicationDetails}
      />

      <RescheduleInvitationModal
        open={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedCandidate(null);
          setInterviewDate("");
          setInterviewTime("");
        }}
        selectedCandidate={selectedCandidate}
        interviewDate={interviewDate}
        setInterviewDate={setInterviewDate}
        interviewTime={interviewTime}
        setInterviewTime={setInterviewTime}
        onSuccess={FetchApplicationDetails}
      />

      <RemarksModal
        open={showRemarksModal}
        onClose={() => {
          setShowRemarksModal(false);
          setSelectedCandidate(null);
        }}
        selectedCandidate={selectedCandidate}
        onSuccess={FetchApplicationDetails}
      />

      <OfferLetterModal
        open={isOfferLetterModalOpen}
        selectedCandidate={selectedCandidate}
        closeModal={() => {
          setIsOfferLetterModalOpen(false);
          setSelectedCandidate(null);
        }}
        onSuccess={FetchApplicationDetails}
      />
    </EmployerLayout>
  );
}
