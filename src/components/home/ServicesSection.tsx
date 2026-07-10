import { services } from "./data";
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
export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-16 md:py-20 bg-muted/30 border-y border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Verification, simplified
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            A complete suite of identity and business checks — one API, one
            dashboard.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Card
              key={s.title}
              className="border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
