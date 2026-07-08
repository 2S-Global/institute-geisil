import { Link } from "react-router-dom";
import { ShieldCheck, Zap, Lock, Users, Award, TrendingUp, CheckCircle2, Globe, Target, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const values = [
  { icon: ShieldCheck, title: "Trust & Security", desc: "Bank-grade encryption and full regulatory compliance on every verification." },
  { icon: Zap, title: "Speed", desc: "Automated workflows cut KYC turnaround from days to minutes." },
  { icon: Lock, title: "Data Privacy", desc: "Your customer data stays yours — encrypted at rest and in transit." },
  { icon: Heart, title: "Customer First", desc: "Dedicated support and continuous product improvements driven by feedback." },
];

const stats = [
  { value: "2M+", label: "Verifications completed" },
  { value: "2,000+", label: "Businesses onboarded" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "24/7", label: "Support coverage" },
];

const features = [
  "Aadhaar, PAN, GST, Bank & Voter ID verification",
  "Razorpay-powered pay-per-verification model",
  "Real-time API and webhook integrations",
  "Bulk verification and CSV upload",
  "Role-based team access and audit logs",
  "Custom KYC workflows for any industry",
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">G</div>
            <span className="font-bold text-lg text-foreground">GEISIL</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
            <Link to="/about" className="text-primary font-medium">About</Link>
            <Link to="/blog-list" className="text-muted-foreground hover:text-primary">Blog</Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link to="/">Login</Link></Button>
            <Button asChild size="sm"><Link to="/register">Register</Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simplifying KYC for a <span className="text-primary">digital-first India</span>
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            A secure, reliable verification platform built by Global Employability Information Services India Limited — trusted by businesses to onboard customers faster, safer, and smarter.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">About</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-3">Our Story</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Who we are</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                GEISIL is a secure and reliable KYC verification platform designed to simplify and streamline the KYC process for businesses and their clients. Our goal is to make identity verification hassle-free while ensuring full compliance with regulatory standards.
              </p>
              <p>
                With GEISIL, businesses can initiate, manage, and monitor KYC verifications through a user-friendly interface that prioritizes accuracy, data security, and operational efficiency — whether onboarding new clients or verifying existing ones.
              </p>
              <p>
                Integrated with the Razorpay payment gateway, GEISIL supports a transparent pay-per-verification model that scales with your business.
              </p>
            </div>
          </div>
          <Card className="border-border/60 shadow-lg bg-gradient-to-br from-primary-soft to-card">
            <CardContent className="p-8 space-y-4">
              <h3 className="font-bold text-xl text-foreground">What sets us apart</h3>
              {features.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </CardContent>
          </Card>
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

      {/* Mission / Vision */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, title: "Our Mission", desc: "To power seamless, secure, and compliant identity verification for every business in India — from startups to enterprises — through automation and thoughtful design." },
            { icon: Eye, title: "Our Vision", desc: "To become the most trusted verification infrastructure across South Asia, enabling a digital economy where onboarding is instant and fraud is a thing of the past." },
          ].map((m) => (
            <Card key={m.title} className="border-border/60 shadow-sm">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <m.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-xl text-foreground mb-2">{m.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-3">Core Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">What we stand for</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">The principles that shape every decision, every feature, and every interaction on our platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <Card key={v.title} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why businesses choose GEISIL</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Built for scale", desc: "From 10 to 10 million verifications — our infrastructure grows with you." },
              { icon: Award, title: "Regulator-ready", desc: "Aligned with RBI, SEBI, and UIDAI compliance frameworks out of the box." },
              { icon: TrendingUp, title: "Continuous innovation", desc: "Regular updates keep you ahead of evolving compliance and fraud patterns." },
              { icon: Globe, title: "Pan-India coverage", desc: "Verify identities across every state with consistent SLAs and support." },
              { icon: Lock, title: "Enterprise security", desc: "ISO-aligned controls, encrypted storage, and detailed access logs." },
              { icon: Zap, title: "Fast integration", desc: "Go live in days with clear docs, SDKs, and sandbox environments." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-5 rounded-lg bg-card border border-border/60">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-border/60 shadow-brand bg-gradient-to-br from-primary to-primary-hover text-primary-foreground overflow-hidden">
            <CardContent className="p-10 md:p-14 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to streamline your KYC?</h2>
              <p className="opacity-90 max-w-xl mx-auto mb-6">Join thousands of businesses using GEISIL to onboard customers faster, safer, and with confidence.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg" variant="secondary"><Link to="/register">Get started free</Link></Button>
                <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link to="/contact">Talk to sales</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GEISIL. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/blog-list" className="hover:text-primary">Blog</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
