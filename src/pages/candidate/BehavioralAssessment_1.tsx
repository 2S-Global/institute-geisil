import * as RadioGroup from "@radix-ui/react-radio-group";
import { useEffect, useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
/* const questions = [
  {
    id: 13546456,
    question: "In a team meeting, I am most likely to:",
    options: [
      "Encourage open discussion and keep the energy positive",
      "Push for quick decisions so we can move forward",
      "Listen carefully and support quieter teammates",
      "Ask detailed questions and point out potential risks",
    ],
  },
  {
    id: "2dgrtyrtytr",
    question: "When starting a new project, I usually:",
    options: [
      "Brainstorm creative ideas",
      "Create a detailed plan",
      "Organize the team",
      "Research everything first",
    ],
  },
  {
    id: 3,
    question: "If I face a difficult problem, I tend to:",
    options: [
      "Solve it immediately",
      "Think carefully before acting",
      "Ask others for input",
      "Look for a creative solution",
    ],
  },
  {
    id: 4,
    question: "My ideal work environment is:",
    options: [
      "Fast-paced and exciting",
      "Calm and organized",
      "Collaborative and friendly",
      "Flexible and creative",
    ],
  },
  {
    id: 5,
    question: "When making decisions, I rely mostly on:",
    options: ["Logic", "Experience", "People's opinions", "My intuition"],
  },
  // Add remaining questions here...
];
 */
export default function BehavioralAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const FetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-test");

      if (response.data.success) {
        const data = response.data.data;
        setQuestions(data);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchCompanyDetails();
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  const submitQuiz = async () => {
    let result = questions?.map((question, index) => ({
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

  return (
    <CandidateLayout>
      <div className="min-h-screen p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full rounded-xl bg-white p-4 shadow sm:p-6">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-gray-700 flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Behavioral Assessment
              </h1>
              <p className="text-sm text-gray-500"></p>
            </div>
          </div>

          {loading ? (
            <div className="mb-6 rounded-lg border p-4 sm:p-5">
              {/* Question title skeleton */}
              <div className="mb-4 flex items-center gap-2">
                <Skeleton className="h-5 w-6 rounded sm:h-6" />
                <Skeleton className="h-5 w-3/4 rounded sm:h-6" />
              </div>

              {/* Options skeleton */}
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    {/* Radio button */}
                    <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />

                    {/* Option text */}
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
          ) : (
            questions?.map((question, index) => (
              <div
                key={question._id}
                className="mb-6 rounded-lg border p-4 sm:p-5"
              >
                <h2 className="mb-4 text-base font-semibold sm:text-lg">
                  {index + 1}. {question.question}
                </h2>

                <RadioGroup.Root
                  value={answers[question._id]?.toString() ?? ""}
                  onValueChange={(value) => handleAnswer(question._id, value)}
                  className="space-y-3"
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <RadioGroup.Item
                        id={`q-${question.id}-${index}`}
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
                        htmlFor={`q-${question._id}-${index}`}
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
                  ))}
                </RadioGroup.Root>
              </div>
            ))
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <div className="relative inline-block group">
              <Button
                type="button"
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== questions.length}
              >
                Submit
              </Button>

              {Object.keys(answers).length !== questions.length && (
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                    Please answer all questions first.
                  </div>

                  <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-red-600" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
}
