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
const Profile = () => {
  const { toast } = useToast();

  const [industries, setIndustry] = useState([]);
  const [disableform, setDisableform] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [company_type_list, setCompanyTypeList] = useState([]);
  const apiurl = "";
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const token = localStorage.getItem("token");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const pathname = location.pathname;

  const showmessage =
    searchParams.get("c9b1e5a4-1d5f-4b9e-9c32-8c0f4a9e1d3b") === "true";

  useEffect(() => {
    if (showmessage) {
      setSuccess("Please Update Your CIN Number");
      setMessageId(Date.now());

      // Remove all query params
      //router.replace(pathname);
    }
  }, [showmessage]);

  useEffect(() => {
    fetchindustries();
    FetchCompanyDetails();
    fetchcompanylist();
  }, []);

  const [formdata, setFormdata] = useState({
    company_type: "",
    cin_id: "",
    cin: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    established: "",
    teamsize: "",

    industry_type: [],
    allowinsearch: true,
    about: "",
    logo: null,
    cover: null,
    logo_preview: null,
    cover_preview: null,
  });
  const fetchcompanylist = async () => {
    try {
      const response = await API.get(`/api/companyprofile/get_company_types`);
      if (response.data.success) {
        setCompanyTypeList(response.data.data);
      }
    } catch (error) {}
  };
  const fetchindustries = async () => {
    try {
      const response = await API.get(`/api/sql/dropdown/get_industry `);
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item.id,
          label: item.job_industry,
        }));
        setIndustry(formatted);
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
    }
  };
  const handelcinsubmit = async () => {
    const regex =
      /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/;
    if (regex.test(formdata.cin)) {
      try {
        setDisableform(true);
        setLoading(true);
        setError(null);
        setErrorId(null);
        setSuccess(null);
        setMessageId(null);

        const response = await API.post(
          `/api/companyprofile/search_company_by_cin`,
          {
            cin: formdata.cin,
          },
        );
        if (response.data.success) {
          setFormdata({
            ...formdata,
            cin_id: response.data.data._id,
            cin: response.data.data.cinnumber,
            name: response.data.data.companyname,
            email: response.data.data.companyemail,
            phone: response.data.data.companyphone,
            address: response.data.data.companyaddress,
          });

          setError(null);
          setErrorId(null);
          setSuccess(response.data.message);
          setMessageId(Date.now());
        } else {
          setError("No Details Found Please Enter Valid CIN or Enter Manually");
          setErrorId(Date.now());
        }
      } catch (e) {
        setError("No Details Found Please Enter Valid CIN or Enter Manually");
        setErrorId(Date.now());
      } finally {
        setLoading(false);
        setDisableform(false);
      }
    } else {
      setError("Invalid CIN Please Enter Valid CIN or Enter Manually");
      setErrorId(Date.now());
    }
  };

  const FetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/api/companyprofile/get_company_details`);

      if (response.data.success) {
        const data = response.data.data;

        const submitted = data.isSubmitted === true;
        setIsSubmitted(submitted);
        const updatedFormData = {
          ...formdata,
          cin_id: data.cin_id || "",
          cin: data.cin || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone?.replace(/^91/, "") || "",
          address: data.address || "",
          website: data.website || "",
          established: data.established || "",
          teamsize: data.teamsize || "",
          industry_type: data.industry_type
            ?.split(",")
            .map((item) => parseInt(item.trim(), 10)),
          allowinsearch: data.allowinsearch || true,
          about: data.about || "",
          logo_preview: data.logo || "",
          cover_preview: data.cover || "",
          company_type: data.company_type || "",
        };

        setFormdata(updatedFormData);
        setDisableform(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formdata.logo_preview) {
      console.log("Updated formdata.logo_preview:", formdata.logo_preview); // ✅ Correct place
    }
  }, [formdata.logo_preview]);

  const handelsubmit = async (e) => {
    console.log(formdata);
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    if (formdata.company_type === "") {
      setError("Please Select Company Type");
      setErrorId(Date.now());
      setLoading(false);
      setSubmitting(false);
      return;
    }
    try {
      const payload = new FormData();
      for (const key in formdata) {
        if (formdata[key] !== null && formdata[key] !== undefined) {
          payload.append(key, formdata[key]);
        }
      }

      const response = await API.post(
        `/api/companyprofile/add_or_update_company`,
        payload,
      );
      if (response.data.success) {
        setError(null);
        setErrorId(null);
        setSuccess(response.data.message);
        setMessageId(Date.now());
        toast({
          title: "Success",
          description: response.data.message,
        });
        //wait for 2 seconds then setActiveTab= "account"
        setTimeout(() => {
          //setActiveTab("account");
        }, 2000);
      }
    } catch (error) {
      setError("Error Saving Details Please Try Again");
      toast({
        title: "Error",
        variant: "destructive",
        description: "Error Saving Details Please Try Again",
      });
      setErrorId(Date.now());
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const Deletecover = async () => {
    // Reset previous states
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);
    setLoading(true);

    try {
      const response = await API.delete(
        `/api/companyprofile/delete_cover_photo`,
      );

      if (response.data.success) {
        // Update the form state
        setFormdata((prev) => ({
          ...prev,
          cover_preview: null,
        }));

        // Show success
        setSuccess("Cover photo deleted");
        setMessageId(Date.now());
      } else {
        setError("Failed to delete cover photo");
        setErrorId(Date.now());
      }
    } catch (error) {
      setError("Failed to delete cover photo Please Try Again");
      setMessageId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || submitting || (!formdata.logo && !formdata.logo_preview);
  const [needcin, setNeedcin] = useState(false);
  useEffect(() => {
    if (formdata.company_type) {
      setNeedcin(Cincheck(formdata.company_type));
    } else {
      setNeedcin(false);
    }
  }, [formdata.company_type]);

  const Cincheck = (type_id) => {
    const item = company_type_list.find((item) => item._id === type_id);
    return item ? item.Has_CIN : false;
  };

  return (
    <>
      <style>
        {`
      .custom-textarea::placeholder {
        color: #c7c5c5 !important;
        font-size: 15px !important;
      }

      .suggestion-btn {
        bottom: 0;
        left: 10;
        display: flex;
        align-items: center;
        gap: 5px;
        background-color: #e8f0fe;
        color: #1a73e8;
        border-radius: 20px;
        padding: 6px 12px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
      }

      .suggestion-btn:hover {
        background-color: #d2e3fc;
      }

      .suggestion-btn svg {
        width: 16px;
        height: 16px;
      }
    `}
      </style>

      <form
        className="default-form"
        onSubmit={handelsubmit}
        type="multipart/form-data"
        method="post"
      >
        {/* Company Type */}
        <div className="space-y-2 mb-4" id="company_type">
          <Label>
            Company Type
            <span style={{ color: "red" }} className="ms-1">
              *
            </span>
          </Label>

          <div className="flex flex-wrap gap-4 mt-2">
            {company_type_list?.map((item) => (
              <div className="flex items-center gap-2" key={item._id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="company_type"
                  id={`company-${item._id}`}
                  value={item._id}
                  checked={formdata.company_type === item._id}
                  disabled={isSubmitted}
                  onChange={(e) =>
                    setFormdata({
                      ...formdata,
                      company_type: e.target.value,
                    })
                  }
                />

                <label htmlFor={`company-${item._id}`}>
                  {item.Legal_Structure}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* CIN */}
        {needcin && (
          <div className="space-y-2 mb-4">
            <Label>
              CIN
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <div className="flex gap-2">
              <Input
                type="text"
                name="cin"
                placeholder="Enter company CIN"
                value={formdata.cin}
                onChange={(e) =>
                  setFormdata({ ...formdata, cin: e.target.value })
                }
                readOnly={isSubmitted}
                disabled={isSubmitted}
                required
                pattern="^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$"
              />

              <Button
                type="button"
                disabled={isSubmitted}
                onClick={() => handelcinsubmit()}
              >
                <Search />
              </Button>
            </div>
          </div>
        )}

        {!isSubmitted && (
          <Button
            type="button"
            variant="warning"
            className="mb-4"
            onClick={() => setDisableform(false)}
          >
            Enter Manually
          </Button>
        )}

        {/* Main Form */}
        <div
          className="grid gap-4 md:grid-cols-2"
          style={{
            pointerEvents: disableform ? "none" : "auto",
            opacity: disableform ? 0.5 : 1,
          }}
        >
          {/* Company Name */}
          <div className="space-y-2">
            <Label>
              Company Name
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="text"
              name="name"
              placeholder="Enter company name"
              value={formdata.name}
              readOnly={isSubmitted}
              disabled={isSubmitted}
              onChange={(e) =>
                setFormdata({ ...formdata, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>
              Email Address
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="email"
              placeholder="Enter email address"
              value={formdata.email}
              readOnly={isSubmitted}
              disabled={isSubmitted}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>
              Phone
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="text"
              placeholder="Enter 10 digit mobile number"
              value={formdata.phone}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                setFormdata({
                  ...formdata,
                  phone: value,
                });
              }}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Delete",
                    "ArrowLeft",
                    "ArrowRight",
                    "Tab",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              required
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label>
              Website
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="url"
              placeholder="https://www.example.com"
              value={formdata.website}
              onChange={(e) =>
                setFormdata({ ...formdata, website: e.target.value })
              }
              required
            />
          </div>

          {/* Established */}
          <div className="space-y-2" style={{ position: "relative" }}>
            <Label>
              Est. Since
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Input
              type="date"
              name="website"
              placeholder="Est. Since"
              value={formdata.established ? YMD(formdata.established) : ""}
              onKeyDown={(e) => e.preventDefault()}
              onChange={(e) =>
                setFormdata({
                  ...formdata,
                  established: e.target.value,
                })
              }
              disabled={isSubmitted}
              required
            />
          </div>

          {/* Team Size */}
          <div className="space-y-2">
            <Label>
              Team Size
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
              value={formdata.teamsize}
              onChange={(e) =>
                setFormdata({ ...formdata, teamsize: e.target.value })
              }
            >
              <option value="less_than_50">Less than 50</option>
              <option value="50_100">50 - 100</option>
              <option value="101_500">101 - 500</option>
              <option value="501_1000">501 - 1000</option>
              <option value="more_than_1000">More than 1000</option>
            </select>
          </div>

          {/* Industry */}
          <div className="space-y-2 md:col-span-2">
            <Label>
              Industry Type
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <Select
              isMulti
              required
              name="industry"
              isDisabled={isSubmitted}
              options={industries}
              className="basic-multi-select"
              classNamePrefix="select"
              value={industries.filter((opt) =>
                formdata.industry_type?.includes(opt.value),
              )}
              onChange={(selectedOptions) =>
                setFormdata({
                  ...formdata,
                  industry_type: selectedOptions.map((option) => option.value),
                })
              }
            />
          </div>

          {/* Search Listing */}
          <div className="space-y-2">
            <Label>Allow In Search & Listing</Label>

            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formdata.searchlisting}
              onChange={(e) =>
                setFormdata({
                  ...formdata,
                  searchlisting: e.target.value,
                })
              }
            >
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>

          {/* About */}
          <div className="space-y-2 md:col-span-2">
            <Label>
              About Company
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <textarea
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm custom-textarea"
              required
              value={formdata.about}
              onChange={(e) =>
                setFormdata({ ...formdata, about: e.target.value })
              }
              placeholder="Write about your company..."
            ></textarea>
          </div>

          {/* Address */}
          <div className="space-y-2 md:col-span-2">
            <Label>
              Company Address
              <span style={{ color: "red" }} className="ms-1">
                *
              </span>
            </Label>

            <textarea
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm custom-textarea"
              required
              value={formdata.address}
              onChange={(e) =>
                setFormdata({ ...formdata, address: e.target.value })
              }
              placeholder="Enter company address..."
            ></textarea>
          </div>

          {/* Logo & Cover */}
          <LogoCoverUploader
            formdata={formdata}
            setFormdata={setFormdata}
            Deletecover={Deletecover}
          />
        </div>

        {/* Submit */}
        <Button
          className="gap-2 mt-4 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
          type="submit"
          disabled={isDisabled}
          style={{
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
        >
          {loading || submitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </>
  );
};

export default Profile;
