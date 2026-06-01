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

const VerifyEmployee = () => {
  const [loading, setLoading] = useState(false);

  const [packageLoading, setPackageLoading] = useState(false);

  const [packages, setPackages] = useState<any[]>([]);

  const [selectedPackage, setSelectedPackage] = useState("");

  const [approvedFields, setApprovedFields] = useState<any>({});

  const [isChecked, setIsChecked] = useState(false);

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

  // =====================================
  // FILE CHANGE
  // =====================================

  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev: any) => ({
      ...prev,
      [`${name}doc`]: file,
    }));
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateDocuments(formData);

    if (validationError) {
      alert(validationError);
      return;
    }

    if (!selectedPackage) {
      alert("Please select plan");
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
        alert("Employee verification submitted successfully");

        setFormData({
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

        setSelectedPackage("");
      }
    } catch (error: any) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
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
                  <Label>Full Name</Label>

                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <Label>Date of Birth</Label>

                  <Input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <Label>Phone</Label>

                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <Label>Email</Label>

                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
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
                    required
                  >
                    <option value="">Select Plan</option>

                    {packages.map((item: any) => (
                      <option key={item._id} value={item._id}>
                        {item.name} (₹ {item.transaction_fee})
                      </option>
                    ))}
                  </select>
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
