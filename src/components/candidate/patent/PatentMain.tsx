import React, { useState, useEffect } from "react";
import PatentModal from "./PatentModal";
  import { Pencil } from "lucide-react";
const PatentMain = ({ setReload, list = [], setError, setSuccess }) => {
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

return(<>
  <div className="pt-4">
    <div className="flex items-start justify-between">
      <div>
        <h5 className="text-lg font-semibold">Patent</h5>
        <p className="mt-1 text-sm text-muted-foreground">
          Add details of patents you have filed
        </p>
      </div>

      <button
        onClick={() => openModal()}
        className="rounded-md p-2 hover:bg-muted transition-colors"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>

    {Array.isArray(list) &&
      list.length > 0 &&
      list.map((item) => (
        <div
          key={item._id}
          className="mt-5 border-b pb-4 last:border-b-0"
        >
          <div className="flex items-center gap-4">
            <h6 className="font-semibold text-gray-900">
              {item.title}
            </h6>

            <button
              onClick={() => openModal(item)}
              className="rounded-md p-1 hover:bg-muted transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block break-all text-sm text-blue-600 hover:underline"
          >
            {item.url}
          </a>

          <p className="mt-2">
            <strong>Patent office:</strong> {item.patent_office}
          </p>

          <p className="">
            <strong>Application number:</strong> {item.application_number}
          </p>

          <p className="">
            <strong>Issued on:</strong>{" "}
            {item.status === "Patent pending"
              ? "-"
              : `${monthNames[item.issue_month - 1]} ${item.issue_year}`}
          </p>

          <div
            className="mt-2 justify-content-around"
            dangerouslySetInnerHTML={{
              __html: item.description,
            }}
          />
        </div>
      ))}
  </div>

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
</>
  );
};

export default PatentMain;
