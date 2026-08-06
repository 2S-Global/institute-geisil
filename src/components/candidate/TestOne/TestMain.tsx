import React, { useState, useEffect } from "react";
import TestModal from "./TestModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import API from "@/lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import * as Progress from "@radix-ui/react-progress";

const getStatus = (score: number) => {
  if (score >= 90)
    return {
      text: "Outstanding",
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      ring: "ring-emerald-100",
    };

  if (score >= 75)
    return {
      text: "Excellent",
      color: "text-green-600",
      bg: "bg-green-500",
      ring: "ring-green-100",
    };

  if (score >= 60)
    return {
      text: "Good",
      color: "text-yellow-600",
      bg: "bg-yellow-500",
      ring: "ring-yellow-100",
    };

  if (score >= 40)
    return {
      text: "Average",
      color: "text-orange-600",
      bg: "bg-orange-500",
      ring: "ring-orange-100",
    };

  return {
    text: "Needs Improvement",
    color: "text-red-600",
    bg: "bg-red-500",
    ring: "ring-red-100",
  };
};
const TestMain = () => {
  const [score, setScore] = useState();
  const [percentage, setPercentage] = useState(0);
  const [isScore, setIsScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const fetchBehavioralAssessmentScore = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-test/attempt-history");
      console.log("response 2", response.data.data?.[0]);

      if (response.data.success) {
        const data = response.data.data?.[0];
        if (data.score && data.totalQuestions) {
          setPercentage(
            Math.round((data.score / data.totalQuestions) * 100) || 0,
          );
        }
        setScore(data);
        setIsScore(true);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBehavioralAssessmentScore();
  }, []);
  const status = getStatus(percentage);
  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">Behavioral Assessment</h5>
          <p className="text-sm text-muted-foreground">
            {/* First test, first step. */}
            Behavioral Assessments help identify strengths, improve teamwork,
            and support better decisions.
          </p>
        </div>
        {/* Show 'Add' button only if list is empty */}
        {!isScore && (
          <Button
            size="sm"
            onClick={() => navigate("/candidate/behavioral-assessment")}
          >
            <Plus className=" h-4 w-4" /> Start Assessment
          </Button>
        )}
      </div>

      {isScore ? (
        <div className="w-full">
          {/* Progress Section */}
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>

            <Progress.Root
              value={score}
              className="h-3 w-full overflow-hidden rounded-full bg-slate-200"
            >
              <Progress.Indicator
                className={`h-full rounded-full transition-all duration-700 ${status.bg}`}
                style={{ transform: `translateX(-${100 - percentage}%)` }}
              />
            </Progress.Root>
          </div>

          {/* Assessment Card */}
          <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
            <p className="text-sm font-medium text-slate-500">
              Assessment Score ({" "}
              <span className={`text-center font-semibold  ${status.color}`}>
                {status.text}
              </span>
              )
            </p>

            <p
              className={`mt-2 text-3xl font-bold sm:text-4xl ${status.color}`}
            >
              {percentage}/100
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-1 items-center justify-center w-full shadow-sm">
          <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
            <p className="text-sm">No data added yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestMain;
