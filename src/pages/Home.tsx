import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PartnersSection from "@/components/home/PartnersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import VerificationSection from "@/components/home/VerificationSection";
import Footer from "@/components/home/Footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <StatsSection />
      <VerificationSection />
      <PartnersSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
