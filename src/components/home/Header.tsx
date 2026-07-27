
import { Link } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "@/lib/axios";

// import {
//   ShieldCheck,
//   Zap,
//   Lock,
//   Users,
//   Award,
//   TrendingUp,
//   CheckCircle2,
//   ArrowRight,
//   ChevronLeft,
//   ChevronRight,
//   Building2,
//   CreditCard,
//   FileCheck,
//   Landmark,
//   UserCheck,
//   Fingerprint,
//   Quote,
//   Star,
//   Lightbulb,
//   Mail,
//   Phone,
//   MapPin,
// } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/UserMenu";
import Logo from "../../assets/img/Logo.webp";

export default function Header() {
  const [active, setActive] = useState("home");
  const [token, setToken] = useState<string | null>(null);

  useLayoutEffect(() => {
    setToken(localStorage.getItem("token") || Cookies.get("token"));
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-card/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/*  <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
            G
          </div>
          <div className="leading-tight">
            <div className="font-bold text-foreground">GEISIL</div>
            <div className="text-[10px] text-muted-foreground">
              Employability · Reimagined
            </div>
          </div>
        </Link> */}
        {/*  <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="GEISIL Logo"
            className="h-10 w-10 rounded-lg object-contain"
          />

          <div className="leading-tight">
            <div className="font-bold text-foreground">GEISIL</div>
            <div className="text-[10px] text-muted-foreground">
              Employability · Reimagined
            </div>
          </div>
        </Link> */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="GEISIL Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a
            href="#home"
            onClick={() => setActive("home")}
            className={
              active === "home"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setActive("about")}
            className={
              active === "about"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setActive("services")}
            className={
              active === "services"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Services
          </a>
          <a
            href="#verification"
            onClick={() => setActive("verification")}
            className={
              active === "verification"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Verification
          </a>
          <a
            href="#clients"
            onClick={() => setActive("clients")}
            className={
              active === "clients"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Clients
          </a>
          <a
            href="#testimonials"
            onClick={() => setActive("testimonials")}
            className={
              active === "testimonials"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={() => setActive("contact")}
            className={
              active === "contact"
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-primary"
            }
          >
            Contact
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {token ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm">
              <Link to="/login">Log in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

// import { Link } from "react-router-dom";
// import { useLayoutEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { Menu, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { UserMenu } from "@/components/UserMenu";
// import Logo from "../../assets/img/Logo.webp";

// export default function Header() {
//   const [active, setActive] = useState("home");
//   const [token, setToken] = useState<string | null>(null);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useLayoutEffect(() => {
//     setToken(localStorage.getItem("token") || Cookies.get("token"));
//   }, []);

//   const navLinks = [
//     { name: "Home", href: "#home", id: "home" },
//     { name: "About", href: "#about", id: "about" },
//     { name: "Services", href: "#services", id: "services" },
//     { name: "Verification", href: "#verification", id: "verification" },
//     { name: "Clients", href: "#clients", id: "clients" },
//     { name: "Testimonials", href: "#testimonials", id: "testimonials" },
//     { name: "Contact", href: "#contact", id: "contact" },
//   ];

//   return (
//     <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md transition-all duration-300">
//       <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
//         {/* LOGO */}
//         <Link to="/" className="flex items-center gap-2 group">
//           <img
//             src={Logo}
//             alt="GEISIL Logo"
//             className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
//           />
//         </Link>

//         {/* DESKTOP NAVIGATION */}
//         <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-muted/40 border border-border/50 backdrop-blur-sm text-sm">
//           {navLinks.map((link) => {
//             const isActive = active === link.id;
//             return (
//               <a
//                 key={link.id}
//                 href={link.href}
//                 onClick={() => setActive(link.id)}
//                 className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
//                   isActive
//                     ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25"
//                     : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
//                 }`}
//               >
//                 {link.name}
//               </a>
//             );
//           })}
//         </nav>

//         {/* RIGHT ACTIONS / AUTH & MOBILE TOGGLE */}
//         <div className="flex items-center gap-3">
//           {token ? (
//             <UserMenu />
//           ) : (
//             <Button
//               asChild
//               className="hidden sm:inline-flex bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 h-10 px-5 rounded-md font-medium shadow-md shadow-primary/20 transition-all"
//             >
//               <Link to="/login">Log in</Link>
//             </Button>
//           )}

//           {/* MOBILE MENU TRIGGER BUTTON */}
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="lg:hidden inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 h-9 rounded-md px-3 shadow-sm"
//             aria-label="Toggle menu"
//           >
//             {mobileMenuOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
//           </button>
//         </div>
//       </div>

//       {/* MOBILE DROPDOWN MENU */}
//       {mobileMenuOpen && (
//         <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-xl py-6 px-6 transition-all animate-in slide-in-from-top-2 duration-300">
//           <div className="flex flex-col space-y-3">
//             {navLinks.map((link) => {
//               const isActive = active === link.id;
//               return (
//                 <a
//                   key={link.id}
//                   href={link.href}
//                   onClick={() => {
//                     setActive(link.id);
//                     setMobileMenuOpen(false);
//                   }}
//                   className={`px-4 py-3 rounded-md font-medium text-base transition-all ${
//                     isActive
//                       ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
//                       : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
//                   }`}
//                 >
//                   {link.name}
//                 </a>
//               );
//             })}

//             {!token && (
//               <div className="pt-4 border-t border-border/60 flex flex-col gap-3">
//                 <Button
//                   asChild
//                   className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 h-10 rounded-md font-medium shadow-md shadow-primary/20"
//                 >
//                   <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
//                     Log in
//                   </Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }