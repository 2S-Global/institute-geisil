import React, { useEffect, useState } from "react";
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

import UserModal from "@/components/admin/BehavioralTest/FormModal";
import { useAddQuestion } from "./hooks/useAddQuestion";

const BehavioralTest = () => {


  const { addQuestion, loading: testAddLoading, error: testError, data: testData } = useAddQuestion()


  const { toast } = useToast();


  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Delete Confirmation Alert Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Active Form Data State matching your API structure
  const [currentService, setCurrentService] = useState({
    _id: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const users = [
    {
      id: "1",
      name: "John",
      email: "john@test.com",
    },
  ];

  function editUser(user: any) {
    setSelectedUser(user);

    setOpen(true);
  }

  function createUser() {
    setSelectedUser(null);

    setOpen(true);
  }

  // Fetch Services on Component Mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/home/get-service-details");

      const result = response.data;
      if (result && Array.isArray(result.data)) {
        setServices(result.data);
      } else if (Array.isArray(result)) {
        setServices(result);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast({
        title: "Error",
        description: "Failed to fetch service details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Changes for Modals
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentService((prev) => ({ ...prev, [name]: value }));
  };

  // Open Update Modal and load selected service data
  const handleOpenUpdate = (service) => {
    setCurrentService({
      _id: service._id || "",
      title: service.title || "",
      description: service.description || "",
    });
    setIsUpdateModalOpen(true);
  };

  // Handle Add New Service Form Submission
  const handleSaveNew = async (e) => {
    e.preventDefault();
    if (!currentService.title.trim()) return;

    try {
      const response = await API.post("/api/home/add-service-details", {
        title: currentService.title,
        description: currentService.description,
      });

      if (response.data?.success) {
        setIsAddModalOpen(false);
        fetchServices();
        toast({
          title: "Success",
          description: response.data.message || "Service added successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to add service.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      toast({
        title: "Error",
        description: "Something went wrong while adding the service.",
        variant: "destructive",
      });
    }
  };

  // Handle Update Service Form Submission using PUT and URL parameter ID
  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        _id: currentService._id,
        title: currentService.title,
        description: currentService.description,
      };

      const response = await API.put(
        `/api/home/update-service-details/${currentService._id}`,
        payload,
      );

      if (response.data?.success) {
        setIsUpdateModalOpen(false);
        fetchServices();
        toast({
          title: "Success",
          description: response.data.message || "Service updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to update service.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating service:", error);
      toast({
        title: "Error",
        description: "Something went wrong while updating the service.",
        variant: "destructive",
      });
    }
  };

  // Trigger Delete Confirmation Dialog
  const confirmDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  // Handle Delete Service execution using PUT /api/home/delete-service-details/:id
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await API.put(
        `/api/home/delete-service-details/${serviceToDelete._id}`,
      );

      if (response.data?.success) {
        setServices((prev) =>
          prev.filter((s) => s._id !== serviceToDelete._id),
        );
        toast({
          title: "Success",
          description: response.data.message || "Service deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: response.data?.message || "Failed to delete service.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      toast({
        title: "Error",
        description: "Something went wrong while deleting the service.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  // Filtered Services List based on Search Input
  const filteredServices = services.filter((s) =>
    (s.title || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
        {/* Top Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Manage Services
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Configure and manage services displayed across your platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <Button
              onClick={createUser}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add New Service
            </Button>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">Title</th>
                    <th className="py-3 px-4 sm:px-6">Description</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={index}>
                        <td colSpan="3" className="py-4 px-4 sm:px-6">
                          <Skeleton className="h-6 w-full" />
                        </td>
                      </tr>
                    ))
                  ) : filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <tr
                        key={service._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-4 sm:px-6 font-medium text-gray-900 whitespace-nowrap">
                          {service.title}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-gray-500 max-w-xs sm:max-w-md truncate">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          />
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-right space-x-1 sm:space-x-2 whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenUpdate(service)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(service)}
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
                        No services found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <UserModal
          open={open}
          setOpen={setOpen}
          user={selectedUser}
          loading={testAddLoading}
          onSave={async (data) => {
            if (selectedUser) {
              console.log("UPDATE", selectedUser.id, data);
            } else {
              console.log("CREATE", data);
              const payload = {
                question: data.question,
                options: [data.option1, data.option2, data.option3, data.option4],
                correctOption: data.correctAnswer,
              };
              await addQuestion(payload);
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
                service &quot;{serviceToDelete?.title}&quot; from the server.
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
                onClick={handleDeleteService}
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
