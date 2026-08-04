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
export default function ServicesSection() {
  const [loading, setLoading] = useState(false);
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
  }, []);
  const stripHtml = (html) => html.replace(/<[^>]+>/g, "");

  const limitWords = (html, wordLimit = 50) => {
    const text = stripHtml(html);
    const words = text.split(" ");
    return words.slice(0, wordLimit).join(" ");
  };
  function ReadMore(row) {
    setServices((pre) =>
      pre.map((item) =>
        item?._id === row?._id ? { ...item, readMore: !item.readMore } : item,
      ),
    );
  }
  return (
    <section
      id="services"
      className="py-16 md:py-20 bg-muted/30 border-y border-border/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="bg-primary/10 text-primary border-primary/20 mb-3"
          >
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Services
          </h2>
          {/*  <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            A complete suite of identity and business checks — one API, one
            dashboard.
          </p> */}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {services?.map((item) => (
            <Card
              key={item?._id}
              className="border-border/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-1">
                  {item?.title}
                </h3>
                <div className="text-sm text-muted-foreground">
                  <p
                    className="mt-1"
                    style={{ textAlign: "justify" }}
                    dangerouslySetInnerHTML={{
                      __html: item?.readMore
                        ? item?.description
                        : limitWords(item?.description, 50) + "...",
                    }}
                  />

                  <div style={{ textAlign: "right" }}>
                    <span
                      onClick={() => ReadMore(item)}
                      style={{
                        cursor: "pointer",
                        color: "#007bff",
                        fontStyle: "italic", // ✅ italic
                        fontWeight: "400", // optional (lighter look)
                      }}
                    >
                      {stripHtml(item?.description).split(" ").length > 50
                        ? item?.readMore
                          ? "Read Less"
                          : "Read More"
                        : ""}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}



