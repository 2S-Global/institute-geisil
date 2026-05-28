
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
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
     {/* Logo Upload */}
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">
            Institute Logo
            <span className="text-red-500 ml-1">*</span>
        </label>

        <div className="mt-3">
            {/* Upload Button */}
            <div className="mb-4">
            <input
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

            <label
                htmlFor="upload_logo"
                className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
            >
                {logoImg ? logoImg.name : "Browse Logo"}
            </label>
            </div>

            {/* Preview */}
            {logoPreview && (
            <div className="relative inline-block">
                <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-28 w-28 rounded-full border-2 border-gray-300 object-cover shadow-md"
                />

                <button
                type="button"
                onClick={removeLogo}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                >
                ×
                </button>
            </div>
            )}
        </div>
    </div>

    {/* Cover Upload */}
    <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700">
        Institute Cover Image
    </label>

    <div className="mt-3">
        {/* Upload Button */}
        <div className="mb-4">
        <input
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

        <label
            htmlFor="upload_cover"
            className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
        >
            {coverImg ? coverImg.name : "Browse Cover"}
        </label>
        </div>

        {/* Preview */}
        {coverPreview && (
        <div className="relative inline-block">
            <img
            src={coverPreview}
            alt="Cover Preview"
            className="max-w-xs rounded-xl border border-gray-300 object-cover shadow-md aspect-video"
            />

            {coverPreview === formdata.cover_preview ? (
            <button
                type="button"
                onClick={DeleteCover}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
            >
                <Trash2 size={16} />
            </button>
            ) : (
            <button
                type="button"
                onClick={removeCover}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
            >
                ×
            </button>
            )}
        </div>
        )}
    </div>
    </div>
    </>
  );
};

export default LogoCoverUploader;
