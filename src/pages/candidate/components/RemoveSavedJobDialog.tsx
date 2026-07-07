import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface RemoveSavedJobDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveSavedJobDialog = ({
  open,
  onClose,
  onConfirm,
}: RemoveSavedJobDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove from saved?</DialogTitle>
          <DialogDescription>
            This job will be removed from your saved list. You can always find it again by browsing jobs.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
