import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    if (Edit_item) {
      setItem(Edit_item);
      console.log("Selected Item:", Edit_item);
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
      <div className="pt-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h5 className="text-lg font-semibold">Online Profile</h5>
            <p className="mt-1 text-sm text-muted-foreground">
              Add links to your professional profiles (e.g. LinkedIn, GitHub,
              Portfolio, etc.)
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => openModal()}
            className="flex items-center gap-1 shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Online Profile
          </Button>
        </div>

        {Array.isArray(list) && list.length > 0 ? (
          list.map((item) => (
            <Card key={item._id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base font-semibold">
                    {item.socialProfileName}
                  </CardTitle>
                  <CardDescription>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {item.url}
                    </a>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => openModal(item)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardHeader>
              {item.description && (
                <CardContent>
                  <div
                    className="text-sm text-muted-foreground text-justify"
                    dangerouslySetInnerHTML={{
                      __html: item.description,
                    }}
                  />
                </CardContent>
              )}
            </Card>
          ))
        ) : (
          <div className="flex flex-1 items-center justify-center w-full">
            <div className="w-full border border-dashed border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <p className="text-sm">No Online Profiles added yet.</p>
            </div>
          </div>
        )}
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