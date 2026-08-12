import { Plus, Pencil, Trash2, RotateCcw } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import QuestionModal from "./components/QuestionModal";
import { usePersonalityTest } from "./hooks/usePersonalityTest";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { QuestionSkeleton } from "./components/QuestionSkeleton";
import Pagination from "@/components/admin/BehavioralTest/Pagination";
import NoData from "@/components/common/NoData";

interface QuestionData {
  _id: string;
  question: string;
  category: string;
  categoryId: string;
  is_reversed: boolean;
}

const PersonalityTest = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<QuestionData | null>(
    null,
  );

  const {
    headers,
    headersLoading,
    headersError,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    loading,
    isModalOpen,
    setIsModalOpen,
    categoriesList,
    filteredQuestions,
    currentPage,
    setCurrentPage,
    totalPages,
    initialModalCategory,
    handleSave,
    editingQuestion,
    setEditingQuestion,
    handleUpdate,
    deleteQuestions,
  } = usePersonalityTest();

  const handleEditClick = (question: QuestionData) => {
    console.log("aaaaaaaaaaaaaaaaaaa", question);
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);

    if (!open) {
      setEditingQuestion(null);
    }
  };

  const handleDeleteClick = (question: QuestionData) => {
    setQuestionToDelete(question);
    setDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return;

    await deleteQuestions(questionToDelete._id);
    setQuestionToDelete(null);
    setDeleteModal(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Personality Test
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage personality questions by category.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Category */}
            <div className="w-full sm:w-48">
              <Select
                value={activeTab}
                onValueChange={setActiveTab}
                disabled={headersLoading}
              >
                <SelectTrigger className="w-full bg-white border border-gray-300 shadow-sm text-sm">
                  <SelectValue
                    placeholder={
                      headersLoading ? "Loading..." : "Select Category"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {categoriesList.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder={`Search in ${activeTab || "category"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Add */}
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={headersLoading}
              className="bg-[#112B5F] hover:bg-[#0e224c] text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Question
            </Button>
          </div>
        </div>

        {/* Error */}
        {headersError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-sm text-red-600">
                Unable to load personality test categories.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Delete Modal */}
        <DeleteConfirmationModal
          open={deleteModal}
          onOpenChange={(open) => {
            setDeleteModal(open);

            if (!open) {
              setQuestionToDelete(null);
            }
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Question"
          description="Are you sure you want to delete this question? This action cannot be undone."
          isPending={loading}
        />

        {/* Questions */}
        <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6 w-[55%]">Question</th>

                    <th className="py-3 px-4 sm:px-6">Category</th>

                    <th className="py-3 px-4 sm:px-6">Type</th>

                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <QuestionSkeleton key={index} />
                    ))
                  ) : filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q: QuestionData) => (
                      <tr key={q._id} className="hover:bg-gray-50 transition">
                        {/* Question */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-start gap-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {q.question}
                              </p>

                              {/*         {q.is_reversed && (
                                <div className="flex items-center gap-1 mt-1.5">
                                  <RotateCcw className="w-3.5 h-3.5 text-orange-500" />

                                  <span className="text-xs font-medium text-orange-600">
                                    Reverse scored
                                  </span>
                                </div>
                              )} */}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 sm:px-6">
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                            {q.category}
                          </span>
                        </td>

                        {/* Reverse */}
                        <td className="py-4 px-4 sm:px-6">
                          {q.is_reversed ? (
                            <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                              Reversed
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                              Normal
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(q)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 mr-1"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          <Button
                            onClick={() => handleDeleteClick(q)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center">
                        <NoData
                          title="No questions found"
                          description="Try adjusting your search or add a new question."
                          delay={0}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        )}
      </div>

      {/* Question Modal */}
      <QuestionModal
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
        categories={headers}
        initialCategory={initialModalCategory}
        editingQuestion={editingQuestion}
        onSave={handleSave}
        onUpdate={handleUpdate}
      />
    </AdminLayout>
  );
};

export default PersonalityTest;
