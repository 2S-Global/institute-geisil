import React from "react";
import { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import { da } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
const AccountBox = () => {
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
  const apiurl = import.meta.env.VITE_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
 const { toast } = useToast();
  useEffect(() => {
    Fetchdetails();
  }, [apiurl]);

  const Fetchdetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `${apiurl}/api/instituteprofile/get_account_details`,
      
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
        `${apiurl}/api/instituteprofile/update_account_details`,
        formdata,
        
      );
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());
           toast({
          title: "Success",
          description: 'Account details updated successfully.',
        });
        setTimeout(() => {
          //setActiveTab("contact");
        }, 2000);
      } else {
        console.error("Error saving personal details:", response.data.message);
        toast({
          title: "Error",
          variant: "destructive",
          description: response.data.message,
        });
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("Error saving personal details:", error);

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



  <form
    className="default-form"
    onSubmit={handelsubmit}
    type="multipart/form-data"
    method="post"
  >
    <div className="grid gap-4 md:grid-cols-2">
      {/* Institute Name */}
      <div className="space-y-2">
        <Label htmlFor="companyname">
          Institute Name
          <span className="text-red-500 ms-1">*</span>
        </Label>

        <Input
          type="text"
          name="companyname"
          placeholder="Enter institute name"
          value={formdata.companyname}
          readOnly
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="companyemail">
          Email Address
          <span className="text-red-500 ms-1">*</span>
        </Label>

        <Input
          type="email"
          name="companyemail"
          placeholder="Enter email address"
           pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
              title="Please enter a valid email address (example: name@example.com)"
          value={formdata.companyemail}
          readOnly
          className="bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="companyphone">
          Mobile Number
        </Label>

        <Input
          type="text"
          name="companyphone"
          placeholder="Enter Mobile Number"
          title="Enter valid 10-digit mobile number"
          pattern="^[0-9]{10}$"
          value={formdata.companyphone}
          /* onChange={handleChange} */
           onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              setFormData({
                ...formdata,
                companyphone: value,
              });
               
            }}
          onBlur={handleBlur}
          className={`${
            touched.companyphone && formErrors.companyphone
              ? "border-red-500 focus-visible:ring-red-500"
              : ""
          }`}
        />

        {validationErrors.companyphone && (
          <small className="text-red-500">
            {validationErrors.companyphone}
          </small>
        )}
      </div>
    </div>

    {/* Submit Button */}
    <Button
      className="gap-2 mt-4 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
      type="submit"
      disabled={isDisabled}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
    >
      {submitting ? "Saving..." : "Save"}
    </Button>
  </form>
</>
  );
};

export default AccountBox;
