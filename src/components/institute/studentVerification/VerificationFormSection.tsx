//import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
/* import CustomizedProgressBars from "@/components/common/loader"; */
import AsyncSelect from "react-select/async";
import { se } from "date-fns/locale/se";
import React, { useState, useEffect, useRef ,useCallback} from "react";
import { Button } from "@/components/ui/button";
import api from "../../../lib/axios";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
const VerificationFormSection = ({
  formdata,
  setFormData,
  onClose,
  is_complete,
  setSuccess = () => {},
  setMessageId = () => {},
  setError = () => {},
  setErrorId = () => {},
}) => {
  // ✅ Skip rendering when complete
  if (is_complete) return null;   
  const defaultOptions = formdata.course_id
    ? [{ value: formdata.course_id, label: formdata.course_name }]
    : [];

  const apiurl =  import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // =============================
  // 🔹 Local State
  // =============================
  const [loading, setLoading] = useState(false);
  const [levels, setLevels] = useState([]);
  const [courseModes, setCourseModes] = useState([]);
  const [grading_systems, setGradingSystems] = useState([]);
  //validation error
  const [err, setErr] = useState(null);
  // =============================
  // 🔹 Handlers (Memoized)
  // =============================
  const handleToggle = useCallback(
    (field) => (e) => {
      setErr({});
      if(e.target.checked){
            setFormData((prev) => ({
              ...prev,
              level_verified: true,
              courseType_verified: true,
              courseName_verified: true,
              duration_verified: true,
              gradingSystem_verified: true,
              marks_verified: true,
              [field]: e.target.checked,
            }));
      }
      else{
        setFormData((prev) => ({
              ...prev,
              level_verified: false,
              courseType_verified: false,
              courseName_verified: false,
              duration_verified: false,
              gradingSystem_verified: false,
              marks_verified: false,
              [field]: e.target.checked,
      }))
    }
      
    },
    [setFormData]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [setFormData]
  );

    // validation 
const validate = () => {
      let newErrors = {};
      let d=new Date()
      let year=d.getFullYear()

      if (!formdata?.level_verified) {
        newErrors.level_verified = "Level verification is required";
      } 

       if (!formdata?.courseType_verified) {
        newErrors.courseType_verified = "Course type verification is required";
      } 
      if (!formdata?.courseName_verified) {
        newErrors.courseName_verified = "Course name verification is required";
      } 
      if (!formdata?.duration_verified) {
        newErrors.duration_verified = "Course duration verification is required";
      } 
     
      if (formdata?.duration?.to > year) {
        newErrors.duration_verified = "This student is currently pursuing";
      } 
      if (!formdata?.gradingSystem_verified) {
        newErrors.gradingSystem_verified = "Grading system verification is required";
      } 

      if (!formdata?.marks_verified) {
        newErrors.marks_verified = "Marks verification is required";
      } 
      

      return newErrors;
};
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
       const validationErrors = validate();
        setErr(validationErrors);
        let isChecked=false;
        if(formdata.is_studied_here && Object.keys(validationErrors).length === 0){
          isChecked=true;
        }
        if(!formdata.is_studied_here){
          isChecked=true;
        }
        if(isChecked)
          {
                try {
                const response = await api.put(
                  `/api/institutestudent/update_student_status`,
                  formdata,
                );

                //  console.log("Form submitted successfully:", response.data);

                if (response.data.success) {
                  setSuccess(response.data.message);
                  onClose();
                } else {
                  console.error("Submission failed:", response.data.message);
                }
              } catch (error) {
                console.error("Error submitting form:", error);
              }
        }
          
      
    },
    [formdata, apiurl, token, onClose]
  );

  // =============================
  // 🔹 Auto-enable related flags
  // =============================
/*   useEffect(() => {
    if (formdata.is_verified) {
      setFormData((prev) => ({
        ...prev,
        level_verified: true,
        courseType_verified: true,
        courseName_verified: true,
        duration_verified: true,
        gradingSystem_verified: true,
        marks_verified: true,
      }));
    }
   
  }, [formdata.is_verified, setFormData]); */

  
  // =============================
  // 🔹 Fetch Dropdowns (Levels & Course Modes)
  // =============================
  const fetchDropdowns = useCallback(async () => {
    setLoading(true);
    try {
      const [levelsRes, courseRes] = await Promise.all([
        api.get(`/api/sql/dropdown/education_level`),
        api.get(`/api/sql/dropdown/course_type`),
      ]);

      setLevels(levelsRes.data?.data || []);
      setCourseModes(courseRes.data?.data || []);
    } catch (error) {
      console.error("Error fetching dropdowns:", error);
    } finally {
      setLoading(false);
    }
  }, [apiurl]);

  // =============================
  // 🔹 Fetch Grading Systems
  // =============================
  const fetchGradingSystems = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/sql/dropdown/grading_system`
      );
      setGradingSystems(response.data.data);
    } catch (error) {
      console.error("Error fetching grading systems:", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // 🔹 Initial Data Load
  // =============================
  useEffect(() => {
    fetchDropdowns();
    fetchGradingSystems();
  }, [fetchDropdowns]);

  // =============================
  // 🔹 Fetch Matching Courses
  // =============================
  const fetchCourses = async (inputValue) => {
    if (!inputValue || inputValue.trim() === "") return [];

    try {
      const response = await axios.get(
        `${apiurl}/api/sql/dropdown/matching_courses`,
        { params: { course_name: inputValue } }
      );

      return (
        response.data?.data?.map((item) => ({
          label: item.name,
          value: item.id,
        })) || []
      );
    } catch (error) {
      console.error("Error loading courses:", error);
      return [];
    }
  };

  // =============================
  // 🔹 Handle Course Selection
  // =============================
  const handleCourseChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      course_id: selectedOption ? selectedOption.value : "",
      course_name: selectedOption ? selectedOption.label : "",
    }));
  };
  // =============================
  // 🔹 JSX
  // =============================
  if (loading) return <>kkk</>;

  return (
   <form
  onSubmit={handleSubmit}
  className="bg-white rounded-xl shadow-sm mb-4 border border-gray-200"
>
  <div className="grid grid-cols-12 gap-y-4 p-5">
    <div className="col-span-12">
      <h5 className="text-lg font-semibold text-gray-800">Verification</h5>
    </div>

    {/* accepted or rejected */}
    {!is_complete && (
      <div className="col-span-12 md:col-span-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Did this student study here ?
        </label>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              type="radio"
              name="studyHere"
              checked={formdata.is_studied_here === true}
              onChange={() =>
                setFormData({ ...formdata, is_studied_here: true })
              }
            />
            <span className="text-sm text-gray-700">Yes</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              type="radio"
              name="studyHere"
              checked={formdata.is_studied_here === false}
              onChange={() =>
                setFormData({
                  ...formdata,
                  level_verified: false,
                  courseType_verified: false,
                  courseName_verified: false,
                  duration_verified: false,
                  gradingSystem_verified: false,
                  marks_verified: false,
                  is_studied_here: false,
                })
              }
            />
            <span className="text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>
    )}

    {/* Editable Form Fields */}
    {formdata.is_studied_here && !is_complete && (
      <>
        {/* Overall Verification Switch */}
        <div className="col-span-12">
          <div className="flex items-center gap-3">
            <input
              className="h-5 w-10 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500"
              type="checkbox"
              id="verifiedSwitch"
              checked={!!formdata.is_verified}
              onChange={handleToggle("is_verified")}
            />
            <label
              className="text-sm font-semibold text-gray-700"
              htmlFor="verifiedSwitch"
            >
              All Details Verified
            </label>
          </div>
        </div>

        {/* Level */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Level <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              name="level"
              value={formdata.level || ""}
              onChange={handleChange}
              required
              disabled={formdata.level_verified || formdata.is_verified}
            >
              <option value="">Select Level</option>

              {levels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.level}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={`px-3 py-2 m-1 text-sm rounded-lg transition ${
                formdata.level_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  level_verified: !prev.level_verified,
                }));

                setErr({ ...err, level_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.level_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.level_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.level_verified}
            </div>
          )}
        </div>

        {/* Course Type */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Type <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-3">
            <div className="flex flex-wrap gap-4 flex-1">
              {courseModes.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    type="radio"
                    name="course_type"
                    value={item.id}
                    disabled={
                      formdata.courseType_verified || formdata.is_verified
                    }
                    checked={Number(formdata.course_type) === Number(item.id)}
                    onChange={handleChange}
                  />

                  <span className="text-sm text-gray-700">{item.name}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              className={`px-3 py-2 text-sm rounded-lg transition ${
                formdata.courseType_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  courseType_verified: !prev.courseType_verified,
                }));

                setErr({ ...err, courseType_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.courseType_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.courseType_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.courseType_verified}
            </div>
          )}
        </div>

        {/* Course Name */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Name <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <AsyncSelect
                cacheOptions
                defaultOptions={defaultOptions}
                loadOptions={fetchCourses}
                isClearable
                isSearchable
                onChange={handleCourseChange}
                value={
                  formdata.course_id
                    ? {
                        label: formdata.course_name,
                        value: formdata.course_id,
                      }
                    : null
                }
                placeholder="Enter or select a course name"
                isDisabled={
                  formdata.courseName_verified || formdata.is_verified
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    minHeight: "42px",
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>

            <button
              type="button"
              className={`px-3 py-2 m-1 text-sm rounded-lg transition ${
                formdata.courseName_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  courseName_verified: !prev.courseName_verified,
                }));

                setErr({ ...err, courseName_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.courseName_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.courseName_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.courseName_verified}
            </div>
          )}
        </div>

        {/* Course Duration */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Duration <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-5">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        duration: {
                          ...formdata.duration,
                          from: e.target.value,
                        },
                      })
                    }
                    disabled={
                      formdata.duration_verified || formdata.is_verified
                    }
                    value={formdata.duration?.from || ""}
                  >
                    <option value="">Start Year</option>

                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;

                      const isDisabled =
                        formdata.duration?.to &&
                        parseInt(year) >
                          parseInt(formdata.duration.to) - 1;

                      return (
                        !isDisabled && (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>

                <div className="col-span-2 text-center font-semibold text-gray-600">
                  to
                </div>

                <div className="col-span-5">
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        duration: {
                          ...formdata.duration,
                          to: e.target.value,
                        },
                      })
                    }
                    disabled={
                      formdata.duration_verified || formdata.is_verified
                    }
                    value={formdata.duration?.to || ""}
                  >
                    <option value="">End Year</option>

                    {Array.from({ length: 46 }, (_, i) => {
                      const year = new Date().getFullYear() + 5 - i;

                      const isDisabled =
                        formdata.duration?.from &&
                        parseInt(year) <
                          parseInt(formdata.duration.from) + 1;

                      return (
                        !isDisabled && (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="button"
              className={`px-3 py-2 m-1 text-sm rounded-lg transition ${
                formdata.duration_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  duration_verified: !prev.duration_verified,
                }));

                setErr({ ...err, duration_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.duration_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.duration_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.duration_verified}
            </div>
          )}
        </div>

        {/* Grading System */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Grading System <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              name="grading_system"
              onChange={handleChange}
              value={formdata.grading_system}
              disabled={
                formdata.gradingSystem_verified || formdata.is_verified
              }
            >
              <option>Select Grading System</option>

              {grading_systems.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={`px-3 py-2 m-1 text-sm rounded-lg transition ${
                formdata.gradingSystem_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  gradingSystem_verified: !prev.gradingSystem_verified,
                }));

                setErr({ ...err, gradingSystem_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.gradingSystem_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.gradingSystem_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.gradingSystem_verified}
            </div>
          )}
        </div>

        {/* Marks */}
        <div className="col-span-12 md:col-span-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Marks <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              name="marks"
              value={formdata.marks || ""}
              onChange={handleChange}
              disabled={formdata.marks_verified || formdata.is_verified}
              placeholder="Enter obtained marks"
            />

            <button
              type="button"
              className={`px-3 py-2 m-1 text-sm rounded-lg transition ${
                formdata.marks_verified
                  ? "bg-green-600 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  marks_verified: !prev.marks_verified,
                }));

                setErr({ ...err, marks_verified: "" });
              }}
              disabled={formdata.is_verified}
            >
              {formdata.marks_verified ? "Verified" : "Verify"}
            </button>
          </div>

          {err?.marks_verified && (
            <div className="text-red-500 text-sm font-medium mt-1">
              {err.marks_verified}
            </div>
          )}
        </div>

        {/* Remarks */}
        <div className="col-span-12">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Remarks
          </label>

          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            name="remarks"
            rows="2"
            style={{
              resize: "vertical",
              overflowY: "auto",
            }}
            value={formdata.remarks || ""}
            onChange={handleChange}
            placeholder="Add remarks or notes here..."
          />
        </div>
      </>
    )}

    {/* Footer Buttons */}
    <div className="col-span-12 flex justify-end gap-3 pt-2">
      <button
        type="button"
        className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        onClick={onClose}
        disabled={loading}
      >
        Cancel
      </button>

      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  </div>
</form>
  );
};

export default React.memo(VerificationFormSection);
