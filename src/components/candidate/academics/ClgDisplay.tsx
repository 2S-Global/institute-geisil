


import React from "react";
import { Pencil, GraduationCap, Calendar, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Custom helper components/methods integrated directly for clean access
const StatusIcon = ({ status, inlineBadge = false }) => {
  const iconColor = inlineBadge ? "text-white" : "";

  switch (status) {
    case "verified":
      return (
        <CheckCircle2
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-green-600"}`}
        />
      );
    case "rejected":
      return (
        <XCircle
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-red-600"}`}
        />
      );
    case "pending":
    default:
      return (
        <Clock
          className={`w-3.5 h-3.5 shrink-0 ${iconColor || "text-amber-600"}`}
        />
      );
  }
};

const getBadgeStyles = (status) => {
  switch (status) {
    case "verified":
      return "bg-[#0f8754] text-white border-transparent";
    case "rejected":
      return "bg-[#dc3545] text-white border-transparent";
    case "pending":
    default:
      return "bg-[#fd7e14] text-white border-transparent";
  }
};

const getBadgeLabel = (status) => {
  switch (status?.toLowerCase()) {
    case "verified":
      return "VERIFIED";
    case "rejected":
      return "REJECTED";
    case "pending":
    default:
      return "PENDING";
  }
};

const ClgDisplay = ({ isVerified, isPending, isRejected, data, openModalRH }) => {
  const statusKey = isVerified ? "verified" : isRejected ? "rejected" : "pending";

  // Dynamic inline indicator field checker function to map 3 states onto internal row tags
  const getFieldIcon = (fieldVerified) => {
    if (isVerified || fieldVerified === true) {
      return <CheckCircle2 size={16} className="text-green-600 shrink-0" />;
    }
    if (isRejected) {
      return <XCircle size={16} className="text-red-600 shrink-0" />;
    }
    return <Clock size={16} className="text-amber-600 shrink-0" />;
  };

  return (
    <>
      <Card key={data._id}>
        <CardContent className="p-5 flex items-start gap-4">
          <div className="h-11 w-11 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="font-semibold text-gray-900">{data?.level}</span>
              {getFieldIcon(data?.level_verified)}
              
              {/* Perfect matching rounded solid pill badge from the layout template image */}
              <span className={`ml-2 inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-0.5  rounded-full ${getBadgeStyles(statusKey)} tracking-wider shrink-0 shadow-sm`}>
                <StatusIcon status={statusKey} inlineBadge={true} />
                {getBadgeLabel(statusKey)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <span>{data?.courseName}</span>
              {getFieldIcon(data?.courseName_verified)}
            </div>

            {data.is_studied_here !== undefined && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span
                  title={data.remarks || "No remarks"}
                  className="inline-flex items-center justify-center rounded-full p-1 hover:bg-gray-100 cursor-pointer"
                >
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
              <span>{data?.instituteName}</span>
              {getFieldIcon(data?.is_studied_here)}
            </div>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              {data.universityName}
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {data?.duration.from} - {data?.duration.to}
                {getFieldIcon(data?.duration_verified)}
              </span>

              <span className="inline-flex items-center gap-1">
                {data?.courseType}
                {getFieldIcon(data?.courseType_verified)}
              </span>
            </div>

            {/* Display verification rejection feedback notes */}
            {isRejected && data?.remarks && (
              <p className="text-[11px] text-rose-500 mt-1.5 max-w-md">
                * Reason: {data.remarks}
              </p>
            )}
          </div>
          
          {/* Edit pen interface shows up strictly for Pending entries */}
          {isPending && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 shrink-0" 
              onClick={() => openModalRH(data.level_id, data._id)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}

          
        </CardContent>
      </Card>
    </>
  );
};

export default ClgDisplay;