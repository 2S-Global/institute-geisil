import React, { useEffect, useState } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleX, Code2, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VerificationCard, VerificationItem } from "./VerificationCard";
import {
  VerificationFormDialog,
  FormDataState,
} from "./VerificationFormDialog";

const VerificationSimplified: React.FC = () => {
  const [items, setItems] = useState<VerificationItem[]>([]);
  const [rawApiResponse, setRawApiResponse] = useState<unknown>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VerificationItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/api/verification-services/get-all-services",
      );
      setRawApiResponse(response.data);

      const apiData = response.data?.data;
      setItems(Array.isArray(apiData) ? apiData : []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to fetch verification services.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (item: VerificationItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (formData: FormDataState) => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in both title and description.",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Check your console to verify formData contains iconColor before sending!
      console.log("Sending payload to backend:", formData);

      if (editingItem) {
        await API.patch(
          `/api/verification-services/update-service/${editingItem._id}`,
          formData, // <-- Must include formData.iconColor
        );
        toast({
          title: "Success",
          description: "Service updated successfully!",
        });
      } else {
        await API.post("/api/verification-services/", formData);
        toast({
          title: "Success",
          description: "Service created successfully!",
        });
      }

      setIsFormOpen(false);
      fetchItems(); // Refreshes item list from backend
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.response?.data?.message ||
          "Failed to save verification service.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      setSubmitting(true);
      await API.delete(
        `/api/verification-services/delete-service/${deletingId}`,
      );
      toast({ title: "Deleted", description: "Service deleted successfully!" });
      setIsDeleteDialogOpen(false);
      fetchItems();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.response?.data?.message || "Failed to delete item.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Verification Simplified
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage identity verification CMS cards shown on the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button
            variant="outline"
            onClick={() => setShowRawData(!showRawData)}
            className="gap-2 text-xs"
          >
            <Code2 className="h-4 w-4" />
            {showRawData ? "Hide Raw API" : "Show Raw API"}
          </Button> */}

          <Button onClick={handleOpenAddModal}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Raw API JSON Inspector */}
      {showRawData && (
        <div className="border border-slate-800 rounded-xl bg-slate-950 p-4 text-slate-100 font-mono text-xs overflow-auto max-h-[300px]">
          <pre>{JSON.stringify(rawApiResponse, null, 2)}</pre>
        </div>
      )}

      {/* Cards Grid / Loading State / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <Card
              key={index}
              className="rounded-3xl border shadow-sm p-6 space-y-4"
            >
              <Skeleton className="h-14 w-14 rounded-2xl" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-gray-50/50">
          <CircleX className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-lg font-semibold">No verification items found</p>
          <Button
            onClick={handleOpenAddModal}
            variant="outline"
            className="mt-4"
          >
            <Plus className="h-4 w-4 mr-2" /> Add First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <VerificationCard
              key={item._id}
              item={item}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <VerificationFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingItem={editingItem}
        submitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Card</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this verification service? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={submitting}
              className="gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VerificationSimplified;


