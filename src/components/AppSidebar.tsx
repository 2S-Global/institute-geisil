import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  ClipboardCheck,
  BarChart3,
  Building2,
  Settings,
  BookOpen,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
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
    url: "/institute/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Student Verification",
    url: "/institute/student-verification",
    icon: GraduationCap,
  },
  {
    title: "Institute Profile",
    url: "/institute/institute-profile-details",
    icon: Building2,
  },
  { title: "Students", url: "/institute/students", icon: GraduationCap },

  {
    title: "Search Student",
    url: "/institute/search-student",
    icon: GraduationCap,
  },
  { title: "Courses", url: "/institute/manage-courses", icon: BookOpen },
  { title: "Recruiters", url: "/institute/recruiters", icon: Briefcase },
  { title: "Evaluations", url: "/institute/evaluations", icon: ClipboardCheck },
  { title: "Placements", url: "/institute/placements", icon: Building2 },
  { title: "Reports", url: "/institute/reports", icon: BarChart3 },
];

const secondary = [
  /*  { title: "Faculty", url: "/institute/faculty", icon: Users }, */
  { title: "Campus", url: "/institute/manage-campus", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();

  const isActive = (path: string, end?: boolean) =>
    end
      ? pathname === path
      : pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-5">
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
                Institute Portal
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider px-2">
              Workspace
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
              Manage
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
