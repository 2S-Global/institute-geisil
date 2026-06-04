import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import { Search,Trash2 } from "lucide-react";
import Select from "react-select";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TermsModal from "./TermsModal"
const AadharForm = ({
  loading,
  setLoading,
  error,
  setError,
  success,
  setSuccess,
  setRenderBill,
  setRenderForm,
  setFormsubmitted,
  formsubmitted,
  setPaymentvalues,
  setErrorId,
  setMessage_id,
}) => {
   const [owners, setOwners] = useState([]);
  const name = localStorage.getItem("name");
  const [formData, setFormData] = useState({
    name: "",
    dob: null,
    phone: "",
    email: "",
    address: "",
    gender: "",
    aadhar_number: "",
    aadhar_name: "",
    aadhaardoc: null,
    owner_id: "",
  });
  const apiurl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("Role");
  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const [documentData, setDocumentData] = useState({
    file: null,
    filePreview: null,
  });

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const fetchowners = async () => {
    try {
      //setLoading(true);

      const res = await API.get(
        `/api/complex/getallownerforcompany`,
      );
      if (res.data.success) {
        setOwners(res.data.data);
      }
    } catch (err) {
      //  console.log("Error fetching plans. Please try again.", err);
    } finally {
      //setLoading(false);
    }
  };
  useEffect(() => {
    if (role == "2") {
      fetchowners();
    }
  }, [apiurl, token]); // ✅ include token too

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errorMsg = "";

    if (["name", "aadhar_name"].includes(name)) {
      const onlyLetters = /^[A-Za-z\s]*$/;
      if (!onlyLetters.test(value)) return;
      if (!value.trim()) errorMsg = "Name is required.";
    } else if (name === "aadhar_number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
      if (updatedValue.length !== 12)
        errorMsg = "Aadhar number must be exactly 12 digits.";
    } else if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
      if (updatedValue.length !== 10)
        errorMsg = "Phone number must be exactly 10 digits.";
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleDateChange = (date) => {
    if (date) setFormData({ ...formData, dob: date });
  };

  const handleValidation = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailRegex.test(value)) error = "Invalid email format";
    } else if (name === "phone" && value.length !== 10) {
      error = "Phone number must be exactly 10 digits";
    } else if (name === "aadhar_number" && value.length !== 12) {
      error = "Aadhar must be 12 digits";
    }

    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCheckboxChange = (e) => setIsChecked(e.target.checked);

  const handleShowTermsModal = () => {
    setShowTermsModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
    document.body.style.overflow = "auto";
  };

  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.aadhar_number.length === 12 &&
      !formErrors.name &&
      !formErrors.aadhar_number &&
      !formErrors.aadhar_name
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fix the errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      const formPayload = new FormData();
      for (let key in formData) formPayload.append(key, formData[key]);

      const response = await API.post(
        `/api/usercart/add_user_cart_aadhao_otp`,
        formPayload,
      );
      if (response.data.success) {
        setSuccess(response.data.message || "Submitted successfully");
        setMessage_id(Date.now());
        /*    setRenderBill(true); */
        setFormsubmitted(true);
        /* call setPaymentvalues function */
        setPaymentvalues();
        setError("");
      } else {
        setError(
          response.data.message || "Submission failed. Please try again."
        );
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError("Submission failed. Please try again.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentData({ file, filePreview: URL.createObjectURL(file) });
      setFormData((prev) => ({ ...prev, aadhaardoc: file }));
    }
  };

  const [isSameAsFullName, setIsSameAsFullName] = useState(false);


  useEffect(() => {
    if (isSameAsFullName) {
      setFormData((prev) => ({
        ...prev,
        aadhar_name: formData.name || "",
      }));
    }
  }, [formData.name, isSameAsFullName]);

  const handleCheckboxChangenew = (e) => {
    const checked = e.target.checked;
    setIsSameAsFullName(checked);

    if (!checked) {
      setFormData((prev) => ({
        ...prev,
        aadhar_name: "",
      }));
    }
  };

  return (
<>
  <form
    className="default-form pt-5"
    onSubmit={handleSubmit}
    style={{
      pointerEvents: formsubmitted ? "none" : "auto",
      opacity: formsubmitted ? 0.5 : 1,
    }}
  >
    {/* 3 COLUMN GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-3">

      {/* Full Name */}
      <div>
        <label className="font-semibold">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label className="font-semibold">
          Date of Birth <span className="text-red-500">*</span>
        </label>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {/* <DatePicker
            value={formData.dob}
            onChange={handleDateChange}
            format="dd/MM/yyyy"
            maxDate={eighteenYearsAgo}
            views={["year", "month", "day"]}
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: "dd/mm/yyyy",
                sx: {
                  "& .MuiInputBase-root": {
                    height: "48px",
                    borderRadius: "10px",
                  },
                },
              },
            }}
          /> */}
           <DatePicker
                value={formData.dob}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                maxDate={eighteenYearsAgo}
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    id: "dob",
                    required: true,
                    fullWidth: true,
                    placeholder: "dd/mm/yyyy",
                     sx: {
                  "& .MuiInputBase-root": {
                    height: "48px",
                    borderRadius: "10px",
                  },
                },
                  },
                }}
              />
        </LocalizationProvider>
      </div>

      {/* Phone */}
      <div>
        <label className="font-semibold">Phone Number</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="font-semibold">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleValidation}
          required
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="font-semibold">Gender</label>
        <select
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Address */}
      <div>
        <label className="font-semibold">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Aadhar Number */}
      <div>
        <label className="font-semibold">
          Aadhar Number <span className="text-red-500">*</span>
        </label>
        <input
          name="aadhar_number"
          value={formData.aadhar_number}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={12}
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Aadhar Name */}
      <div>
        <label className="font-semibold">
          Full Name As per Aadhar <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="aadhar_name"
          value={formData.aadhar_name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSameAsFullName}
          required
          className="w-full mt-2 rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />

        <div className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isSameAsFullName}
            onChange={handleCheckboxChangenew}
          />
          <label className="text-sm">Same as Full Name</label>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="font-semibold">Upload Aadhar File</label>

        <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 bg-gray-50">
          <input
            key={inputKey}
            type="file"
            accept="image/*"
            id="aadhaardoc"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />

          <label htmlFor="aadhaardoc" className="cursor-pointer text-gray-600">
            {documentData.file ? documentData.file.name : "Browse Aadhar File"}
          </label>

          {documentData.file && (
            <Trash2
              size={18}
              className="text-red-500 cursor-pointer"
              onClick={() => {
                setDocumentData({ file: null, filePreview: null });
                setInputKey(Date.now());
                setFormData((prev) => ({
                  ...prev,
                  aadhaardoc: null,
                }));
              }}
            />
          )}
        </div>
      </div>

    </div>

    {/* Terms + Submit */}
    {!formsubmitted && (
      <div className="px-3 mt-6">

        <div className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <label className="text-sm">
            This KYC verification is being done as per request from "{name}".
            I agree to{" "}
            <span
              className="underline cursor-pointer"
              onClick={handleShowTermsModal}
            >
              Terms and Conditions
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!isFormValid() || !isChecked || loading}
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{
            backgroundColor:
              !isFormValid() || !isChecked || loading ? "#d3d7df" : "#2563eb",
            cursor:
              !isFormValid() || !isChecked || loading
                ? "not-allowed"
                : "pointer",
          }}
        >
          {loading ? "Please wait..." : "Submit"}
        </button>

      </div>
    )}
  </form>

  {showTermsModal && (
    <TermsModal show={showTermsModal} onClose={handleCloseTermsModal} /> 
  )}
</>
  );
};

export default AadharForm;
