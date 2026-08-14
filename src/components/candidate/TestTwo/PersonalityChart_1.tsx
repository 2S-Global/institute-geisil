import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
} from "recharts";

const chartData = [
  {
    name: "Achiever (A)",
    score: 20,
    color: "#6258df",
  },
  {
    name: "Professional (B)",
    score: 36,
    color: "#7d8da0",
  },
  {
    name: "Specialist (C)",
    score: 40,
    color: "#2ea49e",
  },
  {
    name: "Supporter (D)",
    score: 4,
    color: "#e38b2e",
  },
];

const behaviors = ["Empathetic", "Harmonious", "Relational", "Supportive"];

export default function PersonalityChart() {
  const [activeTab, setActiveTab] = useState("archetype");

  return (
    <div className="min-h-screen bg-[#fafafa] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto min-h-screen max-w-[1240px] border-x border-gray-200 bg-white px-4 py-5 sm:px-6 lg:px-14">
        {/* =====================================================
            HEADER
        ====================================================== */}
        {/*   <header className="flex min-h-[60px] items-center justify-center text-center">
          <p className="text-sm text-[#748295] sm:text-base lg:text-[18px]">
            Automated evaluation based on dimensional scoring formulas.
          </p>
        </header> */}

        {/* =====================================================
            SCORE CARDS
        ====================================================== */}
        <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:mb-11 lg:gap-4">
          {/* Achiever */}
          <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl border border-[#6258df]/20 bg-[#f7f6ff] transition hover:shadow-sm sm:h-[105px]">
            <span className="text-xs font-bold tracking-wide text-[#5148bd] sm:text-sm lg:text-base">
              ACHIEVER (A)
            </span>

            <span className="mt-1 text-3xl font-extrabold text-[#283258] sm:text-[34px]">
              20%
            </span>
          </div>

          {/* Professional */}
          <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl border border-[#7d8da0]/20 bg-[#f8fafb] transition hover:shadow-sm sm:h-[105px]">
            <span className="text-xs font-bold tracking-wide text-[#6e7c8d] sm:text-sm lg:text-base">
              PROFESSIONAL (B)
            </span>

            <span className="mt-1 text-3xl font-extrabold text-[#273244] sm:text-[34px]">
              36%
            </span>
          </div>

          {/* Specialist */}
          <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl border border-[#2ea49e]/20 bg-[#f4fffd] transition hover:shadow-sm sm:h-[105px]">
            <span className="text-xs font-bold tracking-wide text-[#258b87] sm:text-sm lg:text-base">
              SPECIALIST (C)
            </span>

            <span className="mt-1 text-3xl font-extrabold text-[#205f5d] sm:text-[34px]">
              40%
            </span>
          </div>

          {/* Supporter */}
          <div className="flex h-[92px] flex-col items-center justify-center rounded-2xl border border-[#e38b2e]/20 bg-[#fffaf0] transition hover:shadow-sm sm:h-[105px]">
            <span className="text-xs font-bold tracking-wide text-[#c07b27] sm:text-sm lg:text-base">
              SUPPORTER (D)
            </span>

            <span className="mt-1 text-3xl font-extrabold text-[#7b3710] sm:text-[34px]">
              4%
            </span>
          </div>
        </section>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}
        <section className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {/* =================================================
              CHART
          ================================================== */}
          <div className="rounded-2xl border border-[#dedfdf] bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] sm:p-6 lg:h-[545px] lg:p-7">
            <h2 className="mb-5 text-center text-sm font-bold tracking-[1px] text-[#8290a2] sm:text-base lg:mb-7 lg:text-[18px]">
              DIMENSIONAL SPECTRUM CHART
            </h2>

            <div className="h-[360px] w-full sm:h-[400px] lg:h-[430px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -10,
                    bottom: 55,
                  }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    stroke="#d7d9da"
                    strokeWidth={1}
                    vertical
                    horizontal
                  />

                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    tickFormatter={(value) => `${value}%`}
                    axisLine={{
                      stroke: "#cfd2d4",
                    }}
                    tickLine={false}
                    width={48}
                    tick={{
                      fill: "#5e6065",
                      fontSize: 13,
                    }}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={{
                      stroke: "#cfd2d4",
                    }}
                    tickLine={false}
                    interval={0}
                    angle={-13}
                    textAnchor="end"
                    height={65}
                    tick={{
                      fill: "#55585c",
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(0,0,0,0.025)",
                    }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [`${value}%`, "Score"]}
                  />

                  <Bar dataKey="score" radius={[12, 12, 0, 0]} maxBarSize={78}>
                    {chartData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* =================================================
              ARCHETYPE CARD
          ================================================== */}
          <div className="relative overflow-visible rounded-2xl bg-gradient-to-br from-[#4d43dc] to-[#5147e6] p-6 text-white shadow-[0_5px_12px_rgba(65,55,190,0.15)] sm:p-8 lg:h-[545px]">
            {/* ---------------------------------------------
                CLICKABLE TABS
            ---------------------------------------------- */}
            <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-4">
              {/* Primary Archetype */}
              <button
                type="button"
                onClick={() => setActiveTab("archetype")}
                className={`
                  rounded-full px-4 py-1.5
                  text-xs font-bold tracking-[1px]
                  transition-all duration-200
                  sm:text-sm
                  ${
                    activeTab === "archetype"
                      ? "bg-white/15 text-white shadow-sm"
                      : "bg-transparent text-[#dedfff] hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                PRIMARY ARCHETYPE
              </button>

              {/* Hybrid Adaptive Profile */}
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`
                  rounded-full px-3 py-1.5
                  text-sm transition-all duration-200
                  sm:text-base
                  ${
                    activeTab === "profile"
                      ? "bg-white/15 text-white shadow-sm"
                      : "bg-transparent text-[#dedfff] hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                Hybrid Adaptive Profile
              </button>
            </div>

            {/* =================================================
                TAB CONTENT
            ================================================== */}

            {activeTab === "archetype" ? (
              <div>
                {/* Title */}
                <h1 className="mb-4 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[32px] lg:text-[35px]">
                  The Collaborative Specialist
                </h1>

                {/* Description */}
                <p className="max-w-xl text-[16px] leading-7 text-[#eeeeff] sm:text-[18px] sm:leading-8 lg:text-[20px]">
                  Empathetic, team-focused, and supportive. You act as
                  organizational glue to keep team morale high, but may need to
                  practice asserting your boundaries in direct conflict.
                </p>

                {/* =================================================
                    BEHAVIOR BOX
                    Heading overlaps border
                ================================================== */}
                <div className="relative mt-9 rounded-2xl border border-white/20 bg-white/[0.07] px-5 pb-5 pt-7 sm:px-6">
                  {/* Overlapping Label */}
                  <div className="absolute -top-[11px] left-5 bg-[#5147e6] px-2 sm:left-6">
                    <h3 className="whitespace-nowrap text-xs font-bold tracking-[1px] text-[#d0d1ff] sm:text-sm lg:text-base">
                      KEY BEHAVIORAL CHARACTERISTICS
                    </h3>
                  </div>

                  {/* List */}
                  <ul className="space-y-2 pl-6 text-[16px] text-[#f4f4ff] sm:text-[18px]">
                    {behaviors.map((behavior) => (
                      <li key={behavior} className="list-disc">
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                {/* Profile Tab */}
                <h1 className="mb-4 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[32px] lg:text-[35px]">
                  Hybrid Adaptive Profile
                </h1>

                <p className="max-w-xl text-[16px] leading-7 text-[#eeeeff] sm:text-[18px] sm:leading-8 lg:text-[20px]">
                  Your profile demonstrates adaptability across different
                  working environments. You can shift between specialist,
                  professional, and collaborative behaviors depending on the
                  situation.
                </p>

                {/* Profile Details */}
                <div className="relative mt-9 rounded-2xl border border-white/20 bg-white/[0.07] px-5 pb-5 pt-7 sm:px-6">
                  {/* Overlapping Label */}
                  <div className="absolute -top-[11px] left-5 bg-[#5147e6] px-2 sm:left-6">
                    <h3 className="whitespace-nowrap text-xs font-bold tracking-[1px] text-[#d0d1ff] sm:text-sm lg:text-base">
                      PROFILE CHARACTERISTICS
                    </h3>
                  </div>

                  <ul className="space-y-3 pl-6 text-[16px] text-[#f4f4ff] sm:text-[18px]">
                    <li className="list-disc">Highly adaptable</li>

                    <li className="list-disc">Comfortable with change</li>

                    <li className="list-disc">
                      Balances expertise and collaboration
                    </li>

                    <li className="list-disc">Strong team awareness</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            DIAGNOSTICS
        ====================================================== */}
        <section className="mt-6 rounded-2xl border border-[#dedfdf] bg-white p-5 sm:mt-8 sm:p-7">
          <h2 className="mb-5 text-sm font-bold tracking-[1px] text-[#63758c] sm:text-base">
            AUTOMATED MATHEMATICAL FORMULA DIAGNOSTICS
          </h2>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {/* Diagnostic 1 */}
            <div>
              <h3 className="text-[15px] font-bold text-[#27313e] sm:text-base">
                Dominance Margin (DR):
              </h3>

              <p className="mt-1 text-[16px] font-semibold text-[#1e2835] sm:text-lg">
                1 Questions (4% Margin)
              </p>

              <p className="mt-1 text-sm text-[#9ca5af]">
                Difference between #1 and #2 categories.
              </p>
            </div>

            {/* Diagnostic 2 */}
            <div>
              <h3 className="text-[15px] font-bold text-[#27313e] sm:text-base">
                Profile Classification:
              </h3>

              <p className="mt-1 text-[16px] font-semibold text-[#1e2835] sm:text-lg">
                Hybrid Adaptive Profile
              </p>

              <p className="mt-1 text-sm text-[#9ca5af]">
                Pure vs Hybrid adaptability status.
              </p>
            </div>

            {/* Diagnostic 3 */}
            <div>
              <h3 className="text-[15px] font-bold text-[#27313e] sm:text-base">
                Secondary Tendency:
              </h3>

              <p className="mt-1 text-[16px] font-semibold text-[#1e2835] sm:text-lg">
                The Cautious Professional (36%)
              </p>

              <p className="mt-1 text-sm text-[#9ca5af]">
                Backup operating style under pressure.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
