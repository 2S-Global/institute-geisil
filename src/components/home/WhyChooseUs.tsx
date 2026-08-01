
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Lock,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API from "@/lib/axios";

const iconMap: Record<string, any> = {
  Users,
  Award,
  TrendingUp,
  Zap,
  Lock,
  ShieldCheck,
  LucideUsers: Users,
  LucideAward: Award,
  TrendingUpIcon: TrendingUp,
  LucideZap: Zap,
  LockKeyhole: Lock,
  LucideShieldCheck: ShieldCheck,
};

export default function WhyChooseUs() {
  const [whydata, Setwhydata] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/why-geisil/get");
      const result = response?.data?.data || response?.data || [];
      if (Array.isArray(result)) {
        Setwhydata(result);
      }
    } catch (error) {
      console.error("Failed to fetch why-geisil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden border-y border-border/40">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-4 px-3.5 py-1.5 font-semibold text-xs tracking-wider uppercase inline-flex items-center gap-1.5 shadow-sm rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Why GEISIL
          </Badge>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Built for Scale, Designed for Trust
          </h2>
          {/* <p className="text-muted-foreground mt-4 text-base md:text-lg leading-relaxed font-normal">
            Enterprise-grade compliance infrastructure engineered to
             handle heavy verification workloads with uncompromising accuracy and low latency.
          </p> */}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm font-medium text-muted-foreground">
                Loading architecture features...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whydata.map((item: any, index) => {
              const IconComponent = iconMap[item.icon] || ShieldCheck;

              return (
                <div
                  key={item._id || item.title || index}
                  className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-border/80 via-border/40 to-transparent hover:from-primary/60 hover:to-primary/20 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1.5"
                >
                  <Card className="h-full bg-card/95 backdrop-blur-xl border-0 rounded-[15px] overflow-hidden flex flex-col justify-between relative">
                    {/* Top ambient highlight line inside card */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-6 flex items-start gap-4 relative">
                      {/* Ambient background hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Left Icon Box with Glassmorphic Style */}
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/60 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                        style={{
                          backgroundColor:
                            item.backgroundColor || "hsl(var(--primary) / 0.08)",
                          color: item.iconColor || "hsl(var(--primary))",
                        }}
                      >
                        <IconComponent className="h-6 w-6 transition-transform duration-300 group-hover:rotate-6" />
                      </div>

                      {/* Right Content */}
                      <div className="flex flex-col flex-1 min-w-0 relative z-10">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground text-justify leading-relaxed">
                          {item.description || item.desc}
                        </p>
                      </div>
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