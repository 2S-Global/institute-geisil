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
  SquarePen,
  UserPlus,
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

import { useSidebar } from "@/components/ui/sidebar"

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};



const List = ({data,setContact,openModalEdit,requirementAdd}) => {
   const {toggleSidebarOpen}=useSidebar()
  return (
        <>
        {data?.map((r, i) => (
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
          <div className="flex flex-wrap items-center gap-2">
  <Button
    variant="outline"
    size="sm"
    className="flex-1 min-w-[110px] gap-1"
    onClick={() => {
      setContact(r);
      toggleSidebarOpen();
    }}
  >
    <Mail className="h-3.5 w-3.5" />
    Contact
  </Button>

  <Link to={`/institute/recruiters/${r?._id}`}>
    <Button
      variant="outline"
      size="sm"
      className="flex-1 min-w-[110px] gap-1"
    >
      View <ExternalLink className="h-3.5 w-3.5" />
    </Button>
  </Link>

  <Button
    variant="outline"
    size="sm"
    className="flex-1 min-w-[110px] gap-1"
    onClick={() => {
      openModalEdit(r);
      toggleSidebarOpen();
    }}
  >
    <SquarePen className="h-3.5 w-3.5" />
    Edit
  </Button>

  <Button
    variant="outline"
    size="sm"
    className="flex-1 min-w-[50px] gap-1"
    onClick={() => {
      requirementAdd(r);
      toggleSidebarOpen();
    }}
  >
    <UserPlus className="h-3.5 w-3.5" />
  </Button>
</div>
            </CardContent>
          </Card>
        ))}
        </>
  );
};

export default List;
