import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Pencil, Trash2 } from "lucide-react";
import NoData from "@/components/common/NoData";
import { Question } from "../hooks/usePersonalityTest";
import { QuestionSkeleton } from "./QuestionSkeleton";

const CategoryTabContent = ({
    category,
    loading,
    filteredQuestions,
    onEdit,
    onDelete
}: {
    category: string;
    loading: boolean;
    filteredQuestions: Question[];
    onEdit?: (question: Question) => void;
    onDelete?: (question: Question) => void;
}) => {
    return (
        <TabsContent value={category} className="mt-0 outline-none">
            <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[640px]">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    <th className="py-3 px-4 sm:px-6">Question</th>
                                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                                {loading ? (
                                    Array.from({ length: 20 }).map((_, index) => (
                                        <QuestionSkeleton key={index} />
                                    ))
                                ) : filteredQuestions.length > 0 ? (
                                    filteredQuestions.map((q) => (
                                        <tr key={q._id} className="hover:bg-gray-50 transition">
                                            <td className="py-4 px-4 sm:px-6 font-medium text-gray-900">
                                                {q.question}
                                            </td>
                                            <td className="py-4 px-4 sm:px-6 text-right space-x-1 sm:space-x-2 whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onEdit?.(q)}
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Button>
                                                <Button
                                                    onClick={() => onDelete?.(q)}
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
                                        <td colSpan={2}>
                                            <NoData
                                                title={`No questions found for ${category}`}
                                                description="No questions found in this category."
                                                className="flex items-center justify-center"
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
};

export default CategoryTabContent;