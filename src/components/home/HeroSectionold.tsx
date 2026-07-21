// HeroSection.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

export default function HeroSection() {
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [homeBanner, sethomeBanner] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/home/all-banner`);

        if (response.data) {
          sethomeBanner(response.data.data); // ✅ multiple banners
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  const prevSlide = () => {
    setSlide((prev) => (prev === 0 ? homeBanner.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (homeBanner.length > 0) {
      setSlide((prev) => (prev + 1) % homeBanner.length);
    }
  };
  // Reset slide when banners load/change
  useEffect(() => {
    if (slide >= homeBanner.length) {
      setSlide(0);
    }
  }, [homeBanner, slide]);

  // Auto slider
  useEffect(() => {
    if (homeBanner.length <= 1) return;

    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % homeBanner.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [homeBanner]);

  return (
    <section
      id="home"
      className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-primary/10
        via-primary/5
        to-background
        border-b
        border-border/60
      "
    >
      {/* LEFT ARROW */}

      <button
        onClick={prevSlide}
        className="
          absolute
          left-3
          md:left-6
          top-1/2
          -translate-y-1/2
          z-20
          h-10
          w-10
          md:h-12
          md:w-12
          rounded-full
          bg-background/80
          backdrop-blur
          border
          shadow-md
          hover:bg-primary
          hover:text-white
          transition
        "
      >
        <ArrowLeft className="h-5 w-5 mx-auto" />
      </button>

      {/* RIGHT ARROW */}

      <button
        onClick={nextSlide}
        className="
          absolute
          right-3
          md:right-6
          top-1/2
          -translate-y-1/2
          z-20
          h-10
          w-10
          md:h-12
          md:w-12
          rounded-full
          bg-background/80
          backdrop-blur
          border
          shadow-md
          hover:bg-primary
          hover:text-white
          transition
        "
      >
        <ArrowRight className="h-5 w-5 mx-auto" />
      </button>

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-12
          sm:py-16
          md:py-24
        "
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -80,
            }}
            transition={{
              duration: 0.45,
            }}
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-10
              lg:gap-16
              items-center
            "
          >
            {/* LEFT CONTENT */}

            <div
              className="
                order-2
                lg:order-1
                text-center
                lg:text-left
              "
            >
              {/*  <Badge
                variant="outline"
                className="
                  bg-primary/10
                  text-primary
                  border-primary/20
                  mb-4
                "
              >
                {homeBanner?.[slide]?.subtitle}
              </Badge>
 */}
              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-6xl
                  font-bold
                  leading-tight
                  mb-5
                "
              >
                {homeBanner?.[slide]?.banner_title}
              </h1>

              <p
                className="
                  text-muted-foreground
                  text-justify
                  text-base
                  sm:text-lg
                  max-w-xl
                  mx-auto
                  lg:mx-0
                  mb-8
                "
              >
                {homeBanner?.[slide]?.description}
              </p>

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  justify-center
                  lg:justify-start
                  gap-3
                "
              >
                <Button asChild size="lg">
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight
                      className="
                        ml-2
                        h-4
                        w-4
                      "
                    />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <a href="#services">Explore Services</a>
                </Button>
              </div>

              {/* DOTS */}

              <div
                className="
                  flex
                  justify-center
                  lg:justify-start
                  gap-2
                  mt-8
                "
              >
                {homeBanner.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSlide(index)}
                    className={`
                      h-2
                      rounded-full
                      transition-all

                      ${
                        slide === index ? "w-8 bg-primary" : "w-2 bg-primary/30"
                      }
                    `}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT RESPONSIVE IMAGE */}

            <div
              className="
                order-1
                lg:order-2
                w-full
              "
            >
              <Card
                className="
                  overflow-hidden
                  border-border/60
                  shadow-brand
                  bg-card
                "
              >
                <CardContent className="p-0">
                  <div
                    className="
                      relative
                      w-full
                      aspect-[4/3]
                      sm:aspect-[16/10]
                      lg:aspect-[4/3]
                      overflow-hidden
                    "
                  >
                    <img
                      src={homeBanner?.[slide]?.banner_image}
                      alt={homeBanner?.[slide]?.banner_title}
                      className="
                        w-full
                        h-full
                        object-cover
                        transition-transform
                        duration-500
                        hover:scale-105
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/70
                        via-black/20
                        to-transparent
                        flex
                        items-end
                        p-6
                        sm:p-8
                      "
                    >
                      {/*  <div className="text-white">
                        <h2
                          className="
                            text-xl
                            sm:text-2xl
                            font-bold
                            mb-2
                          "
                        >
                          {homeBanner?.[slide]?.banner_title}
                        </h2>

                        <p
                          className="
                            text-sm
                            sm:text-base
                            text-white/80
                          "
                        >
                          {homeBanner?.[slide]?.cardText}
                        </p>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
