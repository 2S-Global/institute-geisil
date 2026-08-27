import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GlassSearchBar() {
  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");

  const [isFocused, setIsFocused] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectOpenRef = useRef(false);

  // Typewriter effect state for placeholder
  const placeholders = [
    "Search 'Full Stack Developer'...",
    "Search 'Remote jobs'...",
    "Search 'UI/UX Designer'...",
    "Search 'Software Engineer'...",
    "Search 'Project Manager'..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Compute if the search bar is currently expanded
  const isExpanded =
    isFocused ||
    selectOpen ||
    Boolean(keyword) ||
    Boolean(experience) ||
    Boolean(location);

  useEffect(() => {
    if (isExpanded) {
      setCurrentPlaceholder("Enter skills / designations / companies");
      return;
    }

    let timer: NodeJS.Timeout;
    const handleType = () => {
      const fullText = placeholders[placeholderIndex];
      if (!isDeleting) {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length + 1));
        setTypingSpeed(80);

        if (currentPlaceholder === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 1500);
          return;
        }
      } else {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length - 1));
        setTypingSpeed(40);

        if (currentPlaceholder === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          setTypingSpeed(250);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPlaceholder, isDeleting, placeholderIndex, isExpanded]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSelectOpenChange = (open: boolean) => {
    selectOpenRef.current = open;
    setSelectOpen(open);

    if (open) {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    /*
      Wait until the browser has finished changing focus.

      This prevents the search bar from collapsing for one frame
      when the Radix Select portal opens.
    */
    requestAnimationFrame(() => {
      const activeElement = document.activeElement;

      if (
        !selectOpenRef.current &&
        containerRef.current &&
        !containerRef.current.contains(activeElement)
      ) {
        setIsFocused(false);
      }
    });
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-rainbow-border {
          animation: spin 4s linear infinite;
        }
      `}</style>
      <motion.div
        ref={containerRef}
        initial={false}
        animate={{
          maxWidth: isExpanded ? 1024 : 360,
        }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={handleBlur}
        className="
        relative
        mx-auto
        w-full
        p-2
      "
      >
        <form
          onSubmit={handleSearch}
          className="
          relative
          z-10
          flex
          w-full
          items-center
          gap-2
        "
        >
          {/* =============================================
            KEYWORD
        ============================================== */}
          <motion.div
            initial={false}
            animate={{
              flexGrow: isExpanded ? 1.5 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <div className={`relative p-[1.5px] rounded-full overflow-hidden transition-all duration-300 ${
              isExpanded ? "bg-slate-200" : "bg-transparent shadow-sm"
            }`}>
              {/* Animated rainbow background element - visible only when idle */}
              {!isExpanded && (
                <div 
                  className="absolute inset-[-150%] animate-rainbow-border origin-center pointer-events-none"
                  style={{
                    background: "conic-gradient(#3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #3b82f6)"
                  }}
                />
              )}

              {/* Input content container */}
              <div className="relative w-full rounded-full bg-white flex items-center">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                  <motion.div
                    animate={isExpanded ? { scale: 1 } : {
                      scale: [1, 1.15, 1],
                    }}
                    transition={isExpanded ? { duration: 0.2 } : {
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                  >
                    <Search className="h-5 w-5 text-slate-500" />
                  </motion.div>
                </div>

                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={currentPlaceholder}
                  className="
                    h-12
                    w-full
                    rounded-full
                    border-0
                    bg-transparent
                    pl-12
                    pr-4
                    text-sm
                    text-slate-900
                    shadow-none
                    placeholder:text-slate-400
                    focus-visible:outline-none
                    focus-visible:!ring-0
                    focus-visible:!ring-offset-0
                    sm:text-base
                  "
                />
              </div>
            </div>
          </motion.div>

          {/* =============================================
            EXPANDED AREA

            IMPORTANT:
            It always stays mounted.

            Only width / opacity change.
            This removes the layout popping.
        ============================================== */}
          <motion.div
            initial={false}
            animate={{
              width: isExpanded ? "auto" : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{
              width: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: isExpanded ? 0.3 : 0.15,
                delay: isExpanded ? 0.1 : 0,
              },
            }}
            style={{
              pointerEvents: isExpanded ? "auto" : "none",
            }}
            className="
            flex
            shrink-0
            items-center
            gap-2
            overflow-hidden
            whitespace-nowrap
          "
          >
            {/* EXPERIENCE */}
            <div className="w-[180px] shrink-0">
              <Select
                value={experience}
                onValueChange={setExperience}
                onOpenChange={handleSelectOpenChange}
              >
                <SelectTrigger
                  className="
                  h-12
                  w-full
                  rounded-full
                  border
                  border-slate-200
                  bg-white
                  px-4
                  text-sm
                  text-slate-700
                  shadow-sm

                  focus:border-slate-300
                  focus:outline-none
                  focus:!ring-0
                  focus:!ring-offset-0

                  focus-visible:!ring-0
                  focus-visible:!ring-offset-0
                  focus-visible:!outline-none

                  sm:text-base
                "
                >
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>

                <SelectContent>
                  {[
                    "Fresher",
                    "1-3 years",
                    "3-6 years",
                    "6-10 years",
                    "10+ years",
                  ].map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LOCATION */}
            <div className="relative w-[220px] shrink-0">
              <MapPin
                className="
                pointer-events-none
                absolute
                left-4
                top-1/2
                z-10
                h-5
                w-5
                -translate-y-1/2
                text-slate-500
              "
              />

              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location"
                className="
                h-12
                w-full
                rounded-full
                border
                border-slate-200
                bg-white
                pl-12
                pr-4
                text-sm
                text-slate-900
                shadow-sm

                placeholder:text-slate-400

                focus-visible:border-slate-300
                focus-visible:outline-none
                focus-visible:!ring-0
                focus-visible:!ring-offset-0

                sm:text-base
              "
              />
            </div>

            {/* SEARCH */}
            <Button
              asChild
              className="
              h-12
              shrink-0
              rounded-full
              border
              border-[#113068]
              bg-[#113068]
              px-8
              text-base
              font-semibold
              text-white
              shadow-lg

              transition-[background-color,border-color,box-shadow,transform]
              duration-300

              hover:border-[#1a4385]
              hover:bg-[#1a4385]
              hover:shadow-[0_8px_25px_rgba(17,48,104,0.35)]

              active:scale-[0.98]
            "
            >
              <Link
                to={{
                  pathname: "/job-search",
                  search: new URLSearchParams({
                    ...(keyword ? { keyword } : {}),
                    ...(experience ? { experience } : {}),
                    ...(location ? { location } : {}),
                  }).toString(),
                }}
              >
                Search
              </Link>
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </>
  );
}