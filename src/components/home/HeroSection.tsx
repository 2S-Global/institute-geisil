// HeroSection.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { slides } from "./data";

export default function HeroSection() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => setSlide((s) => (s - 1 + slides.length) % slides.length);

  const next = () => setSlide((s) => (s + 1) % slides.length);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center min-h-[520px]">
        <div>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-4"
          >
            {slides[slide].subtitle}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
            {slides[slide].title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mb-8">
            {slides[slide].desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Get started free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#services">Explore services</a>
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-8">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all ${i === slide ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative">
          <Card className="border-border/60 shadow-brand bg-gradient-to-br from-card to-primary-soft overflow-hidden">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <ShieldCheck className="h-4 w-4 text-success" />
                Live verification preview
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: "Aadhaar",
                    value: "XXXX XXXX 4712",
                    status: "Verified",
                  },
                  { label: "PAN", value: "ABCDE1234F", status: "Verified" },
                  {
                    label: "Bank A/C",
                    value: "HDFC · ***4421",
                    status: "Verified",
                  },
                  {
                    label: "GSTIN",
                    value: "27AACCG1234F1Z5",
                    status: "Verified",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/60"
                  >
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {r.label}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {r.value}
                      </div>
                    </div>
                    <Badge
                      className="bg-success/10 text-success border-success/20 hover:bg-success/10"
                      variant="outline"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> {r.status}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg. response 1.2s</span>
                <span>API v3.4</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-card border border-border/60 shadow-md items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-card border border-border/60 shadow-md items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </section>
  );
}
