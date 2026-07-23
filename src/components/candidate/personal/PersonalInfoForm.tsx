
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "react-select";
import { Calendar } from "lucide-react";
import Disability from "./Disability";
import CareerBreak from "./CareerBreak";
import LanguageProficiency from "./Language";

const PersonalInfoForm = ({
  show,
  onClose,
  setReload,
  formData,
  setFormData,
  focusSection,
  setWrongDate,
  targetLanguageId,
}) => {
  const apiurl = import.meta.env.VITE_API_URL;

  const [Genders, setGenders] = useState([]);
  const [countries, setCountries] = useState([]);
  const [more_info_list, setMore_info_list] = useState([]);
  const [marriageStatusList, setMarriageStatusList] = useState([]);
  const [withpartnername, setWithpartnername] = useState([]);
  const [categories, setCategories] = useState([]);
  const [UsaVisaList, setUsaVisaList] = useState([]);

  const [renderLanguages, setRenderLanguages] = useState(false);
  // Self-contained state to track which block is currently flashing/active
  const [activeHighlight, setActiveHighlight] = useState(null);

  useEffect(() => {
    if (!focusSection || focusSection === "languages") {
      setRenderLanguages(true);
    } else {
      setRenderLanguages(false);
    }
  }, [focusSection]);

  const personalInfo = useRef(null);
  const category = useRef(null);
  const careerBreak = useRef(null);
  const workPermit = useRef(null);
  const languages = useRef(null);
  const dob = useRef(null);
  const differentlyAbled = useRef(null);
  const address = useRef(null);

  const today = new Date();

  const [loading, setLoading] = useState(false);
  const [onpincode, setOnPincode] = useState(false);

  useEffect(() => {
    if (loading || !show || !focusSection) return;

    const sectionRefs = {
      personalInfo,
      category,
      careerBreak,
      workPermit,
      languages,
      dob,
      differentlyAbled,
      address,
    };

    const targetRef = sectionRefs[focusSection];

    if (!targetRef) {
      console.warn("No matching ref for focusSection:", focusSection);
      return;
    }

    setTimeout(() => {
      if (focusSection === "languages") {
        setRenderLanguages(true);
        return;
      }
      if (targetRef.current) {
        try {
          targetRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          // Set the active component highlight row
          setActiveHighlight(focusSection);

          const timeout = setTimeout(() => {
            setActiveHighlight(null);
          }, 3000);

          return () => clearTimeout(timeout);
        } catch (err) {
          console.error("Scroll error:", err);
        }
      }
    }, 100);
  }, [show, focusSection, loading]);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_gender`);
        const data = await response.json();
        setGenders(data.data || []);
      } catch (error) {
        console.error("Error fetching genders:", error);
      }
    };

    const fetchMoreInfoList = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/more_information`);
        const data = await response.json();
        setMore_info_list(data.data || []);
      } catch (error) {
        console.error("Error fetching more info list:", error);
      }
    };

    const fetchMarriageStatusList = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/marital_status`);
        const data = await response.json();
        setMarriageStatusList(data.data || []);
        setWithpartnername(data.hasPartner || []);
      } catch (error) {
        console.error("Error fetching marriage status list:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/category_details`);
        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchUsaVisaList = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/visa_type`);
        const data = await response.json();
        setUsaVisaList(data.data || []);
      } catch (error) {
        console.error("Error fetching USA visa list:", error);
      }
    };

    const fetchCountries = async () => {
      try {
        const response = await fetch(`${apiurl}/api/sql/dropdown/All_contry`);
        const data = await response.json();
        setCountries(
          (data.data || []).map((country) => ({
            label: country.name,
            value: country.id,
          }))
        );
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    setLoading(true);
    Promise.all([
      fetchCountries(),
      fetchUsaVisaList(),
      fetchCategories(),
      fetchMarriageStatusList(),
      fetchGenders(),
      fetchMoreInfoList(),
    ]).finally(() => setLoading(false));
  }, [apiurl]);

  const handleSelect = (key, value, e) => {
    e.preventDefault();
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleMultiSelect = (key, value, e) => {
    e.preventDefault();
    setFormData((prev) => {
      const currentValues = prev[key] || [];
      const isSelected = currentValues.includes(value);
      return {
        ...prev,
        [key]: isSelected
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleChange = (selectedOptions) => {
    setFormData({
      ...formData,
      work_permit_other_countries: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    });
  };

  useEffect(() => {
    if (!formData?.have_usa_visa) {
      setFormData((prev) => ({
        ...prev,
        usa_visa_type: "",
      }));
    }
  }, [formData?.have_usa_visa]);

  // Helper to append dynamic classes without needing any external CSS layout targets
  const getHighlightClass = (sectionId) => {
    const baseClass = "p-3 border rounded-lg transition-all duration-500 ease-in-out ";
    if (activeHighlight === sectionId) {
      return baseClass + "border-[#223B6B] bg-[#223B6B]/[0.02] shadow-[0_0_0_3px_rgba(34,59,107,0.15)]";
    }
    return baseClass + "border-transparent bg-transparent";
  };

  if (!show) return null;

  const safeMoreInfo = Array.isArray(formData?.more_info) ? formData.more_info : [];
  const safeWorkPermitCountries = Array.isArray(formData?.work_permit_other_countries) ? formData.work_permit_other_countries : [];
  const safePartnerList = Array.isArray(withpartnername) ? withpartnername : [];

  return (
    <>
      {loading ? (
        "loading...."
      ) : (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {!renderLanguages && (
            <>
              {/* Personal Info Section Container */}
              <div ref={personalInfo} id="personalInfo" className={`${getHighlightClass("personalInfo")} space-y-6`}>
                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Genders.map((gender) => (
                      <button
                        type="button"
                        key={gender.id}
                        onClick={(e) => handleSelect("gender", gender.id, e)}
                        className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                          formData?.gender == gender.id
                            ? "bg-indigo-100 border-indigo-500 font-semibold"
                            : "bg-white border-gray-400 text-gray-700"
                        }`}
                      >
                        {gender.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* More Info */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    More Information
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {more_info_list.map((info) => (
                      <button
                        type="button"
                        key={info.id}
                        onClick={(e) => handleMultiSelect("more_info", info.id, e)}
                        className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                          safeMoreInfo.includes(info.id)
                            ? "bg-indigo-100 border-indigo-500 font-semibold"
                            : "bg-white border-gray-400 text-gray-700"
                        }`}
                      >
                        {info.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Marital Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {marriageStatusList.map((status) => (
                      <button
                        type="button"
                        key={status.id}
                        onClick={(e) => handleSelect("marital_status", status.id, e)}
                        className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                          formData?.marital_status == status.id
                            ? "bg-indigo-100 border-indigo-500 font-semibold"
                            : "bg-white border-gray-400 text-gray-700"
                        }`}
                      >
                        {status.status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Partner Name */}
                {(safePartnerList.includes(formData?.marital_status) || Boolean(formData?.partner_name)) && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Spouse Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      placeholder="Partner Name"
                      value={formData?.partner_name || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          partner_name: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* DOB Section Container */}
              <div ref={dob} id="dob" className={getHighlightClass("dob")}>
                <label className="block text-sm font-semibold mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer accent-indigo-600 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    value={
                      formData?.dob
                        ? new Date(formData.dob).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dob: e.target.value,
                      })
                    }
                    max={today.toISOString().split("T")[0]}
                  />
                  <Calendar className="absolute right-3 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Category Section Container */}
              <div ref={category} id="category" className={getHighlightClass("category")}>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>
                <p className="text-gray-500 text-sm mb-2">
                  Companies welcome people from various categories to bring equality among all citizens.
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={(e) => handleSelect("category", cat.id, e)}
                      className={`px-4 py-1.5 rounded-full border text-sm transition-all ${
                        formData?.category == cat.id
                          ? "bg-indigo-100 border-indigo-500 font-semibold"
                          : "bg-white border-gray-400 text-gray-700"
                      }`}
                    >
                      {cat.category_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Differently Abled Section Container */}
              <div ref={differentlyAbled} id="differentlyAbled" className={getHighlightClass("differentlyAbled")}>
                <label className="block text-sm font-semibold mb-2">
                  Are you differently abled?
                </label>
                <div className="flex gap-4 mb-2">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        checked={formData?.differently_abled === option}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            differently_abled: option,
                          })
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {formData?.differently_abled === "Yes" && (
                  <Disability
                    formData={formData}
                    setFormData={setFormData}
                    apiurl={apiurl}
                  />
                )}
              </div>

              {/* Career Break Section Container */}
              <div ref={careerBreak} id="careerBreak" className={getHighlightClass("careerBreak")}>
                <label className="block text-sm font-semibold mb-2">
                  Have you taken a career break?
                </label>
                <div className="flex gap-4 mb-2">
                  {["Yes", "No"].map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        checked={formData?.career_break === option}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            career_break: option,
                          })
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>

                {formData?.career_break === "Yes" && (
                  <CareerBreak
                    formData={formData}
                    setFormData={setFormData}
                    apiurl={apiurl}
                    setWrongDate={setWrongDate}
                  />
                )}
              </div>

              {/* Work Permit Section Container */}
              <div ref={workPermit} id="workPermit" className={getHighlightClass("workPermit")}>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Do you have a Work permit for USA
                  </label>
                  <select
                    className="w-full border px-3 py-2 rounded-md bg-white"
                    value={String(formData?.have_usa_visa ?? false)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        have_usa_visa: e.target.value === "true",
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {formData?.have_usa_visa && (
                  <div className="mt-3">
                    <label className="block text-sm font-semibold mb-2">
                      Work permit for USA
                    </label>
                    <select
                      className="w-full border px-3 py-2 rounded-md bg-white"
                      value={formData?.usa_visa_type || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usa_visa_type: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Visa Type</option>
                      {UsaVisaList.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.visa_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-3">
                  <label className="block text-sm font-semibold mb-2">
                    Work permit for other countries (Max 3)
                  </label>
                  <Select
                    isMulti
                    options={countries}
                    value={countries.filter((option) =>
                      safeWorkPermitCountries.includes(option.value)
                    )}
                    onChange={handleChange}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Address Section Container */}
              <div ref={address} id="address" className={`${getHighlightClass("address")} space-y-3`}>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Permanent address
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md"
                    placeholder="Permanent address"
                    value={formData?.permanent_address || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        permanent_address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Hometown
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md"
                    placeholder="Hometown"
                    value={formData?.hometown || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hometown: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pin
                  </label>
                  <input
                    className="w-full border px-3 py-2 rounded-md"
                    placeholder="Pincode"
                    value={formData?.pincode || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d{0,6}$/.test(value)) {
                        setFormData({ ...formData, pincode: value });
                      }
                    }}
                  />

                  {formData?.pincode &&
                    formData.pincode.length !== 6 &&
                    !onpincode && (
                      <p className="text-red-500 text-xs mt-1">
                        Pincode must be exactly 6 digits.
                      </p>
                    )}
                </div>
              </div>
            </>
          )}

          {/* Languages Section Container */}
          {renderLanguages && (
            <div ref={languages} id="languages" className={getHighlightClass("languages")}>
              <LanguageProficiency
                formData={formData}
                setFormData={setFormData}
                targetLanguageId={targetLanguageId}
                onClose={onClose}
                setReload={setReload}
              />
            </div>
          )}
        </form>
      )}
    </>
  );
};

export default PersonalInfoForm;