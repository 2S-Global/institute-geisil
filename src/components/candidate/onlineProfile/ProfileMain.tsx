import React, { useState, useEffect } from "react";
import ProfileModal from "./ProfileModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
const ProfileMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", item);
    } else {
      setItem([]);
    }
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  return (
    <>
      <div className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="text-lg font-semibold">Online Profile</h5>
            <p className="mt-1 text-sm text-muted-foreground">
              Add links to your professional profiles (e.g. LinkedIn, GitHub,
              Portfolio, etc.)
            </p>
          </div>

          {/* <button
        onClick={openModal}
        className="rounded-md p-2 hover:bg-muted transition-colors"
      >
        <Pencil className="h-4 w-4" />
      </button> */}
          <Button size="sm" onClick={() => openModal()}>
            <Plus className=" h-4 w-4" />
            Add Online Profile
          </Button>
        </div>

        {Array.isArray(list) &&
          list.length > 0 &&
          list.map((item) => (
            <div key={item._id} className="mt-5 border-b pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-900">
                    {item.socialProfileName}
                  </h6>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block break-all text-sm text-blue-600 hover:underline"
                  >
                    {item.url}
                  </a>
                </div>

                <Button
                  onClick={() => openModal(item)}
                  variant="ghost"
                  size="icon"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              <div
                className="mt-2"
                dangerouslySetInnerHTML={{
                  __html: item.description,
                }}
              />
            </div>
          ))}
      </div>

      {isModalOpen && (
        <ProfileModal
          show={isModalOpen}
          onClose={closeModal}
          setItem={setItem}
          item={item}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ProfileMain;
