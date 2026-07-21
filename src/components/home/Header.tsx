// // Header.tsx
// import { Link } from "react-router-dom";
// import { useLayoutEffect, useState } from "react";
// import Cookies from "js-cookie";
// import api from "@/lib/axios";

// // import {
// //   ShieldCheck,
// //   Zap,
// //   Lock,
// //   Users,
// //   Award,
// //   TrendingUp,
// //   CheckCircle2,
// //   ArrowRight,
// //   ChevronLeft,
// //   ChevronRight,
// //   Building2,
// //   CreditCard,
// //   FileCheck,
// //   Landmark,
// //   UserCheck,
// //   Fingerprint,
// //   Quote,
// //   Star,
// //   Lightbulb,
// //   Mail,
// //   Phone,
// //   MapPin,
// // } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { UserMenu } from "@/components/UserMenu";
// import Logo from "../../assets/img/Logo.webp";

// export default function Header() {
//   const [active, setActive] = useState("home");
//   const [token, setToken] = useState<string | null>(null);

//   useLayoutEffect(() => {
//     setToken(localStorage.getItem("token") || Cookies.get("token"));
//   }, []);

//   return (
//     <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//         {/*  <Link to="/" className="flex items-center gap-2">
//           <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
//             G
//           </div>
//           <div className="leading-tight">
//             <div className="font-bold text-foreground">GEISIL</div>
//             <div className="text-[10px] text-muted-foreground">
//               Employability · Reimagined
//             </div>
//           </div>
//         </Link> */}
//         {/*  <Link to="/" className="flex items-center gap-2">
//           <img
//             src={Logo}
//             alt="GEISIL Logo"
//             className="h-10 w-10 rounded-lg object-contain"
//           />

//           <div className="leading-tight">
//             <div className="font-bold text-foreground">GEISIL</div>
//             <div className="text-[10px] text-muted-foreground">
//               Employability · Reimagined
//             </div>
//           </div>
//         </Link> */}
//         <Link to="/" className="flex items-center">
//           <img
//             src={Logo}
//             alt="GEISIL Logo"
//             className="h-12 w-auto object-contain"
//           />
//         </Link>
//         <nav className="hidden md:flex items-center gap-7 text-sm">
//           <a
//             href="#home"
//             onClick={() => setActive("home")}
//             className={
//               active === "home"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Home
//           </a>
//           <a
//             href="#about"
//             onClick={() => setActive("about")}
//             className={
//               active === "about"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             About
//           </a>
//           <a
//             href="#services"
//             onClick={() => setActive("services")}
//             className={
//               active === "services"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Services
//           </a>
//           <a
//             href="#verification"
//             onClick={() => setActive("verification")}
//             className={
//               active === "verification"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Verification
//           </a>
//           <a
//             href="#clients"
//             onClick={() => setActive("clients")}
//             className={
//               active === "clients"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Clients
//           </a>
//           <a
//             href="#testimonials"
//             onClick={() => setActive("testimonials")}
//             className={
//               active === "testimonials"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Testimonials
//           </a>
//           <a
//             href="#contact"
//             onClick={() => setActive("contact")}
//             className={
//               active === "contact"
//                 ? "text-primary font-medium"
//                 : "text-muted-foreground hover:text-primary"
//             }
//           >
//             Contact
//           </a>
//         </nav>
//         <div className="flex items-center gap-2">
//           {token ? (
//             <UserMenu />
//           ) : (
//             <Button asChild size="sm">
//               <Link to="/login">Log in</Link>
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }
// Header.tsx
import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import Logo from "../../assets/img/Logo.webp";

export default function Header() {
  const [active, setActive] = useState("home");
  const [token, setToken] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useLayoutEffect(() => {
    setToken(localStorage.getItem("token") || Cookies.get("token"));
  }, []);

  const navLinks = [
    { name: "Home", href: "#home", id: "home" },
    { name: "About", href: "#about", id: "about" },
    { name: "Services", href: "#services", id: "services" },
    { name: "Verification", href: "#verification", id: "verification" },
    { name: "Clients", href: "#clients", id: "clients" },
    { name: "Testimonials", href: "#testimonials", id: "testimonials" },
    { name: "Contact", href: "#contact", id: "contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-2xl transition-all duration-300">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={Logo}
            alt="GEISIL Logo"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-muted/40 border border-border/50 backdrop-blur-md shadow-sm text-sm">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setActive(link.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTIONS / AUTH & MOBILE TOGGLE */}
        <div className="flex items-center gap-3">
          {token ? (
            <UserMenu />
          ) : (
            <Button
              asChild
              size="lg"
              className="hidden sm:inline-flex h-11 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 text-white font-semibold transition-all border-none"
            >
              <Link to="/login">Log in</Link>
            </Button>
          )}

          {/* MOBILE MENU TRIGGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-muted/50 border border-border/60 text-foreground hover:bg-muted transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-border/60 shadow-2xl py-6 px-6 transition-all animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    setActive(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl font-medium text-base transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-primary/20 to-purple-500/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}

            {!token && (
              <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
                <Button
                  asChild
                  size="lg"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-semibold shadow-md"
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}