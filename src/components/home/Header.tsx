// Header.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

import {
  ShieldCheck,
  Zap,
  Lock,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  CreditCard,
  FileCheck,
  Landmark,
  UserCheck,
  Fingerprint,
  Quote,
  Star,
  Lightbulb,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
export default function Header() {
  const [active, setActive] = useState("home");
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
          <a
            href="#home"
            onClick={() => setActive("home")}
            className={
              active === "home"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setActive("about")}
            className={
              active === "about"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setActive("services")}
            className={
              active === "services"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Services
          </a>
          <a
            href="#verification"
            onClick={() => setActive("verification")}
            className={
              active === "verification"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Verification
          </a>
          <a
            href="#clients"
            onClick={() => setActive("clients")}
            className={
              active === "clients"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Clients
          </a>
          <a
            href="#testimonials"
            onClick={() => setActive("testimonials")}
            className={
              active === "testimonials"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={() => setActive("contact")}
            className={
              active === "contact"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
