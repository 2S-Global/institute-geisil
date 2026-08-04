import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import { CandidateLayout } from "@/components/CandidateLayout";
import { Button } from "@/components/ui/button";
const questions = [
  {
    id: 1,
    question: "In a team meeting, I am most likely to:",
    options: [
      "Encourage open discussion and keep the energy positive",
      "Push for quick decisions so we can move forward",
      "Listen carefully and support quieter teammates",
      "Ask detailed questions and point out potential risks",
    ],
  },
  {
    id: 2,
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
          <h1 className="mb-6 text-2xl font-bold">
            Team Personality Questionnaire
          </h1>

          {questions.map((question) => (
            <div
              key={question.id}
              className="mb-6 rounded-lg border p-4 sm:p-5"
            >
              <h2 className="mb-4 text-base font-semibold sm:text-lg">
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
                      htmlFor={`q-${question.id}-${index}`}
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
                      {option}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>
            </div>
          ))}
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
