import React, { useState, useRef } from "react";
import API from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";
interface OfferLetterModalProps {
  open: boolean;
  selectedCandidate: any;
  closeModal: () => void;
onSuccess?: () => void;
}

const OfferLetterModal = ({
  open,
  selectedCandidate,
  closeModal,
  onSuccess,
}: OfferLetterModalProps) => {
  const [offerDesignation, setOfferDesignation] = useState("");
  const [offerJoiningDate, setOfferJoiningDate] = useState("");
  const [offerSalary, setOfferSalary] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  const [offerLoading, setOfferLoading] = useState(false);

  const [designationOptions, setDesignationOptions] = useState<any[]>([]);
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);

  const [designationLoading, setDesignationLoading] = useState(false);

  const joiningDateRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [offerErrors, setOfferErrors] = useState({
    designation: "",
    joiningDate: "",
    salary: "",
    message: "",
  });

  const handleSendOffer = async () => {
    const errors = {
      designation: "",
      joiningDate: "",
      salary: "",
      message: "",
    };

    if (!offerDesignation) errors.designation = "Designation is required";

    if (!offerJoiningDate) errors.joiningDate = "Joining date is required";

    if (!offerSalary) errors.salary = "Salary is required";

    if (!offerMessage) errors.message = "Message is required";

    setOfferErrors(errors);

    if (Object.values(errors).some(Boolean)) return;

    try {
      setOfferLoading(true);

      const response = await API.patch(
        "/api/jobposting/sent_offer_to_candidates",
        {
          applicationId: selectedCandidate?._id,
          offer_letter_designation: offerDesignation,
          offer_letter_joining_date: offerJoiningDate,
          offer_letter_salary: offerSalary,
          offer_letter_message: offerMessage,
        },
      );

      if (response.data?.success) {
        // Reset form
        setOfferDesignation("");
        setOfferJoiningDate("");
        setOfferSalary("");
        setOfferMessage("");

        setOfferErrors({
          designation: "",
          joiningDate: "",
          salary: "",
          message: "",
        });

       toast({
         title: "Success",
         description: response.data?.message || "Offer sent successfully",
       });

       onSuccess?.();

       closeModal();

        // Optional success toast
        console.log(response.data?.message || "Offer sent successfully");
      }
    } catch (error: any) {
      console.error("Offer send failed:", error);

      // Optional error toast
      console.log(error?.response?.data?.message || "Failed to send offer");
    } finally {
      setOfferLoading(false);
    }
  };

  const fetchSpecialization = async (keyword: string) => {
    try {
      const response = await API.get(
        `/api/jobposting/all_job_specializations?query=${keyword}`,
      );

      return (response.data?.data || []).map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

        {/* Modal */}
        <div
          className="relative z-10 w-full max-w-4xl rounded-xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-xl font-semibold">
              Offer Discussion – {selectedCandidate?.candidateName}
            </h2>

            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Candidate Details */}
          <div className="px-6 pt-4 space-y-2">
            <p>
              <span className="font-semibold">Last Drawn Salary:</span>{" "}
              {selectedCandidate?.feedback?.lastDrawnSalary || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Expected Salary:</span>{" "}
              {selectedCandidate?.feedback?.expectedSalary || "N/A"}
            </p>

            <p>
              <span className="font-semibold">Notice Period:</span>{" "}
              {selectedCandidate?.noticePeriod
                ? selectedCandidate.noticePeriod.charAt(0).toUpperCase() +
                  selectedCandidate.noticePeriod.slice(1)
                : "N/A"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Designation */}
              <div className="relative">
                <label className="block text-sm font-medium mb-1">
                  Designation
                </label>

                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Senior Developer"
                  value={offerDesignation}
                  onChange={async (e) => {
                    const value = e.target.value;

                    setOfferDesignation(value);

                    setOfferErrors((prev: any) => ({
                      ...prev,
                      designation: "",
                    }));

                    if (!value.trim()) {
                      setDesignationOptions([]);
                      setShowDesignationDropdown(false);
                      return;
                    }

                    try {
                      setDesignationLoading(true);

                      const results = await fetchSpecialization(value);

                      setDesignationOptions(results || []);
                      setShowDesignationDropdown(results?.length > 0);
                    } catch (error) {
                      console.error(error);
                      setDesignationOptions([]);
                    } finally {
                      setDesignationLoading(false);
                    }
                  }}
                  onFocus={() => {
                    if (designationOptions.length > 0) {
                      setShowDesignationDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowDesignationDropdown(false);
                    }, 200);
                  }}
                />

                {designationLoading && (
                  <p className="mt-1 text-sm text-blue-600">Loading...</p>
                )}

                {showDesignationDropdown && designationOptions.length > 0 && (
                  <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {designationOptions.map((item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                        onMouseDown={() => {
                          setOfferDesignation(item.label || item.value);
                          setShowDesignationDropdown(false);
                        }}
                      >
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}

                {offerErrors.designation && (
                  <p className="mt-1 text-sm text-red-500">
                    {offerErrors.designation}
                  </p>
                )}
              </div>

              {/* Joining Date */}
              <div style={{ position: "relative" }}>
                <label className="block text-sm font-medium mb-1">
                  Joining Date
                </label>

                <input
                  ref={joiningDateRef}
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  value={offerJoiningDate}
                  onClick={() => joiningDateRef.current?.showPicker()}
                  onChange={(e) => {
                    setOfferJoiningDate(e.target.value);

                    setOfferErrors((prev: any) => ({
                      ...prev,
                      joiningDate: "",
                    }));
                  }}
                />

                {offerErrors.joiningDate && (
                  <p className="mt-1 text-sm text-red-500">
                    {offerErrors.joiningDate}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Salary Offered
                </label>

                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="e.g. ₹8,00,000 / year"
                  value={offerSalary}
                  onChange={(e) => {
                    setOfferSalary(e.target.value);

                    setOfferErrors((prev: any) => ({
                      ...prev,
                      salary: "",
                    }));
                  }}
                />

                {offerErrors.salary && (
                  <p className="mt-1 text-sm text-red-500">
                    {offerErrors.salary}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Message
                </label>

                <textarea
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  placeholder="Enter message for candidate"
                  value={offerMessage}
                  onChange={(e) => {
                    setOfferMessage(e.target.value);

                    setOfferErrors((prev: any) => ({
                      ...prev,
                      message: "",
                    }));
                  }}
                />

                {offerErrors.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {offerErrors.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t px-6 py-4">
            <button
              onClick={closeModal}
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              disabled={offerLoading}
              onClick={handleSendOffer}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {offerLoading ? "Sending..." : "Send Offer"}
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default OfferLetterModal;
