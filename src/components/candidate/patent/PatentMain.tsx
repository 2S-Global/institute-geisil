import React, { useState } from "react";
import PatentModal from "./PatentModal";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PatentMain = ({ setReload, list = [], setError, setSuccess }) => {
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

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg font-semibold">Patent</h5>
          <p className="text-sm text-muted-foreground">
            Add details of patents you have filed
          </p>
        </div>

        {/* Show 'Add' button only if list is empty */}
        {(!Array.isArray(list) || list.length === 0) && (
          <Button size="sm" onClick={() => openModal()} >
            <Plus className="mr-2 h-4 w-4" /> Add Patent
          </Button>
        )}
      </div>

      {Array.isArray(list) &&
        list.map((item) => (
          <Card key={item._id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {item.url}
                  </a>
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => openModal(item)}>
                <Pencil className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p><strong>Patent office:</strong> {item.patent_office}</p>
              <p><strong>Application number:</strong> {item.application_number}</p>
              <p>
                <strong>Issued on:</strong>{" "}
                {item.status === "Patent pending"
                  ? "Patent pending"
                  : `${monthNames[item.issue_month - 1]} ${item.issue_year}`}
              </p>
              <div
                className="mt-2 pt-2 border-t"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </CardContent>
          </Card>
        ))}

      {isModalOpen && (
        <PatentModal
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

export default PatentMain;