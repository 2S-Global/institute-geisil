import { ReactNode, useEffect, useState } from "react";
import { Bell, Search, Settings, LogOut } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CandidateSidebar } from "@/components/CandidateSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { LogoutModal } from "@/components/LogoutModal";

export function CandidateLayout({ children }: { children: ReactNode }) {
  const [name, setName] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem("name"));
    const timer = setTimeout(() => {
      setName(localStorage.getItem("name"));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const displayName = name === 'null' ? "" : name || "Riya Sharma";
  const initials = displayName
    ? displayName
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
    : "RS";

  return (
    <SidebarProvider>
      <div className="min-h-screen  flex w-full bg-background">
        <CandidateSidebar />
        <div className="flex-1  flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-md flex items-center gap-3 px-4 md:px-6">
            <SidebarTrigger className="text-foreground" />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md ml-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, companies, skills…"
                  className="pl-9 h-10 bg-muted/40 border-transparent focus-visible:bg-background"
                />
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 md:gap-3 hover:bg-muted/60 p-1.5 pr-2.5 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none text-left animate-fade-in">
                    <div className="hidden sm:block text-right leading-tight">
                      <p className="text-sm font-semibold text-foreground">{displayName}</p>
                      <p className="text-xs text-muted-foreground">Candidate</p>
                    </div>
                    <Avatar className="h-9 w-9 border shadow-sm">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-1.5 bg-popover border border-border rounded-xl shadow-lg">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-foreground truncate mt-0.5">
                      {displayName || "Candidate"}
                    </p>
                  </div>
                  <div className="h-px bg-border my-1" />
                  <div className="space-y-0.5">
                    <button
                      onClick={() => navigate("/candidate/settings")}
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
            </div>
          </header>
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col">
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
              {children}
            </main>
          </div>
        </div>
      </div>
      <LogoutModal open={showLogoutModal} onOpenChange={setShowLogoutModal} />
    </SidebarProvider>
  );
}
