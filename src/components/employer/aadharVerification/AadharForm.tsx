// AadharForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import API from "../../../lib/axios";
import { Search, Trash2 } from "lucide-react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

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
  const { toast } = useToast();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("Role");

  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    gender: "",
    aadhar_number: "",
    aadhar_name: "",
    aadhaardoc: null,
    owner_id: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [inputKey, setInputKey] = useState(Date.now());
  const [documentData, setDocumentData] = useState({
    file: null,
    filePreview: null,
  });
  const [isSameAsFullName, setIsSameAsFullName] = useState(false);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  // Fetch Owners
  const fetchOwners = async () => {
    try {
      const res = await API.get(`/api/complex/getallownerforcompany`);
      if (res.data.success) {
        setOwners(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (role === "2") {
      fetchOwners();
    }
  }, [role]);

  // Sync Aadhar Name
  useEffect(() => {
    if (isSameAsFullName) {
      setFormData((prev) => ({
        ...prev,
        aadhar_name: prev.name || "",
      }));
    }
  }, [formData.name, isSameAsFullName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    if (["name", "aadhar_name"].includes(name)) {
      const onlyLetters = /^[A-Za-z\s]*$/;
      if (!onlyLetters.test(value)) return;
    } else if (name === "aadhar_number") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
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
      error = "Aadhar number must be exactly 12 digits";
    }

    setValidationErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.name?.trim()) errors.name = "Full Name is required";
    if (!formData.dob) errors.dob = "Date of Birth is required";
    if (!formData.email?.trim()) errors.email = "Email is required";
    if (
      formData.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      errors.email = "Invalid email format";
    }
    if (formData.aadhar_number.length !== 12) {
      errors.aadhar_number = "Aadhar number must be exactly 12 digits";
    }
    if (!formData.aadhar_name?.trim()) {
      errors.aadhar_name = "Aadhar name is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!isChecked) {
      toast({
        title: "Error",
        description: "Please agree to terms",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formPayload.append(key, formData[key]);
        }
      });

      const response = await API.post(
        `/api/usercart/add_user_cart_aadhao_otp`,
        formPayload,
      );

      if (response.data.success) {
        setSuccess(response.data.message || "Submitted successfully");
        setMessage_id(Date.now());
        setFormsubmitted(true);
        setPaymentvalues?.();
        toast({
          title: "Success",
          description: "Aadhar verification submitted",
        });
      } else {
        setError(response.data.message || "Submission failed");
        setErrorId(Date.now());
      }
    } catch (err: any) {
      console.error(err);
      setError("Submission failed. Please try again.");
      setErrorId(Date.now());
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentData({ file, filePreview: URL.createObjectURL(file) });
      setFormData((prev) => ({ ...prev, aadhaardoc: file }));
    }
  };

  const removeFile = () => {
    setDocumentData({ file: null, filePreview: null });
    setInputKey(Date.now());
    setFormData((prev) => ({ ...prev, aadhaardoc: null }));
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Main Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label>
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {validationErrors.name && (
                <p className="text-xs text-destructive">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label>
                Date of Birth <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={eighteenYearsAgo.toISOString().split("T")[0]}
                  className="pr-10"
                />
              </div>

              {validationErrors.dob && (
                <p className="text-xs text-destructive">
                  {validationErrors.dob}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleValidation}
                maxLength={10}
              />
              {validationErrors.phone && (
                <p className="text-xs text-destructive">
                  {validationErrors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleValidation}
              />
              {validationErrors.email && (
                <p className="text-xs text-destructive">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="h-10 w-full rounded-md border bg-background px-3"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* Aadhar Number */}
            <div className="space-y-2">
              <Label>
                Aadhar Number <span className="text-red-500">*</span>
              </Label>
              <Input
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                onBlur={handleValidation}
                maxLength={12}
              />
              {validationErrors.aadhar_number && (
                <p className="text-xs text-destructive">
                  {validationErrors.aadhar_number}
                </p>
              )}
            </div>

            {/* Aadhar Name */}
            <div className="space-y-2">
              <Label>
                Full Name As per Aadhar <span className="text-red-500">*</span>
              </Label>
              <Input
                name="aadhar_name"
                value={formData.aadhar_name}
                onChange={handleChange}
                disabled={isSameAsFullName}
              />
              {validationErrors.aadhar_name && (
                <p className="text-xs text-destructive">
                  {validationErrors.aadhar_name}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={isSameAsFullName}
                  onCheckedChange={(checked) => setIsSameAsFullName(!!checked)}
                />
                <label className="text-sm cursor-pointer">
                  Same as Full Name
                </label>
              </div>
            </div>

            {/* Aadhar File Upload */}
            <div className="space-y-2">
              <Label>Upload Aadhar File</Label>
              <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 bg-gray-50">
                <input
                  key={inputKey}
                  type="file"
                  accept="image/*"
                  id="aadhaardoc"
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="aadhaardoc"
                  className="cursor-pointer text-gray-600 flex-1"
                >
                  {documentData.file
                    ? documentData.file.name
                    : "Browse Aadhar File"}
                </label>

                {documentData.file && (
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={removeFile}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Terms & Submit */}
          {!formsubmitted && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => setIsChecked(!!checked)}
                />
                <p className="text-sm text-muted-foreground leading-6">
                  This KYC verification is being done as per the request from{" "}
                  <strong>"{name}"</strong>. The result is not for any
                  promotional & commercial purposes. I agree to all{" "}
                  <span
                    className="underline cursor-pointer text-blue-600"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </span>
                  .
                </p>
              </div>

              <Button
                type="submit"
                disabled={!isChecked || loading || formsubmitted}
                className="min-w-[180px]"
              >
                {loading ? "Please wait..." : "Submit"}
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AadharForm;
