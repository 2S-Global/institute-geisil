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

export default function AboutSection() {
  const [about, setAbout] = useState();
  const fetchList = async () => {
    try {
      const res = await api.get("/api/about/details");

      setAbout(res?.data?.data[0] || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
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
            {about?.title}
          </h2>
          <div className="space-y-4 text-muted-foreground">
            {/*   <p className="flex gap-2">
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
              </p> */}
            <div dangerouslySetInnerHTML={{ __html: about?.description }} />
          </div>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/about">
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
