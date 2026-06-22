import { ReactNode,useEffect,useState } from "react";
import { Bell, Search } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { EmployerSidebar } from "@/components/EmployerSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function EmployerLayout({ children }: { children: ReactNode }) {
  const[name,setName]=useState()
     useEffect(() => {
  
      const timer = setTimeout(() => {
        setName(localStorage.getItem("name"))
      }, 1000);
  
      return () => clearTimeout(timer);
  
    }, []);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <EmployerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-16 border-b bg-card/80 backdrop-blur-md flex items-center gap-3 px-4 md:px-6">
            <SidebarTrigger className="text-foreground" />
            <div className="hidden md:flex items-center gap-2 flex-1 max-w-md ml-2">
              {/* <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates, jobs, applications…"
                  className="pl-9 h-10 bg-muted/40 border-transparent focus-visible:bg-background"
                />
              </div> */}
            </div>
            <div className="ml-auto flex items-center gap-2 md:gap-3">
              {/* <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
              </Button> */}
              <div className="hidden sm:block text-right leading-tight">
                <p className="text-sm font-semibold text-foreground">{localStorage.getItem("name")==='null'?"":localStorage.getItem("name")||""}</p>{/* 
                <p className="text-xs text-muted-foreground">Talent Acquisition</p> */}
              </div>
              <Avatar className="h-9 w-9 border">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{localStorage.getItem("name")==='null'?"":localStorage.getItem("name")?.split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")||""}</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
