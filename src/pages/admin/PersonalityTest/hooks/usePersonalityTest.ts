import { useState, useEffect, useMemo, useCallback } from "react";
import api from "@/lib/axios";
import { toast } from "@/hooks/use-toast";

export interface TestHeader {
  _id: string;
  header: string;
}

export interface Question {
  _id: string;
  documentId: string; // Main feedback document _id
  category: string;
  categoryId: string; // Header ID
  question: string;
  is_reversed: boolean;
}

/**
 * Header returned by:
 * /api/mental-feedback/get-all-test-header
 */
interface APIHeader {
  _id: string;
  header: string;
}

/**
 * Question returned inside the `questions` array
 * from:
 * /api/mental-feedback/get-feedback-form
 */
interface APIFeedbackQuestion {
  _id: string;
  text: string;
  is_reversed: boolean;
}

/**
 * New feedback form response structure
 *
 * data: [
 *   {
 *     _id: "...",
 *     header: "...",
 *     questions: [...]
 *   }
 * ]
 */
interface APIFeedbackGroup {
  _id: string;
  header: string;
  questions: APIFeedbackQuestion[];
  is_del?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

  /**
   * Fetch all test headers/categories
   */
  const fetchHeaders = useCallback(async () => {
    setHeadersLoading(true);
    setHeadersError(null);

    try {
      const response = await api.get(
        "/api/mental-feedback/get-all-test-header",
      );

      setHeaders(response.data?.data || []);
    } catch (error) {
      console.error("Failed to load headers:", error);
      setHeadersError(error);

      toast({
        title: "Error",
        description: "Failed to load test categories",
        variant: "destructive",
      });
    } finally {
      setHeadersLoading(false);
    }
  }, []);

  /**
   * Fetch feedback forms
   *
   * New API response:
   *
   * data: [
   *   {
   *     header: "HEADER_ID",
   *     questions: [
   *       {
   *         _id: "...",
   *         text: "...",
   *         is_reversed: false
   *       }
   *     ]
   *   }
   * ]
   *
   * We flatten this into:
   *
   * {
   *   _id,
   *   category,
   *   categoryId,
   *   question,
   *   is_reversed
   * }
   */
  const fetchQuestions = useCallback(async () => {
    setQuestionsLoading(true);

    try {
      const response = await api.get<{
        success: boolean;
        message: string;
        data: APIFeedbackGroup[];
        errors: any;
      }>("/api/mental-feedback/get-feedback-form");

      const feedbackGroups = response.data?.data || [];

      const mappedQuestions: Question[] = feedbackGroups.flatMap((group) => {
        return (group.questions || []).map((question) => {
          /**
           * Find the readable category name using
           * the header ID from the feedback group.
           */
          const category = headers.find(
            (header) => header._id === group.header,
          );

          return {
            // Question's own ID
            _id: question._id,

            // Main feedback document ID
            // Example: 6a7ad4a54588c54acc9f5f18
            documentId: group._id,

            // Readable category name
            category: category?.header || group.header || "Uncategorized",

            // Header/category ID
            // Example: 6a71cc1d4b85dc241cc21a66
            categoryId: group.header,

            // API `text` -> frontend `question`
            question: question.text,

            // Preserve reverse scoring
            is_reversed: question.is_reversed ?? false,
          };
        });
      });

      setQuestions(mappedQuestions);
    } catch (err) {
      console.error("Failed to load questions:", err);

      toast({
        title: "Error",
        description: "Failed to load questions",
        variant: "destructive",
      });
    } finally {
      setQuestionsLoading(false);
    }
  }, [headers]);

  /**
   * Delete question
   */
  const deleteQuestions = async (id: string) => {
    setQuestionsLoading(true);

    try {
      const response = await api.delete(`/api/mental-feedback/delete/${id}`);

      toast({
        title: "Success",
        description: response.data?.message || "Question deleted successfully",
      });

      await fetchQuestions();
    } catch (err: any) {
      console.error("Failed to delete question:", err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete question",
        variant: "destructive",
      });
    } finally {
      setQuestionsLoading(false);
    }
  };

  /**
   * Initial API calls
   */
  useEffect(() => {
    fetchHeaders();
  }, [fetchHeaders]);

  /**
   * Fetch questions after headers are loaded.
   *
   * This is important because the new feedback API only gives us
   * the header ID, so we use the headers API to get the readable
   * category name.
   */
  useEffect(() => {
    if (headers.length > 0) {
      fetchQuestions();
    }
  }, [headers, fetchQuestions]);

  const [currentPage, setCurrentPage] = useState<number>(1);

  /**
   * Reset page when category/search changes
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  /**
   * Category dropdown
   */
  const categoriesList = useMemo(() => {
    return ["All", ...headers.map((header) => header.header)];
  }, [headers]);

  /**
   * Filter questions
   */
  const filteredQuestions = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesCategory =
        activeTab === "All" || question.category === activeTab;

      const matchesSearch =
        !search || question.question.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [questions, activeTab, searchTerm]);

  /**
   * Pagination
   */
  const ITEMS_PER_PAGE = 10;

  const totalPages = useMemo(() => {
    return Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  }, [filteredQuestions]);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredQuestions, currentPage]);

  /**
   * Category to use when opening Add Question modal
   */
  const initialModalCategory = useMemo(() => {
    if (activeTab !== "All") {
      return headers.find((header) => header.header === activeTab)?._id || "";
    }

    return headers[0]?._id || "";
  }, [activeTab, headers]);

  /**
   * Create questions
   *
   * Expected payload:
   * {
   *   header: string,
   *   questions: string[]
   * }
   */
  const handleSave = async (saveData: {
    header: string;
    questions: string[];
  }) => {
    setQuestionsLoading(true);

    try {
      const response = await api.post(
        "/api/mental-feedback/create-feedback-form",
        saveData,
      );

      toast({
        title: "Success",
        description: response.data?.message || "Questions saved successfully",
      });

      await fetchQuestions();
    } catch (err: any) {
      console.error("Failed to save questions:", err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to save questions",
        variant: "destructive",
      });
    } finally {
      setQuestionsLoading(false);
    }
  };

  /**
   * Update question
   *
   * Expected payload:
   * {
   *   header: string,
   *   question: string
   * }
   */
  const handleUpdate = async (
    id: string,
    updateData: {
      header: string;
      question: string;
    },
  ) => {
    setQuestionsLoading(true);

    try {
      const response = await api.patch(
        `/api/mental-feedback/update-feedback-form/${id}`,
        updateData,
      );

      toast({
        title: "Success",
        description: response.data?.message || "Question updated successfully",
      });

      await fetchQuestions();
    } catch (err: any) {
      console.error("Failed to update question:", err);

      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update question",
        variant: "destructive",
      });
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

    /**
     * Paginated questions
     */
    filteredQuestions: paginatedQuestions,

    /**
     * Full filtered count
     */
    totalQuestionsCount: filteredQuestions.length,

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
