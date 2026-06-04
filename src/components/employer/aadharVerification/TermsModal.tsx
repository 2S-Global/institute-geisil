import React, { useState, useEffect, useRef } from "react";
import API from "../../../lib/axios";
import { useParams, useSearchParams ,useNavigate} from "react-router-dom";
const TermsModal = ({ show, onClose }) => {
 const router = useNavigate();
   const params = useParams(); 
  const apiurl = import.meta.env.VITE_API_URL;
  const token =localStorage.getItem("token");

  const [terms, setTerms] = useState("this is the terms and conditions");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTerms = async () => {
    setLoading(true);
    /* /api/terms/getTerms */
    try {
      console.log("Fetching terms and conditions...");
      const response = await API.get(`/api/terms/getTerms`);

      setTerms(response.data.terms.content);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch terms and conditions.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTerms();
  }, []);

  return (
   <>
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    role="dialog"
    aria-modal="true"
  >
    <div className="w-full max-w-4xl px-4">
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h5 className="text-lg font-bold">
            Terms and Conditions
          </h5>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
                role="status"
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <p>{terms}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </div>
</>
  );
};

export default TermsModal;
