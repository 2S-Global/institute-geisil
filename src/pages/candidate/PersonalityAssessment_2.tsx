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

  const [activeTab, setActiveTab] = useState("");
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [feedbackResponse, headerResponse] = await Promise.all([
        API.get("/api/mental-feedback/get-feedback-form"),
        API.get("/api/mental-feedback/get-all-test-header"),
      ]);
      const headers =
        headerResponse.data?.success && Array.isArray(headerResponse.data?.data)
          ? headerResponse.data.data
          : [];
      const headerMap = headers.reduce((acc, item) => {
        if (item?._id) {
          acc[item._id] = item.header;
        }

        return acc;
      }, {});
      if (
        feedbackResponse.data?.success &&
        Array.isArray(feedbackResponse.data?.data)
      ) {
        const data = feedbackResponse.data.data;

        /*
         * Normalize the API response.
         */
        const questionsList = data.flatMap((section) => {
          const headerId = section?.header;

          const headerName = headerMap[headerId] || "General";

          return (section?.questions || []).map((question) => ({
            _id: question._id,

            // Existing component uses question.question
            question: question.text,

            // Keep reversed information
            is_reversed: question.is_reversed,

            // Existing grouping logic uses item.header.header
            header: {
              _id: headerId,
              header: headerName,
            },
          }));
        });

        setQuestions(questionsList);
      } else {
        setQuestions([]);
      }
    } catch (e) {
      console.error("Failed to fetch behavioral assessment:", e);

      setQuestions([]);

      toast({
        title: "Error",
        description: "Failed to load personality assessment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
   * ----------------------------------------
   * GROUP QUESTIONS BY HEADER NAME
   * ----------------------------------------
   */
  const groupedQuestions = useMemo(() => {
    if (!Array.isArray(questions)) return {};

    return questions.reduce((acc, item) => {
      const key = item.header?.header || "General";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);

      return acc;
    }, {});
  }, [questions]);

  const tabNames = Object.keys(groupedQuestions);

  /*
   * ----------------------------------------
   * SET FIRST TAB
   * ----------------------------------------
   */
  useEffect(() => {
    if (tabNames.length > 0 && !activeTab) {
      setActiveTab(tabNames[0]);
    }
  }, [tabNames, activeTab]);

  /*
   * ----------------------------------------
   * CHECK TAB COMPLETION
   * ----------------------------------------
   */
  const isTabCompleted = (tab) => {
    if (!groupedQuestions[tab]) return false;

    return groupedQuestions[tab].every((q) => answers[q._id]);
  };

  /*
   * ----------------------------------------
   * SCROLL TO TOP
   * ----------------------------------------
   */
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  /*
   * ----------------------------------------
   * HANDLE ANSWER
   * ----------------------------------------
   */
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

  /*
   * ----------------------------------------
   * NEXT TAB
   * ----------------------------------------
   */
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

  /*
   * ----------------------------------------
   * SUBMIT
   * ----------------------------------------
   */
  const handleSubmit = async () => {
    if (!isTabCompleted(activeTab)) {
      setError("Please fill all questions.");
      return;
    }

    const result = questions?.map((question) => ({
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

  /*
   * ========================================
   * LOADING UI
   * ========================================
   */
  if (loading) {
    return (
      <CandidateLayout>
        <div className="mx-auto max-w-5xl animate-pulse p-4">
          {/* Header Skeleton */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />

            <div className="h-8 w-64 rounded-lg bg-gray-200" />
          </div>

          {/* Tabs Skeleton */}
          <div className="mb-6 flex gap-2 overflow-hidden border-b pb-2">
            <div className="h-9 w-44 rounded-lg bg-gray-200" />
            <div className="h-9 w-40 rounded-lg bg-gray-200" />
            <div className="h-9 w-32 rounded-lg bg-gray-200" />
          </div>

          {/* Question Skeleton */}
          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="h-5 w-3/4 rounded bg-gray-200" />

                <div className="mt-4 flex items-center justify-between gap-2">
                  <div className="hidden h-4 w-28 rounded bg-gray-200 sm:block" />

                  <div className="flex gap-2 sm:gap-4">
                    {[1, 2, 3, 4, 5].map((circle) => (
                      <div
                        key={circle}
                        className="h-10 w-10 rounded-full bg-gray-200 sm:h-12 sm:w-12"
                      />
                    ))}
                  </div>

                  <div className="hidden h-4 w-28 rounded bg-gray-200 sm:block" />
                </div>
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="mt-8 flex justify-end">
            <div className="h-11 w-28 rounded-lg bg-gray-200" />
          </div>
        </div>
      </CandidateLayout>
    );
  }

  /*
   * ========================================
   * NO QUESTIONS
   * ========================================
   */
  if (tabNames.length === 0) {
    return (
      <CandidateLayout>
        <div className="flex justify-center p-12 text-gray-500">
          No questions available.
        </div>
      </CandidateLayout>
    );
  }

  /*
   * ========================================
   * MAIN UI
   * ========================================
   */
  return (
    <CandidateLayout>
      <div ref={topRef} className="mx-auto max-w-5xl p-4">
        {/* Page Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100"
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

        {/* Tabs */}
        <Tabs.Root value={activeTab} onValueChange={(val) => setActiveTab(val)}>
          <Tabs.List className="flex gap-2 overflow-x-auto border-b pb-2">
            {tabNames.map((tab) => {
              const completed = isTabCompleted(tab);

              const isActive = activeTab === tab;

              return (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#112B5F] text-white shadow-sm"
                      : completed
                        ? "border border-green-200 bg-green-50 text-green-800 hover:bg-green-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {completed && !isActive && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}

                  {tab}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {/* Tab Contents */}
          {tabNames.map((tab) => (
            <Tabs.Content key={tab} value={tab}>
              <div className="mt-6 space-y-5">
                {groupedQuestions[tab]?.map((question, index) => (
                  <div
                    key={question._id}
                    className="space-y-4 rounded-xl border bg-white p-5 shadow-sm"
                  >
                    <h3 className="font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </h3>

                    {/* Responsive Rating Scale */}
                    <div className="mt-4 pt-2">
                      {/* Mobile Labels */}
                      <div className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-500 sm:hidden">
                        <span>Strongly Disagree</span>

                        <span>Strongly Agree</span>
                      </div>

                      {/* Desktop Horizontal Scale */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="hidden w-56 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:block md:text-sm">
                          Strongly Disagree
                        </span>

                        <div className="mx-auto flex max-w-md flex-1 items-center justify-center gap-2 sm:gap-4">
                          {OPTIONS.map((option) => {
                            const isSelected = answers[question._id] === option;

                            return (
                              <label
                                key={option}
                                className={`flex h-11 w-11 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border text-center font-medium transition sm:h-12 sm:w-12 ${
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

                        <span className="hidden w-36 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 sm:block md:text-sm">
                          Strongly Agree
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Validation Error */}
              {error && activeTab === tab && (
                <p className="mt-4 font-medium text-red-500">{error}</p>
              )}

              {/* Navigation */}
              <div className="mt-8 flex justify-end">
                {tab !== tabNames[tabNames.length - 1] ? (
                  <button
                    onClick={nextTab}
                    className="rounded-lg bg-[#112B5F] px-6 py-3 font-medium text-white transition hover:opacity-90"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    disabled={!isTabCompleted(tab)}
                    onClick={handleSubmit}
                    className={`rounded-lg px-6 py-3 font-medium text-white ${
                      isTabCompleted(tab)
                        ? "bg-[#112B5F] transition hover:opacity-90"
                        : "cursor-not-allowed bg-gray-400"
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
