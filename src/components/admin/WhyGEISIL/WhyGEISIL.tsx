
import React, { useEffect, useState } from "react";
import API from "../../../lib/axios";
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
import { DynamicIcon } from "../VerificationSimplified/DynamicIcon";
import {
  VerificationFormDialog,
  FormDataState,
} from "../VerificationSimplified/VerificationFormDialog";

export interface GeisilItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  icon?: string;
  backgroundColor?: string;
  iconColor?: string;
}

const WhyGEISIL = () => {
  const [items, setItems] = useState<GeisilItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Modal / Form States
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<GeisilItem | null>(null);

  // Delete Dialog States
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await API.get("/api/why-geisil/get");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: GeisilItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteOpen(true);
  };

  const handleSubmitForm = async (formData: FormDataState) => {
    try {
      setSubmitting(true);
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        await API.put(`/api/why-geisil/update/${id}`, formData);
        toast({ title: "Success", description: "Item updated successfully." });
      } else {
        await API.post("/api/why-geisil/create", formData);
        toast({
          title: "Success",
          description: "New item created successfully.",
        });
      }
      setIsFormOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save feature item.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      setSubmitting(true);
      await API.delete(`api/why-geisil/delete/${deletingId}`);
      toast({ title: "Deleted", description: "Item removed successfully." });
      setIsDeleteOpen(false);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Why GEISIL
            </h1>
            <p className="text-sm text-slate-500">
              Manage feature highlights and platform advantages.
            </p>
          </div>
          <Button onClick={handleAddNew} className="gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Feature
          </Button>
        </div>

        {/* Feature Grid Component */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card
                key={n}
                className="p-6 border border-slate-100 shadow-sm rounded-3xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <Skeleton className="h-9 w-9 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border rounded-2xl bg-slate-50">
            No features added yet. Click "Add Feature" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => {
              const itemId = item._id || item.id || String(index);

              return (
                <Card
                  key={itemId}
                  className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all bg-white rounded-3xl p-6"
                >
                  <CardContent className="p-0 space-y-4">
                    {/* Top Row: Icon Badge (Left) + Action Buttons (Right) */}
                    <div className="flex items-start justify-between">
                      {/* Rounded Square Icon Badge */}
                      <div
                        className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{
                          backgroundColor: item.backgroundColor || "#f1f5f9",
                        }}
                      >
                        <DynamicIcon
                          icon={item.icon}
                          color={item.iconColor || "#ffffff"}
                          className="w-7 h-7"
                        />
                      </div>

                      {/* Top-Right Action Buttons matching your image style */}
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors bg-white shadow-xs"
                          title="Edit Card"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(itemId)}
                          className="h-9 w-9 rounded-xl border border-slate-200 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors bg-white shadow-xs"
                          title="Delete Card"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-2 pt-1">
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Form Dialog */}
        {/* <VerificationFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          editingItem={editingItem as any}
          submitting={submitting}
          onSubmit={handleSubmitForm}
        /> */}
        <VerificationFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          editingItem={editingItem as any}
          submitting={submitting}
          onSubmit={handleSubmitForm}
          addTitle="Add Why GEISIL Feature"
          editTitle="Edit Why GEISIL Feature"
          dialogDescription="Customize the title, description, and icons for the GEISIL feature card."
          badgeLabel="GEISIL Management"
        />

        {/* Delete Confirmation Alert */}
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                feature card from the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={submitting} className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
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

export default WhyGEISIL;
