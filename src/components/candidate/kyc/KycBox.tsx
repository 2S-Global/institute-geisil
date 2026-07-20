

import React, { useState, useEffect } from "react";

const KycBox = ({ show, onClose, data = {}, setRefresh, formData, setFormData, focusSection }) => {
  const [loading, setLoading] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null);

  useEffect(() => {
    if (focusSection) {
      let targetId = focusSection.toLowerCase();
      if (targetId === "aadhar") {
        targetId = "aadhaar";
      }

      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });

        if (focusSection !== "all") {
          setActiveHighlight(targetId);
        }
        
        const timeout = setTimeout(() => {
          setActiveHighlight(null);
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  }, [focusSection]);

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  // Generates smooth background and border transitions strictly for the container
  const getHighlightClass = (sectionId, columnsCount = "md:grid-cols-2") => {
    const baseClass = `grid grid-cols-1 ${columnsCount} gap-4 p-3 border rounded-lg transition-all duration-500 ease-in-out `;
    if (activeHighlight === sectionId) {
      return baseClass + "border-[#223B6B] bg-[#223B6B]/[0.02] shadow-[0_0_0_3px_rgba(34,59,107,0.15)]";
    }
    return baseClass + "border-slate-100 bg-transparent";
  };
  
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-semibold">
          Identity Documents
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Update your PAN, Driving License, Passport, EPIC and Aadhaar details.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/75 z-50">
          loading....
        </div>
      )}

      <div className="space-y-6">
        {/* PAN Row Section */}
        <div id="pan" className={getHighlightClass("pan", "md:grid-cols-2")}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">PAN Number</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.pan_number || ""}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                setFormData({
                  ...formData,
                  pan_number: sanitized,
                });
              }}
              maxLength={10}
              pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
              placeholder="ABCDE1234F"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name as per PAN</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.pan_name || ""}
              onChange={(e) => {
                const alphabetOnly = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                setFormData({
                  ...formData,
                  pan_name: alphabetOnly,
                });
              }}
              placeholder="e.g. RAHUL KUMAR SHARMA"
            />
          </div>
        </div>

        {/* Driving License Row Section */}
        <div id="dl" className={getHighlightClass("dl", "md:grid-cols-3")}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Driving License Number
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.dl_number || ""}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9\s-]/g, "").toUpperCase();
                setFormData({
                  ...formData,
                  dl_number: sanitized,
                });
              }}
              maxLength={16}
              pattern="^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$"
              placeholder="DL-1420110068753"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Name as per Driving License
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.dl_name || ""}
              onChange={(e) => {
                const alphabetOnly = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                setFormData({
                  ...formData,
                  dl_name: alphabetOnly,
                });
              }}
              placeholder="e.g. RAHUL KUMAR SHARMA"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Date of Birth as per Driving License
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm relative focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.dl_dob ? new Date(formData.dl_dob).toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dl_dob: e.target.value,
                })
              }
              max={eighteenYearsAgo.toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* EPIC Row Section */}
        <div id="epic" className={getHighlightClass("epic", "md:grid-cols-2")}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              EPIC (Voter) Number
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.epic_number || ""}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                setFormData({
                  ...formData,
                  epic_number: sanitized,
                });
              }}
              maxLength={10}
              pattern="^[A-Z]{3}[0-9]{7}$"
              placeholder="ABC1234567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Name as per EPIC
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.epic_name || ""}
              onChange={(e) => {
                const alphabetOnly = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                setFormData({
                  ...formData,
                  epic_name: alphabetOnly,
                });
              }}
              placeholder="e.g. RAHUL KUMAR SHARMA"
            />
          </div>
        </div>

        {/* Passport Row Section */}
        <div id="passport" className={getHighlightClass("passport", "md:grid-cols-3")}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Passport File Number
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm uppercase font-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.passport_number || ""}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                setFormData({
                  ...formData,
                  passport_number: sanitized,
                });
              }}
              maxLength={12}
              placeholder="ABCD12345678"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Name as per Passport
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.passport_name || ""}
              onChange={(e) => {
                const alphabetOnly = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                setFormData({
                  ...formData,
                  passport_name: alphabetOnly,
                });
              }}
              placeholder="e.g. RAHUL KUMAR SHARMA"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Date of Birth as per Passport
            </label>
            <input
              type="date"
              className="w-full border rounded-md px-3 py-2 text-sm relative focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.passport_dob ? new Date(formData.passport_dob).toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passport_dob: e.target.value,
                })
              }
              max={eighteenYearsAgo.toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Aadhaar Row Section */}
        <div id="aadhaar" className={getHighlightClass("aadhaar", "md:grid-cols-2")}>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Aadhaar Number
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.aadhar_number || ""}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, "");
                setFormData({
                  ...formData,
                  aadhar_number: numericValue,
                });
              }}
              maxLength={12}
              pattern="[0-9]{12}"
              placeholder="Enter 12-digit Aadhaar Number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Name as per Aadhaar
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-slate-300 transition-colors"
              value={formData.aadhar_name || ""}
              onChange={(e) => {
                const alphabetOnly = e.target.value.replace(/[^a-zA-Z\s.]/g, "");
                setFormData({
                  ...formData,
                  aadhar_name: alphabetOnly,
                });
              }}
              placeholder="e.g. RAHUL KUMAR SHARMA"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default KycBox;