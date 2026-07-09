import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import API from "../../../lib/axios";
import { Trash2 } from "lucide-react";
import Loading from "@/components/common/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
//import { EditorState, ContentState } from "draft-js";
//import "draft-js/dist/Draft.css";
//import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
//import draftToHtml from "draftjs-to-html";
//import { convertToRaw } from "draft-js";
//import htmlToDraft from "html-to-draftjs";

/* const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
); */
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
const PatentModal = ({
  setReload,
  show,
  onClose,
  item,
  setError,
  setSuccess,
}) => {
  if (!show) return null;
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    _id: item._id || "",
    title: item.title || "",
    url: item.url || "",
    patent_office: item.patent_office || "",
    status: item.status || "",
    application_number: item.application_number || "",
    issue_year: item.issue_year || "",
    issue_month: item.issue_month || "",
    description: item.description || "",
  });

  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("token");
  const apiurl = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const validateURL = (url) => {
    try {
      const pattern = new URL(url); // Will throw if invalid
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.title || formData.title.toString().trim() === "") {
      return false;
    }
    if (!formData.url || formData.url.toString().trim() === "") {
      return false;
    }
    if (formData.url && !validateURL(formData.url)) {
      return false;
    }

    return true;
  };
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleGenerateHeadline = () => {
    console.log(
      "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
      isGenerated,
    );
    if (isGenerated) {
      setFormData((prev) => ({
        ...prev,
        description: "",
      }));
      setIsGenerated(false);
    } else {
      const generatedText = `
      <p>Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience.</p>
      <p>Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality.</p>
      <p>Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.</p>
    `;

      setFormData((prev) => ({
        ...prev,
        description: generatedText,
      }));
      setIsGenerated(true);
    }
  };

  const handleSave = async () => {
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    console.log("Saving personal details:", formData);
    setSaving(true);
    /* /api/candidate/accomplishments/add_online_profile */
    try {
      if (formData._id) {
        const response = await API.put(
          `/api/candidate/accomplishments/update_patent`,
          formData,
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
            toast({
            title: "Success",
            description: response?.data?.message || "",
          });
        } else {
          console.error(
            "Error saving Presentation details:",
            response.data.message,
          );
          setSaving(false);
          setError(response.data.message);
            toast({
            title: "Error",
            variant: "destructive",
            description: response?.data?.message || "",
          });
        }
      } else {
        const response = await API.post(
          `/api/candidate/accomplishments/add_patent`,
          formData,
        );
        if (response.data.success) {
          setSaving(false);
          onClose();
          setReload(true);
          setSuccess(response.data.message);
            toast({
            title: "Success",
            description: response?.data?.message || "",
          });
        } else {
          console.error(
            "Error saving presentation details:",
            response.data.message,
          );
          setSaving(false);
          setError(response.data.message);
            toast({
            title: "Error",
            variant: "destructive",
            description: response?.data?.message || "",
          });
        }
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
      setSaving(false);
    }
  };

  const [urlError, setUrlError] = useState("");

  const handleBlur = () => {
    if (!validateURL(formData.url)) {
      setUrlError("Please enter a valid URL (include https://)");
    } else {
      setUrlError("");
    }
  };
  const handleDelete = async () => {
    setLoading(true);
    if (!formData._id) {
      console.error("No education record selected for deletion.");
      return;
    }
    if (!token) {
      console.error("Authorization token is missing. Please log in.");
      return;
    }
    try {
      setSaving(true);

      /* /api/candidate/accomplishments/delete_online_profile */
      const response = await API.delete(
        `/api/candidate/accomplishments/delete_patent`,
        {
          data: {
            _id: formData._id,
          },
        },
      );

      if (response.data.success) {
        //setSaving(false);
        onClose();
        setReload(true);
        setLoading(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting education record:", error);
      setError("An error occurred while deleting the record.Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      handleDelete();
    }
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
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // getMonth() is 0-indexed

  const generateMonthOptions = (selectedYear) => {
    const maxMonth = selectedYear === currentYear ? currentMonth : 12;
    return monthNames.slice(0, maxMonth).map((month, index) => (
      <option key={index + 1} value={index + 1}>
        {month}
      </option>
    ));
  };

  return (
    <>
      <style>
        {`
      .custom-textarea::placeholder {
        color: #c7c5c5 !important;
        font-size: 15px !important;
      }

      .suggestion-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background-color: #e8f0fe;
        color: #1a73e8;
        border-radius: 20px;
        padding: 6px 14px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all .3s ease;
      }

      .suggestion-btn:hover {
        background: #d2e3fc;
      }

      .suggestion-btn svg {
        width:16px;
        height:16px;
      }
    `}
      </style>

      <Dialog
        open={show}
        onOpenChange={(open) => {
          if (!open) {
            setFormData(null);
            onClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl">
              <span>Patent</span>

              {formData?._id && (
                <Trash2
                  size={18}
                  className="cursor-pointer text-red-500 hover:text-red-600 mt-4"
                  onClick={handleConfirmDelete}
                />
              )}
            </DialogTitle>

            <DialogDescription>
              Add details of patents you have filed.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            'loading'
          ) : (
            <div className="space-y-5 pt-2">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Presentation title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {/* URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  URL <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  className={`w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary ${
                    urlError ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your patent URL"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      url: e.target.value,
                    })
                  }
                  onBlur={handleBlur}
                />

                {urlError && <p className="text-sm text-red-500">{urlError}</p>}
              </div>

              {/* Patent Office */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Patent Office</label>

                <input
                  type="text"
                  className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Patent office"
                  value={formData.patent_office}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      patent_office: e.target.value,
                    })
                  }
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Patent issued"
                      checked={formData.status === "Patent issued"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                    />
                    Patent issued
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="Patent pending"
                      checked={formData.status === "Patent pending"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                    />
                    Patent pending
                  </label>
                </div>
              </div>

              {/* Application Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Application Number
                </label>

                <input
                  type="text"
                  className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter Application number"
                  value={formData.application_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      application_number: e.target.value,
                    })
                  }
                />
              </div>

              {formData.status !== "Patent pending" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date</label>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      className="rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.issue_year || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issue_year: e.target.value,
                          issue_month: "",
                        })
                      }
                    >
                      <option value="">Select Year</option>

                      {Array.from({ length: 30 }, (_, i) => {
                        const year = currentYear - i;

                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>

                    <select
                      className="rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.issue_month || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          issue_month: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Month</option>

                      {generateMonthOptions(parseInt(formData.issue_year))}
                    </select>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Description</label>

                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: value,
                    }));

                   
                  }}
                  placeholder="Type here..."
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                  formats={[
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "list",
                    "bullet",
                    "link",
                  ]}
                  className="bg-white"
                />

                <button
                  type="button"
                  className="suggestion-btn"
                  onClick={handleGenerateHeadline}
                >
                  <Sparkles size={16} />
                  {isGenerated ? "Clear" : "Help me write"}
                </button>
                {/*    <button
                          type="button"
                          className="suggestion-btn"
                          onClick={handleGenerateHeadline}
                        >
                          <Sparkles size={16} />
                          {isGenerated ? "Clear" : "Help me write"}
                        </button> */}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={() => {
                setFormData(null);
                onClose();
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <div className="relative inline-flex group">
              <button
                type="submit"
                onClick={handleSave}
                disabled={!isFormValid || saving}
                className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:cursor-not-allowed disabled:bg-[#27406F]/50"
              >
                {item._id
                  ? saving
                    ? "Updating..."
                    : "Update"
                  : saving
                    ? "Saving..."
                    : "Save"}
              </button>

              {!isFormValid && (
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
                  Please fill all required fields.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatentModal;
