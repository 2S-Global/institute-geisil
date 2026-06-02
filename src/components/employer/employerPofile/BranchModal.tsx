import React, { useState, useEffect } from "react";
//import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
/* import CustomizedProgressBars from "@/components/common/loader";
import MessageComponent from "@/components/common/ResponseMsg" */;
//import axios from "axios";
//import { id } from "date-fns/locale";
import API from "../../../lib/axios";
import { useToast } from "@/hooks/use-toast";
const BranchModal = ({
  show,
  onClose,
  setError,
  setErrorId,
  setSuccess,
  setMessageId,
  setRefresh,
  item = {},
}) => {
  if (!show) return null;
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const apiurl = "";
  const token = localStorage.getItem("token");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: item._id || "",
    name: item.name || "",
    country: item.country?._id || "",
    state: item.state?._id || "",
    city: item.city?._id || "",
    address: item.address || "",
    phone: item.phone || "",
    email: item.email || "",
  });

  useEffect(() => {
    FetchCountries();
  }, [apiurl]);

  useEffect(() => {
    if (formData.country) {
      FetchStates(formData.country);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      FetchCities(formData.state);
    }
  }, [formData.state]);

  const FetchCountries = async () => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_conunty`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setCountries(formatted);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchStates = async (countryId) => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_state_by_conunty/${countryId}`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setStates(formatted);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchCities = async (stateId) => {
    setLoading(true);
    try {
      const response = await API.get(
        `/api/companyprofile/get_city_by_state/${stateId}`
      );
      if (response.data.success) {
        const formatted = response.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setCities(formatted);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handelsubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitting(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      // Choose API endpoint based on whether it's an edit or add
      const endpoint = formData.id
        ? `/api/companyprofile/edit_branch`
        : `/api/companyprofile/add_branch`;

      const cleanedData = {
        ...formData,
        city: formData.city || undefined, // remove empty city
        state: formData.state || undefined, // optional if state also isn't mandatory
        country: formData.country || undefined,
      };

      const response = await API.post(endpoint, cleanedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle success or failure
      if (response.data.success) {
        setSuccess(response.data.message);
        setMessageId(Date.now());
         toast({
                    title: "Success",
                    description: response.data.message,
                  });

        // Close modal after short delay
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(response.data.message || "Operation failed");
        setErrorId(Date.now());
        toast({
                    title: "Error",
                    description: response.data.message,
                  });
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error saving details, please try again."
      );
      toast({
                    title: "Error",
                    description: "Error saving details, please try again.",
                  });
      setErrorId(Date.now());
    } finally {
      setRefresh(true);
      setLoading(false);
      setSubmitting(false);
      onClose();
    }
  };

  const isDisabled = loading || submitting;

  return (
<>
{/*   {loading && (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center bg-white/75"
    >
      
    </div>
  )} */}

  {/* Modal Overlay */}
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    
    {/* Modal */}
    <div className="w-full max-w-4xl overflow-hidden rounded-xl bg-background shadow-2xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold">
            {formData.id ? "Update Branch" : "Add Branch"}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Fill in the branch information below
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 transition hover:bg-muted"
        >
          <span className="text-xl leading-none">&times;</span>
        </button>
      </div>

      {/* Form */}
      <form
        className="default-form"
        onSubmit={handelsubmit}
        type="multipart/form-data"
        method="post"
      >
        {/* Body */}
        <div className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            
            {/* Left Side */}
            <div className="space-y-4">
              
              {/* Branch Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Branch Name
                  <span className="ms-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  required
                  placeholder="Enter your branch name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Branch Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Branch Email
                  <span className="ms-1 text-red-500">*</span>
                </label>

                <input
                  type="email"
                  name="branchEmail"
                  required
                  placeholder="Enter your branch email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Branch Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Branch Phone
                  <span className="ms-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="branchPhone"
                  required
                  placeholder="Enter your branch phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-4">
              
              {/* Country */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Country
                </label>

                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      country: e.target.value,
                    })
                  }
                >
                  <option value="">Select Country</option>

                  {countries.map((country) => (
                    <option
                      key={country.value}
                      value={country.value}
                    >
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  State
                </label>

                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      state: e.target.value,
                    })
                  }
                >
                  <option value="">Select State</option>

                  {states.map((state) => (
                    <option
                      key={state.value}
                      value={state.value}
                    >
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  City
                </label>

                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      city: e.target.value,
                    })
                  }
                >
                  <option value="">Select City</option>

                  {cities.map((city) => (
                    <option
                      key={city.value}
                      value={city.value}
                    >
                      {city.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">
                Complete Address
                <span className="ms-1 text-red-500">*</span>
              </label>

              <textarea
                name="address"
                required
                rows="3"
                placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="custom-textarea flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                style={{
                  resize: "vertical",
                }}
              ></textarea>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isDisabled}
            style={{
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-brand transition hover:bg-[hsl(var(--primary-hover))] disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : formData.id
              ? "Update Branch"
              : "Add Branch"}
          </button>
        </div>
      </form>
    </div>
  </div>
</>
  );
};

export default BranchModal;
