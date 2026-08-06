import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Plus, Trash2, LayoutList, MessageCircleQuestion } from "lucide-react";

export interface QuestionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: any[];
    initialCategory?: string;
    editingQuestion?: { _id: string; categoryId: string; question: string } | null;
    onSave: (data: { header: string; questions: string[] }) => void;
    onUpdate?: (id: string, data: { header: string; question: string }) => void;
}

const QuestionModal = ({
    open,
    onOpenChange,
    categories,
    initialCategory,
    editingQuestion,
    onSave,
    onUpdate
}: QuestionModalProps) => {
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || (categories[0]?._id || ""));
    const [questions, setQuestions] = useState<string[]>([""]);

    useEffect(() => {
        if (open) {
            if (editingQuestion) {
                setQuestions([editingQuestion.question]);
                setSelectedCategory(editingQuestion.categoryId || (categories[0]?._id || ""));
            } else {
                setQuestions([""]);
                setSelectedCategory(initialCategory || (categories[0]?._id || ""));
            }
        }
    }, [open, initialCategory, categories, editingQuestion]);

    const handleAddQuestionBox = () => {

        setQuestions((prev) => [...prev, ""]);

    };

    const handleQuestionChange = (index: number, value: string) => {
        setQuestions((prev) => {
            const newQs = [...prev];
            newQs[index] = value;
            return newQs;
        });
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const validQuestions = questions.filter(q => q.trim().length > 0);

        if (editingQuestion) {
            onUpdate?.(editingQuestion._id, {
                header: selectedCategory,
                question: validQuestions[0] || ""
            });
        } else {
            onSave({
                header: selectedCategory,
                questions: validQuestions
            });
        }
        onOpenChange(false);
    };

    const hasValidQuestions = questions.some(q => q.trim().length > 0);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-slate-50">

                {/* Header Section */}
                <div className="bg-white px-8 py-6 border-b">
                    <DialogHeader>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#112B5F]/10 text-[#112B5F]">
                                <MessageCircleQuestion className="w-6 h-6" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl text-slate-900">
                                    {editingQuestion ? "Edit Question" : "Add New Questions"}
                                </DialogTitle>
                                <DialogDescription className="text-slate-500 mt-1">
                                    {editingQuestion
                                        ? "Refine your question and assign it to the right category."
                                        : "Select a category and build your question list below."}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* Scrollable Content Body */}
                <div className="p-8 py-6 space-y-8 max-h-[60vh] overflow-y-auto">

                    {/* Category Selection */}
                    <div className="space-y-3">
                        <Label htmlFor="category-select" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <LayoutList className="w-4 h-4 text-[#112B5F]" />
                            Select Category
                        </Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger id="category-select" className="w-full bg-white h-12 rounded-xl border-slate-200 focus:ring-[#112B5F]">
                                <SelectValue placeholder="Choose the best fit..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {categories.map((c: any) => (
                                    <SelectItem key={c._id} value={c._id} className="cursor-pointer">
                                        {c.header}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold text-slate-700">
                                Question Prompts
                            </Label>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#112B5F]/10 text-[#112B5F]">
                                {questions.length} / 5
                            </span>
                        </div>

                        <div className="space-y-3">
                            {questions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="group relative flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:border-slate-300 focus-within:border-[#112B5F] focus-within:ring-1 focus-within:ring-[#112B5F]"
                                >
                                    {/* Number Badge */}
                                    <div className="mt-1 flex items-center justify-center w-7 h-7 shrink-0 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">
                                        {idx + 1}
                                    </div>

                                    {/* Borderless Input */}
                                    <Input
                                        autoFocus={idx === questions.length - 1 && idx !== 0}
                                        type="text"
                                        value={q}
                                        onChange={(e) => handleQuestionChange(idx, e.target.value)}
                                        placeholder="Type your question here..."
                                        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-1 bg-transparent text-slate-700 placeholder:text-slate-400"
                                    />

                                    {/* Delete Button */}
                                    {questions.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleRemoveQuestion(idx)}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0 rounded-lg h-9 w-9"
                                            aria-label="Remove question"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Add Question Dropzone */}
                        {!editingQuestion && (
                            <button
                                type="button"
                                onClick={handleAddQuestionBox}
                               
                                className={`w-full flex flex-col items-center justify-center gap-2 py-4 border-2 border-dashed rounded-xl transition-all duration-200 border-slate-300 bg-white text-slate-500 hover:border-[#112B5F]/40 hover:bg-[#112B5F]/5 hover:text-[#112B5F] cursor-pointer`}
                            >
                                <div className={`p-2 rounded-full bg-slate-100 group-hover:bg-[#112B5F]/10`}>
                                    <Plus className="h-5 w-5" />
                                </div>
                                <span className="text-sm font-medium">
                                    {"Add another question"}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="bg-white p-6 border-t flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="h-11 px-6 font-medium text-slate-600 hover:text-slate-900 rounded-xl"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!hasValidQuestions}
                        className="h-11 px-8 font-medium rounded-xl bg-[#112B5F] hover:bg-[#0e224c] text-white shadow-md shadow-[#112B5F]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                    >
                        {editingQuestion ? "Save Changes" : "Save Questions"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default QuestionModal;