import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  ClipboardList,
  FileBarChart,
  Bell,
  Settings,
  Shield,
  LogOut,
  CreditCard,
  MessageSquare,
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

const main = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Candidates", url: "/admin/candidates", icon: Users },
  { title: "Employers", url: "/admin/employers", icon: Briefcase },
  { title: "Institutes", url: "/admin/institutes", icon: GraduationCap },
  { title: "Jobs", url: "/admin/jobs", icon: ClipboardList },
  { title: "Applications", url: "/admin/applications", icon: Building2 },
];

const manage = [
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  { title: "Notifications", url: "/admin/notifications", icon: Bell },
  { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  { title: "Roles & Access", url: "/admin/roles", icon: Shield },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border/60 px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-display font-extrabold text-lg shadow-sm">
            G
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display font-bold text-sidebar-primary leading-tight truncate">GEISIL</p>
              <p className="text-[11px] uppercase tracking-wider text-sidebar-foreground/70 truncate">
                Admin Console
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider px-2">
              Overview
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              {main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground text-sidebar-foreground rounded-md transition-colors"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
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
              {manage.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground text-sidebar-foreground rounded-md transition-colors"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <NavLink
          to="/admin/login"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-colors text-sm"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
}
