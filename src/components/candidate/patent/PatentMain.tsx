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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h5 className="text-lg font-semibold">Patent</h5>
          <p className="mt-1 text-sm text-muted-foreground">
            Add details of patents you have filed
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => openModal()}
          className="flex items-center gap-1 shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Patent
        </Button>
      </div>

      {Array.isArray(list) && list.length > 0 ? (
        list.map((item) => {
          const hasMetadata = !!(
            item.patent_office ||
            item.application_number ||
            item.status === "Patent pending" ||
            item.issue_month ||
            item.issue_year
          );

          return (
            <Card key={item._id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base font-semibold">
                    {item.title}
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
              {(hasMetadata || item.description) && (
                <CardContent className="space-y-2">
                  {item.patent_office && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="font-semibold text-foreground">
                        Patent office:
                      </strong>{" "}
                      {item.patent_office}
                    </p>
                  )}
                  {item.application_number && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="font-semibold text-foreground">
                        Application number:
                      </strong>{" "}
                      {item.application_number}
                    </p>
                  )}
                  {(item?.status === "Patent pending" ||
                    item?.issue_month ||
                    item?.issue_year) && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="font-semibold text-foreground">
                        Issued on:
                      </strong>{" "}
                      {item?.status === "Patent pending"
                        ? "Patent pending"
                        : `${item?.issue_month ? monthNames[item.issue_month - 1] : ""} ${item.issue_year ? item.issue_year : ""}`}
                    </p>
                  )}
                  {item.description && (
                    <div
                      className={`text-sm text-muted-foreground text-justify ${
                        hasMetadata ? "mt-3 pt-3 border-t" : ""
                      }`}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </CardContent>
              )}
            </Card>
          );
        })
      ) : (
        <div className="flex flex-1 items-center justify-center w-full">
          <div className="w-full border border-dashed border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
            <p className="text-sm">No Patents added yet.</p>
          </div>
        </div>
      )}

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