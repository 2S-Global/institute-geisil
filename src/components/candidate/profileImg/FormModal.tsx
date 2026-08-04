

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import Cropper from "react-easy-crop";
import { useAuth } from "../../context/AuthContext.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const FormModal = ({ show, onClose, setRefresh, imageSrc }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(
    imageSrc || "/images/resource/no_user.png",
  );
  const { setrefresh } = useAuth();

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select image
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Image size should be less than 2MB",
      });
      return;
    }

    setFile(selectedFile);
    setImage(URL.createObjectURL(selectedFile));
  };

  // Crop complete
  const cropComplete = (area, pixels) => {
    setCroppedPixels(pixels);
  };

  // Upload API
  const uploadImage = async () => {
    try {
      setLoading(true);

      const croppedFile = await createCroppedImage(image, croppedPixels);

      const formData = new FormData();

      formData.append("profile_picture", croppedFile);

      const response = await API.post(
        `${apiurl}/api/useraction/update-profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const imageUrl = URL.createObjectURL(croppedFile);

      setSelectedImage(imageUrl);
      onClose();

      if (response?.data?.profilePicture) {
        localStorage.setItem("profilePicture", response.data.profilePicture);
        setrefresh((p) => p + 1);
      }

      setRefresh((v) => v + 1);
      setImage(null);

      setTimeout(() => {
        toast({
          title: "Success",
          description: response.data.message || "Image uploaded successfully",
        });
      }, 500);
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to upload image",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Upload a Recent Photo
          </DialogTitle>

          <DialogDescription>
            A profile photo enhances memorability and helps demonstrate
            professionalism.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Profile Image */}
          <div className="flex justify-center">
            {image ? (
              <div
                className="relative rounded-full overflow-hidden border"
                style={{
                  width: 300,
                  height: 300,
                }}
              >
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={cropComplete}
                />
              </div>
            ) : (
              <div
                className="rounded-full overflow-hidden border"
                style={{
                  width: 140,
                  height: 140,
                }}
              >
                <img
                  src={selectedImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Zoom */}
          {image && (
            <div className="px-5">
              <label className="text-sm text-muted-foreground">Zoom</label>

              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          )}

          {/* Actions - Single Conditional Button */}
          <div className="border rounded-lg p-4 text-center bg-muted/30 flex items-center justify-center gap-3 flex-wrap">
            <input
              id="file-upload"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              hidden
              disabled={loading}
              onChange={handleFileChange}
            />

            {!image ? (
              <label
                htmlFor="file-upload"
                className={`inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-sm rounded-md cursor-pointer transition-colors ${
                  loading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                Change Photo
              </label>
            ) : (
              <Button type="button" onClick={uploadImage} disabled={loading}>
                {loading ? "Uploading..." : "Save Photo"}
              </Button> 
            )}

            <div className="w-full">
              <p className="text-xs text-muted-foreground mt-2">
                Supported file formats: PNG, JPG, JPEG, GIF — up to 2MB.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Create circular cropped file
function createCroppedImage(imageSrc, crop) {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.beginPath();
      ctx.arc(crop.width / 2, crop.height / 2, crop.width / 2, 0, Math.PI * 2);

      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height,
      );

      canvas.toBlob((blob) => {
        resolve(
          new File([blob], "profile.png", {
            type: "image/png",
          }),
        );
      }, "image/png");
    };
  });
}

export default FormModal;
