import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import API from "../../../lib/axios";
import { Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
const ProfileModal = ({
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
    socialProfile: item.socialProfile || "",
    url: item.url || "",
    description: item.description || "",
  });

  /*   const [editorState, setEditorState] = useState(() => {
    if (item.description) {
      const blocksFromHtml = htmlToDraft(item.description);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap
        );
        return EditorState.createWithContent(contentState);
      }
    }
    return EditorState.createEmpty();
  }); */

  const [isGenerated, setIsGenerated] = useState(false); // Track button presses
  const token = localStorage.getItem("token");
  const apiurl = import.meta.env.VITE_API_URL;

  const [listsocialProfile, setListsocialProfile] = useState([]);

  const fetchsocialProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("candidate_token");
      const response = await API.get(`/api/sql/dropdown/social_profile`);
      if (response.status == 200) {
        setListsocialProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchsocialProfile();
  }, [apiurl]);

  const [loading, setLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [saving, setSaving] = useState(false);
  const validateForm = () => {
    if (
      !formData.socialProfile ||
      formData.socialProfile.toString().trim() === ""
    ) {
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
    if (isGenerated) {
      setFormData({
        ...formData,
        description: "",
      });

      setIsGenerated(false);
    } else {
      const generatedText =
        "Developed and deployed a scalable web application using React.js and Node.js, ensuring high performance and seamless user experience. Designed and implemented RESTful APIs, optimized database queries, and integrated third-party services for enhanced functionality. Focused on system architecture, security, and responsive UI/UX to deliver a robust and efficient solution.";

      setFormData({
        ...formData,
        description: `<p>${generatedText}</p>`,
      });

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
          `/api/candidate/accomplishments/edit_online_profile`,
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
            "Error saving personal details:",
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
          `/api/candidate/accomplishments/add_online_profile`,
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
            "Error saving personal details:",
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

  const validateURL = (url) => {
    try {
      const pattern = new URL(url); // Will throw if invalid
      return true;
    } catch {
      return false;
    }
  };

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
        `/api/candidate/accomplishments/delete_online_profile`,
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
        transition: all 0.3s ease-in-out;
      }

      .suggestion-btn:hover {
        background-color: #d2e3fc;
      }

      .suggestion-btn svg {
        width: 16px;
        height: 16px;
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
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl">
              <span>Online Profiles</span>

              {formData?._id && (
                <Trash2
                  size={18}
                  className="cursor-pointer text-red-500 hover:text-red-600 mt-4"
                  onClick={handleConfirmDelete}
                />
              )}
            </DialogTitle>

            <DialogDescription>
              Add links to your professional profiles (e.g. LinkedIn, GitHub,
              Portfolio, etc.)
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            "loading"
          ) : (
            <div className="space-y-5 pt-2">
              {/* Social Profile */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Social Profile <span className="text-red-500">*</span>
                </label>

                <select
                  className="w-full rounded-md border p-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.socialProfile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialProfile: e.target.value,
                    })
                  }
                >
                  <option value="">Select Social Profile</option>

                  {listsocialProfile.map((profile, index) => (
                    <option key={index} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="Enter your social profile URL"
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

              {/* Description */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Description</label>

                {/* Your Editor goes here */}
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={(value) => {
                    setFormData({
                      ...formData,
                      description: value,
                    });

                    setIsGenerated(false);
                  }}
                  placeholder="Type here..."
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline", "strike"],
                      [{ script: "super" }, { script: "sub" }],
                    ],
                  }}
                  className="rounded-md"
                />

                <button
                  type="button"
                  className="suggestion-btn"
                  onClick={handleGenerateHeadline}
                >
                  <Sparkles size={16} />
                  {isGenerated ? "Clear" : "Help me write"}
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setFormData(null);
                onClose();
              }}
            >
              Cancel
            </Button>

            <div className="relative inline-flex group">
              <Button
                type="submit"
                onClick={handleSave}
                disabled={!isFormValid || saving}
                
              >
                {item._id
                  ? saving
                    ? "Updating..."
                    : "Update"
                  : saving
                    ? "Saving..."
                    : "Save"}
              </Button>

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

export default ProfileModal;
