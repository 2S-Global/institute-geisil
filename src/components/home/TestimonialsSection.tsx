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
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/testimonials/all-testimonial`);
        if (response?.data?.data?.length > 0) {
          const Data = response?.data?.data?.map((item) => ({
            ...item,
            readMore: false,
          }));
          setTestimonials(Data);
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    })();
  }, []);

  function ReadMore(row) {
    const shortText = row?.description?.slice(0, 50); // show first 100 characters
    return (
      <>
        {row?.readMore ? row?.description + "  " : shortText}
        {row?.description?.length > 50 ? (
          <button
            onClick={() =>
              setTestimonials((pre) =>
                pre.map((item) =>
                  item?._id === row?._id
                    ? { ...item, readMore: !item.readMore }
                    : item,
                ),
              )
            }
            className="group inline-flex items-center text-[#28406F] font-semibold hover:text-[#1f3358] transition-all duration-300"
          >
            {row?.readMore ? " Read Less" : " .. Read More"}
          </button>
        ) : (
          ""
        )}
      </>
    );
  }

  return (
    <section id="testimonials" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Testimonials</h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials?.map((item) => (
            <SwiperSlide key={item?._id} className="h-auto">
              <div className="bg-white rounded-xl border shadow-sm p-6 h-full flex flex-col">
                <Quote className="w-8 h-8 text-gray-300 mb-4" />

                <p className="text-gray-700 leading-8 flex-1">
                  "{ReadMore(item)}"
                </p>

                <div className="border-t mt-6 pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-blue-700">
                      <img
                        loading="lazy"
                        src={item.customer_image}
                        alt={item?.customer_name || "Customer"}
                        className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#28406F]/10"
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold">{item?.customer_name}</h4>
                      <p className="text-sm text-gray-500">
                        {item?.customer_designation}
                      </p>
                    </div>
                  </div>

                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
