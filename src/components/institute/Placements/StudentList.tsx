import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Building2,
  IndianRupee,
  TrendingUp,
  Users,
  Download,
  Plus,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
const statusStyles: Record<string, string> = {
  Accepted: "bg-success/10 text-success border-success/20",
  Pending: "bg-warning/10 text-warning border-warning/20",
  Negotiating: "bg-accent/10 text-accent border-accent/20",
};
interface Offer {
  student: string;
  company: string;
  role: string;
  ctc: string;
  location: string;
  status: "Accepted" | "Pending" | "Negotiating";
}

const initialOffers: Offer[] = [
  {
    student: "Priya Menon",
    company: "Google India",
    role: "SWE I",
    ctc: "32 LPA",
    location: "Bengaluru",
    status: "Accepted",
  },
  {
    student: "Rohan Verma",
    company: "Goldman Sachs",
    role: "Analyst",
    ctc: "24 LPA",
    location: "Mumbai",
    status: "Accepted",
  },
  {
    student: "Aisha Khan",
    company: "Microsoft",
    role: "Data Scientist",
    ctc: "28 LPA",
    location: "Hyderabad",
    status: "Pending",
  },
  {
    student: "Karthik Iyer",
    company: "Qualcomm",
    role: "Hardware Eng.",
    ctc: "22 LPA",
    location: "Bengaluru",
    status: "Accepted",
  },
  {
    student: "Neha Gupta",
    company: "Deloitte",
    role: "Consultant",
    ctc: "14 LPA",
    location: "Gurugram",
    status: "Negotiating",
  },
];
export default function RecruitersCard() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [offers, setOffers] = useState(initialOffers);
  const sectionRef = useRef(null);

  const handleOpenChange = (value) => {
    setOpen(value);

    if (value) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  };

  const handleSelect = (card) => {
    setSelectedCard(card);
  };

  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader>
        <CardTitle className="text-lg font-display">Recent Offers</CardTitle>
        <CardDescription>Latest placements and offer status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <th className="font-medium py-3">Student</th>
                <th className="font-medium py-3">Company</th>
                <th className="font-medium py-3">Role</th>
                <th className="font-medium py-3">CTC</th>
                <th className="font-medium py-3">Location</th>
                <th className="font-medium py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {offers.map((o) => (
                <tr
                  key={`${o.student}-${o.company}`}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-3">
                    <Link
                      to={`/institute/placements/${encodeURIComponent(o.student.toLowerCase().replace(/\s+/g, "-"))}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">
                          {o.student
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {o.student}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3 font-medium text-foreground">
                    {o.company}
                  </td>
                  <td className="py-3 text-muted-foreground">{o.role}</td>
                  <td className="py-3 font-semibold text-foreground">
                    {o.ctc}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {o.location}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Badge variant="outline" className={statusStyles[o.status]}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
