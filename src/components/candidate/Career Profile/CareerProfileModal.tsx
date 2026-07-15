import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import API from "@/lib/axios";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const CareerProfileModal = ({
  isOpen,
  onClose,
  currentData,
  highlightField,
  onSaveSuccess,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // API Data Dropdown States
  const [apiIndustries, setApiIndustries] = useState([]);
  const [apiDepartments, setApiDepartments] = useState([]);
  const [apiJobRoles, setApiJobRoles] = useState([]);
  const [apiLocations, setApiLocations] = useState([]);

  // Location Search and Dropdown Interactive States
  const [locationSearch, setLocationSearch] = useState("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Unified Form State
  const [formData, setFormData] = useState({
    _id: "",
    industry: "",
    department: "",
    job_role: "",
    job_type: [],
    employment_type: [],
    work_location: [], // Will store objects: { id: 4101, name: "Kolkata" }
    currency_type: "INR",
    expected_salary: 0,
    shift: "",
  });

  const dropdownContainerRef = useRef(null);

  // Close custom dropdown safely if user clicks outside of the element container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target)
      ) {
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch Static Initial Data (Industries & Locations) on Mount/Open
  useEffect(() => {
    const fetchInitialDropdowns = async () => {
      setLoading(true);
      try {
        // Fetch Industries
        const indResponse = await API.get("/api/sql/dropdown/get_industry");
        let industriesList = [];
        if (indResponse.data?.success) {
          industriesList = indResponse.data.data || [];
        } else if (Array.isArray(indResponse.data)) {
          industriesList = indResponse.data;
        }
        setApiIndustries(industriesList);

        // Fetch Preferred Locations
        const locResponse = await API.get("/api/sql/dropdown/get_cities");
        let locationsList = [];
        if (locResponse.data?.success) {
          locationsList = locResponse.data.data || [];
        } else if (Array.isArray(locResponse.data)) {
          locationsList = locResponse.data;
        }
        setApiLocations(locationsList);
      } catch (err) {
        console.error("Error fetching initial dropdown settings:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchInitialDropdowns();
    }
  }, [isOpen]);

  // 2. Map loaded city name text identifiers ("Kolkata") to ID keys ("4101") inside state array mapping definitions
  useEffect(() => {
    if (apiLocations.length > 0 && formData.work_location.length > 0) {
      const updatedLocations = formData.work_location.map((loc) => {
        // If the location badge element only contains a ID reference string/number representation fallback
        if (loc.id && (loc.name === String(loc.id) || !loc.name)) {
          const foundCity = apiLocations.find(
            (apiLoc) =>
              (apiLoc.id ?? apiLoc._id ?? "").toString() === loc.id.toString(),
          );
          if (foundCity) {
            const cityName =
              foundCity.city_name ||
              foundCity.popular_location ||
              foundCity.location_name ||
              foundCity.city ||
              foundCity.name;
            return { id: loc.id, name: cityName };
          }
        }
        return loc;
      });

      // Quick equality assessment checklist reference flag to prevent infinite loops updates cycles
      if (
        JSON.stringify(updatedLocations) !==
        JSON.stringify(formData.work_location)
      ) {
        setFormData((prev) => ({ ...prev, work_location: updatedLocations }));
      }
    }
  }, [apiLocations, formData.work_location]);

  // 3. Fetch Cascading Departments based on Selected Industry ID
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!formData.industry) {
        setApiDepartments([]);
        return;
      }
      try {
        const response = await API.get(
          `https://api.geisil.com/api/sql/dropdown/get_job_departments?industry_id=${formData.industry}`,
        );
        if (response.data?.success) {
          setApiDepartments(response.data.data || []);
        } else if (Array.isArray(response.data)) {
          setApiDepartments(response.data);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, [formData.industry]);

  // 4. Fetch Cascading Job Roles based on Selected Department ID
  useEffect(() => {
    const fetchJobRoles = async () => {
      if (!formData.department) {
        setApiJobRoles([]);
        return;
      }
      try {
        const response = await API.get(
          `https://api.geisil.com/api/sql/dropdown/get_job_roles?department_id=${formData.department}`,
        );
        if (response.data?.success) {
          setApiJobRoles(response.data.data || []);
        } else if (Array.isArray(response.data)) {
          setApiJobRoles(response.data);
        }
      } catch (err) {
        console.error("Error fetching job roles:", err);
      }
    };
    fetchJobRoles();
  }, [formData.department]);

  // Sync incoming pre-populated records when open
  useEffect(() => {
    if (isOpen && currentData) {
      let initialLocations = [];
      if (Array.isArray(currentData.work_location)) {
        initialLocations = currentData.work_location;
      } else if (
        typeof currentData.work_location === "string" &&
        currentData.work_location.trim() !== ""
      ) {
        initialLocations = currentData.work_location
          .split(", ")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      setFormData({
        _id: currentData._id || "",
        industry: (currentData.industry || "").toString(),
        department: (currentData.department || "").toString(),
        job_role: (currentData.job_role || "").toString(),
        job_type: currentData.job_type
          ? Array.isArray(currentData.job_type)
            ? currentData.job_type
            : currentData.job_type.split(", ").filter(Boolean)
          : [],
        employment_type: currentData.employment_type
          ? Array.isArray(currentData.employment_type)
            ? currentData.employment_type
            : currentData.employment_type.split(", ").filter(Boolean)
          : [],
        shift: currentData.shift || "",
        work_location: initialLocations.map((loc) => {
          if (typeof loc === "object" && loc !== null) return loc;
          const numId = isNaN(Number(loc)) ? loc : Number(loc);
          return { id: numId, name: String(numId) }; // initialized placeholder name with stringified ID until dropdown API responds
        }),
        currency_type: currentData.currency_type || "INR",
        expected_salary: currentData.expected_salary ?? 0,
      });
    }
  }, [currentData, isOpen]);

  const handleCheckboxChange = (value, field) => {
    setFormData((prev) => {
      const currentList = prev[field];
      if (currentList.includes(value)) {
        return {
          ...prev,
          [field]: currentList.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [field]: [...currentList, value] };
      }
    });
  };

  const removeLocation = (idToRemove) => {
    setFormData((prev) => ({
      ...prev,
      work_location: prev.work_location.filter((loc) => loc.id !== idToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      _id: formData._id,
      industry: formData.industry,
      department: formData.department,
      job_role: formData.job_role,
      job_type: formData.job_type.join(", ") || "",
      employment_type: formData.employment_type.join(", ") || "",
      shift: formData.shift,
      work_location: formData.work_location.map((loc) => loc.id), // Submits correct ID payload: [4101]
      currency_type: formData.currency_type,
      expected_salary:
        Number(formData.expected_salary.toString().replace(/,/g, "")) || 0,
    };

    try {
      await API.post("/api/useraction/add_career_profile", payload);
      toast({
        title: "Success",
        description: "Career profile updated successfully.",
      });
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-white overflow-hidden rounded-xl border-0 shadow-lg">
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <DialogTitle className="text-lg font-semibold text-slate-800">
            Career profile
          </DialogTitle>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 space-y-5 max-h-[75vh] overflow-y-auto"
        >
          <p className="text-xs text-slate-500">
            Add details about your current and preferred job profile. This helps
            us personalise your job recommendations.
          </p>

          {/* Industry Field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Current industry<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.industry}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    industry: e.target.value,
                    department: "",
                    job_role: "",
                  }))
                }
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200/60 rounded-lg text-sm appearance-none cursor-pointer"
              >
                <option value="">Select Industry</option>
                {apiIndustries.map((ind) => (
                  <option
                    key={ind.id ?? ind._id}
                    value={(ind.id ?? ind._id).toString()}
                  >
                    {ind.industry_name || ind.job_industry || ind.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Current department<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.department}
                disabled={!formData.industry}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                    job_role: "",
                  }))
                }
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200/60 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="">Select Department</option>
                {apiDepartments.map((dept) => (
                  <option
                    key={dept.id ?? dept._id}
                    value={(dept.id ?? dept._id).toString()}
                  >
                    {dept.job_department || dept.department_name || dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Job Role Field */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Job role<span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.job_role}
                disabled={!formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, job_role: e.target.value }))
                }
                className="w-full h-11 px-3 bg-slate-50 border border-slate-200/60 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-60"
              >
                <option value="">Select Job Role</option>
                {apiJobRoles.map((role) => (
                  <option
                    key={role.id ?? role._id}
                    value={(role.id ?? role._id).toString()}
                  >
                    {role.job_role || role.job_role_name || role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desired Job Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Desired job type
            </label>
            <div className="flex gap-12 items-center px-1">
              {["Permanent", "Contractual"].map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={formData.job_type.includes(type)}
                    onCheckedChange={() =>
                      handleCheckboxChange(type, "job_type")
                    }
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Desired Employment Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Desired employment type
            </label>
            <div className="flex gap-12 items-center px-1">
              {["Full-time", "Part-time"].map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={formData.employment_type.includes(type)}
                    onCheckedChange={() =>
                      handleCheckboxChange(type, "employment_type")
                    }
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Shift Type */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Shift type
            </label>
            <div className="flex gap-8 items-center px-1">
              {["Day", "Night", "Flexible"].map((shiftItem) => (
                <label
                  key={shiftItem}
                  className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="shiftType"
                    checked={formData.shift === shiftItem}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, shift: shiftItem }))
                    }
                    className="w-4 h-4 accent-blue-600 border-slate-300 cursor-pointer"
                  />
                  <span>{shiftItem}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Searchable Work Location */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Preferred work location (Max 10)
            </label>
            <div className="space-y-2 relative" ref={dropdownContainerRef}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={
                    formData.work_location.length >= 10
                      ? "Maximum locations reached"
                      : "Type to search locations..."
                  }
                  value={locationSearch}
                  disabled={formData.work_location.length >= 10}
                  onFocus={() => setIsLocationDropdownOpen(true)}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full h-11 bg-slate-50 border border-slate-200/60 rounded-lg text-sm"
                />
              </div>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
                  {apiLocations
                    .map((loc) => {
                      const rawId = loc?.id ?? loc?._id;
                      const rawName =
                        loc?.city_name ||
                        loc?.popular_location ||
                        loc?.location_name ||
                        loc?.city ||
                        loc?.name ||
                        "Unknown Location";
                      return {
                        id: isNaN(Number(rawId)) ? rawId : Number(rawId),
                        name: String(rawName),
                      };
                    })
                    .filter(
                      (locObj) =>
                        locObj.name
                          .toLowerCase()
                          .includes(locationSearch.toLowerCase()) &&
                        !formData.work_location.some(
                          (selected) => selected.id === locObj.id,
                        ),
                    )
                    .map((locationItem, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            work_location: [
                              ...prev.work_location,
                              locationItem,
                            ],
                          }));
                          setLocationSearch("");
                          setIsLocationDropdownOpen(false);
                        }}
                        className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        {locationItem.name}
                      </div>
                    ))}
                </div>
              )}

              {/* Badges container: Correctly displays "Kolkata" instead of "4101" */}
              <div className="min-h-11 p-1.5 bg-slate-50 rounded-lg flex flex-wrap items-center gap-1.5 border border-slate-100">
                {formData.work_location.length === 0 && (
                  <span className="text-xs text-slate-400 px-1">
                    No locations specified.
                  </span>
                )}
                {formData.work_location.map((loc) => (
                  <span
                    key={loc.id}
                    className="inline-flex items-center bg-white text-xs font-medium text-slate-700 px-2 py-1 rounded border border-slate-100 shadow-sm"
                  >
                    {loc.name}
                    <button
                      type="button"
                      onClick={() => removeLocation(loc.id)}
                      className="ml-1.5 text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Expected Salary */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Expected salary
            </label>
            <div className="flex gap-2">
              <select
                value={formData.currency_type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currency_type: e.target.value,
                  }))
                }
                className="w-16 h-11 bg-slate-50 border border-slate-200/60 rounded-lg text-sm text-center"
              >
                <option value="INR">₹</option>
              </select>
              <Input
                type="number"
                value={formData.expected_salary ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expected_salary: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </form>

        <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3 bg-white">
          <Button
            type="button"
            onClick={onClose}
           variant="ghost"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || loading}
            onClick={handleSubmit}
            
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CareerProfileModal;

// import React, { useState, useEffect, useRef } from "react";
// import { X } from "lucide-react";
// import API from "@/lib/axios";

// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";

// const CareerProfileModal = ({
//   isOpen,
//   onClose,
//   currentData,
//   highlightField,
//   onSaveSuccess,
// }) => {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // API Data Dropdown States
//   const [apiIndustries, setApiIndustries] = useState([]);
//   const [apiDepartments, setApiDepartments] = useState([]);
//   const [apiJobRoles, setApiJobRoles] = useState([]);
//   const [apiLocations, setApiLocations] = useState([]);

//   // Location Search and Dropdown Interactive States
//   const [locationSearch, setLocationSearch] = useState("");
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

//   // Dynamic Highlight State
//   const [activeHighlight, setActiveHighlight] = useState(null);

//   // Unified Form State
//   const [formData, setFormData] = useState({
//     _id: "",
//     industry: "",
//     department: "",
//     job_role: "",
//     job_type: [],
//     employment_type: [],
//     work_location: [],
//     currency_type: "INR",
//     expected_salary: 0,
//     shift: "",
//   });

//   const dropdownContainerRef = useRef(null);

//   // Form input references
//   const fieldRefs = {
//     industry: useRef(null),
//     department: useRef(null),
//     job_role: useRef(null),
//     work_location: useRef(null),
//     expected_salary: useRef(null),
//   };

//   // Handles smooth scroll, auto-focus, and temporary highlight ring activation
//   useEffect(() => {
//     if (isOpen && highlightField) {
//       setActiveHighlight(highlightField);
      
//       setTimeout(() => {
//         if (fieldRefs[highlightField]?.current) {
//           fieldRefs[highlightField].current.focus();
//           fieldRefs[highlightField].current.scrollIntoView({
//             behavior: "smooth",
//             block: "center",
//           });
//         }
        
//         // Remove the blue outline after 2 seconds so it acts as a smooth indicator
//         setTimeout(() => {
//           setActiveHighlight(null);
//         }, 2000);
//       }, 150);
//     } else {
//       setActiveHighlight(null);
//     }
//   }, [isOpen, highlightField]);

//   // Close custom dropdown safely if user clicks outside of the element container
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownContainerRef.current &&
//         !dropdownContainerRef.current.contains(event.target)
//       ) {
//         setIsLocationDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // 1. Fetch Static Initial Data on Mount/Open
//   useEffect(() => {
//     const fetchInitialDropdowns = async () => {
//       setLoading(true);
//       try {
//         const indResponse = await API.get("/api/sql/dropdown/get_industry");
//         let industriesList = indResponse.data?.success ? indResponse.data.data || [] : Array.isArray(indResponse.data) ? indResponse.data : [];
//         setApiIndustries(industriesList);

//         const locResponse = await API.get("/api/sql/dropdown/get_cities");
//         let locationsList = locResponse.data?.success ? locResponse.data.data || [] : Array.isArray(locResponse.data) ? locResponse.data : [];
//         setApiLocations(locationsList);
//       } catch (err) {
//         console.error("Error fetching initial dropdown settings:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (isOpen) {
//       fetchInitialDropdowns();
//     }
//   }, [isOpen]);

//   // 2. Map loaded city name text identifiers
//   useEffect(() => {
//     if (apiLocations.length > 0 && formData.work_location.length > 0) {
//       const updatedLocations = formData.work_location.map((loc) => {
//         if (loc.id && (loc.name === String(loc.id) || !loc.name)) {
//           const foundCity = apiLocations.find(
//             (apiLoc) => (apiLoc.id ?? apiLoc._id ?? "").toString() === loc.id.toString(),
//           );
//           if (foundCity) {
//             const cityName = foundCity.city_name || foundCity.popular_location || foundCity.location_name || foundCity.city || foundCity.name;
//             return { id: loc.id, name: cityName };
//           }
//         }
//         return loc;
//       });

//       if (JSON.stringify(updatedLocations) !== JSON.stringify(formData.work_location)) {
//         setFormData((prev) => ({ ...prev, work_location: updatedLocations }));
//       }
//     }
//   }, [apiLocations, formData.work_location]);

//   // 3. Fetch Cascading Departments based on Selected Industry ID
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       if (!formData.industry) {
//         setApiDepartments([]);
//         return;
//       }
//       try {
//         const response = await API.get(
//           `https://api.geisil.com/api/sql/dropdown/get_job_departments?industry_id=${formData.industry}`,
//         );
//         if (response.data?.success) {
//           setApiDepartments(response.data.data || []);
//         } else if (Array.isArray(response.data)) {
//           setApiDepartments(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching departments:", err);
//       }
//     };
//     fetchDepartments();
//   }, [formData.industry]);

//   // 4. Fetch Cascading Job Roles based on Selected Department ID
//   useEffect(() => {
//     const fetchJobRoles = async () => {
//       if (!formData.department) {
//         setApiJobRoles([]);
//         return;
//       }
//       try {
//         const response = await API.get(
//           `https://api.geisil.com/api/sql/dropdown/get_job_roles?department_id=${formData.department}`,
//         );
//         if (response.data?.success) {
//           setApiJobRoles(response.data.data || []);
//         } else if (Array.isArray(response.data)) {
//           setApiJobRoles(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching job roles:", err);
//       }
//     };
//     fetchJobRoles();
//   }, [formData.department]);

//   // Sync incoming records
//   useEffect(() => {
//     if (isOpen && currentData) {
//       let initialLocations = [];
//       if (Array.isArray(currentData.work_location)) {
//         initialLocations = currentData.work_location;
//       } else if (typeof currentData.work_location === "string" && currentData.work_location.trim() !== "") {
//         initialLocations = currentData.work_location.split(", ").map((s) => s.trim()).filter(Boolean);
//       }

//       setFormData({
//         _id: currentData._id || "",
//         industry: (currentData.industry || "").toString(),
//         department: (currentData.department || "").toString(),
//         job_role: (currentData.job_role || "").toString(),
//         job_type: currentData.job_type ? (Array.isArray(currentData.job_type) ? currentData.job_type : currentData.job_type.split(", ").filter(Boolean)) : [],
//         employment_type: currentData.employment_type ? (Array.isArray(currentData.employment_type) ? currentData.employment_type : currentData.employment_type.split(", ").filter(Boolean)) : [],
//         shift: currentData.shift || "",
//         work_location: initialLocations.map((loc) => {
//           if (typeof loc === "object" && loc !== null) return loc;
//           const numId = isNaN(Number(loc)) ? loc : Number(loc);
//           return { id: numId, name: String(numId) };
//         }),
//         currency_type: currentData.currency_type || "INR",
//         expected_salary: currentData.expected_salary ?? 0,
//       });
//     }
//   }, [currentData, isOpen]);

//   const handleCheckboxChange = (value, field) => {
//     setFormData((prev) => {
//       const currentList = prev[field];
//       if (currentList.includes(value)) {
//         return { ...prev, [field]: currentList.filter((item) => item !== value) };
//       } else {
//         return { ...prev, [field]: [...currentList, value] };
//       }
//     });
//   };

//   const removeLocation = (idToRemove) => {
//     setFormData((prev) => ({
//       ...prev,
//       work_location: prev.work_location.filter((loc) => loc.id !== idToRemove),
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const payload = {
//       _id: formData._id,
//       industry: formData.industry,
//       department: formData.department,
//       job_role: formData.job_role,
//       job_type: formData.job_type.join(", ") || "",
//       employment_type: formData.employment_type.join(", ") || "",
//       shift: formData.shift,
//       work_location: formData.work_location.map((loc) => loc.id),
//       currency_type: formData.currency_type,
//       expected_salary: Number(formData.expected_salary.toString().replace(/,/g, "")) || 0,
//     };

//     try {
//       await API.post("/api/useraction/add_career_profile", payload);
//       toast({ title: "Success", description: "Career profile updated successfully." });
//       if (onSaveSuccess) onSaveSuccess();
//       onClose();
//     } catch (error) {
//       console.error(error);
//       toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       {/* onOpenAutoFocus prevents the modal from automatically focusing the industry selector */}
//       <DialogContent 
//         onOpenAutoFocus={(e) => e.preventDefault()} 
//         className="sm:max-w-[480px] p-0 bg-white overflow-hidden rounded-xl border-0 shadow-lg"
//       >
//         <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
//           <DialogTitle className="text-lg font-semibold text-slate-800">
//             Career profile
//           </DialogTitle>
//         </div>

//         <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 max-h-[75vh] overflow-y-auto">
//           <p className="text-xs text-slate-500">
//             Add details about your current and preferred job profile. This helps us personalise your job recommendations.
//           </p>

//           {/* Industry Field */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-1.5">
//               Current industry<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 ref={fieldRefs.industry}
//                 value={formData.industry}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     industry: e.target.value,
//                     department: "",
//                     job_role: "",
//                   }))
//                 }
//                 className={`w-full h-11 px-3 bg-slate-50 border rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-slate-200 transition-all ${
//                   activeHighlight === "industry" 
//                     ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10" 
//                     : "border-slate-200/60"
//                 }`}
//               >
//                 <option value="">Select Industry</option>
//                 {apiIndustries.map((ind) => (
//                   <option key={ind.id ?? ind._id} value={(ind.id ?? ind._id).toString()}>
//                     {ind.industry_name || ind.job_industry || ind.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Department Field */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-1.5">
//               Current department<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 ref={fieldRefs.department}
//                 value={formData.department}
//                 disabled={!formData.industry}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     department: e.target.value,
//                     job_role: "",
//                   }))
//                 }
//                 className={`w-full h-11 px-3 bg-slate-50 border rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all ${
//                   activeHighlight === "department" 
//                     ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10" 
//                     : "border-slate-200/60"
//                 }`}
//               >
//                 <option value="">Select Department</option>
//                 {apiDepartments.map((dept) => (
//                   <option key={dept.id ?? dept._id} value={(dept.id ?? dept._id).toString()}>
//                     {dept.job_department || dept.department_name || dept.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Job Role Field */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-1.5">
//               Job role<span className="text-red-500 ml-0.5">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 ref={fieldRefs.job_role}
//                 value={formData.job_role}
//                 disabled={!formData.department}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, job_role: e.target.value }))}
//                 className={`w-full h-11 px-3 bg-slate-50 border rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-60 focus:outline-none focus:ring-0 focus:border-slate-200 transition-all ${
//                   activeHighlight === "job_role" 
//                     ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10" 
//                     : "border-slate-200/60"
//                 }`}
//               >
//                 <option value="">Select Job Role</option>
//                 {apiJobRoles.map((role) => (
//                   <option key={role.id ?? role._id} value={(role.id ?? role._id).toString()}>
//                     {role.job_role || role.job_role_name || role.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Desired Job Type */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-2">Desired job type</label>
//             <div className="flex gap-12 items-center px-1">
//               {["Permanent", "Contractual"].map((type) => (
//                 <label key={type} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none">
//                   <Checkbox checked={formData.job_type.includes(type)} onCheckedChange={() => handleCheckboxChange(type, "job_type")} />
//                   <span>{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Desired Employment Type */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-2">Desired employment type</label>
//             <div className="flex gap-12 items-center px-1">
//               {["Full-time", "Part-time"].map((type) => (
//                 <label key={type} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none">
//                   <Checkbox checked={formData.employment_type.includes(type)} onCheckedChange={() => handleCheckboxChange(type, "employment_type")} />
//                   <span>{type}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Shift Type */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-2">Shift type</label>
//             <div className="flex gap-8 items-center px-1">
//               {["Day", "Night", "Flexible"].map((shiftItem) => (
//                 <label key={shiftItem} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer select-none">
//                   <input
//                     type="radio"
//                     name="shiftType"
//                     checked={formData.shift === shiftItem}
//                     onChange={() => setFormData((prev) => ({ ...prev, shift: shiftItem }))}
//                     className="w-4 h-4 accent-blue-600 border-slate-300 cursor-pointer"
//                   />
//                   <span>{shiftItem}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Preferred Work Location */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-1.5">Preferred work location (Max 10)</label>
//             <div className="space-y-2 relative" ref={dropdownContainerRef}>
//               <div className="relative">
//                 <Input
//                   ref={fieldRefs.work_location}
//                   type="text"
//                   placeholder={formData.work_location.length >= 10 ? "Maximum locations reached" : "Type to search locations..."}
//                   value={locationSearch}
//                   disabled={formData.work_location.length >= 10}
//                   onFocus={() => setIsLocationDropdownOpen(true)}
//                   onChange={(e) => setLocationSearch(e.target.value)}
//                   className={`w-full h-11 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-0 focus:border-slate-200 transition-all ${
//                     activeHighlight === "work_location" 
//                       ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10" 
//                       : "border-slate-200/60"
//                   }`}
//                 />
//               </div>

//               {isLocationDropdownOpen && (
//                 <div className="absolute left-0 z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-lg">
//                   {apiLocations
//                     .map((loc) => {
//                       const rawId = loc?.id ?? loc?._id;
//                       const rawName = loc?.city_name || loc?.popular_location || loc?.location_name || loc?.city || loc?.name || "Unknown Location";
//                       return { id: isNaN(Number(rawId)) ? rawId : Number(rawId), name: String(rawName) };
//                     })
//                     .filter((locObj) => locObj.name.toLowerCase().includes(locationSearch.toLowerCase()) && !formData.work_location.some((selected) => selected.id === locObj.id))
//                     .map((locationItem, idx) => (
//                       <div
//                         key={idx}
//                         onClick={() => {
//                           setFormData((prev) => ({ ...prev, work_location: [...prev.work_location, locationItem] }));
//                           setLocationSearch("");
//                           setIsLocationDropdownOpen(false);
//                         }}
//                         className="px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
//                       >
//                         {locationItem.name}
//                       </div>
//                     ))}
//                 </div>
//               )}

//               <div className="min-h-11 p-1.5 bg-slate-50 rounded-lg flex flex-wrap items-center gap-1.5 border border-slate-100">
//                 {formData.work_location.length === 0 && <span className="text-xs text-slate-400 px-1">No locations specified.</span>}
//                 {formData.work_location.map((loc) => (
//                   <span key={loc.id} className="inline-flex items-center bg-white text-xs font-medium text-slate-700 px-2 py-1 rounded border border-slate-100 shadow-sm">
//                     {loc.name}
//                     <button type="button" onClick={() => removeLocation(loc.id)} className="ml-1.5 text-slate-400 hover:text-slate-600 font-bold">×</button>
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Expected Salary */}
//           <div>
//             <label className="text-xs font-semibold text-slate-700 block mb-1.5">Expected salary</label>
//             <div className="flex gap-2">
//               <select
//                 value={formData.currency_type}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, currency_type: e.target.value }))}
//                 className="w-16 h-11 bg-slate-50 border border-slate-200/60 rounded-lg text-sm text-center"
//               >
//                 <option value="INR">₹</option>
//               </select>
//               <Input
//                 ref={fieldRefs.expected_salary}
//                 type="number"
//                 value={formData.expected_salary ?? ""}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, expected_salary: Number(e.target.value) }))}
//                 className={`focus:outline-none focus:ring-0 focus:border-slate-200 transition-all ${
//                   activeHighlight === "expected_salary" 
//                     ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/10" 
//                     : "border-slate-200/60"
//                 }`}
//               />
//             </div>
//           </div>
//         </form>

//         <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-3 bg-white">
//           <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
//           <Button type="submit" disabled={isSubmitting || loading} onClick={handleSubmit}>
//             {isSubmitting ? "Saving..." : "Save"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CareerProfileModal;