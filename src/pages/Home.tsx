import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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

const slides = [
  {
    title: "KYC Verification",
    subtitle: "Instant, secure identity checks",
    desc: "Aadhaar, PAN, GST and more — verify in seconds with bank-grade encryption.",
  },
  {
    title: "Employability Reimagined",
    subtitle: "Build a workforce you can trust",
    desc: "Background checks and credential verification that scale from 10 to 10 million records.",
  },
  {
    title: "Compliance Made Simple",
    subtitle: "Regulator-ready by default",
    desc: "Aligned with RBI, SEBI, and UIDAI frameworks — audit logs and reports included.",
  },
];

const services = [
  { icon: Fingerprint, title: "Aadhaar Verification", desc: "UIDAI-compliant Aadhaar authentication with OTP and offline eKYC." },
  { icon: CreditCard, title: "PAN Verification", desc: "Real-time PAN validation against the NSDL database." },
  { icon: Landmark, title: "Bank Account Verification", desc: "Penny-drop and IFSC-based account name & number matching." },
  { icon: FileCheck, title: "GST Verification", desc: "Validate GSTIN, business name, and registration status instantly." },
  { icon: UserCheck, title: "Voter ID & DL Checks", desc: "Verify voter ID and driving licence details in a single flow." },
  { icon: Building2, title: "Business KYB", desc: "Onboard businesses with company, director, and beneficial owner checks." },
];

const partners = ["Razorpay", "NSDL", "UIDAI", "NPCI", "SEBI", "MCA"];

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Head of Ops, FinEdge",
    quote: "GEISIL cut our onboarding time from 3 days to under 5 minutes. The API is rock solid and the dashboard is a dream.",
  },
  {
    name: "Rahul Verma",
    role: "CTO, LendKart",
    quote: "The pay-per-verification model is exactly what a growing lender needs. Compliance reports save hours every week.",
  },
  {
    name: "Aisha Khan",
    role: "Compliance Lead, PayNova",
    quote: "Best-in-class accuracy. We rely on GEISIL for every customer onboarding — zero downtime in the last year.",
  },
];

const stats = [
  { value: "2M+", label: "Verifications" },
  { value: "2,000+", label: "Businesses" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setSlide((s) => (s - 1 + slides.length) % slides.length);
  const next = () => setSlide((s) => (s + 1) % slides.length);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent — we'll be in touch soon.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
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
            <a
              href="#about"
              className="text-muted-foreground hover:text-primary"
            >
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
            <Button asChild size="sm">
              <Link to="/">Log in</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero slider */}
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

      {/* About strip */}
      <section id="about" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-xl overflow-hidden border border-border/60 shadow-lg bg-gradient-to-br from-primary/10 to-primary-soft aspect-[4/3] flex items-center justify-center">
            <div className="text-center p-8">
              <div className="mx-auto h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-4 shadow-brand">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <p className="font-semibold text-foreground">
                Trusted verification infrastructure
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Built for India's digital economy
              </p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-warning" />
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20"
              >
                About GEISIL
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Global Employability Information Services India Limited
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />{" "}
                A pioneering information and HR solutions firm dedicated to
                building secure, high-performing workforces worldwide.
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />{" "}
                We empower businesses to make informed, secure, and strategic
                decisions — ensuring every hire is not just qualified, but fully
                validated and compliant.
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />{" "}
                A pay-per-verification model integrated with Razorpay keeps
                costs transparent and scalable.
              </p>
            </div>
            <Button asChild className="mt-6" variant="outline">
              <Link to="/about">
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
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

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl md:text-5xl font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose us */}
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
              Built for scale, designed for trust
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

      {/* Partners / Clients */}
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

      {/* Testimonials */}
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

      {/* Contact */}
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

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-lg bg-primary-foreground text-primary flex items-center justify-center font-bold">
                G
              </div>
              <span className="font-bold">GEISIL</span>
            </div>
            <p className="text-sm opacity-80">
              Global Employability Information Services India Limited.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/about" className="hover:opacity-100">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog-list" className="hover:opacity-100">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:opacity-100">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <a href="#services" className="hover:opacity-100">
                  Services
                </a>
              </li>
              <li>
                <a href="#clients" className="hover:opacity-100">
                  Clients
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:opacity-100">
                  Testimonials
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Get started</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/login" className="hover:opacity-100">
                  Log in
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:opacity-100">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs opacity-70 text-center">
            © {new Date().getFullYear()} GEISIL. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
