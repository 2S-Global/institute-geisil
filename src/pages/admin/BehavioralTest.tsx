import React, { useEffect, useState, useMemo } from "react";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import FormModal from "@/components/admin/BehavioralTest/FormModal";
import Pagination from "@/components/admin/BehavioralTest/Pagination";
import { useQuestion } from "./hooks/useQuestion";

const BehavioralTest = () => {
  const {
    addQuestion,
    editQuestion,
    loading: testAddLoading,
    error: respError,
    data: respData,
  } = useQuestion();

  const { toast } = useToast();

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(false);

  // selected data
  const [selectedData, setSelectedData] = useState();

  // Delete Confirmation Alert Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  //pagination

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filteredData = useMemo(() => {
    return data.filter((v) =>
      (v.question || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, data]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  function createUser() {
    setSelectedData(null);
    setOpen(true);
  }

  // Fetch Services on Component Mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/mental-test");

      const result = response.data;
      if (result && Array.isArray(result.data)) {
        setData(result.data);
      } else if (Array.isArray(result)) {
        setData(result);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch record details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open Update Modal and load selected record data
  const handleOpenUpdate = (record) => {
    setSelectedData(record);
    setOpen(true);
  };

  // Trigger Delete Confirmation Dialog
  const confirmDelete = (record) => {
    setDeleteData(record);
    setIsDeleteDialogOpen(true);
  };

  // Handle Delete
  const handleDelete = async () => {
    if (!deleteData) return;

    try {
      const response = await API.delete(`/api/mental-test/${deleteData._id}`);

      if (response.data?.success) {
        setData((prev) => prev.filter((s) => s._id !== deleteData._id));
        toast({
          title: "Success",
          description:
            response.data.message || "Question deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to delete record.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting the record.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteData(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
        {/* Top Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Behavioral Test
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              A step toward evaluating skills, attitudes, and workplace
              behaviors
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search data..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <Button onClick={createUser} className="bg-[#112B5F] text-white">
              <Plus className="w-4 h-4" /> Add Question
            </Button>
          </div>
        </div>

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
                    Array.from({ length: 2 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan="3" className="py-4 px-4 sm:px-6">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((record) => (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap">
                          {record.question}
                        </td>

                        <td className="py-4 px-4 sm:px-6 text-right space-x-1 sm:space-x-2 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenUpdate(record)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(record)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-8 text-gray-400"
                      >
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        {/* Pagination with page numbers */}
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

        <FormModal
          open={open}
          setOpen={setOpen}
          selectedData={selectedData}
          loading={testAddLoading}
          onSave={async (data) => {
            if (selectedData) {
              try {
                const payload = {
                  question: data.question,
                  options: [
                    data.option1,
                    data.option2,
                    data.option3,
                    data.option4,
                  ],
                  correctOption: data.correctAnswer,
                };
                const result = await editQuestion(payload, selectedData._id);
                if (result.success) {
                  toast({
                    title: "Success",
                    description: result.message || "",
                  });
                  setRefresh((pre) => !pre);
                }
              } catch (err) {
                console.log("UPDATE", err);
                toast({
                  title: "Error",
                  description: "Something went wrong.",
                  variant: "destructive",
                });
              }
            } else {
              console.log("CREATE", data);
              try {
                const payload = {
                  question: data.question,
                  options: [
                    data.option1,
                    data.option2,
                    data.option3,
                    data.option4,
                  ],
                  correctOption: data.correctAnswer,
                };
                const result = await addQuestion(payload);
                if (result.success) {
                  toast({
                    title: "Success",
                    description: result.message || "",
                  });
                  setRefresh((pre) => !pre);
                }
              } catch (err) {
                toast({
                  title: "Error",
                  description: "Something went wrong.",
                  variant: "destructive",
                });
              }
            }
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent className="max-w-[90%] sm:max-w-lg rounded-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                record &quot;{deleteData?.question}&quot; from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel
                onClick={() => setIsDeleteDialogOpen(false)}
                className="mt-0"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default BehavioralTest;
