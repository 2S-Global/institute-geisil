import { useState, useEffect } from "react";
import Select from "react-select";
import { z } from "zod";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import API from "../../lib/axios";
import { email, phone, percentage } from "../../lib/utils";
let YMD = (input) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
let DMY = (input) => {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
};

export default function AddStudentDialog({
  open,
  setOpen,
  data = {},
  setRefresh,
}) {
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [courseStructure, setCourseStructure] = useState();
  const [programData, setProgramData] = useState([]);
  const [programDataResp, setProgramDataResp] = useState([]);
  const [selectProgram, setSelectProgram] = useState([]);
  const [marksType, setMarksType] = useState();
  const [isProgramChange, setProgramChange] = useState(false);
  const [editSemesterCount, setEditSemesterCount] = useState(
    data?.semesters?.length || 0,
  );

  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    USN: "",
    program: "",
    gender: "",
    dob: "",
    admissionYear: "",
    tenTh: "",
    twelveTh: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  //validation error
  const [err, setErr] = useState(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [fields, setFields] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const Semesters = Array.from({ length: totalSemesters }, (_, i) => 1 + i);

  // validation
  const validate = () => {
    let newErrors = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.USN?.trim()) {
      newErrors.USN = "University registration number is required";
    }
    if (!formData.program?.trim()) {
      newErrors.program = "Program is required";
    }
    if (!formData.gender?.trim()) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.dob?.trim()) {
      newErrors.dob = "DOB is required";
    }
    if (!formData.admissionYear?.trim()) {
      newErrors.admissionYear = "Admission Year is required";
    }
    if (!formData.tenTh) {
      newErrors.tenTh = "10Th(%) is required";
    } else if (formData.tenTh && percentage(formData.tenTh)) {
      newErrors.tenTh = "Invalid number";
    }
    if (!formData.twelveTh) {
      newErrors.twelveTh = "12Th(%) is required";
    } else if (formData.twelveTh && percentage(formData.twelveTh)) {
      newErrors.twelveTh = "Invalid number";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (formData.email && email(formData.email)) {
      newErrors.email = "Invalid email";
    }
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (formData.phoneNumber && phone(formData.phoneNumber)) {
      newErrors.phoneNumber = "Invalid phone number";
    }

    return newErrors;
  };

  // Add new field
  const addField = () => {
    let totalSem = totalSemesters || 0;
    let fieldsLen = fields?.length || 0;
    if (fieldsLen < totalSem) {
      setFields([...fields, { value: "" }]);
    } else {
      setErr((prev) => ({ ...prev, program: "" }));
    }
  };

  //add all filed selected program
  useEffect(() => {
    /*    let totalSem=totalSemesters||0;
    let fieldsLen=fields?.length||0;
    let remaining=(totalSem-fieldsLen)==totalSem?totalSem:totalSem-fieldsLen
      if(remaining >0 ){
          for(let i=0;i<remaining;i++){
            setFields((fields)=>[...fields, { value: "" }]);
          }
        } */

    console.log("fileds 1st load", fields);

    /*   let totalSem = totalSemesters || 0;
    if (totalSem > 0 && fields.length < totalSem) {
      for (let i = 0; i < totalSem; i++) {
        setFields((fields) => [...fields, { value: "" }]);
      }
    } */

    let totalSem = totalSemesters || 0;

    if (totalSem > 0) {
      const semesterFields = Array.from({ length: totalSem }, () => ({
        value: "",
      }));

      setFields(semesterFields);
    } else {
      setFields([]);
    }
  }, [totalSemesters]);
  useEffect(() => {
    if (data?._id) {
      setFormData({
        _id: data._id || "",
        name: data.name || "",
        USN: data.USN || "",
        program: data.program || "",
        gender: data.gender || "",
        dob: data?.dob ? YMD(data.dob) : data.dob || "",
        admissionYear: data.admissionYear || "",
        tenTh: data.tenTh || "",
        twelveTh: data.twelveTh || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
      });

      console.log("fileds 2nd load", fields);
    } else {
      setFormData({
        _id: "",
        name: "",
        USN: "",
        program: "",
        gender: "",
        dob: "",
        admissionYear: "",
        tenTh: "",
        twelveTh: "",
        email: "",
        phoneNumber: "",
      });
    }
  }, [data?._id]);

  const clearData = () => {
    setFormData({
      _id: "",
      name: "",
      USN: "",
      program: "",
      gender: "",
      dob: "",
      admissionYear: "",
      tenTh: "",
      twelveTh: "",
      email: "",
      phoneNumber: "",
    });
    setErr({});
  };

  // Remove field
  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Handle Semester change
  const handleSemesterChange = (index, event) => {
    const newFields = [...fields];
    newFields[index].value = event.target.value;
    setFields(newFields);
  };

  const handleProgramSelect = (selectedOptions) => {
    if (selectedOptions?.value) {
      setProgramChange(true);
      setErr((prev) => ({ ...prev, program: "" }));
      setFormData((prev) => ({ ...prev, program: selectedOptions?.value }));
      const findData = programDataResp.find(
        (u) => u._id === selectedOptions?.value,
      );
      setTotalSemesters(findData?.total_number_of_semesters || 0);
      setCourseStructure(findData?.courseStructure || "");
      setMarksType(findData?.marksType || "");
      setFields([]);
    } else {
      setTotalSemesters(0);
    }
    setSelectProgram(selectedOptions);
  };

  // ------------------------------
  // HANDLE INPUT CHANGE
  // ------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr((prev) => ({ ...prev, [name]: "" }));
    let newValue = value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const token = localStorage.getItem("token");

  // ------------------------------
  // FORM SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationErrors = validate();
    setErr(validationErrors);
    if (!token) {
      setError("Token not found. Please log in again.");
      setLoading(false);
      return;
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        const isUpdate = formData._id ? true : false;
        /*  const url = isUpdate
          ? `${apiurl}/api/useradmin/update_user`
          : `${apiurl}/api/useradmin/add_user`; */
        const url = `/api/institutestudent/add-institute-student-manually`;
        let semesters = [];
        fields.forEach((field, index) => {
          let sem = index + 1;
          if (field.value) {
            let newValue = { [sem]: field?.value };
            semesters.push(newValue);
          }
        });
        let payload = {};
        //if(formData._id){
        let AddData = { ...formData };
        AddData.dob = DMY(formData.dob);
        payload = {
          ...AddData,
          semesters,
          ...(isUpdate ? {} : { role: 1 }),
        };

        const method = "post";
        const response = await API({
          method,
          url,
          data: payload,
        });

        // Backend does not return success: true
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(response.data?.message || "Operation failed");
        }

        const res = response.data;

        // Success
        if (res.success === true) {
          toast({
            title: "Success!",
            description: res.message || "Student created successfully.",
          });

          setTimeout(() => {
            setFormData({});
            setFields([]);
            setSelectProgram([]);
            setOpen(false);
            setRefresh((p) => p + 1);
          }, 500);
        }

        // Student already exists
        else if (
          res.success === false &&
          res.message === "Student already exists"
        ) {
          toast({
            variant: "destructive",
            title: "Duplicate Student",
            description: "Student already exists.",
          });
        }

        // Validation failed
        else if (res.success === false && res.message === "Validation failed") {
          toast({
            variant: "destructive",
            title: "Validation Failed",
            description:
              res.audit?.errors?.join(", ") ||
              "Please check the entered details.",
          });
        }
        // setRefresh(p=>p+1);

        // setTimeout(() => {
        //   setOpen(false);
        // }, 1500);
      } catch (err) {
        const errorMessage =
          err.response?.data?.audit?.errors?.join(", ") ||
          err.response?.data?.message ||
          "Request failed. Please try again.";

        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // course list

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/institute-course/course`);

        const responseData = response?.data?.data.map((item) => ({
          label:
            item?.type !== "custom"
              ? item?.name + "(" + item?.type + ")"
              : item?.name,
          value: item?._id,
        }));
        setProgramData(responseData || []);
        setProgramDataResp(response?.data?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // edit selected course

  useEffect(() => {
    if (data?._id && !isProgramChange) {
      let obj = {
        label:
          data?.programDetails?.type !== "custom"
            ? data?.programDetails?.name +
              "(" +
              data?.programDetails?.type +
              ")"
            : data?.programDetails?.name,
        value: data?.programDetails?._id,
      };
      setSelectProgram(obj);
      let semestersData = data?.semesters || [];

      console.log("semestersData", semestersData);
      let updatedData = fields.map((item, index) => {
        const found = semestersData.find(
          (element) => index + 1 === element.semester,
        );

        return found ? { value: found.marks } : item;
      });

      if (updatedData?.length > 0) {
        setFields(updatedData);
      }
      /*   if(editSemesterCount){
              let semestersData=[...fields]
              for (let item of data?.semesters) {
                //semestersData.push({value: item.marks})
               const updatedArr = semestersData.map((obj, index) =>
                  index === 1 ? { ...obj, status: "done" } : obj
                );
              }
                
              setFields(semestersData)
              
            } */

      setTotalSemesters(data?.programDetails?.total_number_of_semesters || 0);
      setCourseStructure(data?.programDetails?.courseStructure || "");
      setMarksType(data?.programDetails?.marksType || "");
    }
  }, [data?._id, fields?.length]);

  const maxValue =
    marksType?.toLowerCase() === "cgpa" || marksType?.toLowerCase() === "dgpa"
      ? 10
      : 100;

  return (
    <>
      {/* <Toaster position="top-center" /> */}
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div
            className="
       relative z-10
    w-full
    max-w-md
    sm:max-w-2xl
    lg:max-w-3xl
    xl:max-w-4xl

    min-h-[40vh]
    max-h-[90dvh]

    bg-white
    rounded-xl
    sm:rounded-2xl
    shadow-2xl

    flex flex-col
    overflow-hidden
    "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 bg-[#112b5e] text-white shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 shrink-0" />

                <h2 className="text-base sm:text-lg font-semibold">
                  {formData._id ? "Update Student" : "Add New Student"}
                </h2>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <form onSubmit={handleSubmit} id="Form" className="space-y-5">
                {/* Name + DOB */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Student Name <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData?.name || ""}
                      onChange={handleChange}
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                    />

                    {err?.name && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      DOB <span className="text-red-500">*</span>
                    </label>

                    <input
                      style={{ position: "relative" }}
                      type="date"
                      max={new Date()?.toISOString().split("T")[0]}
                      name="dob"
                      value={formData?.dob || ""}
                      onChange={handleChange}
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                    />

                    {err?.dob && (
                      <div className="text-xs text-red-600 mt-1">{err.dob}</div>
                    )}
                  </div>
                </div>

                {/* Gender + Admission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Gender <span className="text-red-500">*</span>
                    </label>

                    <select
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                      name="gender"
                      onChange={handleChange}
                      value={formData.gender || ""}
                    >
                      <option value="">Please select</option>
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="o">Other</option>
                    </select>

                    {err?.gender && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.gender}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Admission Year <span className="text-red-500">*</span>
                    </label>

                    <select
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                      name="admissionYear"
                      onChange={handleChange}
                      value={formData.admissionYear || ""}
                    >
                      <option value="">Please select</option>

                      {years?.map((year) => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>

                    {err?.admissionYear && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.admissionYear}
                      </div>
                    )}
                  </div>
                </div>

                {/* USN + Program */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      University Registration Number{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      name="USN"
                      value={formData?.USN || ""}
                      onChange={handleChange}
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                    />

                    {err?.USN && (
                      <div className="text-xs text-red-600 mt-1">
                        {err?.USN}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Program <span className="text-red-500">*</span>
                    </label>

                    <Select
                      options={programData}
                      value={selectProgram}
                      onChange={handleProgramSelect}
                      placeholder="Please select"
                      className="mt-1"
                      classNamePrefix="select"
                    />

                    {err?.program && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.program}
                      </div>
                    )}
                  </div>
                </div>

                {/* 10th + 12th */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      10th (%) <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="tenTh"
                      value={formData.tenTh || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Allow empty value while typing
                        if (value === "") {
                          setFormData({ ...formData, tenTh: "" });
                          return;
                        }

                        const num = Number(value);

                        if (num >= 1 && num <= 100) {
                          setFormData({ ...formData, tenTh: value });
                        }
                      }}
                      className="
    mt-1
    w-full
    rounded-xl
    border
    border-gray-200
    px-4
    py-2.5
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#112b5e]
  "
                    />
                    {err?.tenTh && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.tenTh}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      12th (%) <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="twelveTh"
                      value={formData.twelveTh || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value === "") {
                          setFormData({ ...formData, twelveTh: "" });
                          return;
                        }

                        const num = Number(value);

                        if (num >= 1 && num <= 100) {
                          setFormData({
                            ...formData,
                            twelveTh: value,
                          });
                        }
                      }}
                      className="
    mt-1
    w-full
    rounded-xl
    border
    border-gray-200
    px-4
    py-2.5
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#112b5e]
  "
                    />
                    {err?.twelveTh && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.twelveTh}
                      </div>
                    )}
                  </div>

                  {/* Extra Field for Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                      readOnly={!!formData._id}
                    />

                    {err?.email && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.email}
                      </div>
                    )}
                  </div>

                  {/* Extra Field for Phone Number */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="number"
                      name="phoneNumber"
                      value={formData.phoneNumber || ""}
                      /*   onChange={handleChange} */
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setFormData({
                          ...formData,
                          phoneNumber: value,
                        });
                        setErr((prev) => ({ ...prev, phoneNumber: "" }));
                      }}
                      className="
                mt-1
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-2.5
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-[#112b5e]
              "
                    />

                    {err?.phoneNumber && (
                      <div className="text-xs text-red-600 mt-1">
                        {err.phoneNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Semester / Year Marks */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <h6 className="text-sm sm:text-base font-semibold border-b pb-1">
                      Semester/Yearly Marks{" "}
                      <span style={{ textTransform: "uppercase" }}>
                        ({marksType})
                      </span>
                    </h6>

                    {/*  <button
              type="button"
              onClick={addField}
              className="
                text-sm
                text-[#112b5e]
                font-medium
                hover:underline
                text-left
                sm:text-right
              "
            >
              + Add {courseStructure === "year" ? "Year" : "Semester"}
            </button> */}
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => {
                      const isDisabled =
                        index !== 0 && fields[index - 1]?.value === "";

                      return (
                        <div
                          key={index}
                          className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    gap-3
                  "
                        >
                          <span className="text-sm text-gray-600 sm:w-28">
                            {courseStructure === "year" ? "Year" : "Semester"}{" "}
                            {index + 1}
                          </span>

                          <input
                            type="number"
                            min="0.01"
                            max={maxValue}
                            className="
    flex-1
    rounded-xl
    border
    border-gray-200
    px-4
    py-2.5
    text-sm
    focus:outline-none
    focus:ring-2
    focus:ring-[#112b5e]
  "
                            placeholder={`Max ${maxValue}`}
                            value={field.value}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "") {
                                handleSemesterChange(index, e);
                                return;
                              }

                              const num = Number(value);

                              if (num > 0 && num <= maxValue) {
                                handleSemesterChange(index, e);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (["-", "+", "e", "E"].includes(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            disabled={isDisabled}
                          />

                          {/*      {!formData._id && (
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="
                        text-red-500
                        text-sm
                        hover:underline
                        self-start
                        sm:self-center
                      "
                    >
                      Delete
                    </button>
                  )} */}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-white shrink-0">
              <div
                className="
          flex
          flex-col-reverse
          sm:flex-row
          justify-end
          gap-3
        "
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    clearData();
                  }}
                  className="
            w-full
            sm:w-auto
            px-4
            py-2.5
            rounded-xl
            border
            hover:bg-gray-50
            transition
          "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="Form"
                  className="
            w-full
            sm:w-auto
            px-5
            py-2.5
            rounded-xl
            text-white
            bg-[#112b5e]
            shadow-md
            hover:shadow-lg
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:shadow-none
          "
                >
                  {loading ? (
                    <>{formData._id ? "Updating" : "Submitting"}</>
                  ) : (
                    <>{formData._id ? "Update" : "Submit"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
