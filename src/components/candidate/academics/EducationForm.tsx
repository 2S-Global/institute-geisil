import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
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
import SchoolForm from "./SchoolForm"
import DegreeForm from "./DegreeForm"
const EducationForm = ({ formData,
  setFormData,
  selectedLevel_main,
  edit_id_main,
  loading,
  setLoading,
  allowedLevels,
  minimumAllowedYear,}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
 // console.log("show",show)
  const token = localStorage.getItem("token");
  //list
  const [levels, Setlevels] = useState([]);
  const [states, useStates] = useState([]);
  const [course_mode, setCourseMode] = useState([]);
  const [grading_systems, setGradingSystems] = useState([]);
  const [listboard, setListboard] = useState([]);
  const [listmedium, setListmedium] = useState([]);
  const [university, setUniversity] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [schools, setSchools] = useState([]); // Added for school level

  //tools
  const [stateselected, setStateselected] = useState(false);
  const [universityselected, setUniversityselected] = useState(false);
  const [collegeselected, setCollegeselected] = useState(false);
  const [filteredSchools, setFilteredSchools] = useState(schools);
  const [filteredColleges, setFilteredColleges] = useState(colleges);
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [filteredUniversity, setFilteredUniversity] = useState(university);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredBoard, setFilteredBoard] = useState(listboard);
  const [boardSearch, setBoardSearch] = useState(formData.board);
  const [courseSearch, setCourseSearch] = useState(formData.course_name);
  const [coursetype, setCoursetype] = useState(formData.level_type);
  const [universitySearch, setUniversitySearch] = useState(formData.university);
  const [collegeSearch, setCollegeSearch] = useState(formData.institute_name);
  const [schoolSearch, setSchoolSearch] = useState(formData.school_name);
  const [minimumAllowedYearState, setMinimumAllowedYearState] = useState<string | Date | null>(null);

  //use Effect
  useEffect(() => {
    setBoardSearch(formData.board);
    setCourseSearch(formData.course_name);
    setUniversitySearch(formData.university);
    setCollegeSearch(formData.institute_name);
  }, [formData]);

  useEffect(() => {
    const fetchCandidateDob = async () => {
      try {
        const response = await API.get(`/api/candidate/personal/get_personal_details_with_name`);
        if (response.status === 200) {
          const dateOfBirth = response.data?.data?.dob;
          setMinimumAllowedYearState(dateOfBirth || null);
        }
      } catch (error) {
        console.error("Error fetching candidate DOB:", error);
      }
    };

    fetchCandidateDob();
  }, []);

  useEffect(() => {
    const fetchLevels = async () => {
      setLoading(true);
      try {
        /* /api/userdata/get_user_level
        for adding
        ${apiurl}/api/sql/dropdown/education_level
        for editing


        */
        if (edit_id_main) {
          const response = await API.get(
            `/api/sql/dropdown/education_level`
          );
          Setlevels(response.data.data);
        } else {
          const response = await API.get(
            `/api/userdata/get_user_level`
          );

          Setlevels(response.data.data);
        }
      } catch (error) {
        //  console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, [token]);

  useEffect(() => {
    if (!formData.level) return;
    const fetchStates = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/all_university_state`
        );
        useStates(response.data.data);
      } catch (error) {
        //  console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    };
    /* api/sql/dropdown/course_type */
    const fetchCourseMode = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/course_type`
        );
        setCourseMode(response.data.data);
      } catch (error) {
        // console.error("Error fetching course modes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseMode();

    const fetchGradingSystems = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/grading_system`
        );
        setGradingSystems(response.data.data);
      } catch (error) {
        // console.error("Error fetching grading systems:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGradingSystems();

    fetchStates();
  }, [formData.level]);

  useEffect(() => {
    if (!formData.state) return;
    const fetchboard = async () => {
      /* setLoading(true); */
      try {
        const response = await API.get(
          `/api/sql/dropdown/state_wise_board?state_id=${formData.state}`
        );
        setListboard(response.data.data);
        setFilteredBoard(response.data.data);
      } catch (error) {
        //  console.error("Error fetching boards:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchmedium = async () => {
      /*  setLoading(true); */
      try {
        const response = await API.get(
          `/api/sql/dropdown/medium_of_education`
        );
        setListmedium(response.data.data);
      } catch (error) {
        //     console.error("Error fetching mediums:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchuniversity = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/university_state?state_id=${formData.state}`
        );
        setUniversity(response.data.data);
        setFilteredUniversity(response.data.data);
      } catch (error) {
        // console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchuniversity();
    fetchboard();
    fetchmedium();
  }, [formData.state]);

  useEffect(() => {
    const fetchschools = async () => {
      setLoading(true);
      try {
        /* for now using university */
        const response = await API.get(
          `/api/sql/dropdown/get_school_lists?board_name=${formData.board}`
        );
        setSchools(response.data.data);
        setFilteredSchools(response.data.data);
      } catch (error) {
        // console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchschools();
  }, [formData.board]);

  useEffect(() => {
    if (!formData.university) return;
    if (!formData.state) return;
    const fetchcolleges = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/college_name?university_id=${formData.university}&state_id=${formData.state}`
        );
        setColleges(response.data.data);
        setFilteredColleges(response.data.data);
      } catch (error) {
        // console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchcolleges();
  }, [formData.university, formData.state]);

  useEffect(() => {
    if (!formData.institute_name) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await API.get(
          `/api/sql/dropdown/university_course?state_id=${formData.state}&university_id=${formData.university}&college_name=${formData.institute_name}&course_type=${coursetype}`
        );
        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
        setCollegeselected(true);
      } catch (error) {
        // console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [formData.institute_name]);

  useEffect(() => {
    setStateselected(!!formData.state);
    setUniversityselected(!!formData.university);
    setCollegeselected(!!formData.institute_name);
  }, [formData.state, formData.university, formData.institute_name]);

  useEffect(() => {
    return () => {
      if (formData.transcriptPreview)
        URL.revokeObjectURL(formData.transcriptPreview);
      if (formData.certificatePreview)
        URL.revokeObjectURL(formData.certificatePreview);
    };
  }, [formData.transcriptPreview, formData.certificatePreview]);

  //chanage level
  const handleLevelChange = (e) => {
    const selectedLevel = e.target.value;
    const levelData = (allowedLevels && allowedLevels.length ? allowedLevels : levels).find((lvl) => String(lvl.id) === String(selectedLevel));
    if (levelData) {
      setCoursetype(levelData.type);
    }

    setFormData((prev) => ({
      ...prev,
      level: selectedLevel,
      state: "",
      board: "",
      year_of_passing: "",
      medium: "",
      marks: "",
      eng_marks: "",
      math_marks: "",
      university: "",
      institute_name: "",
      course_name: "",
      course_type: "",
      start_year: "",
      end_year: "",
      grading_system: "",
      is_primary: false,
      transcript: null,
      certificate: null,
    }));
  };
  //handel changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle marks: only allow 0-100 numeric
    if (name === "marks" || name === "eng_marks" || name === "math_marks") {
      // Allow digits and at most one decimal point
      let numericValue = value.replace(/[^0-9.]/g, "");

      // Prevent multiple decimal points
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Check if empty or <= 100
      if (numericValue === "" || Number(numericValue) <= 100) {
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
      }
      return; // Stop here for "marks"
    }

    // Update formData normally
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Common toggle logic
    const toggleSetters = {
      state: setStateselected,
      university: setUniversityselected,
      institute_name: setCollegeselected,
    };

    if (toggleSetters[name]) {
      toggleSetters[name](!!value.trim());
    }
  };

  const formatLevelName = (id) => {
    const resolvedLevels = allowedLevels && allowedLevels.length ? allowedLevels : levels;
    const levelObj = resolvedLevels.find((lvl) => String(lvl.id) === String(id));
    return levelObj ? (levelObj.level || levelObj.name || "Unknown Level") : "Unknown Level";
  };

  const handleSearchChange = (e, setSearch, setFiltered, list, key = "") => {
    const value = e.target.value.trim(); // normalise input
    setSearch(value);

    // Show everything while the box is empty
    if (!value) {
      setFiltered(list);
      return;
    }

    const query = value.toLowerCase();
    const getText = (item) => (key ? item[key] : item).toString().toLowerCase();

    const filtered = list
      .filter((item) => getText(item).includes(query))
      .sort((a, b) => {
        const aText = getText(a);
        const bText = getText(b);

        // 1️⃣ exact match beats everything
        if (aText === query && bText !== query) return -1;
        if (bText === query && aText !== query) return 1;

        // 2️⃣ prefix match comes next
        const aPrefix = aText.startsWith(query);
        const bPrefix = bText.startsWith(query);
        if (aPrefix && !bPrefix) return -1;
        if (!aPrefix && bPrefix) return 1;

        // 3️⃣ otherwise, earlier index wins
        const posDiff = aText.indexOf(query) - bText.indexOf(query);
        if (posDiff !== 0) return posDiff;

        // 4️⃣ finally, alphabetical as a stable tiebreaker
        return aText.localeCompare(bText);
      });

    setFiltered(filtered);
  };

  const handleSelect = (value, setSearch, setFiltered) => {
    setSearch(value);
    setFiltered([]);
  };

  const handleTranscriptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file); // ✅ works for both images and PDFs

    setFormData((prev) => ({
      ...prev,
      transcript: file,
      transcriptPreview: preview,
    }));
  };

  const handleCertificateChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      certificate: file,
      certificatePreview: preview,
    }));
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setTimeout(() => setIsFocused(false), 100); // Slight delay for click to register
  };
  

  return (
<>
<form className="space-y-6">
  {/* Select Level */}
  <div>
    <label className="mb-2 block text-sm font-medium text-gray-700">
      Select Level <span className="text-red-500">*</span>
    </label>

    <select
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-gray-100"
      name="level"
      value={formData.level}
      onChange={handleLevelChange}
      required
      disabled={selectedLevel_main}
    >
      <option value="">Select Level</option>

      {(allowedLevels && allowedLevels.length ? allowedLevels : levels).map((level) => (
        <option key={level.id} value={level.id}>
          {formatLevelName(level.id)}
        </option>
      ))}
    </select>
  </div>

  {formData.level ? (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-center text-lg font-semibold text-gray-900">
        {formatLevelName(formData.level)}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            State <span className="text-red-500">*</span>
          </label>

          <select
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>

            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {formData.level == 1 || formData.level == 2 ? (
          <SchoolForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            listboard={listboard}
            minimumAllowedYear={minimumAllowedYear ?? minimumAllowedYearState}
            listmedium={listmedium}
            stateselected={stateselected}
            handleTranscriptChange={handleTranscriptChange}
            handleCertificateChange={handleCertificateChange}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            handleSearchChange={handleSearchChange}
            filteredBoard={filteredBoard}
            setFilteredBoard={setFilteredBoard}
            boardSearch={boardSearch}
            setBoardSearch={setBoardSearch}
            handleSelect={handleSelect}
            schoolSearch={schoolSearch}
            setSchoolSearch={setSchoolSearch}
            filteredSchools={filteredSchools}
            setFilteredSchools={setFilteredSchools}
            schools={schools}
          />
        ) : (
          <DegreeForm
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            stateselected={stateselected}
            university={university}
            handleSearchChange={handleSearchChange}
            universityselected={universityselected}
            collegeselected={collegeselected}
            collegeSearch={collegeSearch}
            setCollegeSearch={setCollegeSearch}
            filteredColleges={filteredColleges}
            setFilteredColleges={setFilteredColleges}
            colleges={colleges}
            handleSelect={handleSelect}
            courseSearch={courseSearch}
            setCourseSearch={setCourseSearch}
            setFilteredCourses={setFilteredCourses}
            filteredCourses={filteredCourses}
            courses={courses}
            course_mode={course_mode}
            grading_systems={grading_systems}
            handleTranscriptChange={handleTranscriptChange}
            handleCertificateChange={handleCertificateChange}
            handleFocus={handleFocus}
            handleBlur={handleBlur}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            universitySearch={universitySearch}
            setUniversitySearch={setUniversitySearch}
            filteredUniversity={filteredUniversity}
            setFilteredUniversity={setFilteredUniversity}
          />
        )}
      </div>
    </div>
  ) : (
    <p className="text-sm font-medium text-red-500">
      Please select a level
    </p>
  )}
</form>
</>
  );
};

export default EducationForm;
