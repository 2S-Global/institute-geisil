import { CalendarCheck, CheckCircle2, Hourglass, Send, XCircle } from "lucide-react";


export type Status =
  | "Applied"
  | "In Review"
  | "Shortlisted"
  | "Interview"
  | "Offered"
  | "Rejected"
  | "Offer Accepted"
  | "Offer Rejected"
  | "Completed";

export const statusMeta: Record<Status, { color: string; icon: any }> = {
  Applied: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: Send },
  "In Review": {
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    icon: Hourglass,
  },
  Shortlisted: {
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    icon: CheckCircle2,
  },
  Interview: {
    color: "bg-primary/10 text-primary border-primary/20",
    icon: CalendarCheck,
  },
  Offered: {
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  Rejected: { color: "bg-rose-500/10 text-rose-600 border-rose-500/20", icon: XCircle },
  "Offer Accepted": {
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    icon: CheckCircle2,
  },
  "Offer Rejected": {
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    icon: XCircle,
  },
  Completed: {
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    icon: CheckCircle2,
  },
};

