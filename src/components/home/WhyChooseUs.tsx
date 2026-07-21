import { features } from "./data";
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
export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Why GEISIL
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Built for Scale, Designed for Trust
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Users,
              title: "Built for scale",
              desc: "From 10 to 10 million verifications — infrastructure that grows with you.",
            },
            {
              icon: Award,
              title: "Regulator-ready",
              desc: "Aligned with RBI, SEBI, and UIDAI compliance frameworks.",
            },
            {
              icon: TrendingUp,
              title: "Continuous innovation",
              desc: "Regular updates keep you ahead of evolving fraud patterns.",
            },
            {
              icon: Zap,
              title: "Fast integration",
              desc: "Go live in days with clear docs, SDKs, and sandbox environments.",
            },
            {
              icon: Lock,
              title: "Enterprise security",
              desc: "ISO-aligned controls, encrypted storage, and detailed access logs.",
            },
            {
              icon: ShieldCheck,
              title: "Compliance-first",
              desc: "Every workflow designed with audit and reporting in mind.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-5 rounded-lg bg-card border border-border/60 hover:shadow-md transition"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
