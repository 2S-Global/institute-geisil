import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

interface BannerItem {
  _id?: string | number;
  subtitle?: string;
  banner_title?: string;
  description?: string;
  banner_image?: string;
  is_del?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const SWIPE_THRESHOLD = 50;

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [homeBanner, setHomeBanner] = useState<BannerItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/home/all-banner`);
        if (isMounted && response.data?.data) {
          setHomeBanner(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching hero banners:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (homeBanner.length > 0) {
      setDirection(1);
      setSlide((prev) => (prev + 1) % homeBanner.length);
    }
  }, [homeBanner.length]);

  const prevSlide = useCallback(() => {
    if (homeBanner.length > 0) {
      setDirection(-1);
      setSlide((prev) => (prev === 0 ? homeBanner.length - 1 : prev - 1));
    }
  }, [homeBanner.length]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      nextSlide();
    } else if (info.offset.x > SWIPE_THRESHOLD) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (slide >= homeBanner.length && homeBanner.length > 0) {
      setSlide(0);
    }
  }, [homeBanner, slide]);

  useEffect(() => {
    if (homeBanner.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [homeBanner.length, nextSlide]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.96,
    }),
  };

  const currentBanner = homeBanner[slide];

  if (loading) {
    return (
      <section className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background via-primary/18 to-background border-b border-border/40 px-6 py-12">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Skeleton className="h-8 w-44 rounded-full" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-24 w-4/5 rounded-xl" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40 rounded-xl" />
              <Skeleton className="h-14 w-40 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-6">
            <Skeleton className="w-full h-[520px] rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (!homeBanner.length) return null;

  return (
    <section
      id="home"
      className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/18 via-30% to-background border-b border-border/50 py-10 lg:py-0 select-none"
    >
      {/* BALANCED GRADIENT MESH & GLOW BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.22),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.22),transparent_45%),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_55%)] pointer-events-none" />

      {/* Soft Animated Glowing Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-tr from-primary/35 to-purple-500/25 rounded-full blur-[110px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-gradient-to-bl from-blue-600/25 via-primary/25 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Subtle Dot Grid Mask Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-8 lg:px-12 z-10 my-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={slide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 260, damping: 28 },
              opacity: { duration: 0.35 },
              scale: { duration: 0.35 },
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* LEFT COLUMN: TYPOGRAPHY (55%) */}
            <div className="lg:col-span-7 xl:col-span-6 order-2 lg:order-1 text-center lg:text-left space-y-6 lg:pr-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-block"
              >
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-primary/20 to-purple-500/10 text-primary border-primary/30 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  {currentBanner?.subtitle || "Verified Service"}
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground"
                style={{ lineHeight: 1.15 }}
              >
                <span className="bg-gradient-to-r from-foreground via-foreground/95 to-primary bg-clip-text text-transparent drop-shadow-sm">
                  {currentBanner?.banner_title}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground text-left text-base sm:text-lg xl:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal tracking-wide"
              >
                {currentBanner?.description}
              </motion.p>

              {/* ACTION BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary via-primary to-purple-600 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all border-none text-white"
                >
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2.5 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-base font-semibold rounded-2xl bg-background/40 text-foreground backdrop-blur-xl border-border/80 hover:bg-foreground hover:text-background hover:border-foreground hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  <a href="#services">Explore Services</a>
                </Button>
              </motion.div>

              {/* DESKTOP INDICATORS */}
              {homeBanner.length > 1 && (
                <div className="flex justify-center lg:justify-start items-center gap-3 pt-6">
                  {homeBanner.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > slide ? 1 : -1);
                        setSlide(index);
                      }}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-500 focus:outline-none ${
                        slide === index
                          ? "w-12 bg-gradient-to-r from-primary to-purple-500 shadow-md shadow-primary/40"
                          : "w-3 bg-muted-foreground/30 hover:bg-muted-foreground/65"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: SWIPEABLE CARD WITH GRADIENT BORDER FRAME (45%) */}
            <div className="lg:col-span-5 xl:col-span-6 order-1 lg:order-2 w-full">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={handleDragEnd}
                className="relative mx-auto max-w-lg lg:max-w-none cursor-grab active:cursor-grabbing touch-pan-y"
              >
                {/* Gradient Outer Border Frame Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-[2.5rem] blur-xl opacity-70 transition duration-1000" />

                <Card className="relative overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl bg-card/30 backdrop-blur-2xl rounded-[2rem]">
                  <CardContent className="p-0 pointer-events-none">
                    <div className="relative w-full aspect-[4/3] lg:aspect-[16/11] xl:aspect-[4/3] overflow-hidden group">
                      <img
                        src={currentBanner?.banner_image}
                        alt={currentBanner?.banner_title || "Hero Banner"}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        draggable={false}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90" />

                      {/* DYNAMIC FLOATING BADGE OVERLAY BASED ON API */}
                      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-background/50 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/30 to-purple-500/20 text-primary">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              System Feature
                            </p>
                            <p className="text-sm font-bold text-foreground">
                              {currentBanner?.banner_title}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                          <ShieldCheck className="w-4 h-4" />
                          {!currentBanner?.is_del ? "Active" : "Archived"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

