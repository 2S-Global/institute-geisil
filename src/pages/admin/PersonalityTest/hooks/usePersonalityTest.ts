import { useState, useEffect, useMemo } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export interface TestHeader {
    _id: string;
    header: string;
}

export interface Question {
    _id: string;
    category: string;
    categoryId: string;
    question: string;
}

interface APIFeedbackHeader {
    _id: string;
    header: string;
}

interface APIFeedbackQuestion {
    _id: string;
    header: APIFeedbackHeader | null;
    question: string;
}

export const usePersonalityTest = () => {
    const [headers, setHeaders] = useState<TestHeader[]>([]);
    const [headersLoading, setHeadersLoading] = useState<boolean>(false);
    const [headersError, setHeadersError] = useState<any>(null);

    const [activeTab, setActiveTab] = useState<string>("All");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [questionsLoading, setQuestionsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const fetchHeaders = async () => {
        setHeadersLoading(true);
        try {
            const response = await api.get(`/api/mental-feedback/get-all-test-header`);
            setHeaders(response.data.data || []);
        } catch (error) {
            setHeadersError(error);
        } finally {
            setHeadersLoading(false);
        }
    };

    const fetchQuestions = async () => {
        setQuestionsLoading(true);
        try {
            const response = await api.get<{ data: APIFeedbackQuestion[] }>("/api/mental-feedback/get-feedback-form");
            const mappedQuestions = response.data.data.map((q) => ({
                _id: q._id,
                category: q.header?.header || "Uncategorized",
                categoryId: q.header?._id || "",
                question: q.question,
            }));
            setQuestions(mappedQuestions);
        } catch (err) {
            console.error("Failed to load questions:", err);
            toast.error("Failed to load questions");
        } finally {
            setQuestionsLoading(false);
        }
    };



    const deleteQuestions = async (id: string) => {
        setQuestionsLoading(true);
        try {
            const response = await api.delete(`/api/mental-feedback/delete/${id}`);
            console.log('is tis wokring==>' , response)
            toast.success("Question deleted successfully");
            fetchQuestions();
        } catch (err) {
            console.error("Failed to delete question:", err);
            toast.error("Failed to delete question");
        } finally {
            setQuestionsLoading(false);
        }
    };





    useEffect(() => {
        fetchHeaders();
        fetchQuestions();
    }, []);

    const [currentPage, setCurrentPage] = useState<number>(1);

    // Reset page to 1 when tab or search term changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const categoriesList = useMemo(() => {
        return ["All", ...headers.map((d) => d.header)];
    }, [headers]);

    const filteredQuestions = useMemo(() => {
        return questions.filter((q) => {
            const matchesCategory = activeTab === "All" || q.category === activeTab;
            const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [questions, activeTab, searchTerm]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredQuestions.length / 10);
    }, [filteredQuestions]);

    const paginatedQuestions = useMemo(() => {
        const startIndex = (currentPage - 1) * 10;
        return filteredQuestions.slice(startIndex, startIndex + 10);
    }, [filteredQuestions, currentPage]);

    const initialModalCategory = useMemo(() => {
        if (activeTab !== "All") {
            return headers.find((c) => c.header === activeTab)?._id || "";
        }
        return headers[0]?._id || "";
    }, [activeTab, headers]);

    const handleSave = async (saveData: { header: string; questions: string[] }) => {
        setQuestionsLoading(true);
        try {
            const response = await api.post("/api/mental-feedback/create-feedback-form", saveData);
            toast.success(response.data.message || "Questions saved successfully");
            fetchQuestions();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to save questions");
        } finally {
            setQuestionsLoading(false);
        }
    };

    const handleUpdate = async (id: string, updateData: { header: string; question: string }) => {
        setQuestionsLoading(true);
        try {
            const response = await api.patch(`/api/mental-feedback/update-feedback-form/${id}`, updateData);
            toast.success(response.data.message || "Question updated successfully");
            fetchQuestions();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update question");
        } finally {
            setQuestionsLoading(false);
        }
    };

    return {
        headers,
        headersLoading,
        headersError,
        activeTab,
        setActiveTab,
        searchTerm,
        setSearchTerm,
        loading: questionsLoading || headersLoading,
        isModalOpen,
        setIsModalOpen,
        categoriesList,
        filteredQuestions: paginatedQuestions, // return the paginated subset of questions
        totalQuestionsCount: filteredQuestions.length, // return the original filtered count if needed
        currentPage,
        setCurrentPage,
        totalPages,
        initialModalCategory,
        handleSave,
        editingQuestion,
        setEditingQuestion,
        handleUpdate,
        deleteQuestions,
    };
};
