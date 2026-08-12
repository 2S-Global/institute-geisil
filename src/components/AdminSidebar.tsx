import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  FileText,
  ChevronRight,
  Speech,
  Brain
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,

} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const main = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  {
    title: "Behavioral Test",
    url: "/admin/behavioral-test",
    icon: Speech,
  },
  {
    title: "Personality Test",
    url: "/admin/personality-test",
    icon: Brain,
  },
  // { title: "Candidates", url: "/admin/candidates", icon: Users },
  // { title: "Employers", url: "/admin/employers", icon: Briefcase },
  // { title: "Institutes", url: "/admin/institutes", icon: GraduationCap },
  // { title: "Jobs", url: "/admin/jobs", icon: ClipboardList },
  // { title: "Applications", url: "/admin/applications", icon: Building2 },
];

const manage = [
  // { title: "Payments", url: "/admin/payments", icon: CreditCard },
  // { title: "Reports", url: "/admin/reports", icon: FileBarChart },
  // { title: "Notifications", url: "/admin/notifications", icon: Bell },
  // { title: "Messages", url: "/admin/messages", icon: MessageSquare },
  // { title: "Roles & Access", url: "/admin/roles", icon: Shield },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

const cms = [
  // { title: "Pages", url: "/admin/cms/pages" },
  // { title: "Blogs", url: "/admin/cms/blogs" },
  { title: "Manage Banners", url: "/admin/banners" },
  { title: "About Page", url: "/admin/about-page" },
  { title: "Verification Simplified", url: "/admin/verification" },
  { title: "Why GEISIL", url: "/admin/whygeisil" },
  { title: "Manage Services", url: "/admin/manageservices" },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");
  const isCmsActive = cms.some((item) => isActive(item.url));

  return (
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
              {/* Added Collapsible CMS Menu */}
              <Collapsible
                defaultOpen={isCmsActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isCmsActive}
                      className="w-full flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground rounded-md transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && <span className="truncate">CMS</span>}
                      </div>
                      {!collapsed && (
                        <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {cms.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <NavLink to={subItem.url}>
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {manage.map((item) => (
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
