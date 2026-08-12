import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutList, MessageCircleQuestion, Plus, Trash2 } from "lucide-react";

export interface QuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: any[];
  initialCategory?: string;

  editingQuestion?: {
    _id?: string;
    documentId: string;
    categoryId: string;
    question: string;

    // Support both possible API field names
    isrevers?: boolean;
    is_reversed?: boolean;
  } | null;

  // ADD MODE
  onSave: (data: {
    header: string;
    questions: {
      text: string;
      is_reversed: boolean;
    }[];
  }) => void;

  // EDIT MODE
  onUpdate?: (
    documentId: string,
    data: {
      header: string;
      questions: {
        text: string;
        is_reversed: boolean;
        _id?: string;
      }[];
    },
  ) => void;
}

const QuestionModal = ({
  open,
  onOpenChange,
  categories,
  initialCategory,
  editingQuestion,
  onSave,
  onUpdate,
}: QuestionModalProps) => {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || categories[0]?._id || "",
  );

  const [questions, setQuestions] = useState<string[]>([""]);

  // Stores indexes of reversed questions
  const [reverseIndexes, setReverseIndexes] = useState<number[]>([]);

  // Scrollable questions container
  const questionsContainerRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // INITIALIZE MODAL
  // =========================

  useEffect(() => {
    if (!open) return;

    if (editingQuestion) {
      // =========================
      // EDIT MODE
      // =========================

      setQuestions([editingQuestion.question]);

      setSelectedCategory(
        editingQuestion.categoryId || categories[0]?._id || "",
      );

      // Support both `is_reversed` and `isrevers`
      const isReversed =
        editingQuestion.is_reversed === true ||
        editingQuestion.isrevers === true;

      setReverseIndexes(isReversed ? [0] : []);
    } else {
      // =========================
      // ADD MODE
      // =========================

      setQuestions([""]);

      setSelectedCategory(initialCategory || categories[0]?._id || "");

      setReverseIndexes([]);
    }
  }, [open, initialCategory, categories, editingQuestion]);

  // =========================
  // QUESTION CHANGE
  // =========================

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // =========================
  // ADD QUESTION
  // =========================

  const handleAddQuestion = () => {
    // Don't allow adding questions in edit mode
    if (editingQuestion) return;

    setQuestions((prev) => [...prev, ""]);

    // Scroll to newly added question
    requestAnimationFrame(() => {
      setTimeout(() => {
        const container = questionsContainerRef.current;

        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    });
  };

  // =========================
  // REMOVE QUESTION
  // =========================

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;

    setQuestions((prev) => prev.filter((_, i) => i !== index));

    // Keep reverse indexes synchronized
    setReverseIndexes((prev) =>
      prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)),
    );
  };

  // =========================
  // REVERSE TOGGLE
  // =========================

  const handleReverseChange = (index: number) => {
    setReverseIndexes((prev) => {
      const isSelected = prev.includes(index);

      if (isSelected) {
        // Turn OFF
        return prev.filter((i) => i !== index);
      }

      // Turn ON
      return [...prev, index];
    });
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = () => {
    // =========================
    // EXTRA VALIDATION
    // =========================

    // Make sure every question has text
    const allQuestionsFilled = questions.every(
      (question) => question.trim().length > 0,
    );

    if (!allQuestionsFilled) {
      return;
    }

    // =========================
    // EDIT MODE
    // =========================

    if (editingQuestion) {
      const questionText = questions[0]?.trim() || "";

      const validQuestions = [
        {
          _id: editingQuestion._id,
          text: questionText,
          is_reversed: reverseIndexes.includes(0),
        },
      ];

      onUpdate?.(editingQuestion.documentId, {
        header: selectedCategory,
        questions: validQuestions,
      });
    } else {
      // =========================
      // ADD MODE
      // =========================

      const validQuestions = questions.map((question, index) => ({
        text: question.trim(),
        is_reversed: reverseIndexes.includes(index),
      }));

      onSave({
        header: selectedCategory,
        questions: validQuestions,
      });
    }

    onOpenChange(false);
  };

  // =========================
  // VALIDATION
  // =========================

  // IMPORTANT:
  // `.every()` means ALL questions must be filled.
  //
  // Example:
  // ["Question 1", "Question 2", "Question 3"] -> TRUE
  // ["Question 1", "Question 2", ""]           -> FALSE

  const hasValidQuestions =
    questions.length > 0 &&
    questions.every((question) => question.trim().length > 0);

  // =========================
  // UI
  // =========================

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-50">
        {/* ================= HEADER ================= */}

        <div className="bg-white px-8 py-6 border-b">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#112B5F]/10 text-[#112B5F]">
                <MessageCircleQuestion className="w-6 h-6" />
              </div>

              <div>
                <DialogTitle className="text-2xl text-slate-900">
                  {editingQuestion ? "Edit Question" : "Add New Question"}
                </DialogTitle>

                <DialogDescription className="text-slate-500 mt-1">
                  {editingQuestion
                    ? "Refine your question and assign it to the right category."
                    : "Select a category and create your questions below."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}

        <div
          ref={questionsContainerRef}
          className="p-8 py-6 space-y-8 max-h-[60vh] overflow-y-auto"
        >
          {/* ================= CATEGORY ================= */}

          <div className="space-y-3">
            <Label
              htmlFor="category-select"
              className="text-sm font-semibold text-slate-700 flex items-center gap-2"
            >
              <LayoutList className="w-4 h-4 text-[#112B5F]" />
              Select Category
            </Label>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger
                id="category-select"
                className="w-full bg-white h-12 rounded-xl border-slate-200 focus:ring-[#112B5F]"
              >
                <SelectValue placeholder="Choose the best fit..." />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                {categories.map((c: any) => (
                  <SelectItem
                    key={c._id}
                    value={c._id}
                    className="cursor-pointer"
                  >
                    {c.header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ================= QUESTIONS ================= */}

          <div className="space-y-4">
            <Label className="text-sm font-semibold text-slate-700">
              Question Prompt
            </Label>

            <div className="space-y-3">
              {questions.map((question, index) => {
                const isReverseActive = reverseIndexes.includes(index);

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-300 focus-within:border-[#112B5F] focus-within:ring-1 focus-within:ring-[#112B5F]"
                  >
                    {/* Number */}

                    <div className="flex items-center justify-center w-7 h-7 shrink-0 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">
                      {index + 1}
                    </div>

                    {/* Question */}

                    <Input
                      autoFocus={index === 0}
                      type="text"
                      value={question}
                      onChange={(e) =>
                        handleQuestionChange(index, e.target.value)
                      }
                      placeholder="Type your question here..."
                      className="flex-1 min-w-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 bg-transparent text-slate-700 placeholder:text-slate-400"
                    />

                    {/* Reverse */}

                    <div className="flex items-center gap-2 shrink-0">
                      <Label className="text-xs font-medium text-slate-500">
                        Reverse
                      </Label>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={isReverseActive}
                        onClick={() => handleReverseChange(index)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#112B5F] focus:ring-offset-2 ${
                          isReverseActive ? "bg-[#112B5F]" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 mt-0.5 rounded-full bg-white shadow transform transition duration-200 ${
                            isReverseActive
                              ? "translate-x-5"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Remove */}

                    {!editingQuestion && questions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveQuestion(index)}
                        className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ================= ADD QUESTION ================= */}

            {!editingQuestion && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddQuestion}
                className="w-full h-11 rounded-xl border-[#112B5F] text-[#112B5F] bg-white hover:bg-[#112B5F] hover:text-white hover:border-[#112B5F] transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            )}
          </div>
        </div>

        {/* ================= FOOTER ================= */}

        <DialogFooter className="bg-white p-6 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
          {/* Cancel */}

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 px-6 font-medium text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </Button>

          {/* Submit */}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!hasValidQuestions}
            className="h-11 px-8 font-medium rounded-xl bg-[#112B5F] hover:bg-[#0e224c] text-white shadow-md shadow-[#112B5F]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {editingQuestion ? "Save Changes" : "Save Questions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
