export const formatStatus = (status: string) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "applied":
        return "Applied";
      case "in review":
      case "in_review":
      case "under review":
      case "under_review":
        return "In Review";
      case "shortlisted":
        return "Shortlisted";
      case "interview":
        return "Interview";
      case "invitation_sent":
        return "Invitation Sent";
      case "offered":
      case "offer":
      case "offer_sent":
      case "offer_letter_sent":
        return "Offered";
      case "rejected":
        return "Rejected";
      case "offer_letter_accepted":
        return "Offer Accepted";
      case "offer_letter_rejected":
        return "Offer Rejected";
     
      default:
        return status;
    }
  };