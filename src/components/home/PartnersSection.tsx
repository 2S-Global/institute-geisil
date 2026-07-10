import { partners } from "./data";
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
export default function PartnersSection() {
  return (
    <section
      id="clients"
      className="py-14 bg-muted/30 border-y border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Our Partners
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Powering verification with trusted networks
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {partners.map((p) => (
            <div
              key={p}
              className="h-20 rounded-lg bg-card border border-border/60 flex items-center justify-center font-bold text-muted-foreground hover:text-primary hover:border-primary/40 transition"
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
