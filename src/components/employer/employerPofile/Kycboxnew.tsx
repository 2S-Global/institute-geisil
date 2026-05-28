
import { useState, useEffect } from "react";

const Kycboxnew = ({ formData, setFormData, focusSection }) => {
  useEffect(() => {
    if (focusSection) {
      const element = document.getElementById(focusSection);

      if (element) {
        // Scroll into view
        element.scrollIntoView({ behavior: "smooth" });

        if (focusSection != "all") {
          // Add highlight class
          element.classList.add("highlight");
        }
        // Remove after 3s
        const timeout = setTimeout(() => {
          element.classList.remove("highlight");
        }, 3000);

        // Cleanup if effect re-runs
        return () => clearTimeout(timeout);
      }
    }
  }, [focusSection]);

  return (
  <>
  <div id="all" className="space-y-4">
    {/* CIN */}
    <div
      className="mx-2 grid grid-cols-1 gap-4 md:grid-cols-2"
      id="cin"
    >
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          CIN Number
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.cin_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              cin_number: e.target.value,
            });
          }}
          pattern="^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$"
          title="Please enter a valid CIN number"
          placeholder="Enter CIN Number"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          Name as per CIN
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.cin_name}
          onChange={(e) => {
            setFormData({
              ...formData,
              cin_name: e.target.value,
            });
          }}
          placeholder="Enter Name as per CIN"
        />
      </div>
    </div>

    {/* GSTIN */}
    <div
      className="mx-2 grid grid-cols-1 gap-4 md:grid-cols-2"
      id="gstin"
    >
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          GSTIN Number
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.gstin_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              gstin_number: e.target.value,
            });
          }}
          pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
          title="Please enter a valid GSTIN number"
          placeholder="Enter GSTIN Number"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          Name as per GSTIN
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.gstin_name}
          onChange={(e) => {
            setFormData({
              ...formData,
              gstin_name: e.target.value,
            });
          }}
          placeholder="Enter Name as per GSTIN"
        />
      </div>
    </div>

    {/* PAN */}
    <div
      className="mx-2 grid grid-cols-1 gap-4 md:grid-cols-2"
      id="pan"
    >
      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          PAN Number
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.pan_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              pan_number: e.target.value,
            });
          }}
          pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
          title="Please enter a valid PAN number"
          placeholder="Enter PAN Number"
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-2 text-sm font-medium text-gray-700">
          Name as per PAN
        </label>

        <input
          type="text"
          className="rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          value={formData.pan_name}
          onChange={(e) => {
            setFormData({
              ...formData,
              pan_name: e.target.value,
            });
          }}
          placeholder="Enter Name as per PAN"
        />
      </div>
    </div>
  </div>
</>
  );
};

export default Kycboxnew;
