

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  Fingerprint,
  CreditCard,
  Book,
  Contact,
  Car,
  IdCard,
  Landmark,
  ReceiptText,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Map strings coming from the backend API to actual Lucide components
const iconMap: Record<string, any> = {
  Fingerprint,
  CreditCard,
  Book,
  Contact,
  Car,
  IdCard,
  LandmarkIcon: Landmark,
  Landmark,
  LucideReceiptText: ReceiptText,
  ReceiptText,
  Building2Icon: Building2,
  Building2,
  GraduationCapIcon: GraduationCap,
  GraduationCap,
  BriefcaseBusiness,
  ShieldAlertIcon: ShieldAlert,
  ShieldAlert,
};

export default function VerificationSection() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`api/verification-services/get-all-services`);
        if (response?.data?.data?.length > 0) {
          const Data = response?.data?.data?.map((item: any) => ({
            ...item,
            readMore: false,
          }));
          setServices(Data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section
      id="verification"
      className="relative py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden border-y border-border/40"
    >
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center    mx-auto mb-10">
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading verification services...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s: any, index) => {
              const IconComponent = iconMap[s.icon] || ShieldCheck;

              return (
                <div
                  key={s._id || s.title || index}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-border/80 via-border/40 to-transparent hover:from-primary/70 hover:to-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1.5"
                >
                  <Card className="h-full bg-card/95 backdrop-blur-xl border-0 rounded-[15px] overflow-hidden flex flex-col justify-between relative">
                    {/* Top ambient highlight line inside card */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-6 flex flex-col justify-between h-full relative">
                      {/* Ambient background hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Top Header Row (Icon + Interactive Indicator) */}
                      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                          style={{
                            backgroundColor:
                              s.backgroundColor || "hsl(var(--primary) / 0.08)",
                            color: s.iconColor || "hsl(var(--primary))",
                          }}
                        >
                          <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                        </div>

                        
                      </div>

                      {/* Main Text Content */}
                      <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors mb-2">
                          {s.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground text-justify leading-relaxed">
                          {s.description}
                        </p>
                      </div>

                      {/* Bottom Active Accent Indicator Line */}
                      
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}