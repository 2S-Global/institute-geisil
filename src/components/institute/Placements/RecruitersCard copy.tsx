import { useRef, useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

const cards = [
  {
    id: 1,
    recruiter: "Sarah Johnson",
    company: "Google",
    interviewDate: "22/09/2026",
  },
  {
    id: 2,
    recruiter: "Michael Chen",
    company: "Microsoft",
    interviewDate: "24/09/2026",
  },
  {
    id: 3,
    recruiter: "Emily Davis",
    company: "Amazon",
    interviewDate: "26/09/2026",
  },
  {
    id: 4,
    recruiter: "James Wilson",
    company: "Meta",
    interviewDate: "28/09/2026",
  },
  {
    id: 5,
    recruiter: "Olivia Brown",
    company: "Netflix",
    interviewDate: "30/09/2026",
  },
  {
    id: 6,
    recruiter: "Daniel Miller",
    company: "Apple",
    interviewDate: "02/10/2026",
  },
  {
    id: 7,
    recruiter: "Sophia Taylor",
    company: "Adobe",
    interviewDate: "04/10/2026",
  },
  {
    id: 8,
    recruiter: "Robert Anderson",
    company: "Stripe",
    interviewDate: "06/10/2026",
  },
  {
    id: 9,
    recruiter: "Emma Thomas",
    company: "Shopify",
    interviewDate: "08/10/2026",
  },
  {
    id: 10,
    recruiter: "William Moore",
    company: "Tesla",
    interviewDate: "10/10/2026",
  },
  {
    id: 11,
    recruiter: "Ava Martin",
    company: "Spotify",
    interviewDate: "12/10/2026",
  },
  {
    id: 12,
    recruiter: "Lucas Jackson",
    company: "Uber",
    interviewDate: "14/10/2026",
  },
  {
    id: 13,
    recruiter: "Mia White",
    company: "Airbnb",
    interviewDate: "16/10/2026",
  },
  {
    id: 14,
    recruiter: "Henry Harris",
    company: "Notion",
    interviewDate: "18/10/2026",
  },
  {
    id: 15,
    recruiter: "Isabella Clark",
    company: "Figma",
    interviewDate: "20/10/2026",
  },
  {
    id: 16,
    recruiter: "Benjamin Lewis",
    company: "Vercel",
    interviewDate: "22/10/2026",
  },
  {
    id: 17,
    recruiter: "Charlotte Lee",
    company: "GitHub",
    interviewDate: "24/10/2026",
  },
  {
    id: 18,
    recruiter: "Alexander Walker",
    company: "Atlassian",
    interviewDate: "26/10/2026",
  },
  {
    id: 19,
    recruiter: "Amelia Hall",
    company: "Slack",
    interviewDate: "28/10/2026",
  },
  {
    id: 20,
    recruiter: "Ethan Allen",
    company: "LinkedIn",
    interviewDate: "30/10/2026",
  },
];

function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ card, selected, onSelect }) {
  const initials = card.recruiter
    .split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <button
      type="button"
      onClick={() => onSelect(card)}
      aria-pressed={selected}
      className={`
        group
        relative
        w-full
        overflow-visible
        rounded-2xl
        border
        bg-white
        p-5
        text-left

        shadow-[0_4px_20px_rgba(15,23,42,0.04)]

        transition-all
        duration-300
        ease-out

        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-violet-500
        focus-visible:ring-offset-2

        ${
          selected
            ? `
              border-violet-500
              bg-violet-50/40
              shadow-[0_10px_35px_rgba(124,58,237,0.15)]
              ring-1
              ring-violet-500
            `
            : `
              border-slate-200
              hover:-translate-y-1
              hover:shadow-[0_15px_40px_rgba(15,23,42,0.10)]
            `
        }
      `}
    >
      {/* Selected Check */}
      <div
        className={`
          absolute
          right-4
          top-4
          z-10

          flex
          h-6
          w-6
          items-center
          justify-center

          rounded-full
          bg-violet-600
          text-white
          shadow-sm

          transition-all
          duration-300

          ${selected ? "scale-100 opacity-100" : "scale-75 opacity-0"}
        `}
      >
        <CheckIcon />
      </div>

      {/* Recruiter */}
      <div className="flex w-full min-w-0 items-center gap-3 pr-8">
        {/* Avatar */}
        <div
          className={`
            flex
            h-11
            w-11
            min-w-11
            shrink-0
            items-center
            justify-center

            rounded-full

            text-sm
            font-bold
            text-white

            shadow-sm

            transition-transform
            duration-300

            ${
              selected
                ? "bg-gradient-to-br from-violet-600 to-indigo-600"
                : "bg-gradient-to-br from-violet-500 to-blue-500 group-hover:scale-105"
            }
          `}
        >
          {initials}
        </div>

        {/* Name + Company */}
        <div className="min-w-0 flex-1">
          {/* Recruiter Name */}
          <div className="group/name relative w-full">
            <p
              className="
                block
                w-full
                truncate
                text-sm
                font-semibold
                leading-5
                text-slate-900
              "
            >
              {card.recruiter}
            </p>

            {/* Full Name Tooltip */}
            <div
              className="
                pointer-events-none
                absolute
                bottom-full
                left-0
                z-[100]
                mb-2

                whitespace-nowrap

                rounded-lg
                bg-slate-900
                px-3
                py-2

                text-xs
                font-medium
                leading-4
                text-white

                opacity-0
                translate-y-1
                scale-95

                shadow-xl

                transition-all
                duration-200

                group-hover/name:translate-y-0
                group-hover/name:scale-100
                group-hover/name:opacity-100
              "
            >
              {card.recruiter}

              {/* Tooltip Arrow */}
              <span
                className="
                  absolute
                  left-4
                  top-full
                  h-2
                  w-2
                  -translate-y-1/2
                  rotate-45
                  bg-slate-900
                "
              />
            </div>
          </div>

          {/* Company */}
          <p
            className="
              mt-0.5
              block
              w-full
              truncate
              text-xs
              leading-4
              text-slate-500
            "
          >
            {card.company}
          </p>
        </div>
      </div>

      {/* Interview Date */}
      <div className="mt-6 border-t border-slate-100 pt-4">
        <p
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-slate-400
          "
        >
          Interview Date
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className={selected ? "text-violet-600" : "text-slate-400"}>
            <CalendarIcon />
          </span>

          <span
            className="
              text-base
              font-bold
              tracking-tight
              text-slate-900
            "
          >
            {card.interviewDate}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function CardGrid() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const sectionRef = useRef(null);

  const handleOpenChange = (value) => {
    setOpen(value);

    if (value) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  };

  const handleSelect = (card) => {
    setSelectedCard(card);
  };

  return (
    <section
      ref={sectionRef}
      className="
        bg-gradient-to-b
        from-slate-50
        via-white
        to-slate-50
        py-12
      "
    >
      <Collapsible.Root
        open={open}
        onOpenChange={handleOpenChange}
        className="mx-auto max-w-7xl px-5"
      >
        {/* Header */}
        <div
          className="
            mb-8
            flex
            items-end
            justify-between
            gap-5
          "
        >
          <div>
            <span
              className="
                text-[11px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-violet-600
              "
            >
              Opportunities
            </span>
          </div>

          {/* Show All */}
          <Collapsible.Trigger asChild>
            <button
              type="button"
              className="
                group
                flex
                shrink-0
                items-center
                gap-2

                rounded-full
                border
                border-slate-200
                bg-white

                px-5
                py-2.5

                text-sm
                font-semibold
                text-slate-700

                shadow-sm

                transition-all
                duration-300

                hover:border-violet-200
                hover:bg-violet-50
                hover:text-violet-600
                hover:shadow-md

                active:scale-95
              "
            >
              <span className="group-data-[state=open]:hidden">Show All</span>

              <span className="hidden group-data-[state=open]:inline">
                Show Less
              </span>

              <svg
                className="
                  h-4 w-4
                  transition-transform
                  duration-300
                  group-data-[state=open]:rotate-180
                "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Collapsible.Trigger>
        </div>

        {/* First 10 Cards */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
            xl:grid-cols-5
          "
        >
          {cards.slice(0, 10).map((card) => (
            <Card
              key={card.id}
              card={card}
              selected={selectedCard?.id === card.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Remaining Cards */}
        <Collapsible.Content
          className="
            overflow-visible
            data-[state=open]:animate-expand
            data-[state=closed]:animate-collapse
          "
        >
          <div
            className="
              mt-5
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
              xl:grid-cols-5
            "
          >
            {cards.slice(10).map((card, index) => (
              <div
                key={card.id}
                className="animate-card-in"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <Card
                  card={card}
                  selected={selectedCard?.id === card.id}
                  onSelect={handleSelect}
                />
              </div>
            ))}
          </div>
        </Collapsible.Content>

        {/* Selected Interview */}
        {selectedCard && (
          <div
            className="
              mt-6
              flex
              items-center
              justify-between
              gap-4

              rounded-xl
              border
              border-violet-200
              bg-violet-50

              px-5
              py-4

              animate-card-in
            "
          >
            <div className="min-w-0">
              <p className="text-xs font-medium text-violet-500">
                Selected Interview
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-violet-900">
                {selectedCard.recruiter}

                <span className="mx-2 text-violet-300">•</span>

                {selectedCard.company}
              </p>
            </div>

            <div className="shrink-0 text-sm font-bold text-violet-700">
              {selectedCard.interviewDate}
            </div>
          </div>
        )}
      </Collapsible.Root>
    </section>
  );
}
