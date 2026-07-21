
import React, { useState } from "react";
import ProfileModal from "./ProfileModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileMain = ({ setReload, list = [], setError, setSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [item, setItem] = useState([]);

  const openModal = (Edit_item) => {
    setItem(Edit_item || []);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">Presentation</h5>
          <p className="text-sm text-muted-foreground">
            Add links to your online presentations (e.g. SlideShare, etc.)
          </p>
        </div>

        {/* Show 'Add' button only if list is empty */}
        {(!Array.isArray(list) || list.length === 0) && (
          <Button size="sm" onClick={() => openModal()} >
            <Plus className="h-4 w-4" /> Add Presentation
          </Button>
        )}
      </div>

      {Array.isArray(list) &&
        list.map((item) => (
          <Card key={item._id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{item.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openModal(item)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline break-all"
              >
                {item.url}
              </a>
              <div
                className="mt-2 text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </CardContent>
          </Card>
        ))}

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
    </div>
  );
};

export default ProfileMain;