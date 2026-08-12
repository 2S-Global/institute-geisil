import { useMemo, useState, useEffect, useRef } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import API from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const OPTIONS = [1, 2, 3, 4, 5];

export default function PersonalityAssessment() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const topRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-feedback/get-feedback-form");

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        const questionsList = Array.isArray(data) ? data : data.questions || [];
        setQuestions(questionsList);
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

  const groupedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return {};
    return questions.reduce((acc, item) => {
      const key = item.header?.header || "General";

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);

      return acc;
    }, {});
  }, [questions]);

  const tabNames = Object.keys(groupedQuestions);

  const [activeTab, setActiveTab] = useState("");
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (tabNames.length > 0 && !activeTab) {
      setActiveTab(tabNames[0]);
    }
  }, [tabNames, activeTab]);

  const isTabCompleted = (tab) => {
    if (!groupedQuestions[tab]) return false;
    return groupedQuestions[tab].every((q) => answers[q._id]);
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnswer = (questionId, value) => {
    const updated = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(updated);

    if (
      groupedQuestions[activeTab]?.every((q) =>
        q._id === questionId ? true : updated[q._id],
      )
    ) {
      setError("");
    }
  };

  const nextTab = () => {
    if (!isTabCompleted(activeTab)) {
      setError("Please fill all questions.");
      return;
    }

    setError("");

    const currentIndex = tabNames.indexOf(activeTab);

    if (currentIndex < tabNames.length - 1) {
      setActiveTab(tabNames[currentIndex + 1]);
      scrollToTop();
    }
  };

  const handleSubmit = async () => {
    if (!isTabCompleted(activeTab)) {
      setError("Please fill all questions.");
      return;
    }

    let result = questions?.map((question, index) => ({
      questionId: question._id,
      remarks: answers[question._id],
    }));

    try {
      const response = await API.post(
        "/api/mental-feedback/submit-feedback",
        result,
      );

      if (response.data?.success) {
        toast({
          title: "Success",
          description: response.data.message || "",
        });
        navigate("/candidate/profile");
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message || "Something went wrong.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    }
  };

  // Skeleton Loader UI
  if (loading) {
    return (
      <CandidateLayout>
        <div className="max-w-5xl mx-auto p-4 animate-pulse">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-2 border-b pb-2 mb-6">
            <div className="h-9 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
            <div className="h-9 w-20 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Question Cards Skeleton */}
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-white p-5 shadow-sm space-y-4"
              >
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center justify-between gap-2 mt-4">
                  <div className="h-4 w-28 bg-gray-200 rounded hidden sm:block"></div>
                  <div className="flex gap-2 sm:gap-4">
                    {[1, 2, 3, 4, 5].map((circle) => (
                      <div
                        key={circle}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gray-200"
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 w-28 bg-gray-200 rounded hidden sm:block"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-end mt-8">
            <div className="h-11 w-28 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </CandidateLayout>
    );
  }

  if (tabNames.length === 0) {
    return (
      <CandidateLayout>
        <div className="flex justify-center p-12 text-gray-500">
          No questions available.
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div ref={topRef} className="max-w-5xl mx-auto p-4">
        {/* Page Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700 flex items-center justify-center"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Personality Assessment
            </h1>
            <p className="text-sm text-gray-500">
              Please complete all sections to submit your feedback.
            </p>
          </div>
        </div>

        {/* Tabs with locked navigation & completed color indications */}
        <Tabs.Root value={activeTab} onValueChange={(val) => setActiveTab(val)}>
          <Tabs.List className="flex gap-2 overflow-auto border-b pb-2">
            {tabNames.map((tab) => {
              const completed = isTabCompleted(tab);
              const isActive = activeTab === tab;

              return (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm transition font-medium
                    ${
                      isActive
                        ? "bg-[#112B5F] text-white shadow-sm"
                        : completed
                          ? "bg-green-50 text-green-800 border border-green-200 hover:bg-green-100"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {completed && !isActive && (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  )}
                  {tab}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {tabNames.map((tab) => (
            <Tabs.Content key={tab} value={tab}>
              <div className="space-y-5 mt-6">
                {groupedQuestions[tab]?.map((question, index) => (
                  <div
                    key={question._id}
                    className="rounded-xl border bg-white p-5 shadow-sm space-y-4"
                  >
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </h3>

                    {/* Responsive Side-by-Side Scale layout */}
                    <div className="mt-4 pt-2">
                      {/* Mobile stack labels (Visible only on small screens) */}
                      <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:hidden">
                        <span>Strongly Disagree</span>
                        <span>Strongly Agree</span>
                      </div>

                      {/* Desktop Horizontal Alignment */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="hidden sm:block text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider w-56 text-left">
                          Strongly Disagree
                        </span>

                        <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1 max-w-md mx-auto">
                          {OPTIONS.map((option) => {
                            const isSelected = answers[question._id] === option;
                            return (
                              <label
                                key={option}
                                className={`flex h-11 w-11 sm:h-12 sm:w-12 cursor-pointer items-center justify-center rounded-full border text-center font-medium transition select-none shrink-0
                                   ${
                                     isSelected
                                       ? "border-[#112B5F] bg-[#112B5F] text-white shadow-sm"
                                       : "border-gray-300 text-gray-700 hover:border-[#112B5F] hover:bg-gray-50"
                                   }`}
                              >
                                <input
                                  type="radio"
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() =>
                                    handleAnswer(question._id, option)
                                  }
                                />
                                {option}
                              </label>
                            );
                          })}
                        </div>

                        <span className="hidden sm:block text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider w-36 text-right">
                          Strongly Agree
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && activeTab === tab && (
                <p className="text-red-500 mt-4 font-medium">{error}</p>
              )}

              <div className="flex justify-end mt-8">
                {tab !== tabNames[tabNames.length - 1] ? (
                  <button
                    onClick={nextTab}
                    className="bg-[#112B5F] text-white px-6 py-3 rounded-lg hover:opacity-90 transition font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    disabled={!isTabCompleted(tab)}
                    onClick={handleSubmit}
                    className={`px-6 py-3 rounded-lg text-white font-medium
                       ${
                         isTabCompleted(tab)
                           ? "bg-[#112B5F] hover:opacity-90 transition"
                           : "bg-gray-400 cursor-not-allowed"
                       }`}
                  >
                    Submit
                  </button>
                )}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </CandidateLayout>
  );
}
