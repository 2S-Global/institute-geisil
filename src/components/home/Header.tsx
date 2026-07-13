// Header.tsx
import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/lib/axios";

// import {
//   ShieldCheck,
//   Zap,
//   Lock,
//   Users,
//   Award,
//   TrendingUp,
//   CheckCircle2,
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   CreditCard,
//   FileCheck,
//   Landmark,
//   UserCheck,
//   Fingerprint,
//   Quote,
//   Star,
//   Lightbulb,
//   Mail,
//   Phone,
//   MapPin,
// } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";

export default function Header() {
  const [token, setToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    setToken(localStorage.getItem("token") || Cookies.get("token"));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            G
          </div>
          <div className="leading-tight">
            <div className="font-bold text-foreground">GEISIL</div>
            <div className="text-[10px] text-muted-foreground">
              Employability · Reimagined
            </div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a href="#home" className="text-primary font-medium">
            Home
          </a>
          <a href="#about" className="text-muted-foreground hover:text-primary">
            About
          </a>
          <a
            href="#services"
            className="text-muted-foreground hover:text-primary"
          >
            Services
          </a>
          <a
            href="#clients"
            className="text-muted-foreground hover:text-primary"
          >
            Clients
          </a>
          <a
            href="#testimonials"
            className="text-muted-foreground hover:text-primary"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-primary"
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {token ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}