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
import { services } from "./data";
export default function VerificationSection() {
  /*   const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/home/get-service-details`);
        if (response?.data?.data?.length > 0) {
          const Data = response?.data?.data?.map((item) => ({
            ...item,
            readMore: false,
          }));
          setServices(Data);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []); */
  return (
    <section
      id="verification"
      className="py-16 md:py-20 bg-muted/30 border-y border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/*  <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Our Services
          </Badge> */}
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Verification, Simplified
          </h2>
          <p className="text-muted-foreground mt-3  text-justify">
            GEISIL (Global Employability Information Services India Limited)
            streamlines user onboarding, background screening, and compliance
            workflows by directly cross-referencing official government and
            institutional databases. Here is a detailed breakdown of each
            verification service provided by GEISIL:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <Card
              key={s.title}
              className="border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <CardContent className="p-6">
                <div
                  className="h-12 w-12 rounded-lg  text-white flex items-center justify-center mb-4"
                  style={{ backgroundColor: s.color }}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground text-justify">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
