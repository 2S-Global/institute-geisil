import { toast } from "sonner";
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
export default function ContactSection() {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent — we'll be in touch soon.");
  };

  return (
    <section
      id="contact"
      className="py-16 md:py-20 bg-muted/30 border-t border-border/60"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
        <div>
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Contact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's talk verification
          </h2>
          <p className="text-muted-foreground mb-8">
            Have a question, want a demo, or ready to integrate? Our team
            responds within one business day.
          </p>
          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Address", value: "New Delhi, India" },
              { icon: Phone, label: "Call Us", value: "+91 98765 43210" },
              { icon: Mail, label: "Email", value: "hello@geisil.com" },
            ].map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border/60"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{c.label}</p>
                  <p className="font-medium text-foreground">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="border-border/60 shadow-md">
          <CardContent className="p-6 md:p-8">
            <h3 className="font-bold text-xl text-foreground mb-1">
              Leave A Message
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              We usually reply within a few hours.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">
                    Your Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" required placeholder="Jane Doe" />
                </div>
                <div>
                  <Label htmlFor="email">
                    Your Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="jane@company.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input id="subject" required placeholder="Request a demo" />
              </div>
              <div>
                <Label htmlFor="message">
                  Your Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Tell us about your use case…"
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
