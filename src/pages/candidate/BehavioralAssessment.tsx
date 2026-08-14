import * as RadioGroup from "@radix-ui/react-radio-group";
import { useEffect, useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function BehavioralAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const { toast } = useToast();
  const navigate = useNavigate();

  const FetchCompanyDetails = async () => {
    try {
      setLoading(true);

      const response = await API.get("/api/mental-test");

      if (response.data.success) {
        const data = response.data.data;
        setQuestions(data);
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchCompanyDetails();
  }, []);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Automatically go to next question after selecting answer
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 150);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    const question = questions[currentQuestion];

    // Don't allow next without answering current question
    if (!question || !answers[question._id]) {
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const submitQuiz = async () => {
    let result = questions?.map((question) => ({
      questionId: question._id,
      selectedOption: answers[question._id],
    }));

    let playLoad = { answers: result };

    try {
      const response = await API.post("/api/mental-test/submit-test", playLoad);

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

      console.log("error", response);
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

  const answeredCount = Object.keys(answers).length;

  const currentQuestionData = questions[currentQuestion];

  const isCurrentQuestionAnswered =
    currentQuestionData && !!answers[currentQuestionData._id];

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <CandidateLayout>
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full rounded-xl bg-white p-4 shadow sm:p-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Behavioral Assessment
              </h1>

              {!loading && questions.length > 0 && (
                <p className="text-sm text-gray-500">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              )}
            </div>
          </div>

          {/* Progress */}
          {!loading && questions.length > 0 && (
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Progress</span>

                <span className="text-gray-500">
                  Answered {answeredCount} / {questions.length}
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${
                      questions.length
                        ? (answeredCount / questions.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="mb-6 rounded-lg border p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-6 rounded sm:h-6" />
                <Skeleton className="h-5 w-3/4 rounded sm:h-6" />
              </div>

              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />

                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full rounded sm:h-5" />

                      {item === 2 && (
                        <Skeleton className="h-4 w-2/3 rounded sm:h-5" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : questions.length > 0 && currentQuestionData ? (
            <>
              {/* Current Question */}
              <div className="mb-6 rounded-lg border p-4 sm:p-5">
                <h2 className="mb-5 text-base font-semibold sm:text-lg">
                  {currentQuestion + 1}. {currentQuestionData.question}
                </h2>

                <RadioGroup.Root
                  value={answers[currentQuestionData._id] ?? ""}
                  onValueChange={(value) =>
                    handleAnswer(currentQuestionData._id, value)
                  }
                  className="space-y-3"
                >
                  {currentQuestionData.options.map(
                    (option: any, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <RadioGroup.Item
                          id={`q-${currentQuestionData._id}-${index}`}
                          value={String(option?.text)}
                          className="
                            mt-1
                            flex
                            h-5
                            w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-gray-400
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                            data-[state=checked]:border-blue-600
                          "
                        >
                          <RadioGroup.Indicator className="flex items-center justify-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                          </RadioGroup.Indicator>
                        </RadioGroup.Item>

                        <label
                          htmlFor={`q-${currentQuestionData._id}-${index}`}
                          className="
                            flex-1
                            cursor-pointer
                            break-words
                            text-sm
                            leading-6
                            text-gray-700
                            sm:text-base
                          "
                        >
                          {option?.text}
                        </label>
                      </div>
                    ),
                  )}
                </RadioGroup.Root>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {/* Previous */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={goToPrevious}
                  disabled={currentQuestion === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                {/* Next / Submit */}
                {!isLastQuestion ? (
                  <div className="relative group">
                    <Button
                      type="button"
                      onClick={goToNext}
                      disabled={!isCurrentQuestionAnswered}
                      className="gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    {!isCurrentQuestionAnswered && (
                      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <div className="whitespace-nowrap rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-lg">
                          Please select an answer first.
                        </div>

                        <div className="absolute bottom-0 right-4 h-2 w-2 translate-y-1/2 rotate-45 bg-red-600" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative group">
                    <Button
                      type="button"
                      onClick={submitQuiz}
                      disabled={answeredCount !== questions.length}
                    >
                      Submit
                    </Button>

                    {answeredCount !== questions.length && (
                      <div className="absolute bottom-full right-0 mb-2 pointer-events-none opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <div className="whitespace-nowrap rounded-md bg-red-600 px-3 py-2 text-xs font-medium text-white shadow-lg">
                          Please answer all questions first.
                        </div>

                        <div className="absolute bottom-0 right-4 h-2 w-2 translate-y-1/2 rotate-45 bg-red-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-gray-500">
              No questions available.
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
}
