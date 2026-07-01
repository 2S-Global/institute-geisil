import React, { useState } from "react";

const SearchableInput = ({
  name,
  label,
  value,
  onChange,
  options,
  onSelect,
  setFormData,
  formData,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    // Update parent form data
    const { name, value } = e.target;
    if (setFormData) {
      setFormData({ ...formData, [name]: value });
    }

    onChange(e);

    // Slight delay so click (onMouseDown) can register
    setTimeout(() => setIsFocused(false), 100);
  };

  return (
    <div className="relative">
  <label className="mb-2 block text-sm font-medium text-gray-700">
    {label} <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    name={name}
    placeholder={`Search ${label}`}
    value={value}
    onChange={onChange}
    onFocus={handleFocus}
    onBlur={handleBlur}
    autoComplete="off"
    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
  />

  {isFocused && value && options.length > 0 && (
    <ul className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
      {options.map((option, index) => (
        <li
          key={index}
          onMouseDown={() => {
            onSelect(option);
            setIsFocused(false);
          }}
          className="cursor-pointer px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {option}
        </li>
      ))}
    </ul>
  )}
</div>
  );
};

export default SearchableInput;

/*
this works fine just dont hide the list 
import React from "react";

const SearchableInput = ({
  name,
  label,
  value,
  onChange,
  options,
  onSelect,
}) => {
  return (
    <div className="form-group  position-relative">
      <label>
        {label}
        <span style={{ color: "red" }}>*</span>
      </label>
      <input
        type="text"
        className="form-control"
        placeholder={`Search ${label}`}
        value={value}
        onChange={onChange}
        autoComplete="off"
        name={name}
      />
      {options.length > 0 && value && (
        <ul
          className="dropdown-menu show"
          style={{ position: "absolute", width: "100%" }}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableInput;
 */
