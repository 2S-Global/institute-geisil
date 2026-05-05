import * as Dialog from "@radix-ui/react-dialog";

export default function TailwindModal() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
          Open Modal
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-lg">
          
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <Dialog.Title className="text-lg font-semibold">
              Modal Title
            </Dialog.Title>

            {/* ❌ CLOSE BUTTON */}
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-black text-xl">
                ✕
              </button>
            </Dialog.Close>
          </div>

          {/* BODY */}
          <div className="p-4 text-sm text-gray-600">
            This is your modal content using Tailwind CSS.
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-2 border-t px-4 py-3">
            <Dialog.Close asChild>
              <button className="px-3 py-1.5 rounded-md border text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
            </Dialog.Close>

            <button className="px-3 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              Save
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}