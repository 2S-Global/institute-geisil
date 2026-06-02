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
const Account = () => {
   const [formdata, setFormData] = useState({
    companyname: "",
    companyemail: "",
    companyphone: "",
  });
  const [touched, setTouched] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const apiurl = '';
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("employer_token");
  const {toast}=useToast()
  useEffect(() => {
    Fetchdetails();
  }, []);

  const Fetchdetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_account_details`
       
      );

      if (response.data.success) {
        setFormData({
          companyname: response.data.data.companyname || "",
          companyemail: response.data.data.email || "",
          companyphone: response.data.data.phone || "",
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
  const isDisabled = loading || submitting || validationErrors.companyphone;

  const handelsubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoading(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    try {
      const response = await API.put(
        `/api/companyprofile/update_account_details`,
        formdata
      
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());
         toast({
                    title: "Success",
                    description: response.data.message,
                  });
        setTimeout(() => {
          /* setActiveTab("contact") */;
        }, 2000);
      } else {
        console.error("Error saving personal details:", response.data.message);
        toast({
                    title: "Error",
                    description: response.data.message,
                  });
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("Error saving personal details:", error);
 toast({
                    title: "Error",
                    description: error,
                  });
      setError("An error occurred while saving personal details.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "companyphone") {
      if (formdata.companyphone.length !== 10) {
        setValidationErrors((prev) => ({
          ...prev,
          companyphone: "Phone number must be 10 digits.",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, companyphone: "" }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    let errorMsg = "";

    if (name === "companyphone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
      if (updatedValue.length !== 10) {
        errorMsg = "Phone number must be 10 digits.";
      }
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
    setFormErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

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

  <form
    className="default-form"
    onSubmit={handelsubmit}
    type="multipart/form-data"
    method="post"
  >
    <div className="grid gap-4 md:grid-cols-2">
      {/* Company Name */}
      <div className="space-y-2">
        <label>
          Company Name
          <span className="text-red-500 ms-1">*</span>
        </label>

        <input
          type="text"
          name="name"
          required
          placeholder="Enter your company name"
          value={formdata.companyname}
          style={{ pointerEvents: "none" }}
          readOnly
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label>
          Email
          <span className="text-red-500 ms-1">*</span>
        </label>

        <input
          type="text"
          name="name"
          placeholder="Enter Email"
          value={formdata.companyemail}
          style={{ pointerEvents: "none" }}
          readOnly
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <label>
          Mobile Number
          <span className="text-red-500 ms-1">*</span>
        </label>

        <input
          type="text"
          name="companyphone"
          className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
            touched.companyphone && formErrors.companyphone
              ? "border-red-500"
              : "border-input"
          }`}
          placeholder="Enter Mobile Number"
          onChange={handleChange}
          onBlur={handleBlur}
          value={formdata.companyphone}
        />

        {validationErrors.companyphone && (
          <small className="text-red-500">
            {validationErrors.companyphone}
          </small>
        )}
      </div>

      {/* Empty Space */}
      <div></div>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-brand hover:bg-[hsl(var(--primary-hover))]"
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {submitting ? "Saving..." : "Save"}
    </button>
  </form>
</>
  );
};

export default Account;
