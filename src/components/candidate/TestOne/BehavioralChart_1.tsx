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

const behaviors = ["Empathetic", "Harmonious", "Relational", "Supportive"];

export default function BehavioralChart({ data }) {
  const [activeTab, setActiveTab] = useState<"archetype" | "profile">(
    "archetype",
  );

  const chartData = [
    {
      name: "Dominance (D)",
      shortName: "Dominance",
      score: data?.scoresPercentage?.D,
      color: "#6258df",
      titleColor: "#5148bd",
      scoreColor: "#283258",
      borderColor: "#6258df",
      backgroundColor: "#f7f6ff",
    },
    {
      name: "Influence (I)",
      shortName: "Influence",
      score: data?.scoresPercentage?.I,
      color: "#7d8da0",
      titleColor: "#6e7c8d",
      scoreColor: "#273244",
      borderColor: "#7d8da0",
      backgroundColor: "#f8fafb",
    },
    {
      name: "Steadiness (S)",
      shortName: "Steadiness",
      score: data?.scoresPercentage?.S,
      color: "#2ea49e",
      titleColor: "#258b87",
      scoreColor: "#205f5d",
      borderColor: "#2ea49e",
      backgroundColor: "#f4fffd",
    },
    {
      name: "Conscientiousness (C)",
      shortName: "Conscientiousness",
      score: data?.scoresPercentage?.C,
      color: "#e38b2e",
      titleColor: "#c07b27",
      scoreColor: "#7b3710",
      borderColor: "#e38b2e",
      backgroundColor: "#fffaf0",
    },
  ];
  console.log("qqqqqqqqqqqqqqq www", data);
  return (
    <div className="w-full min-w-0">
      {/* SCORE CARDS */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {chartData.map((item) => (
          <ScoreCard
            key={item?.name}
            title={item?.name}
            score={item?.score}
            titleColor={item?.titleColor}
            scoreColor={item?.scoreColor}
            borderColor={item?.borderColor}
            backgroundColor={item?.backgroundColor}
          />
        ))}
      </section>

      {/* CHART + ARCHETYPE */}
      <section className="grid min-w-0 gap-5 lg:grid-cols-2">
        {/* CHART */}
        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dedfdf] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-5 text-center text-sm font-bold tracking-[1px] text-[#8290a2] sm:text-base">
            DIMENSIONAL SPECTRUM CHART
          </h2>

          <div className="h-[300px] w-full min-w-0 sm:h-[350px] lg:h-[380px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 5,
                  left: 0,
                  bottom: 35,
                }}
                barCategoryGap="20%"
              >
                <CartesianGrid
                  stroke="#d7d9da"
                  strokeWidth={1}
                  vertical
                  horizontal
                />

                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tickFormatter={(value) => `${value}%`}
                  axisLine={{
                    stroke: "#cfd2d4",
                  }}
                  tickLine={false}
                  width={42}
                  tick={{
                    fill: "#5e6065",
                    fontSize: 11,
                  }}
                />

                <XAxis
                  dataKey="shortName"
                  axisLine={{
                    stroke: "#cfd2d4",
                  }}
                  tickLine={false}
                  interval={0}
                  height={45}
                  tick={{
                    fill: "#55585c",
                    fontSize: 10,
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

                <Bar dataKey="score" radius={[10, 10, 0, 0]} maxBarSize={70}>
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ARCHETYPE CARD */}
        <div className="min-w-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#4d43dc] to-[#5147e6] p-5 text-white shadow-lg sm:p-7">
          {/* TABS */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("archetype")}
              className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-wide transition sm:px-4 sm:text-sm ${
                activeTab === "archetype"
                  ? "bg-white/15 text-white"
                  : "text-[#dedfff] hover:bg-white/10"
              }`}
            >
              PRIMARY ARCHETYPE
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`rounded-full px-3 py-1.5 text-xs transition sm:text-sm ${
                activeTab === "profile"
                  ? "bg-white/15 text-white"
                  : "text-[#dedfff] hover:bg-white/10"
              }`}
            >
              Hybrid Adaptive Profile
            </button>
          </div>

          {activeTab === "archetype" ? (
            <>
              <h1 className="mb-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                The Collaborative Specialist
              </h1>

              <p className="text-sm leading-6 text-[#eeeeff] sm:text-base sm:leading-7">
                Empathetic, team-focused, and supportive. You act as
                organizational glue to keep team morale high, but may need to
                practice asserting your boundaries in direct conflict.
              </p>

              <div className="relative mt-8 rounded-2xl border border-white/20 bg-white/[0.07] px-4 pb-5 pt-7 sm:px-5">
                <div className="absolute -top-[10px] left-4 bg-[#5147e6] px-2">
                  <h3 className="text-[10px] font-bold tracking-wide text-[#d0d1ff] sm:text-xs">
                    KEY BEHAVIORAL CHARACTERISTICS
                  </h3>
                </div>

                <ul className="space-y-2 pl-5 text-sm text-[#f4f4ff] sm:text-base">
                  {behaviors.map((behavior) => (
                    <li key={behavior} className="list-disc">
                      {behavior}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <h1 className="mb-4 text-2xl font-extrabold leading-tight sm:text-3xl">
                Hybrid Adaptive Profile
              </h1>

              <p className="text-sm leading-6 text-[#eeeeff] sm:text-base sm:leading-7">
                Your profile demonstrates adaptability across different working
                environments. You can shift between specialist, professional,
                and collaborative behaviors depending on the situation.
              </p>

              <div className="relative mt-8 rounded-2xl border border-white/20 bg-white/[0.07] px-4 pb-5 pt-7 sm:px-5">
                <div className="absolute -top-[10px] left-4 bg-[#5147e6] px-2">
                  <h3 className="text-[10px] font-bold tracking-wide text-[#d0d1ff] sm:text-xs">
                    PROFILE CHARACTERISTICS
                  </h3>
                </div>

                <ul className="space-y-2 pl-5 text-sm text-[#f4f4ff] sm:text-base">
                  <li className="list-disc">Highly adaptable</li>
                  <li className="list-disc">Comfortable with change</li>
                  <li className="list-disc">
                    Balances expertise and collaboration
                  </li>
                  <li className="list-disc">Strong team awareness</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </section>

      {/* DIAGNOSTICS */}
      {/*  <section className="mt-5 rounded-2xl border border-[#dedfdf] bg-white p-5 sm:p-6">
        <h2 className="mb-5 text-sm font-bold tracking-wide text-[#63758c]">
          AUTOMATED MATHEMATICAL FORMULA DIAGNOSTICS
        </h2>

        <div className="grid gap-5 md:grid-cols-3 md:gap-7">
          <Diagnostic
            title="Dominance Margin (DR):"
            value="1 Questions (4% Margin)"
            description="Difference between #1 and #2 categories."
          />

          <Diagnostic
            title="Profile Classification:"
            value="Hybrid Adaptive Profile"
            description="Pure vs Hybrid adaptability status."
          />

          <Diagnostic
            title="Secondary Tendency:"
            value="The Cautious Professional (36%)"
            description="Backup operating style under pressure."
          />
        </div>
      </section> */}
    </div>
  );
}

function ScoreCard({
  title,
  score,
  titleColor,
  scoreColor,
  borderColor,
  backgroundColor,
}: {
  title: string;
  score: string;
  titleColor: string;
  scoreColor: string;
  borderColor: string;
  backgroundColor: string;
}) {
  return (
    <div
      className="flex h-[90px] min-w-0 flex-col items-center justify-center rounded-2xl border sm:h-[100px]"
      style={{
        borderColor: `${borderColor}33`,
        backgroundColor,
      }}
    >
      <span
        className="max-w-full truncate px-2 text-center text-[10px] font-bold tracking-wide sm:text-xs md:text-sm"
        style={{ color: titleColor }}
      >
        {title}
      </span>

      <span
        className="mt-1 text-2xl font-extrabold sm:text-3xl"
        style={{ color: scoreColor }}
      >
        {score}
        {score ? "%" : ""}
      </span>
    </div>
  );
}

/* function Diagnostic({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-bold text-[#27313e] sm:text-base">{title}</h3>

      <p className="mt-1 break-words text-sm font-semibold text-[#1e2835] sm:text-base">
        {value}
      </p>

      <p className="mt-1 text-xs leading-5 text-[#9ca5af] sm:text-sm">
        {description}
      </p>
    </div>
  );
} */
