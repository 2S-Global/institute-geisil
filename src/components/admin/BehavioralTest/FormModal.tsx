import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* =========================
   VALIDATION
========================= */

const labelSchema = z
  .string()
  .min(1, "Please select an option label")
  .refine((value) => ["D", "I", "S", "C"].includes(value), {
    message: "Please select a valid option label",
  });

const questionSchema = z.object({
  question: z.string().min(1, "Question is required"),

  option1Label: labelSchema,
  option1: z.string().min(1, "Option 1 is required"),

  option2Label: labelSchema,
  option2: z.string().min(1, "Option 2 is required"),

  option3Label: labelSchema,
  option3: z.string().min(1, "Option 3 is required"),

  option4Label: labelSchema,
  option4: z.string().min(1, "Option 4 is required"),
});

type QuestionForm = z.infer<typeof questionSchema>;

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedData?: any | null;
  onSave: (data: any) => void;
  loading?: boolean;
};

/* =========================
   EMPTY FORM
========================= */

const emptyForm: QuestionForm = {
  question: "",

  option1Label: "",
  option1: "",

  option2Label: "",
  option2: "",

  option3Label: "",
  option3: "",

  option4Label: "",
  option4: "",
};

export default function QuestionModal({
  open,
  setOpen,
  selectedData,
  onSave,
  loading = false,
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
    defaultValues: emptyForm,
  });

  /* =========================
     ADD + EDIT FORM FILL
  ========================= */

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedData) {
      const options = selectedData.options || [];

      reset({
        question: selectedData.question || "",

        /*
         * IMPORTANT:
         * Get the trait from each individual option.
         */
        option1Label: options[0]?.trait || selectedData.option1Label || "",

        option1: options[0]?.text || options[0] || selectedData.option1 || "",

        option2Label: options[1]?.trait || selectedData.option2Label || "",

        option2: options[1]?.text || options[1] || selectedData.option2 || "",

        option3Label: options[2]?.trait || selectedData.option3Label || "",

        option3: options[2]?.text || options[2] || selectedData.option3 || "",

        option4Label: options[3]?.trait || selectedData.option4Label || "",

        option4: options[3]?.text || options[3] || selectedData.option4 || "",
      });
    } else {
      reset(emptyForm);
    }

    setServerError("");
  }, [selectedData, open, reset]);

  /* =========================
     SUBMIT
  ========================= */

  const onSubmit = async (data: QuestionForm) => {
    try {
      setServerError("");

      const payload = {
        question: data.question,

        options: [
          {
            trait: data.option1Label,
            text: data.option1,
          },
          {
            trait: data.option2Label,
            text: data.option2,
          },
          {
            trait: data.option3Label,
            text: data.option3,
          },
          {
            trait: data.option4Label,
            text: data.option4,
          },
        ],
      };
      console.log("ssssssssssssssssssssssssssssssssssssssssssss", payload);
      await onSave(payload);

      reset(emptyForm);
      setOpen(false);
    } catch (error: any) {
      setServerError(
        error?.message || "Something went wrong. Please try again.",
      );
    }
  };

  /* =========================
     CLOSE MODAL
  ========================= */

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      reset(emptyForm);
      setServerError("");
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <DialogContent
          className="w-full max-w-3xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedData ? "Edit Question" : "Add Question"}
            </DialogTitle>

            <DialogDescription>
              {selectedData
                ? "Update question details."
                : "Create a new question."}
            </DialogDescription>
          </DialogHeader>

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* QUESTION */}

            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>

              <Input
                id="question"
                placeholder="Enter question"
                {...register("question")}
              />

              {errors.question && (
                <p className="text-sm text-destructive">
                  {errors.question.message}
                </p>
              )}
            </div>

            {/* OPTIONS */}

            <div className="space-y-4">
              <Label>Options</Label>

              {[1, 2, 3, 4].map((num) => {
                const fieldName = `option${num}` as
                  | "option1"
                  | "option2"
                  | "option3"
                  | "option4";

                const labelFieldName = `option${num}Label` as
                  | "option1Label"
                  | "option2Label"
                  | "option3Label"
                  | "option4Label";

                return (
                  <div key={num} className="flex items-start gap-2">
                    {/* LABEL */}

                    <div className="w-[168px]">
                      <Select
                        value={watch(labelFieldName)}
                        onValueChange={(value) => {
                          setValue(labelFieldName, value, {
                            shouldValidate: true,
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="D">Dominance</SelectItem>
                          <SelectItem value="I">Influence</SelectItem>
                          <SelectItem value="S">Steadiness</SelectItem>
                          <SelectItem value="C">Conscientiousness</SelectItem>
                        </SelectContent>
                      </Select>

                      {errors[labelFieldName] && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors[labelFieldName]?.message}
                        </p>
                      )}
                    </div>

                    {/* OPTION TEXT */}

                    <div className="flex-1">
                      <Input
                        placeholder={`Option ${num}`}
                        {...register(fieldName)}
                      />

                      {errors[fieldName] && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors[fieldName]?.message}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SUBMIT */}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : selectedData ? "Update" : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
