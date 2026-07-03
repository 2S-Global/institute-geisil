import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Briefcase,
  CalendarCheck,
  Check,
  ClipboardList,
  MessageSquare,
  Trash2,
  Megaphone,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";

type NotificationType = "job" | "interview" | "assessment" | "message" | "system";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
}

const iconsByType: Record<NotificationType, React.ReactNode> = {
  job: <Briefcase className="h-5 w-5 text-emerald-600" />,
  interview: <CalendarCheck className="h-5 w-5 text-violet-600" />,
  assessment: <ClipboardList className="h-5 w-5 text-amber-600" />,
  message: <MessageSquare className="h-5 w-5 text-sky-600" />,
  system: <Megaphone className="h-5 w-5 text-muted-foreground" />,
};

const bgByType: Record<NotificationType, string> = {
  job: "bg-emerald-50",
  interview: "bg-violet-50",
  assessment: "bg-amber-50",
  message: "bg-sky-50",
  system: "bg-muted",
};

const initialNotifications: NotificationItem[] = [
  {
    id: "1",
    type: "job",
    title: "New job matching your profile",
    body: "Google has posted a Frontend Engineer role that matches 92% of your skills.",
    time: "10 minutes ago",
    read: false,
    link: "/candidate/jobs/1",
  },
  {
    id: "2",
    type: "interview",
    title: "Interview scheduled",
    body: "Your technical interview with Microsoft is scheduled for tomorrow at 2:00 PM IST.",
    time: "1 hour ago",
    read: false,
    link: "/candidate/interviews",
  },
  {
    id: "3",
    type: "assessment",
    title: "Assessment reminder",
    body: "Coding assessment for Adobe expires in 24 hours. Complete it before the deadline.",
    time: "3 hours ago",
    read: false,
    link: "/candidate/assessments",
  },
  {
    id: "4",
    type: "message",
    title: "Recruiter message",
    body: "Rahul from Amazon left a note on your application: 'Great profile! We'll be in touch soon.'",
    time: "5 hours ago",
    read: true,
    link: "/candidate/applied-jobs/2",
  },
  {
    id: "5",
    type: "system",
    title: "Profile update reminder",
    body: "Your profile is 85% complete. Add a project to boost visibility to recruiters.",
    time: "1 day ago",
    read: true,
    link: "/candidate/profile",
  },
  {
    id: "6",
    type: "job",
    title: "Application viewed",
    body: "Your application for Senior React Developer at Flipkart was viewed by the hiring manager.",
    time: "2 days ago",
    read: true,
    link: "/candidate/applied-jobs/3",
  },
  {
    id: "7",
    type: "interview",
    title: "Interview feedback available",
    body: "Feedback for your interview with Netflix is now available. Check your interview history.",
    time: "3 days ago",
    read: true,
    link: "/candidate/interviews",
  },
  {
    id: "8",
    type: "assessment",
    title: "Assessment result published",
    body: "You scored 88th percentile in the DSA round for Meta. View your detailed report.",
    time: "4 days ago",
    read: true,
    link: "/candidate/assessments",
  },
];

export default function CandidateNotifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification dismissed");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const handleClick = (n: NotificationItem) => {
    if (!n.read) markAsRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <CandidateLayout>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        description="Stay updated on your applications, interviews, and opportunities."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <NotificationsList
            items={filtered}
            onClick={handleClick}
            onDismiss={dismiss}
            onMarkRead={markAsRead}
          />
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          <NotificationsList
            items={filtered}
            onClick={handleClick}
            onDismiss={dismiss}
            onMarkRead={markAsRead}
          />
        </TabsContent>
      </Tabs>
    </CandidateLayout>
  );
}

function NotificationsList({
  items,
  onClick,
  onDismiss,
  onMarkRead,
}: {
  items: NotificationItem[];
  onClick: (n: NotificationItem) => void;
  onDismiss: (id: string) => void;
  onMarkRead: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
          <Bell className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No notifications</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          You're all caught up! We'll notify you when something important happens.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((n) => (
        <Card
          key={n.id}
          className={`group cursor-pointer transition-all hover:shadow-sm ${
            n.read ? "bg-card" : "bg-accent/40 border-primary/20"
          }`}
          onClick={() => onClick(n)}
        >
          <CardContent className="p-4 flex items-start gap-4">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                bgByType[n.type]
              }`}
            >
              {iconsByType[n.type]}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {n.title}
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-primary inline-block" />
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                    {n.body}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1.5">{n.time}</p>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {!n.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onMarkRead(n.id)}
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDismiss(n.id)}
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
