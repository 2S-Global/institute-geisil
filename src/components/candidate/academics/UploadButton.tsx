import React from "react";

const UploadButton = ({
  label = "Upload",
  id,
  file,
  onChange,
  accept,
  width = "340px",
  image,
}) => {
  // Check from `file.type` or fallback to image url
  const fileType = file?.type?.toLowerCase() || "";
  const isImage =
    fileType.startsWith("image/") ||
    (typeof image === "string" && /\.(jpe?g|png|gif|bmp|webp)$/i.test(image));
  const isPDF =
    fileType === "application/pdf" ||
    (typeof image === "string" && /\.pdf$/i.test(image));

  return (
  <div className="w-full">
  <div className="flex items-center">
    <input
      id={id}
      type="file"
      accept={accept}
      onChange={onChange}
      required
      className="hidden"
    />

    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
      style={{ width }}
    >
      <span className="truncate">
        {file ? file.name : "Browse..."}
      </span>
    </label>
  </div>

  {image && (
    <div className="mt-3">
      {isImage ? (
        <img
          src={image}
          alt="Uploaded Preview"
          className="rounded-lg border border-gray-200 object-contain"
          style={{
            maxWidth: width,
            height: "auto",
          }}
        />
      ) : isPDF ? (
        <a
          href={image}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 underline hover:text-blue-700"
        >
          View PDF
        </a>
      ) : (
        <p className="text-sm text-gray-500">
          Preview not available for this file type.
        </p>
      )}
    </div>
  )}
</div>
  );
};

export default UploadButton;
