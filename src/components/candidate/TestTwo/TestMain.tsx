import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  RotateCcw,
  CheckCircle2,
  ThumbsUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
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
  const [isScore, setIsScore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const modalOpen = () => {
    setOpen(true);
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-feedback/details");

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setScoreData(data);
        setIsScore(true);
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to fetch behavioral assessment score:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Checks common API date fields
  const rawDate = scoreData?.createdAt || "";
  const formattedDate = formatDate(rawDate);

  // SVG Circular Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  return (
    <Card>
      <CardContent>
        <div className="pt-2 space-y-5 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h5 className="text-xl font-bold tracking-tight text-slate-900">
                Big 5 Personality Assessment (OCEAN)
              </h5>
              <p className="text-sm text-slate-500 mt-0.5 text-justify">
                Please rate each statement based on how accurately it describes
                you in a workplace setting
              </p>
            </div>
            {!isScore && !loading && (
              <Button
                size="sm"
                className="self-start sm:self-center shadow-sm"
                onClick={() => navigate("/candidate/personality-assessment")}
              >
                <Plus className="mr-1.5 h-4 w-4" /> Start Assessment
              </Button>
            )}

            {isScore && (
              <Button
                size="sm"
                onClick={() => modalOpen()}
                className="self-start sm:self-center shadow-sm"
              >
                <Eye className="h-3.5 w-3.5" /> Result
              </Button>
            )}
          </div>

          {/* Main Content Area */}
          {loading ? (
            /* Loading Skeleton */
            <div className="w-full h-36 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60" />
          ) : scoreData ? (
            /* Assessment Card */
            <div
              className={`relative overflow-hidden rounded-2xl border border-green-200 bg-green-50/40 p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left: Circular Progress Ring (Forced Full & Solid Green with ThumbsUp inside) */}
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
                    {/* Full Progress Circle - Emerald Green */}
                    <circle
                      className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="7"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={0}
                    />
                  </svg>

                  {/* Centered Inner ThumbsUp Icon */}
                  <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                      <ThumbsUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Middle: Assessment Status, Score & Date */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {/* Completion Date Badge (Always Shown) */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-700 bg-white/90 border border-slate-200 shadow-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Completed: {formattedDate || "N/A"}
                    </span>
                  </div>

                  <div>
                    <h6 className="text-base font-semibold text-slate-800">
                      Assessment Completed
                    </h6>
                  </div>

                  <p className="text-xs text-slate-500 max-w-md">
                    Your performance metric is evaluated based on your latest
                    personality assessment responses.
                  </p>
                </div>
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
                  Take your first personality test to unlock your assessment
                  score.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <Modal open={open} setOpen={setOpen} data={scoreData} />
    </Card>
  );
};

export default TestMain;
