import React, { useState, useEffect } from "react";
import UploadButton from "./UploadButton";
import SearchableInput from "./SearchableInput";

const DegreeForm = ({
  formData,
  setFormData,
  handleChange,
  stateselected,
  university,
  handleSearchChange,
  universityselected,
  collegeselected,
  collegeSearch,
  setCollegeSearch,
  filteredColleges,
  setFilteredColleges,
  colleges,
  handleSelect,
  courseSearch,
  setCourseSearch,
  filteredCourses,
  setFilteredCourses,
  courses,
  course_mode,
  grading_systems,
  handleTranscriptChange,
  handleCertificateChange,
  handleFocus,
  handleBlur,
  isFocused,
  setIsFocused,
  universitySearch,
  setUniversitySearch,
  filteredUniversity,
  setFilteredUniversity,
}) => {
  return (
   <>
  {!stateselected && (
    <p className="text-sm font-medium text-red-500">
      Please select a state
    </p>
  )}

  <div
    className={`mt-3 space-y-6 ${
      !stateselected ? "pointer-events-none opacity-50" : ""
    }`}
  >
    {/* University */}
    <SearchableInput
      label="University Name"
      name="university"
      value={formData.university || universitySearch}
      onChange={(e) => {
        handleSearchChange(
          e,
          setUniversitySearch,
          setFilteredUniversity,
          university
        );
        handleChange(e);
      }}
      options={filteredUniversity}
      onSelect={(value) => {
        handleSelect(value, setUniversitySearch, setFilteredUniversity);
        setFormData({ ...formData, university: value });
      }}
      handleFocus={handleFocus}
      handleBlur={handleBlur}
      isFocused={isFocused}
      setIsFocused={setIsFocused}
      setFormData={setFormData}
      formData={formData}
    />

    {/* Institute & Course */}
    <div
      className={`space-y-6 ${
        !universityselected ? "pointer-events-none opacity-50" : ""
      }`}
    >
      <SearchableInput
        label="Institute Name"
        name="institute_name"
        value={formData.institute_name || collegeSearch}
        onChange={(e) => {
          handleSearchChange(
            e,
            setCollegeSearch,
            setFilteredColleges,
            colleges
          );
          handleChange(e);
        }}
        options={filteredColleges}
        onSelect={(value) => {
          handleSelect(value, setCollegeSearch, setFilteredColleges);
          setFormData({ ...formData, institute_name: value });
        }}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        setFormData={setFormData}
        formData={formData}
      />

      <div
        className={`space-y-6 ${
          !collegeselected ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <SearchableInput
          label="Course Name"
          name="course_name"
          value={formData.course_name || courseSearch}
          onChange={(e) => {
            handleSearchChange(
              e,
              setCourseSearch,
              setFilteredCourses,
              courses
            );
            handleChange(e);
          }}
          options={filteredCourses}
          onSelect={(value) => {
            handleSelect(value, setCourseSearch, setFilteredCourses);
            setFormData({ ...formData, course_name: value });
          }}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          isFocused={isFocused}
          setIsFocused={setIsFocused}
          setFormData={setFormData}
          formData={formData}
        />

        {/* Course Type */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Course Type <span className="text-red-500">*</span>
          </label>

          <div className="space-y-2">
            {course_mode?.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="course_type"
                  value={item.id}
                  checked={formData.course_type == item.id}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{item.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Duration */}
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Course Start and End Year{" "}
        <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          name="start_year"
          value={formData.start_year || ""}
          onChange={handleChange}
        >
          <option value="">Select Start Year</option>

          {Array.from({ length: 50 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            const isDisabled =
              formData.end_year &&
              parseInt(year) > parseInt(formData.end_year);

            return (
              !isDisabled && (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            );
          })}
        </select>

        <div className="text-center font-semibold text-gray-600">To</div>

        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          name="end_year"
          value={formData.end_year || ""}
          onChange={handleChange}
        >
          <option value="">Select End Year</option>

          {Array.from({ length: 46 }, (_, i) => {
            const year = new Date().getFullYear() + 5 - i;
            const isDisabled =
              formData.start_year &&
              parseInt(year) < parseInt(formData.start_year);

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

    {/* Grading & Marks */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Grading System <span className="text-red-500">*</span>
        </label>

        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          name="grading_system"
          onChange={handleChange}
          value={formData.grading_system}
        >
          <option>Select Grading System</option>

          {grading_systems.map((grading_system) => (
            <option key={grading_system.id} value={grading_system.id}>
              {grading_system.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Marks <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="marks"
          value={formData.marks}
          placeholder="Enter Marks"
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>

    {/* Primary Graduation */}
    {(formData.level == 3 || formData.level == 5) && (
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_primary"
          checked={formData.is_primary}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              is_primary: e.target.checked,
            }))
          }
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />

        <span className="text-sm text-gray-700">
          Make this as my primary graduation/diploma
        </span>
      </label>
    )}

    {/* Uploads */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Transcript (PNG / JPEG / PDF)
        </label>

        <UploadButton
          label="Upload"
          id="transcript"
          name="transcript"
          file={formData.transcript}
          onChange={handleTranscriptChange}
          accept="image/png, image/jpeg, application/pdf"
          width="200px"
          image={formData.transcriptPreview}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Certificate (PNG / JPEG / PDF)
        </label>

        <UploadButton
          label="Upload"
          id="certificate"
          name="certificate"
          width="200px"
          file={formData.certificate}
          onChange={handleCertificateChange}
          accept="image/png, image/jpeg, application/pdf"
          image={formData.certificatePreview}
        />
      </div>
    </div>
  </div>
</>
  );
};

export default DegreeForm;
