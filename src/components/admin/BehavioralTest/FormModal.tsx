import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),

  option1: z.string().min(1, "Option 1 is required"),
  option2: z.string().min(1, "Option 2 is required"),
  option3: z.string().min(1, "Option 3 is required"),
  option4: z.string().min(1, "Option 4 is required"),

  correctAnswer: z.string().min(1, "Please select correct answer"),
});

type QuestionForm = z.infer<typeof questionSchema>;

type Question = {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctAnswer: string;
};

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  question?: Question | null;
  onSave: (data: QuestionForm) => void;
};

export default function QuestionModal({
  open,
  setOpen,
  question,
  onSave,
}: Props) {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),

    defaultValues: {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
    },
  });

  // ADD + EDIT FORM FILL
  useEffect(() => {
    if (question) {
      reset({
        question: question.question,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        correctAnswer: question.correctAnswer,
      });
    } else {
      reset({
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
      });
    }
  }, [question, open, reset]);

  const onSubmit = (data: QuestionForm) => {
    const payload = {
      ...data,
      answerText: data[data.correctAnswer as keyof QuestionForm],
    };

    console.log(payload);

    onSave(data);

    reset();

    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          reset();

          setServerError("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <DialogContent
          className="sm:max-w-[560px]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {question ? "Edit Question" : "Add Question"}
            </DialogTitle>

            <DialogDescription>
              {question ? "Update question details." : "Create a new question."}
            </DialogDescription>
          </DialogHeader>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* QUESTION */}

            <div className="space-y-2">
              <Label>Question</Label>

              <Input placeholder="Enter question" {...register("question")} />

              {errors.question && (
                <p className="text-sm text-destructive">
                  {errors.question.message}
                </p>
              )}
            </div>

            {/* OPTIONS */}

            <div className="space-y-3">
              <Label>Select Correct Answer</Label>

              <RadioGroup
                value={watch("correctAnswer")}
                onValueChange={(value) =>
                  setValue("correctAnswer", value, {
                    shouldValidate: true,
                  })
                }
              >
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-1">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={`option${num}`}
                        id={`option-${num}`}
                      />

                      <Input
                        placeholder={`Option ${num}`}
                        {...register(`option${num}` as const)}
                      />
                    </div>

                    {errors[`option${num}` as keyof QuestionForm] && (
                      <p className="text-sm text-destructive ml-7">
                        {errors[`option${num}` as keyof QuestionForm]?.message}
                      </p>
                    )}
                  </div>
                ))}
              </RadioGroup>

              {errors.correctAnswer && (
                <p className="text-sm text-destructive">
                  {errors.correctAnswer.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              {question ? "Update" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
