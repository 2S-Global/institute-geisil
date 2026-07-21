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
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get("/api/contact/all");

        if (res.data.success && res.data.data.length > 0) {
          setContact(res.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/api/home/add-contact", formData);

      if (res.data.success) {
        toast.success("Message sent successfully.");

        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
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
            Let's Talk Verification
          </h2>
          <p className="text-muted-foreground mb-8">
            Have a question, want a demo, or ready to integrate? Our team
            responds within one business day.
          </p>
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                label: "Address",
                value: contact?.address || "",
              },
              {
                icon: Phone,
                label: "Call Us",
                value: contact?.phone || "",
              },
              {
                icon: Mail,
                label: "Email",
                value: contact?.email || "",
              },
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
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow only letters and spaces
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleChange(e);
                      }
                    }}
                    placeholder="Jane Doe"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Your Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                    title="Please enter a valid email address"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Request a demo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">
                  Your Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your use case..."
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
