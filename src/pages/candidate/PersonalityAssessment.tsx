import { useMemo, useState, useEffect, useRef } from "react";
import API from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { CandidateLayout } from "@/components/CandidateLayout";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const OPTIONS = [1, 2, 3, 4, 5];

export default function PersonalityAssessment() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { toast } = useToast();

  const topRef = useRef(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");

  /*
   * ========================================
   * FETCH QUESTIONS
   * ========================================
   *
   * Header API is no longer needed.
   */
  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await API.get("/api/mental-feedback/get-feedback-form");

      if (response.data?.success && Array.isArray(response.data?.data)) {
        const data = response.data.data;

        /*
         * Flatten all questions from all sections.
         *
         * We don't need header information anymore
         * because questions are displayed one by one.
         */
        const questionsList = data.flatMap((section) => {
          return (section?.questions || []).map((question) => ({
            _id: question._id,

            // Existing question text
            question: question.text,

            // Keep existing reversed information
            is_reversed: question.is_reversed,
          }));
        });

        setQuestions(questionsList);
      } else {
        setQuestions([]);
      }
    } catch (e) {
      console.error("Failed to fetch personality assessment:", e);

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
   * ========================================
   * CURRENT QUESTION
   * ========================================
   */
  const currentQuestionData = questions[currentQuestion];

  /*
   * ========================================
   * ANSWERED COUNT
   * ========================================
   */
  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  /*
   * ========================================
   * CURRENT QUESTION ANSWERED
   * ========================================
   */
  const isCurrentQuestionAnswered =
    currentQuestionData && answers[currentQuestionData._id] !== undefined;

  /*
   * ========================================
   * LAST QUESTION
   * ========================================
   */
  const isLastQuestion =
    questions.length > 0 && currentQuestion === questions.length - 1;

  /*
   * ========================================
   * PROGRESS
   * ========================================
   */
  const progress =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  /*
   * ========================================
   * SCROLL TO TOP
   * ========================================
   */
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /*
   * ========================================
   * HANDLE ANSWER
   * ========================================
   */
  const handleAnswer = (questionId, value) => {
    const updated = {
      ...answers,
      [questionId]: value,
    };

    setAnswers(updated);
    setError("");

    /*
     * Automatically move to the next question
     * after selecting an answer.
     */
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        scrollToTop();
      }, 200);
    }
  };

  /*
   * ========================================
   * PREVIOUS QUESTION
   * ========================================
   */
  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setError("");

      setCurrentQuestion((prev) => prev - 1);

      scrollToTop();
    }
  };

  /*
   * ========================================
   * NEXT QUESTION
   * ========================================
   */
  const nextQuestion = () => {
    /*
     * Don't allow next without answering
     * the current question.
     */
    if (!isCurrentQuestionAnswered) {
      setError("Please select an answer first.");
      return;
    }

    setError("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);

      scrollToTop();
    }
  };

  /*
   * ========================================
   * SUBMIT
   * ========================================
   *
   * Existing submit payload is preserved.
   */
  const handleSubmit = async () => {
    /*
     * Make sure every question has an answer.
     */
    if (answeredCount !== questions.length) {
      setError("Please answer all questions before submitting.");
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
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
          <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-4 shadow sm:p-6">
            {/* Header Skeleton */}
            <div className="mb-6 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />

              <div className="space-y-2">
                <div className="h-7 w-64 rounded-lg bg-gray-200" />
                <div className="h-4 w-40 rounded bg-gray-200" />
              </div>
            </div>

            {/* Progress Skeleton */}
            <div className="mb-6">
              <div className="mb-2 flex justify-between">
                <div className="h-4 w-24 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>

              <div className="h-2 w-full rounded-full bg-gray-200" />
            </div>

            {/* Question Skeleton */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-6 h-6 w-4/5 rounded bg-gray-200" />

              <div className="mb-3 flex justify-between">
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
              </div>

              <div className="flex justify-center gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-11 w-11 rounded-full bg-gray-200 sm:h-12 sm:w-12"
                  />
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="mt-8 flex justify-between">
              <div className="h-11 w-28 rounded-lg bg-gray-200" />
              <div className="h-11 w-28 rounded-lg bg-gray-200" />
            </div>
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
  if (questions.length === 0) {
    return (
      <CandidateLayout>
        <div className="flex min-h-screen items-center justify-center p-12 text-gray-500">
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
      <div ref={topRef} className=" p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-4 shadow sm:p-6">
          {/* ========================================
              PAGE HEADER
          ======================================== */}
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
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
          </div>

          {/* ========================================
              PROGRESS
          ======================================== */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Assessment Progress
              </span>

              <span className="text-gray-500">
                Answered {answeredCount} / {questions.length}
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#112B5F] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* ========================================
              QUESTION
          ======================================== */}
          <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <p className="mb-2 text-sm font-medium text-[#112B5F]">
                Question {currentQuestion + 1} of {questions.length}
              </p>

              <h2 className="text-base font-semibold leading-7 text-gray-900 sm:text-lg">
                {currentQuestion + 1}. {currentQuestionData.question}
              </h2>
            </div>

            {/* Rating Scale */}
            <div className="pt-2">
              {/* Mobile labels */}
              <div className="mb-3 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:hidden">
                <span>Strongly Disagree</span>

                <span>Strongly Agree</span>
              </div>

              <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Desktop left label */}
                <span className="hidden w-40 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 sm:block md:w-48 md:text-sm">
                  Strongly Disagree
                </span>

                {/* Options */}
                <div className="mx-auto flex flex-1 items-center justify-center gap-2 sm:gap-4">
                  {OPTIONS.map((option) => {
                    const isSelected =
                      answers[currentQuestionData._id] === option;

                    return (
                      <label
                        key={option}
                        className={`flex h-11 w-11 shrink-0 cursor-pointer select-none items-center justify-center rounded-full border text-center font-medium transition sm:h-12 sm:w-12 ${
                          isSelected
                            ? "border-[#112B5F] bg-[#112B5F] text-white shadow-md"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#112B5F] hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionData._id}`}
                          value={option}
                          checked={isSelected}
                          onChange={() =>
                            handleAnswer(currentQuestionData._id, option)
                          }
                          className="hidden"
                        />

                        {option}
                      </label>
                    );
                  })}
                </div>

                {/* Desktop right label */}
                <span className="hidden w-40 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 sm:block md:w-48 md:text-sm">
                  Strongly Agree
                </span>
              </div>
            </div>
          </div>

          {/* ========================================
              ERROR
          ======================================== */}
          {error && (
            <p className="mt-4 text-sm font-medium text-red-500">{error}</p>
          )}

          {/* ========================================
              NAVIGATION
          ======================================== */}
          <div className="mt-8 flex items-center justify-between gap-3">
            {/* Previous */}
            <button
              type="button"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 rounded-lg border px-5 py-3 font-medium transition ${
                currentQuestion === 0
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>

            {/* Next / Submit */}
            {!isLastQuestion ? (
              <div className="group relative">
                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={!isCurrentQuestionAnswered}
                  className={`flex items-center gap-2 rounded-lg px-5 py-3 font-medium text-white transition ${
                    isCurrentQuestionAnswered
                      ? "bg-[#112B5F] hover:opacity-90"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Tooltip when Next is disabled */}
                {!isCurrentQuestionAnswered && (
                  <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    Please select an answer first.
                    <div className="absolute bottom-0 right-4 h-2 w-2 translate-y-1/2 rotate-45 bg-red-600" />
                  </div>
                )}
              </div>
            ) : (
              <div className="group relative">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={answeredCount !== questions.length}
                  className={`rounded-lg px-6 py-3 font-medium text-white transition ${
                    answeredCount === questions.length
                      ? "bg-[#112B5F] hover:opacity-90"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  Submit
                </button>

                {/* Tooltip when Submit is disabled */}
                {answeredCount !== questions.length && (
                  <div className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    Please answer all questions first.
                    <div className="absolute bottom-0 right-4 h-2 w-2 translate-y-1/2 rotate-45 bg-red-600" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
