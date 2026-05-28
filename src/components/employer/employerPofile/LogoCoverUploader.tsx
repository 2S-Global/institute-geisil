import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
const LogoCoverUploader = ({ formdata, setFormdata, Deletecover }) => {
  const [logoImg, setLogoImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  // Preview URLs
  const [logoPreview, setLogoPreview] = useState(formdata?.logo_preview || "");
  const [coverPreview, setCoverPreview] = useState(
    formdata?.cover_preview || ""
  );

  useEffect(() => {
    if (formdata.logo_preview) {
      setLogoPreview(formdata.logo_preview);
    }
    if (formdata.cover_preview) {
      setCoverPreview(formdata.cover_preview);
    }
  }, [formdata.logo_preview, formdata.cover_preview]);

  // Generate preview when logo changes
  useEffect(() => {
    if (logoImg) {
      const previewUrl = URL.createObjectURL(logoImg);
      setLogoPreview(previewUrl);
      setFormdata((prev) => ({ ...prev, logo: logoImg }));
    }
  }, [logoImg]);

  // Generate preview when cover changes
  useEffect(() => {
    if (coverImg) {
      const previewUrl = URL.createObjectURL(coverImg);
      setCoverPreview(previewUrl);
      setFormdata((prev) => ({ ...prev, cover: coverImg }));
    }
  }, [coverImg]);

  const removeLogo = () => {
    setLogoImg(null);
    setLogoPreview("");
    setFormdata((prev) => ({ ...prev, logo: null, logo_preview: null }));
  };

  const removeCover = () => {
    setCoverImg(null);
    setCoverPreview("");
    setFormdata((prev) => ({ ...prev, cover: null, cover_preview: null }));
  };
  const DeleteCover = async () => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the cover photo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      setCoverImg(null);
      setCoverPreview("");
      setFormdata((prev) => ({ ...prev, cover: null, cover_preview: null }));
      Deletecover();
    }
  };

  return (
  <>
  {/* Logo & Cover Upload */}
<div className="grid gap-4 md:grid-cols-2 md:col-span-2">
  {/* Logo Upload */}
  <div className="space-y-2">
    <Label>
      Company Logo
      <span className="text-danger ms-1">*</span>
    </Label>

    <div className="border rounded-md p-4">
      <div className="flex items-center gap-3 mb-3">
        <Input
          type="file"
          accept="image/*"
          id="upload_logo"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setLogoImg(file);
              setLogoPreview(URL.createObjectURL(file));

              setTimeout(() => {
                e.target.value = null;
              }, 0);
            }
          }}
        />

        <label htmlFor="upload_logo">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            asChild
          >
            <span>
              {logoImg ? logoImg.name : "Browse Logo"}
            </span>
          </Button>
        </label>
      </div>

      {logoPreview && (
        <div className="relative inline-block">
          <img
            src={logoPreview}
            alt="Logo Preview"
            className="rounded-full border shadow object-cover"
            style={{
              width: "120px",
              height: "120px",
            }}
          />

          <button
            type="button"
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            onClick={removeLogo}
          >
            ×
          </button>
        </div>
      )}
    </div>
  </div>

  {/* Cover Upload */}
  <div className="space-y-2">
    <Label>Company Cover Image</Label>

    <div className="border rounded-md p-4">
      <div className="flex items-center gap-3 mb-3">
        <Input
          type="file"
          accept="image/*"
          id="upload_cover"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setCoverImg(file);
              setCoverPreview(URL.createObjectURL(file));

              setTimeout(() => {
                e.target.value = null;
              }, 0);
            }
          }}
        />

        <label htmlFor="upload_cover">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            asChild
          >
            <span>
              {coverImg ? coverImg.name : "Browse Cover"}
            </span>
          </Button>
        </label>
      </div>

      {coverPreview && (
        <div className="relative inline-block">
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="rounded-md border shadow object-cover"
            style={{
              aspectRatio: "16/9",
              maxWidth: "300px",
              width: "100%",
            }}
          />

          {coverPreview === formdata.cover_preview ? (
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
              onClick={DeleteCover}
            >
              <Trash2 size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
              onClick={removeCover}
            >
              ×
            </button>
          )}
        </div>
      )}
    </div>
  </div>
</div>
  </>
  );
};

export default LogoCoverUploader;
