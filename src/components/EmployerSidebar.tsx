import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileText,
  CalendarCheck,
  ClipboardList,
  BarChart3,
  Building2,
  UserCheck,
  BookmarkCheck,
  Download,
  UserSearch,
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
import Logo from "../assets/img/Logo.webp";
const main = [
  {
    title: "Dashboard",
    url: "/employer/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  { title: "Post a New Job", url: "/employer/post-jobs", icon: Briefcase },
  { title: "Job Postings", url: "/employer/jobs", icon: Briefcase },
  /* { title: "Candidates", url: "/employer/candidates", icon: Users }, */
  {
    title: "Search Candidates",
    url: "/employer/candidates-list",
    icon: UserSearch,
  },
  { title: "Applications", url: "/employer/applications", icon: FileText },
  { title: "Interviews", url: "/employer/interviews", icon: CalendarCheck },
  { title: "Assessments", url: "/employer/assessments", icon: ClipboardList },
  { title: "Reports", url: "/employer/reports", icon: BarChart3 },
  {
    title: "Verify Employee",
    url: "/employer/verify-employee",
    icon: UserCheck,
  },
  {
    title: "Aadhar Verification",
    url: "/employer/aadhar-verification",
    icon: BookmarkCheck,
  },
  {
    title: "Download Center",
    url: "/employer/download-center",
    icon: Download,
  },
  {
    title: "Verify Requests",
    url: "/employer/employee-verification",
    icon: Users,
  },
];

const secondary = [
  { title: "Company", url: "/employer/company", icon: Building2 },
];

export function EmployerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string, end?: boolean) =>
    end
      ? pathname === path
      : pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r  border-sidebar-border">
      <SidebarHeader className="border-b  border-sidebar-border/60 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary shadow-sm sm:h-11 sm:w-11">
            <img
              src={Logo} // Replace with your logo path
              alt="GEISIL Logo"
              className="h-full w-full object-contain"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display font-bold leading-tight text-sidebar-primary">
                GEISIL
              </p>
              <p className="truncate text-[10px] uppercase tracking-wider text-sidebar-foreground/70 sm:text-[11px]">
                Employer Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 overflow-y-auto scrollbar-hide">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider px-2">
              Hiring
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
                    <NavLink to={item.url} className="flex items-center gap-3">
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
                    <NavLink to={item.url} className="flex items-center gap-3">
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
    </Sidebar>
  );
}
