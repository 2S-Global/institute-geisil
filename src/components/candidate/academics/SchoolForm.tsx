import React, { useState, useEffect } from "react";
import UploadButton from "./UploadButton";
import SearchableInput from "./SearchableInput";
import { isYearAllowed } from "./educationYearValidation";
const SchoolForm = ({
  formData,
  setFormData,
  handleChange,
  listboard,
  listmedium,
  stateselected,
  handleTranscriptChange,
  handleCertificateChange,
  handleFocus,
  handleBlur,
  isFocused,
  setIsFocused,
  boardSearch,
  setBoardSearch,
  handleSearchChange,
  filteredBoard,
  setFilteredBoard,
  handleSelect,
  schoolSearch,
  setSchoolSearch,
  filteredSchools,
  setFilteredSchools,
  schools,
  minimumAllowedYear,
}) => {
  return (
  <>
  {!stateselected && (
    <p className="text-sm font-medium text-red-500">
      Please select a state
    </p>
  )}

  <div
    className={`space-y-6 ${
      !stateselected ? "pointer-events-none opacity-50" : ""
    }`}
  >
    <SearchableInput
      label="Board"
      name="board"
      value={formData.board || boardSearch}
      onChange={(e) => {
        handleSearchChange(e, setBoardSearch, setFilteredBoard, listboard);
        handleChange(e);
      }}
      options={filteredBoard}
      onSelect={(value) => {
        handleSelect(value, setBoardSearch, setFilteredBoard);
        setFormData((prevFormData) => ({
          ...prevFormData,
          board: value,
        }));
      }}
      handleFocus={handleFocus}
      handleBlur={handleBlur}
      isFocused={isFocused}
      setIsFocused={setIsFocused}
    />

    {/* Year & Medium */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Year of Passing <span className="text-red-500">*</span>
        </label>

        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          name="year_of_passing"
          onChange={handleChange}
          value={formData.year_of_passing}
        >
          <option value="">Select Year</option>

          {Array.from(
            { length: 51 },
            (_, i) => new Date().getFullYear() - 50 + i
          )
            .filter((year) => year <= new Date().getFullYear())
            .filter((year) => isYearAllowed(year, minimumAllowedYear))
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        {minimumAllowedYear && (
          <p className="mt-2 text-xs text-gray-500">
            Year of passing cannot be earlier than {minimumAllowedYear}.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Medium of Education <span className="text-red-500">*</span>
        </label>

        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          name="medium"
          onChange={handleChange}
          value={formData.medium}
        >
          <option>Select Medium</option>

          {listmedium.map((medium) => (
            <option key={medium.id} value={medium.id}>
              {medium.name}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Marks */}
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Marks (%) <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name="marks"
        placeholder="Enter Marks"
        onChange={handleChange}
        value={formData.marks}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>

    {/* 12th Specific Marks */}
    {formData.level == 2 && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Marks in English (%) <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="eng_marks"
            placeholder="Enter Marks"
            onChange={handleChange}
            value={formData.eng_marks}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Marks in Math (%) <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="math_marks"
            placeholder="Enter Marks"
            onChange={handleChange}
            value={formData.math_marks}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
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
          file={formData.certificate}
          onChange={handleCertificateChange}
          accept="image/png, image/jpeg, application/pdf"
          width="200px"
          image={formData.certificatePreview}
        />
      </div>
    </div>
  </div>
</>
  );
};

export default SchoolForm;
