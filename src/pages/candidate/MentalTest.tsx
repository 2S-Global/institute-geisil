import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const questionsByCategory = {
  "Emotional Well-being": [
    {
      id: 1,
      question: "How often do you feel positive and optimistic about your daily life?",
      options: [
        "Almost always",
        "Frequently",
        "Sometimes",
        "Rarely",
      ],
    },
    {
      id: 2,
      question: "When faced with a setback, how quickly do you usually recover your emotional balance?",
      options: [
        "Very quickly",
        "Within a few days",
        "It takes a while",
        "I struggle to recover",
      ],
    },
  ],
  "Stress & Anxiety": [
    {
      id: 3,
      question: "How often do you feel overwhelmed by your responsibilities?",
      options: [
        "Rarely or never",
        "Sometimes",
        "Often",
        "Almost constantly",
      ],
    },
    {
      id: 4,
      question: "When feeling stressed, what is your most common reaction?",
      options: [
        "Take a break and relax",
        "Work harder to resolve it",
        "Feel physically tense",
        "Avoid the situation",
      ],
    },
  ],
  "Self-Confidence": [
    {
      id: 5,
      question: "How comfortable are you expressing your opinions in a group setting?",
      options: [
        "Very comfortable",
        "Somewhat comfortable",
        "Neutral",
        "Uncomfortable",
      ],
    },
  ],
  "Social & Relationship Health": [
    {
      id: 6,
      question: "How satisfied are you with the quality of your relationships with peers/colleagues?",
      options: [
        "Very satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied",
      ],
    },
  ],
  "Overall Mental Wellness": [
    {
      id: 7,
      question: "Overall, how would you rate your current state of mental wellness?",
      options: [
        "Excellent",
        "Good",
        "Fair",
        "Needs attention",
      ],
    },
  ]
};

const allQuestionsCount = Object.values(questionsByCategory).reduce((acc, curr) => acc + curr.length, 0);

export default function MentalTest() {
  /*   const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
 */
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: Number(value),
    }));
  };
  const submitQuiz = () => {
    console.log("User Answers:", answers);
    alert(JSON.stringify(answers, null, 2));
  };

  return (
    <CandidateLayout>
      <div className="min-h-screen  p-4 sm:p-6 md:p-8">
        <div className="mx-auto w-full  rounded-xl bg-white p-4 shadow sm:p-6">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            Mental Wellness Assessment
          </h1>

          <Tabs defaultValue="Emotional Well-being" className="w-full">
            <div className="mb-6 overflow-x-auto pb-2">
              <TabsList className="inline-flex h-auto w-full min-w-max justify-start sm:w-auto sm:justify-center p-1 bg-gray-100 rounded-lg">
                {Object.keys(questionsByCategory).map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="px-4 py-2 text-sm sm:text-base data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all whitespace-nowrap"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {Object.entries(questionsByCategory).map(([category, questions]) => (
              <TabsContent key={category} value={category} className="space-y-6 outline-none">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-lg border bg-white p-4 sm:p-6 shadow-sm"
                  >
                    <h2 className="mb-4 text-base font-semibold text-gray-800 sm:text-lg">
                      {question.id}. {question.question}
                    </h2>

                    <RadioGroup.Root
                      value={answers[question.id]?.toString() ?? ""}
                      onValueChange={(value) => handleAnswer(question.id, value)}
                      className="space-y-3"
                    >
                      {question.options.map((option, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <RadioGroup.Item
                            id={`q-${question.id}-${index}`}
                            value={String(index)}
                            className="
                              mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400
                              focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:border-blue-600
                            "
                          >
                            <RadioGroup.Indicator className="flex items-center justify-center">
                              <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                            </RadioGroup.Indicator>
                          </RadioGroup.Item>

                          <label
                            htmlFor={`q-${question.id}-${index}`}
                            className="flex-1 cursor-pointer break-words text-sm leading-6 text-gray-700 sm:text-base"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </RadioGroup.Root>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-8 flex justify-end">
            <div className="relative inline-block group">
              <Button
                type="button"
                onClick={submitQuiz}
                disabled={Object.keys(answers).length !== allQuestionsCount}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium transition-colors"
              >
                Submit Assessment
              </Button>

              {Object.keys(answers).length !== allQuestionsCount && (
                <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <div className="bg-red-600 text-white text-xs font-medium px-3 py-2 rounded-md shadow-lg whitespace-nowrap">
                    Please answer all questions first.
                  </div>
                  <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2 bg-red-600" />
                </div>
              )}
            </div>
          </div>

          {/* Debug */}
          {/* <div className="mt-6 rounded-lg bg-gray-100 p-4">
      <h3 className="font-bold">Selected Answers:</h3>
      <pre className="mt-2 text-sm">
        {JSON.stringify(answers, null, 2)}
      </pre>
    </div> */}
        </div>
      </div>
    </CandidateLayout>
  );
}
