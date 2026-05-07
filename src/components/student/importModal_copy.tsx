import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export default function FromModal({open,setOpen}) {
 

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      
      {/* Trigger */}

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Large Modal */}
        <Dialog.Content  onInteractOutside={(e) => e.preventDefault()} className="fixed top-1/2 left-1/2 w-[95%] max-w-4xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border flex flex-col max-h-[90vh]">
          
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Dialog.Title className="text-xl font-semibold">
              Import New Student
            </Dialog.Title>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* BODY (scrollable) */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Example: 2-column form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <input
                type="text"
                placeholder="First Name"
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="text"
                placeholder="Last Name"
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border rounded-lg"
              />

              <input
                type="tel"
                placeholder="Phone"
                className="px-3 py-2 border rounded-lg"
              />

              <textarea
                placeholder="Address"
                className="px-3 py-2 border rounded-lg col-span-2"
              />
            </div>

          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              Save
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}