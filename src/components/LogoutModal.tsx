import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/hooks/use-logout";
import { useState } from "react";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const { logout } = useLogout();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout confirmation:", error);
    } finally {
      setIsPending(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">Sign Out</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground text-sm">
            Are you sure you want to sign out of your account? Any unsaved progress may be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 flex gap-2">
          <AlertDialogCancel disabled={isPending} className="flex-1">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isPending}
            className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Signing out..." : "Sign out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
