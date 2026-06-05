import { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import { da } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  const apiurl = import.meta.env.VITE_API_URL;
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
 const { toast } = useToast();
  useEffect(() => {
    FetchDetails();
  }, [apiurl]);
  const FetchDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `${apiurl}/api/instituteprofile/get_contact_person`,
     
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
        `${apiurl}/api/instituteprofile/add_or_update_contact_person`,
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
          description: 'Contact person details updated successfully.',
        });
        setTimeout(() => {
          //setActiveTab("social");
        }, 2000);
      } else {
        setError(response.data.message || "Something went wrong.");
         toast({
          title: "Error",
          description: 'Something went wrong.',
          variant: "destructive"
        });
        setErrorId(Date.now());
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
       toast({
          title: "Error",
          description: 'Something went wrong. Please try again.',
          variant: "destructive"
        });
      setErrorId(Date.now());
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = loading || submitting || validationErrors.phone;

  return (
 <>


  {loading && (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style={{ zIndex: 1050 }}
    >
      
    </div>
  )}

  <form
    className="default-form"
    onSubmit={handleSubmit}
    type="multipart/form-data"
    method="post"
  >
    <div className="grid gap-4 md:grid-cols-2">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Name{" "}
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </Label>

        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Full Name"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email{" "}
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </Label>

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="abcd@gmail.com"
          required
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">
          Phone Number{" "}
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </Label>

        <Input
          type="text"
          name="phone"
         
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="1234567890"
          required
        />

        {validationErrors.phone && (
          <small style={{ color: "red" }} className="ms-1">
            {validationErrors.phone}
          </small>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">
          Complete Address{" "}
          <span style={{ color: "red" }} className="ms-1">
            *
          </span>
        </Label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          rows="3"
          placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          style={{
            resize: "vertical",
            minHeight: "100px",
          }}
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="md:col-span-2">
        <Button
          type="submit"
          disabled={isDisabled}
          className="gap-2 mt-3 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  </form>
</>
  );
};

export default ContactInfoBox;
