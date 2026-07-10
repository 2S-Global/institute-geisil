import { testimonials } from "./data";
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
export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            From our customers
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 shadow-sm">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-3" />
                <p className="text-foreground leading-relaxed mb-5">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="flex gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
