import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileText,
  CalendarCheck,
  ClipboardList,
  Bookmark,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import api from "@/lib/axios";

const main = [
  {
    title: "Dashboard",
    url: "/candidate/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { title: "My Profile", url: "/candidate/profile", icon: User },
  // { title: "Browse Jobs", url: "/candidate/jobs", icon: Briefcase },
  { title: "Applications", url: "/candidate/applications", icon: FileText },
  { title: "Interviews", url: "/candidate/interviews", icon: CalendarCheck },
  { title: "Assessments", url: "/candidate/assessments", icon: ClipboardList },
  { title: "Saved Jobs", url: "/candidate/saved", icon: Bookmark },
];

const secondary = [
  { title: "Notifications", url: "/candidate/notifications", icon: Bell },
  { title: "Settings", url: "/candidate/settings", icon: Settings },
];

export function CandidateSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string, end?: boolean) =>
    end
      ? pathname === path
      : pathname === path || pathname.startsWith(path + "/");
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // Backend logout API
      await api.post("/api/auth/logout", {}, { withCredentials: true });

      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear normal cookies
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
      });

      // Redirect
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-display font-extrabold text-lg shadow-sm">
              G
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display font-bold text-sidebar-primary leading-tight truncate">
                  GEISIL
                </p>
                <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/70 truncate">
                  Candidate Portal
                </p>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider px-2">
                Career
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {main.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url, item.end)}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground text-sidebar-foreground rounded-md transition-colors"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            {!collapsed && (
              <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider px-2">
                Account
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {secondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground text-sidebar-foreground rounded-md transition-colors"
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/60 p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors text-sm"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
