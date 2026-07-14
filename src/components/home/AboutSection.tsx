
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { ShieldCheck, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AboutSection() {
  const [about, setAbout] = useState(null);

  const fetchList = async () => {
    try {
      const res = await api.get("/api/about/details");
      setAbout(res?.data?.data[0] || null);
    } catch (err) {
      console.error("Failed to fetch about details:", err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <section id="about" className="py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-stretch">

        {/* Left Column */}
        <div className="h-full relative rounded-xl overflow-hidden border border-border/60 shadow-lg bg-gradient-to-br from-primary/10 to-primary-soft aspect-[4/3] md:aspect-auto flex items-center justify-center">
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

        {/* Right Column */}
        <div className="h-full flex flex-col justify-center">
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
            {about?.title || "Loading..."}
          </h2>

          {/* Cleaned up wrapper div */}
          <div
            className="space-y-4 text-muted-foreground text-justify"
            dangerouslySetInnerHTML={{ __html: about?.description || "" }}
          />
        </div>

      </div> {/* <-- Added missing closing tag for the grid container */}
    </section>
  );
}

