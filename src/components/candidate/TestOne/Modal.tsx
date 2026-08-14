import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import BehavioralChart from "./BehavioralChart";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
type AddQuestionModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: object;
};

export default function Modal({ open, setOpen, data }: AddQuestionModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* OVERLAY */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />

        {/* MODAL */}
        <Dialog.Content
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="
        fixed
        left-1/2
        top-1/2
        z-50
        flex
        w-[calc(100%-16px)]
        max-w-5xl
        -translate-x-1/2
        -translate-y-1/2
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-2xl
        outline-none
        max-h-[92vh]
        sm:w-[calc(100%-32px)]
      "
        >
          {/* HEADER */}
          <div className="flex shrink-0 items-start justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
            {/* TITLE */}
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900 sm:text-xl">
                Workplace Behavioral Style Assessment (DISC)
              </Dialog.Title>

              <Dialog.Description className="mt-1 text-sm text-gray-500"></Dialog.Description>
            </div>

            {/* CLOSE BUTTON */}
            <Dialog.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close"
                className="
              h-9
              w-9
              shrink-0
              rounded-lg
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-900
            "
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          {/* BODY */}
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full p-3 sm:p-5 lg:p-6">
              <BehavioralChart data={data} />
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
