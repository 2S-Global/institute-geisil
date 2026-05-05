import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import "./style.css"
const ModalForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log({ name, email });
  };

  return (
    <Dialog.Root>
      {/* Open Button */}
      <Dialog.Trigger asChild>
        <button>Open Form</button>
      </Dialog.Trigger>

      {/* Modal */}
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />

        <Dialog.Content className="modal">
          <Dialog.Title>Contact Form</Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button type="submit">Submit</button>
          </form>

          {/* Close Button */}
          <Dialog.Close asChild>
            <button>Close</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ModalForm;