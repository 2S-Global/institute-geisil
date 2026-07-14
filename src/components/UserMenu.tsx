import { useState, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { LogoutModal } from "@/components/LogoutModal";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

export function UserMenu() {
  const [name, setName] = useState<string | null>(null);
  const [pic, setPic] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setName(localStorage.getItem("name"));
    setPic(localStorage.getItem("profilePicture"));
    setRole(localStorage.getItem("role"));
  }, []);

  const displayName = name === "null" ? "" : name || "";

  // initials calculation
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "US";

  // dashboard path
  const dashboardPath =
    role === "1"
      ? "/candidate/dashboard"
      : role === "2"
        ? "/employer/dashboard"
        : role === "3"
          ? "/institute/dashboard"
          : "/";

  // settings path
  const settingsPath =
    role === "1"
      ? "/candidate/settings"
      : role === "2"
        ? "/employer/settings"
        : role === "3"
          ? "/institute/settings"
          : "/";

  // role label
  const roleLabel =
    role === "1"
      ? "Candidate"
      : role === "2"
        ? "Employer"
        : role === "3"
          ? "Institute"
          : "User";

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 md:gap-3 hover:bg-muted/60 p-1.5 pr-2.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none text-left animate-fade-in">
            <div className="hidden sm:block text-right leading-tight">
              <p className="text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
            <Avatar className="h-9 w-9 border shadow-sm">
              {pic && pic !== "null" ? (
                <AvatarImage src={pic} alt="profile" className="object-cover" />
              ) : (
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              )}
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 p-1.5 bg-popover border border-border rounded-xl shadow-lg"
        >
          <div className="px-2 py-1.5">
            <p className="text-xs text-muted-foreground font-medium">
              Signed in as
            </p>
            <p className="text-sm font-semibold text-foreground truncate mt-0.5">
              {displayName || "User"}
            </p>
          </div>
          <div className="h-px bg-border my-1" />
          <div className="space-y-0.5">
            <button
              onClick={() => navigate(dashboardPath)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
              Dashboard
            </button>
            <button
              onClick={() => navigate(settingsPath)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-left"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              Settings
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </PopoverContent>
      </Popover>
      <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </>
  );
}
