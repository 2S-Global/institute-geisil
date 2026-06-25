import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import noImage from "../../assets/img/no-man.jpg";
const FormModal = ({ show, onClose, data = {}, setRefresh, imageSrc}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  const [selectedImage, setSelectedImage] = useState(
    imageSrc || '/images/resource/no_user.png'
  );
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token");
  }
console.log('show',show)
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);

      // Revoke object URL on component unmount to prevent memory leaks
      return () => URL.revokeObjectURL(imageUrl);
    }
  };

  // Upload image API call
  const uploadImage = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await API.post(
        `${apiurl}/api/useraction/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload successful:", response.data);
      setSuccess("Image uploaded successfully!");
      //setSuccess_main("Image uploaded successfully!");
      setRefresh(v=>v+1);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (error) {
      console.log("Upload failed:", error);
      setError("Failed to upload image. Please try again.");
      //setError_main("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log(error);
 // if (!show) return null;

  return (
<Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">

    {/* Header */}
    <DialogHeader>
      <DialogTitle className="font-display text-xl">
        Upload a Recent Photo
      </DialogTitle>

      <DialogDescription>
        A profile photo enhances memorability and helps demonstrate
        professionalism.
      </DialogDescription>
    </DialogHeader>

    {/* Body */}
    <div className="space-y-5 pt-2">

      {/* Profile Image */}
      <div className="flex justify-center">
        <div
          className="rounded-full overflow-hidden border"
          style={{ width: 140, height: 140 }}
        >
          <img
            src={selectedImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Upload Actions */}
      <div className="border rounded-lg p-4 text-center bg-muted/30">
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer"
        >
          Change Photo
        </label>

        <input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg, image/gif"
          hidden
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="ml-2 px-4 py-2 border border-red-500 text-red-500 rounded-md"
          onClick={() => {
            setSelectedImage("/images/resource/no_user.png");
            setFile(null);
          }}
        >
          Delete Photo
        </button>

        <p className="text-xs text-muted-foreground mt-3">
          Supported file formats: PNG, JPG, JPEG, GIF — up to 2MB.
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>

    {/* Footer */}
    <DialogFooter className="gap-2 pt-4">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>

      {file && (
        <Button
          onClick={uploadImage}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Save"}
        </Button>
      )}
    </DialogFooter>

  </DialogContent>
</Dialog>
  );
};

export default FormModal;
