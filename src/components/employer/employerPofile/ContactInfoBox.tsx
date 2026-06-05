import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import { Search } from "lucide-react";
import Select from "react-select";
import LogoCoverUploader from "./LogoCoverUploader";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
const ContactInfoBox = () => {
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = "";
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("employer_token");
const {toast}=useToast()
  useEffect(() => {
    FetchDetails();
  }, []);
  const FetchDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_contact_person`
      );

      if (response.data.success) {
        setFormData({
          name: response.data.data.name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          address: response.data.data.address || "",
        });
      } else {
        console.error("Failed to fetch details:", response.data.message);
      }
    } catch (error) {
      console.error("Error while fetching account details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "phone") {
      if (formData.phone.length !== 10) {
        setValidationErrors((prev) => ({
          ...prev,
          phone: "Phone number must be 10 digits.",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errorMsg = "";

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
      if (updatedValue.length !== 10) {
        errorMsg = "Phone number must be 10 digits.";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const response = await API.post(
        `/api/companyprofile/add_or_update_contact_person`,
        formData
      );

      if (response.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(response.data.message);
        setMessageId(Date.now());

        FetchDetails();
         toast({
                    title: "Success",
                    description: response.data.message,
                  });
        setTimeout(() => {
          /* setActiveTab("kyc"); */
        }, 2000);
      } else {
        setError(response.data.message || "Something went wrong.");
         toast({
                    title: "Error",
                     variant: "destructive",
                    description: response.data.message,
                  });
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error(err);
       toast({
                    title: "Error",
                     variant: "destructive",
                    description: "Something went wrong. Please try again.",
                  });
      setError("Something went wrong. Please try again.");
      setErrorId(Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = loading || submitting || validationErrors.phone;

  return (
<>
{/*   <MessageComponent
    error={error}
    success={success}
    errorId={errorId}
    message_id={message_id}
  /> */}

{/*   {loading && (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style={{ zIndex: 1050 }}
    >
      
    </div>
  )} */}

  <form className="default-form" onSubmit={handleSubmit}>
    {/* Main Form */}
    <div className="grid gap-4 md:grid-cols-2">
      {/* Name */}
      <div className="space-y-2">
        <label>
          Name
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Full Name"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label>
          Email
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="abcd@gmail.com"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label>
          Phone Number
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </label>

        <input
          type="text"
          name="phone"
          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
            touched.phone && formErrors.phone ? "is-invalid" : ""
          }`}
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1234567890"
          required
        />

        {validationErrors.phone && (
          <small className="text-danger">
            {validationErrors.phone}
          </small>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2 md:col-span-2">
        <label>
          Complete Address
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          rows="4"
          placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm custom-textarea"
        ></textarea>
      </div>
    </div>

    {/* Submit */}
    <button
      type="submit"
      disabled={isDisabled}
      className="gap-2 mt-4 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand px-4 py-2 rounded-md"
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {submitting ? "Submitting..." : "Submit"}
    </button>
  </form>
</>
  );
};

export default ContactInfoBox;
