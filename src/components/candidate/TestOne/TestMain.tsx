import React, { useState, useEffect } from "react";
import { Plus, Calendar, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface ScoreData {
  score?: number;
  totalQuestions?: number;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  completedAt?: string;
  [key: string]: unknown;
}

const getStatus = (score: number) => {
  if (score >= 90)
    return {
      text: "Outstanding",
      color: "text-emerald-700",
      stroke: "!stroke-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      ring: "ring-emerald-500/20",
    };

  if (score >= 75)
    return {
      text: "Excellent",
      color: "text-green-700",
      stroke: "!stroke-green-500",
      bg: "bg-green-50",
      border: "border-green-200",
      ring: "ring-green-500/20",
    };

  if (score >= 60)
    return {
      text: "Good",
      color: "text-amber-700",
      stroke: "!stroke-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      ring: "ring-amber-500/20",
    };

  if (score >= 40)
    return {
      text: "Average",
      color: "text-orange-700",
      stroke: "!stroke-orange-500",
      bg: "bg-orange-50",
      border: "border-orange-200",
      ring: "ring-orange-500/20",
    };

  return {
    text: "Needs Improvement",
    color: "text-red-700",
    stroke: "!stroke-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
    ring: "ring-red-500/20",
  };
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  try {
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) return null;

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const TestMain = () => {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [percentage, setPercentage] = useState<number>(0);
  const [isScore, setIsScore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchBehavioralAssessmentScore = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-test/attempt-history");

      if (response.data.success && response.data.data?.[0]) {
        const data = response.data.data[0];
        if (data.score !== undefined && data.totalQuestions) {
          const calculatedPercentage =
            Math.round((data.score / data.totalQuestions) * 100) || 0;
          setPercentage(calculatedPercentage);
        }
        setScoreData(data);
        setIsScore(true);
      }
    } catch (e) {
      console.error("Failed to fetch behavioral assessment score:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBehavioralAssessmentScore();
  }, []);

  const status = getStatus(percentage);

  // Checks common API date fields
  const rawDate = scoreData?.createdAt;

  const formattedDate = formatDate(rawDate);

  // SVG Circular Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card>
      <CardContent>
        <div className="pt-2 space-y-5 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h5 className="text-xl font-bold tracking-tight text-slate-900">
                Behavioral Assessment
              </h5>
              <p className="text-sm text-slate-500 mt-0.5">
                Behavioral Assessments help identify strengths, improve
                teamwork, and support better decisions.
              </p>
            </div>
            {!isScore && !loading && (
              <Button
                size="sm"
                className="self-start sm:self-center shadow-sm"
                onClick={() => navigate("/candidate/behavioral-assessment")}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Start Assessment
              </Button>
            )}
          </div>

          {/* Main Content Area */}
          {loading ? (
            /* Loading Skeleton */
            <div className="w-full h-36 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60" />
          ) : isScore ? (
            /* Assessment Card */
            <div
              className={`relative overflow-hidden rounded-2xl border ${status.border} ${status.bg}/40 p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left: Circular Progress Ring */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg
                    className="w-32 h-32 transform -rotate-90 drop-shadow-xs"
                    viewBox="0 0 100 100"
                  >
                    {/* Track Circle */}
                    <circle
                      className="text-slate-200/80 stroke-current"
                      strokeWidth="7"
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                    />
                    {/* Animated Progress Circle */}
                    <circle
                      className={`${status.stroke} stroke-current transition-all duration-1000 ease-out`}
                      strokeWidth="7"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                    />
                  </svg>

                  {/* Centered Inner Score Text */}
                  <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {percentage}%
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest -mt-0.5">
                      Score
                    </span>
                  </div>
                </div>

                {/* Middle: Assessment Status, Score & Date */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {/* Performance Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} border ${status.border} ring-1 ${status.ring}`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {status.text}
                    </span>

                    {/* Completion Date Badge */}
                    {formattedDate && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 shadow-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Completed: {formattedDate}
                      </span>
                    )}
                  </div>

                  <div>
                    <h6 className="text-base font-semibold text-slate-800">
                      Assessment Completed
                    </h6>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Overall Score:{" "}
                      {/*  <span className={`font-bold ${status.color}`}>
                        {scoreData?.score ?? percentage} /{" "}
                        {scoreData?.totalQuestions ?? 100}
                      </span>{" "} */}
                      ({percentage}%)
                    </p>
                  </div>

                  <p className="text-xs text-slate-500 max-w-md">
                    Your performance metric is evaluated based on your latest
                    behavioral assessment responses.
                  </p>
                </div>

                {/* Right: Retake Action Button */}
                {/* <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60 w-full sm:w-auto flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/candidate/behavioral-assessment")}
                className="w-full sm:w-auto bg-white/90 hover:bg-white border-slate-200 shadow-xs text-slate-700"
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5 text-slate-500" /> Retake Test
              </Button>
            </div> */}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="mt-4 flex flex-1 items-center justify-center w-full">
              <div className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-500 flex flex-col items-center justify-center bg-slate-50/50">
                <p className="text-sm font-medium">
                  No assessment completed yet.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Take your first behavioral test to unlock your assessment
                  score.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestMain;
