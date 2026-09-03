import { useRef, useState, useEffect } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import StudentList from "./StudentList";
import API from "../../../lib/axios";
import { formatUTCDate } from "../../../utils/utils";

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
  const initials = card?.companyName?.[0];

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
              {card?.companyName}
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
              {card?.companyName}

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
          {/*  <p
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
          </p> */}
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
            {formatUTCDate(card?.latestRequirement?.date)}
          </span>
        </div>
      </div>
    </button>
  );
}

export default function RecruitersCard() {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
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

  const fetchRecruiterList = async () => {
    try {
      const res = await API.get(
        "/api/instituteprofile/get_all_companies_by_institute_placement",
      );
      const data = res?.data?.data || [];
      setRecruiters(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchRecruiterList();
  }, [recruiters.length]);

  return (
    <>
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
            {recruiters.slice(0, 10).map((card) => (
              <Card
                key={card._id}
                card={card}
                selected={selectedCard?._id === card._id}
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
              {recruiters.slice(10).map((card, index) => (
                <div
                  key={card._id}
                  className="animate-card-in"
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <Card
                    card={card}
                    selected={selectedCard?._id === card._id}
                    onSelect={handleSelect}
                  />
                </div>
              ))}
            </div>
          </Collapsible.Content>

          {/* Selected Interview */}
          {/* {selectedCard && (
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
          )} */}
        </Collapsible.Root>
      </section>
      <StudentList />
    </>
  );
}
