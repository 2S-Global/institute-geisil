import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
//import CategoryTabContent from "./components/CategoryTabContent";
import CategoryTabContent from "./components/CategoryTabContent";
import QuestionModal from "./components/QuestionModal";
import { usePersonalityTest } from "./hooks/usePersonalityTest";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

interface questionData {
  category: string;
  categoryId: string;
  question: string;
  _id: string;
}

const PersonalityTest = () => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<questionData | null>(
    null,
  );
  //custom hook
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

  if (headersError) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-500">
          Failed to load categories. Please try again.
        </div>
      </AdminLayout>
    );
  }

  const handleEditClick = (q: questionData) => {
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingQuestion(null);
    }
  };

  const handleDeleteClick = async (question: questionData) => {
    setQuestionToDelete(question);
    setDeleteModal(true);
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
        {/* Top Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Personality Test
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage questions for each mental wellness category.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder={`Search in ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={headersLoading}
              className="bg-[#112B5F] hover:bg-[#0e224c] text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Question
            </Button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="mb-6 max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Category
          </label>
          <Select
            value={activeTab}
            onValueChange={setActiveTab}
            disabled={headersLoading}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 shadow-sm">
              <SelectValue
                placeholder={
                  headersLoading ? "Loading categories..." : "Select a category"
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
        <DeleteConfirmationModal
          open={deleteModal}
          onOpenChange={(open) => {
            setDeleteModal(open);
            if (!open) setQuestionToDelete(null);
          }}
          onConfirm={async () => {
            if (questionToDelete) {
              await deleteQuestions(questionToDelete._id);
            }
          }}
          title="Delete Question"
          description="Are you sure you want to delete this question? This action cannot be undone."
          isPending={loading}
        />

        {/* 2. Wrapped the content in <Tabs> to provide the missing context */}
        <Tabs value={activeTab} className="w-full">
          <CategoryTabContent
            key={activeTab}
            category={activeTab}
            loading={loading}
            filteredQuestions={filteredQuestions}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </Tabs>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modal */}
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
