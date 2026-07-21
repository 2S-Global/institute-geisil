import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

export default function PartnersSection() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get("/api/clients/all-client");
        setPartners(res.data.data || []);
      } catch (error) {
        console.error("Error fetching partners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <section className="py-14">
        <div className="text-center">Loading partners...</div>
      </section>
    );
  }

  return (
    <>
      <style jsx>
        {`
          @keyframes partners-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          .animate-partners {
            animation: partners-scroll 25s linear infinite;
          }

          .animate-partners:hover {
            animation-play-state: paused;
          }
        `}{" "}
      </style>
      <section
        id="clients"
        className="py-14 bg-muted/30 border-y border-border/60 overflow-hidden"
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
              Powering Verification With Trusted Networks
            </h2>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex w-max animate-partners">
              {[...partners, ...partners].map((partner, index) => (
                <a
                  key={`${partner._id}-${index}`}
                  href={partner.url !== "#" ? partner.url : undefined}
                  target={partner.url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mx-4 flex-shrink-0"
                >
                  <div className="w-48 h-24 bg-white rounded-xl border border-border/60 shadow-sm hover:shadow-md transition flex items-center justify-center p-5">
                    <img
                      src={partner.image}
                      alt="Partner"
                      className="max-h-16 max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
