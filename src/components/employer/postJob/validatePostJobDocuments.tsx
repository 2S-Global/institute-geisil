export const validateDocuments = (formData) => {
  const {
    positionAvailable,
    jobType,
    jobExpiryDate,
    jobLocationType,
    salary,
    careerLevel,
    experienceLevel,
    industry,
    qualification,
    advertiseCity,
    advertiseCityName,
    country,
    state,
    city,
    branch,
    address,
    showBy,
    expectedHours,
    fromHours,
    toHours,
  } = formData;

  // -----------------------------
  // POSITIONS AVAILABLE
  // -----------------------------
  if (!positionAvailable || positionAvailable.trim() === "") {
    return {
      field: "positionAvailable",
      message: "Please enter Number of Positions Available.",
    };
  }

  // -----------------------------
  // JOB TYPE REQUIRED
  // -----------------------------
  if (!Array.isArray(jobType) || jobType.length === 0) {
    return {
      field: "jobType",
      message: "Please select at least one Job Type.",
    };
  }

  // -----------------------------
  // PART-TIME VALIDATION

  const isPartTime = jobType?.some((jt) => jt?.label === "Part-time");

  if (isPartTime) {
    // Validate Show By
    if (!showBy || showBy.trim() === "") {
      return {
        field: "showBy",
        message: "Please select how expected hours should be shown.",
      };
    }

    // FIXED / MAXIMUM / MINIMUM → single input
    if (showBy !== "range") {
      if (!expectedHours || expectedHours.trim() === "") {
        return {
          field: "expectedHours",
          message: "Please enter expected hours.",
        };
      }

      if (Number(expectedHours) <= 0) {
        return {
          field: "expectedHours",
          message: "Expected hours must be greater than zero.",
        };
      }
    }

    // RANGE → From and To inputs
    if (showBy === "range") {
      if (!fromHours || fromHours.trim() === "") {
        return {
          field: "fromHours",
          message: "Please enter 'From' hours.",
        };
      }

      if (!toHours || toHours.trim() === "") {
        return {
          field: "toHours",
          message: "Please enter 'To' hours.",
        };
      }

      if (Number(fromHours) <= 0) {
        return {
          field: "fromHours",
          message: "'From' hours must be greater than zero.",
        };
      }

      if (Number(toHours) <= Number(fromHours)) {
        return {
          field: "toHours",
          message: "'To' hours must be greater than 'From' hours.",
        };
      }
    }
  }

  const internLikeTypes = [
    "Internship",
    "Contractual / Temporary",
    "Freelance",
  ];
  const isInternLike = jobType?.some((jt) =>
    internLikeTypes.includes(jt?.label)
  );

  if (isInternLike) {
    // Contract Length required
    if (
      !formData.contractLength ||
      String(formData.contractLength).trim() === ""
    ) {
      return {
        field: "contractLength",
        message: "Please enter contract length.",
      };
    }

    if (Number(formData.contractLength) <= 0) {
      return {
        field: "contractLength",
        message: "Contract length must be greater than zero.",
      };
    }

    // Contract Period required
    if (!formData.contractPeriod || formData.contractPeriod.trim() === "") {
      return {
        field: "contractPeriod",
        message: "Please select contract period.",
      };
    }
  }
  // -----------------------------
  // JOB EXPIRY DATE
  // -----------------------------
  if (!jobExpiryDate || isNaN(new Date(jobExpiryDate).getTime())) {
    return {
      field: "jobExpiryDate",
      message: "Please enter a valid Post Expiry Date.",
    };
  }

  // -----------------------------
  // SALARY VALIDATION
  // -----------------------------
  if (!salary || !salary.structure || !salary.currency || !salary.rate) {
    return {
      field: "salaryStructure",
      message: "Please fill out all required salary details.",
    };
  }

  const { structure, currency, min, max, amount, rate } = salary;

  // Helper: check if number valid
  const isValidNumber = (val) =>
    val !== null && val !== "" && !isNaN(val) && Number(val) >= 0;

  switch (structure) {
    case "range":
      // Required check
      if (!currency || min == null || max == null || !rate) {
        return {
          field: "salaryStructure",
          message:
            "For salary range, currency, min, max, and rate are required.",
        };
      }

      // Numeric check
      if (!isValidNumber(min) || !isValidNumber(max)) {
        return {
          field: "salaryStructure",
          message: "Minimum and Maximum salary must be valid numbers.",
        };
      }

      // Min < Max check
      if (Number(min) >= Number(max)) {
        return {
          field: "salaryStructure",
          message: "Minimum salary must be less than Maximum salary.",
        };
      }

      break;

    case "starting amount":
    case "maximum amount":
    case "exact amount":
      if (!currency || amount == null || !rate) {
        return {
          field: "salaryStructure",
          message: `For salary '${structure}', currency, amount, and rate are required.`,
        };
      }

      // Numeric check
      if (!isValidNumber(amount)) {
        return {
          field: "salaryStructure",
          message: "Amount must be a valid number.",
        };
      }
      break;

    default:
      return { field: "salaryStructure", message: "Invalid salary structure." };
  }

  // -----------------------------
  // CAREER LEVEL
  // -----------------------------
  if (!careerLevel || careerLevel.trim() === "") {
    return { field: "careerLevel", message: "Please select Career Level." };
  }

  // -----------------------------
  // EXPERIENCE LEVEL
  // -----------------------------
  if (!experienceLevel || experienceLevel.trim() === "") {
    return {
      field: "experienceLevel",
      message: "Please select Experience Level.",
    };
  }

  // -----------------------------
  // INDUSTRY
  // -----------------------------
  if (!industry || industry.trim() === "") {
    return { field: "industry", message: "Please select Industry." };
  }

  // -----------------------------
  // QUALIFICATION ARRAY
  // -----------------------------
  if (!Array.isArray(qualification) || qualification.length === 0) {
    return {
      field: "qualification",
      message: "Please select at least one Qualification.",
    };
  }

  // -----------------------------
  // JOB LOCATION TYPE
  // -----------------------------
  if (!jobLocationType || jobLocationType.trim() === "") {
    return {
      field: "jobLocationType",
      message: "Please select a Job Location Type.",
    };
  }

  // -----------------------------
  // REMOTE
  // -----------------------------
  if (jobLocationType === "remote") {
    if (!advertiseCity || advertiseCity.trim() === "") {
      return {
        field: "advertiseCity",
        message:
          "Please select whether you want to advertise your job in a specific city.",
      };
    }

    if (
      advertiseCity === "Yes" &&
      (!advertiseCityName || advertiseCityName.trim() === "")
    ) {
      return {
        field: "advertiseCityName",
        message: "Please enter the city where you want to advertise this job.",
      };
    }
  }

  // -----------------------------
  // ON-SITE
  // -----------------------------
  if (jobLocationType === "on-site") {
    // if (!state || state.trim() === "")
    //   return { field: "state", message: "Please select a state." };
    // if (!city || city.trim() === "")
    //   return { field: "city", message: "Please select a city." };

    if (!branch || branch.trim() === "")
      return { field: "branch", message: "Please select a branch." };

    if (!address || address.trim() === "")
      return { field: "address", message: "Please enter a complete address." };
  }

  return null;
};
