import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import Cropper from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useHandleProfilePictureRemove } from "./hooks/useHandleProfilePitcureRemove";
const FormModal = ({ show, onClose, setRefresh, imageSrc }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(
    imageSrc || "/images/resource/no_user.png",
  );



  const { removeImage, isLoading: isLoadingRemove, error: errorRemove, data: dataRemove } = useHandleProfilePictureRemove()

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(null);

  const [file, setFile] = useState(null);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  const [zoom, setZoom] = useState(1);

  const [croppedPixels, setCroppedPixels] = useState(null);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // Select image

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");

      return;
    }

    setFile(selectedFile);

    setImage(URL.createObjectURL(selectedFile));

    setError("");
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

      setPreview(imageUrl);

      setSelectedImage(imageUrl);

      setSuccess(response.data.message || "Image uploaded successfully");
      toast({
        title: "Success",
        description: response.data.message || "Image uploaded successfully",
      });

      setRefresh((v) => v + 1);

      setImage(null);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.log(err);

      setError("Failed to upload image");
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

          {/* Actions */}

          <div className="border rounded-lg p-4 text-center bg-muted/30">
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-4 py-2 bg-primary text-white rounded-md cursor-pointer ${loading || isLoadingRemove ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              Change Photo
            </label>

            <input
              id="file-upload"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              hidden
              disabled={loading || isLoadingRemove}
              onChange={handleFileChange}
            />

            {image && (
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                onClick={uploadImage}
                disabled={loading || isLoadingRemove}
              >
                {loading ? "Uploading..." : "Save Photo"}
              </button>
            )}

            <button
              type="button"
              className="ml-2 px-4 py-2 border border-red-500 text-red-500 rounded-md disabled:opacity-50"
              disabled={loading || isLoadingRemove}
              onClick={async () => {
                const result = await removeImage();
                if (result && result.success) {
                  setSelectedImage("/images/resource/no_user.png");
                  toast({
                    title: "Success",
                    description: result.message || "Profile picture removed successfully",
                  });
                  setRefresh((v: any) => v + 1);
                  setImage(null);
                  setPreview(null);
                  setFile(null);
                  onClose();
                } else {
                  toast({
                    title: "Error",
                    variant: "destructive",
                    description: result?.error || "Failed to remove profile picture",
                  });
                }
              }}
            >
              {isLoadingRemove ? "Deleting..." : "Delete Photo"}
            </button>

            <p className="text-xs text-muted-foreground mt-3">
              Supported file formats: PNG, JPG, JPEG, GIF — up to 2MB.
            </p>
          </div>

          {/* Preview */}

          {/*    {preview && (
            <div className="flex justify-center">
              <div
                className="rounded-full overflow-hidden border"
                style={{
                  width: 140,
                  height: 140,
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )} */}

          {/* Message */}

          {/*   {success && (
            <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )} */}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading || isLoadingRemove}>
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

      canvas.toBlob(
        (blob) => {
          resolve(
            new File(
              [blob],

              "profile.png",

              {
                type: "image/png",
              },
            ),
          );
        },

        "image/png",
      );
    };
  });
}

export default FormModal;
