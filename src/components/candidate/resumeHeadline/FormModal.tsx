import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const FormModal = ({ show, onClose, data = {}, setRefresh ,setReload,
  setError_main,
  setSuccess_main}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  console.log("show",show)
   const [countries, setCountries] = useState([]);
  const [Genders, setGenders] = useState([]);
  const [isResidingInIndia, setIsResidingInIndia] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const salaryCurrencies = [
    { label: "₹", value: "INR" },
    { label: "$", value: "USD" },
    { label: "€", value: "EUR" },
    { label: "£", value: "GBP" },
  ];

  const [formData, setFormData] = useState({
    full_name: "",
    gender: "",
    dob: null,
    country: "",
    currentLocation: "",
    hometown: "",
    father_name: "",
    salary: "",
    currency: salaryCurrencies[0].value,
    experience_months: "",
    experience_years: "",
    mother_name: "",
  });

  useEffect(() => {
    if (isResidingInIndia) {
      setFormData((prev) => ({ ...prev, country: 102 }));
    }
  }, [isResidingInIndia]);

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token");
  }

  //if (!show) return null;

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGenders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_gender`);
        const data = await response.json();
        setGenders(data.data);
      } catch (error) {
        console.error("Error fetching genders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUerDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("candidate_token");
        const response = await API.get(
          `${apiurl}/api/userdata/user_details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setFormData({
            full_name: response.data.name || "",
            gender: response.data.gender || "",
            dob: response.data.dob ? new Date(response.data.dob) : null,
            country: response.data.country_id || "",
            currentLocation: response.data.currentLocation || "",
            hometown: response.data.hometown || "",
            father_name: response.data.father_name || "",
            mother_name: response.data.mother_name || "",
            salary: response.data.salary || "",
            currency: response.data.currency || "INR",
            experience_months: response.data.experience_months || "",
            experience_years: response.data.experience_years || "",
          });

          if (response.data.country_id == 102) {
            setIsResidingInIndia(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUerDetails();
    fetchGenders();
    fetchCountries();
  }, [apiurl]);

  const today = new Date();
  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );
  const handleCheckboxChange = (e) => {
    setIsResidingInIndia(e.target.checked);
  };

  const handleCountryChange = (e) => {
    setFormData((prev) => ({ ...prev, country: parseInt(e.target.value) }));
  };
  const handleSelect = (type, value, e) => {
    e.preventDefault();
    if (type === "gender")
      setFormData((prevData) => ({
        ...prevData,
        gender: value,
      }));

   /*  if (type === "marital") setSelectedMaritalStatus(value);
    if (type === "info") {
      setSelectedInfo((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } */
  };
  const handleDateChange = (date) => {
    if (date) {
      setFormData({ ...formData, dob: date }); // Store raw Date object
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "full_name") {
      const onlyLetters = /^[A-Za-z\s]*$/; // Allow letters and spaces only

      if (!onlyLetters.test(value)) {
        return; // Don't update state if invalid character
      }
    }

    if (name === "phone") {
      const onlyNumbers = /^[0-9]*$/; // Only numbers allowed

      // If value contains any non-numeric characters, prevent update
      if (!onlyNumbers.test(value)) {
        return; // Don't update state if invalid character
      }

      // Check for exact 10 characters
      if (value.length > 10) {
        return; // Prevent more than 10 characters
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    setError(null);
    setSuccess(null);
    if (!formData.full_name.trim() || !formData.gender || !formData.dob) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    if (!token) {
      setError("Authorization token is missing. Please log in.");
      return;
    }
    try {
      const response = await API.post(
        `${apiurl}/api/useraction/update-user-details`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Upload successful:", response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || "An error occurred");
      }
      setSuccess("Details updated successfully!");
      setSuccess_main("Details updated successfully!");
      setReload(true);
      setTimeout(() => onClose(), 1500); // Close modal after success
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to update Details. Please try again.");
      setError_main("Failed to update Details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.experience_years === "30+") {
      setFormData((prev) => ({ ...prev, experience_months: "" }));
    }
  }, [formData.experience_years]);
  if (!show) return null;

  return (
<Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">

    {/* Header */}
    <DialogHeader>
      <DialogTitle className="font-display text-xl">
        All About You
      </DialogTitle>

      <DialogDescription>
        Update your personal and professional details.
      </DialogDescription>
    </DialogHeader>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-5 pt-2">

      {/* Loader */}
      {loading ? (
       /*  <CustomizedProgressBars /> */
       "loading..."
      ) : (
        <>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Full Name <span className="text-red-500">*</span>
            </label>

            <input
              name="full_name"
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          {/* Father Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Father's Full Name
            </label>

            <input
              name="father_name"
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.father_name}
              onChange={handleChange}
              placeholder="Enter father's full name"
            />
          </div>

          {/* Mother Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Mother's Full Name
            </label>

            <input
              name="mother_name"
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.mother_name}
              onChange={handleChange}
              placeholder="Enter mother's full name"
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Gender <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-wrap gap-2">
              {Genders.map((gender) => (
                <button
                  key={gender.id}
                  type="button"
                  onClick={(e) => handleSelect("gender", gender.id, e)}
                  className={`px-3 py-1 rounded-full border text-sm ${
                    formData.gender == gender.id
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                >
                  {gender.name}
                </button>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Total Experience
            </label>

            <div className="flex gap-2">
              <select
                className="w-full border rounded-md px-2 py-2 text-sm"
                value={formData.experience_years || ""}
                onChange={(e) => {
                  const yearValue = e.target.value;
                  setFormData({
                    ...formData,
                    experience_years: yearValue,
                    experience_months:
                      yearValue === "30+"
                        ? ""
                        : formData.experience_months,
                  });
                }}
              >
                <option value="">Years</option>
                {[...Array(31).keys()].map((year) => (
                  <option key={year} value={year}>
                    {year} Year{year !== 1 ? "s" : ""}
                  </option>
                ))}
                <option value="30+">30+ Years</option>
              </select>

              {formData.experience_years !== "30+" && (
                <select
                  className="w-full border rounded-md px-2 py-2 text-sm"
                  value={formData.experience_months || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      experience_months: e.target.value,
                    })
                  }
                >
                  <option value="">Months</option>
                  {[...Array(12).keys()].map((month) => (
                    <option key={month} value={month}>
                      {month} Month{month !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Current Monthly Salary
            </label>

            <div className="flex gap-2">
              <select
                className="border rounded-md px-2 py-2 text-sm w-20"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currency: e.target.value,
                  })
                }
              >
                {salaryCurrencies.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                inputMode="numeric"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={Number(formData.salary || 0).toLocaleString("en-IN")}
                placeholder="Enter salary"
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  if (/^\d*$/.test(raw)) {
                    setFormData({
                      ...formData,
                      salary: raw,
                    });
                  }
                }}
              />
            </div>
          </div>

          {/* DOB */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Date of Birth <span className="text-red-500">*</span>
            </label>

          {/*   <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={formData.dob ? new Date(formData.dob) : null}
                onChange={handleDateChange}
                maxDate={eighteenYearsAgo}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    className: "w-full border rounded-md px-3 py-2 text-sm",
                    placeholder: "dd/mm/yyyy",
                  },
                }}
              />
            </LocalizationProvider> */}
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isResidingInIndia}
              onChange={handleCheckboxChange}
            />
            <label className="text-sm">
              Currently residing in India
            </label>
          </div>

          {/* Country */}
          {!isResidingInIndia && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Country</label>

              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={formData.country}
                onChange={handleCountryChange}
              >
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Current Location
            </label>

            <input
              name="currentLocation"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.currentLocation}
              onChange={handleChange}
              placeholder="Enter location"
            />
          </div>

          {/* Hometown */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              Hometown
            </label>

            <input
              name="hometown"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={formData.hometown}
              onChange={handleChange}
              placeholder="Enter hometown"
            />
          </div>
        </>
      )}

      {/* Footer */}
      <DialogFooter className="gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
  );
};

export default FormModal;
