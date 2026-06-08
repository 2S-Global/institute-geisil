import { useEffect, useState } from "react";
import { EmployerLayout } from "@/components/EmployerLayout";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import DocumentUpload from "@/components/employer/verifyEmployee/DocumentUpload";

import Additionfield, {
  serializeAdditionalFields,
} from "@/components/employer/verifyEmployee/Additionfield";

import { validateDocuments } from "@/components/employer/verifyEmployee/validateDocuments";

import api from "@/lib/axios";

import { toast } from "@/hooks/use-toast";

import { useNavigate } from "react-router-dom";

const VerifyEmployee = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [packageLoading, setPackageLoading] = useState(false);

  const [packages, setPackages] = useState<any[]>([]);

  const [selectedPackage, setSelectedPackage] = useState("");

  const [approvedFields, setApprovedFields] = useState<any>({});

  const [isChecked, setIsChecked] = useState(false);

  const [validationErrors, setValidationErrors] = useState<any>({});

  const [formData, setFormData] = useState<any>({
    name: "",
    dob: "",
    phone: "",
    email: "",
    gender: "",
    address: "",

    panname: "",
    pannumber: "",
    pandoc: null,

    votername: "",
    voternumber: "",
    voterdoc: null,

    licensename: "",
    licensenumber: "",
    licensedoc: null,

    additionalfields: {},
  });

  // =====================================
  // FETCH PACKAGES
  // =====================================

  const fetchPackages = async () => {
    try {
      setPackageLoading(true);

      // const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/companyPackageRoute/getPackageByCompany",
        {},
      );

      console.log("PACKAGES =>", response.data);

      if (response.data.success) {
        const selectedPlans = response.data?.data?.selected_plan || [];

        setPackages(selectedPlans);

        // auto select first package
        if (selectedPlans.length > 0) {
          setSelectedPackage(selectedPlans[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPackageLoading(false);
    }
  };

  // =====================================
  // FETCH APPROVED FIELDS
  // =====================================

  const fetchApprovedFields = async (packageId: string) => {
    try {
      // const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/fields/list_fields_by_company",
        {
          plan_id: packageId,
        },
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // },
      );

      console.log("APPROVED FIELDS =>", response.data);

      if (response.data.success) {
        setApprovedFields(response.data.company || {});
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =====================================
  // USE EFFECT
  // =====================================

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    if (selectedPackage) {
      fetchApprovedFields(selectedPackage);
    }
  }, [selectedPackage]);

  // =====================================
  // PAGE LOADER
  // =====================================

  if (packageLoading) {
    return (
      <EmployerLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </EmployerLayout>
    );
  }

  // =====================================
  // HANDLE CHANGE
  // =====================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let { name, value } = e.target;

    // ONLY LETTERS
    if (
      name === "name" ||
      name === "panname" ||
      name === "votername" ||
      name === "licensename"
    ) {
      const onlyLetters = /^[A-Za-z\s]*$/;

      if (!onlyLetters.test(value)) {
        return;
      }
    }

    // PHONE
    if (name === "phone") {
      const onlyNumbers = /^[0-9]*$/;

      if (!onlyNumbers.test(value)) {
        return;
      }

      if (value.length > 10) {
        return;
      }
    }

    // UPPERCASE
    if (
      name === "pannumber" ||
      name === "voternumber" ||
      name === "licensenumber"
    ) {
      value = value.toUpperCase();
    }

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    !validationErrors.email &&
    !validationErrors.phone &&
    !validationErrors.pannumber &&
    !validationErrors.voternumber &&
    !validationErrors.licensenumber &&
    !validationErrors.name &&
    !validationErrors.dob &&
    !validationErrors.plan &&
    Boolean(selectedPackage);

  // =====================================
  // FILE CHANGE
  // =====================================

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [`${name}doc`]: file,
    }));
  };

  const handleValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // EMAIL
    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      setValidationErrors((prev: any) => ({
        ...prev,
        email:
          value === ""
            ? "Email is required"
            : emailRegex.test(value)
              ? ""
              : "Invalid email format",
      }));
    }

    // PHONE
    if (name === "phone") {
      if (value === "") {
        setValidationErrors((prev: any) => ({
          ...prev,
          phone: "",
        }));
      } else if (value.length !== 10) {
        setValidationErrors((prev: any) => ({
          ...prev,
          phone: "Phone number must be exactly 10 digits",
        }));
      } else {
        setValidationErrors((prev: any) => ({
          ...prev,
          phone: "",
        }));
      }
    }

    // PAN
    if (name === "pannumber") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      setValidationErrors((prev: any) => ({
        ...prev,
        pannumber:
          value === "" ? "" : panRegex.test(value) ? "" : "Invalid PAN format",
      }));
    }

    // VOTER
    if (name === "voternumber") {
      const voterRegex = /^[A-Z]{3}[0-9]{7}$/;

      setValidationErrors((prev: any) => ({
        ...prev,
        voternumber:
          value === "" ? "" : voterRegex.test(value) ? "" : "Invalid Voter ID",
      }));
    }

    // LICENSE
    if (name === "licensenumber") {
      const normalized = value.toUpperCase().replace(/\s+/g, "");

      const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;

      setValidationErrors((prev: any) => ({
        ...prev,
        licensenumber:
          normalized === ""
            ? ""
            : licenseRegex.test(normalized)
              ? ""
              : "Invalid License format",
      }));
    }
  };

  // ✅ Form-level validation (show inline errors like FormModal)
  const validate = () => {
    const errors: any = {};

    // NAME
    if (!formData.name || !formData.name.trim()) {
      errors.name = "Full Name is required";
    }

    // DOB
    if (!formData.dob) {
      errors.dob = "Date of Birth is required";
    }

    // EMAIL
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    // PHONE (optional)
    if (formData.phone && formData.phone.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // PLAN
    if (!selectedPackage) {
      errors.plan = "Please select a plan";
    }

    // DOCUMENT NUMBERS (if provided validate format)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.pannumber && !panRegex.test(formData.pannumber)) {
      errors.pannumber = "Invalid PAN format";
    }

    const voterRegex = /^[A-Z]{3}[0-9]{7}$/;
    if (formData.voternumber && !voterRegex.test(formData.voternumber)) {
      errors.voternumber = "Invalid Voter ID";
    }

    // const licenseRegex = /^[A-Z]{2}[0-9]{2}\\s?[0-9]{4}\\s?[0-9]{7}$/;
    // if (formData.licensenumber && !licenseRegex.test(formData.licensenumber)) {
    //   errors.licensenumber = "Invalid License format";
    // }

    const normalizedLicense = formData.licensenumber
      ?.toUpperCase()
      .replace(/\s+/g, "");

    const licenseRegex = /^[A-Z]{2}[0-9]{13}$/;

    if (normalizedLicense && !licenseRegex.test(normalizedLicense)) {
      errors.licensenumber = "Invalid License format";
    }

    return errors;
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // run form-level validation and show inline messages
    const errors = validate();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const dob = new Date(formData.dob);

    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      toast({
        title: "Validation Error",
        description: "Employee must be at least 18 years old",
        variant: "destructive",
      });
      return;
    }

    const validationError = validateDocuments(formData);

    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      // PACKAGE
      payload.append("plan", selectedPackage);

      // BASIC DETAILS
      payload.append("name", formData.name || "");

      payload.append("dob", formData.dob || "");

      payload.append("phone", formData.phone || "");

      payload.append("email", formData.email || "");

      payload.append("gender", formData.gender || "");

      payload.append("address", formData.address || "");

      // PAN
      payload.append("panname", formData.panname || "");

      payload.append("pannumber", formData.pannumber || "");

      // VOTER
      payload.append("votername", formData.votername || "");

      payload.append("voternumber", formData.voternumber || "");

      // LICENSE
      payload.append("licensename", formData.licensename || "");

      payload.append("licensenumber", formData.licensenumber || "");

      // ADDITIONAL FIELDS
      payload.append(
        "additionalfields",
        serializeAdditionalFields(formData.additionalfields),
      );

      // FILES
      if (formData.pandoc) {
        payload.append("pandoc", formData.pandoc);
      }

      if (formData.voterdoc) {
        payload.append("voterdoc", formData.voterdoc);
      }

      if (formData.licensedoc) {
        payload.append("licensedoc", formData.licensedoc);
      }

      // const token = localStorage.getItem("token");

      const response = await api.post("/api/usercart/add_user_cart", payload, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        //   "Content-Type": "multipart/form-data",
        // },
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Employee verification submitted successfully",
        });

        navigate("/employer/paynow");
      }
    } catch (error: any) {
      console.log(error);

      // alert(error?.response?.data?.message || "Something went wrong");?
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Verify Employee</h1>

          <p className="text-muted-foreground mt-1">
            Add employee details for verification.
          </p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BASIC DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* NAME */}
                <div className="space-y-2">
                  <Label>
                    Full Name
                    <span className="text-red-500">*</span>
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

                {/* DOB */}
                <div className="space-y-2">
                  <Label>
                    Date of Birth
                    <span className="text-red-500">*</span>
                  </Label>

                  <div className="relative">
                    <Input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() - 18),
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                      className="pr-10"
                    />
                    {validationErrors.dob && (
                      <p className="text-xs text-destructive">
                        {validationErrors.dob}
                      </p>
                    )}
                  </div>
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <Label>Phone</Label>

                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleValidation}
                  />

                  {validationErrors.phone && (
                    <p className="text-xs text-destructive">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <Label>
                    Email
                    <span className="text-red-500">*</span>
                  </Label>

                  <Input
                    name="email"
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

                {/* GENDER */}
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

                {/* ADDRESS */}
                <div className="space-y-2">
                  <Label>Address</Label>

                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                {/* PLAN */}
                <div className="space-y-2">
                  <Label>
                    Plan <span className="text-red-500">*</span>
                  </Label>

                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="h-10 w-full rounded-md border bg-background px-3"
                  >
                    {packages.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.name} (₹ {item.transaction_fee})
                      </option>
                    ))}
                  </select>
                  {validationErrors.plan && (
                    <p className="text-xs text-destructive">
                      {validationErrors.plan}
                    </p>
                  )}
                </div>

                {/* ADDITIONAL FIELDS */}
                <Additionfield formData={formData} setFormData={setFormData} />
              </div>

              {/* DOCUMENTS */}

              <DocumentUpload
                label="PAN"
                name="pan"
                valuename={formData.panname}
                numbername={formData.pannumber}
                formData={formData}
                onfieldChange={handleChange}
                onFileChange={handleFileChange}
                disabled={!approvedFields?.PAN}
                numberError={validationErrors.pannumber}
                onfieldValidation={handleValidation}
              />

              <DocumentUpload
                label="Driving License"
                name="license"
                valuename={formData.licensename}
                numbername={formData.licensenumber}
                formData={formData}
                onfieldChange={handleChange}
                onFileChange={handleFileChange}
                disabled={!approvedFields?.DL}
                numberError={validationErrors.licensenumber}
                onfieldValidation={handleValidation}
              />

              <DocumentUpload
                label="EPIC"
                name="voter"
                valuename={formData.votername}
                numbername={formData.voternumber}
                formData={formData}
                onfieldChange={handleChange}
                onFileChange={handleFileChange}
                disabled={!approvedFields?.EPIC}
                numberError={validationErrors.voternumber}
                onfieldValidation={handleValidation}
              />

              <DocumentUpload
                label="UAN"
                name="uan"
                valuename={formData.uanname}
                numbername={formData.uannumber}
                formData={formData}
                onfieldChange={handleChange}
                onFileChange={handleFileChange}
                disabled={!approvedFields?.UAN}
                numberError={validationErrors.uannumber}
                onfieldValidation={handleValidation}
              />

              {/* TERMS */}
              <div className="flex items-start gap-3 rounded-lg border p-4">
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked: boolean) => setIsChecked(checked)}
                />

                <p className="text-sm text-muted-foreground leading-6">
                  This KYC verification is being done as per the request from
                  "2S GLOBAL TECHNOLOGIES LIMITED". The result is not for any
                  promotional & commercial purposes. I agree to all Terms and
                  Conditions.
                </p>
              </div>

              {/* BUTTON */}
              <Button
                type="submit"
                disabled={!isChecked || loading || packageLoading}
                className="min-w-[180px]"
              >
                {loading ? "Please wait..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </EmployerLayout>
  );
};

export default VerifyEmployee;
