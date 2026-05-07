import { useState, useEffect } from "react";
import Select from "react-select";
import { z } from "zod";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import API from "../../lib/axios";
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

export default function AddStudentDialog({ open, setOpen, data = {},setRefresh}) {
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [courseStructure, setCourseStructure] = useState();
  const [programData, setProgramData] = useState([]);
  const [programDataResp, setProgramDataResp] = useState([]);
  const [selectProgram, setSelectProgram] = useState([]);
  const [marksType, setMarksType] = useState()
  const [editSemesterCount, setEditSemesterCount] = useState(
    data?.semesters?.length || 0,
  );
  const [formData, setFormData] = useState({
    _id: data._id || "",
    name: data.name || "",
    USN: data.USN || "",
    program: data.program || "",
    gender: data.gender || "",
    dob: data?.dob ? YMD(data.dob) : data.dob || "",
    admissionYear: data.admissionYear || "",
    tenTh: data.tenTh || "",
    twelveTh: data.twelveTh || "",
  });
  console.log("formData", formData);
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
      newErrors.USN = "USN is required";
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
    }
    if (!formData.twelveTh) {
      newErrors.twelveTh = "12Th(%) is required";
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

    let totalSem = totalSemesters || 0;
    if (totalSem > 0) {
      for (let i = 0; i < totalSem; i++) {
        setFields((fields) => [...fields, { value: "" }]);
      }
    }
  }, [totalSemesters]);

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
      setErr((prev) => ({ ...prev, program: "" }));
      setFormData((prev) => ({ ...prev, program: selectedOptions?.value }));
      const findData = programDataResp.find(
        (u) => u._id === selectedOptions?.value,
      );
      setTotalSemesters(findData?.total_number_of_semesters || 0);
      setCourseStructure(findData?.courseStructure || "");
      setMarksType(findData?.marksType || "")
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
          data: payload
        });

        // Backend does not return success: true
        if (response.status !== 200 && response.status !== 201) {
          throw new Error(response.data?.message || "Operation failed");
        }

        setSuccess(response.data.message);
        if(response.data.message){
             toast({
              title: "Success!",
              description: response.data.message,
            });
        }
       


        setRefresh(true);

        setTimeout(() => {
          setOpen(false);
        }, 1500);
      } catch (err) {
        setError(
          err.response?.data?.message || "Request failed. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  // course list

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(`/api/institute-course/course`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    if (data.program) {
      let obj = {
        label:
          data?.programDetails?.name + "(" + data?.programDetails?.type + ")",
        value: data?.programDetails?._id,
      };
      setSelectProgram(obj);
      let semestersData = data?.semesters || [];
      console.log("semestersData", semestersData);
      const updatedData = fields.map((item, index) => {
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
      setMarksType(data?.programDetails?.marksType || "")
    }
  }, [data?.program, fields?.length]);

  return (
    <>
    <Toaster position="top-center" />
      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* dialog */}
          <div
            className="relative w-full max-w-3xl h-[90vh] bg-white rounded-2xl shadow-2xl
            flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="p-6 bg-[#112b5e] text-white shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                <h2 className="text-lg font-semibold">{formData._id ? "Update Student" : "Add New Student"}</h2>
              </div>
            </div>
            {/* CONTENT (scrolls) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* form */}
              <form onSubmit={handleSubmit} id="Form" className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Student Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                      value={formData?.name || ""}
                      onChange={handleChange}
                    />
                    {err?.name && (
                      <div className="text-xs text-red-600 mt-1">{err.name}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      DOB
                    </label>
                    <input
                      type="date"
                      max={new Date()?.toISOString().split("T")[0]}
                      name="dob"
                      value={formData?.dob || ""}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                    />
                    {err?.dob && <div className="text-xs text-red-600 mt-1">{err.dob}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
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
                      <div className="text-xs text-red-600 mt-1">{err.gender}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Admission Year
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
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
                      <div className="text-xs text-red-600 mt-1">{err.admissionYear}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      USN
                    </label>
                    <input
                      type="text"
                      name="USN"
                      value={formData?.USN || ""}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                    />
                    {err?.USN && <div className="text-xs text-red-600 mt-1">{err?.USN}</div>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Program
                    </label>
                    <Select
                      options={programData}
                      value={selectProgram}
                      onChange={handleProgramSelect}
                      placeholder="Please select"
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />

                    {err?.program && (
                      <div className="text-xs text-red-600 mt-1">{err.program}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      10Th(%)
                    </label>
                    <input
                      type="number"
                      name="tenTh"
                      value={formData.tenTh || ""}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                    />
                    {err?.tenTh && (
                      <div className="text-xs text-red-600 mt-1">{err.tenTh}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      12Th(%)
                    </label>
                    <input
                      type="number"
                      name="twelveTh"
                      value={formData.twelveTh || ""}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                    />
                    {err?.twelveTh && (
                      <div className="text-xs text-red-600 mt-1">{err.twelveTh}</div>
                    )}
                  </div>
                </div>
                <div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="text-sm font-semibold border-b pb-1">
                        Semester/Yearly Marks ({marksType})
                      </h6>

                      <button
                        type="button"
                        onClick={addField}
                        className="text-sm text-[#112b5e] font-medium hover:underline"
                      >
                        + Add {courseStructure === "year" ? "Year" : "Semester"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => {
                        const isDisabled =
                          index !== 0 && fields[index - 1]?.value === "";

                        return (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-24">
                              {courseStructure === "year" ? "Year" : "Semester"}{" "}
                              {index + 1}
                            </span>

                            <input
                              type="number"
                              className="flex-1 rounded-xl border border-gray-200 px-4 py-2
                                        focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                              placeholder="Enter value"
                              value={field.value}
                              onChange={(e) => handleSemesterChange(index, e)}
                              disabled={isDisabled}
                            />

                            {!formData._id && (
                              <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="text-red-500 text-sm hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            {/* FOOTER (fixed) */}
            <div className="p-4 border-t bg-white flex justify-end gap-3 shrink-0">
              {/* actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-xl border hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="Form"  
                  className="px-5 py-2 rounded-xl text-white bg-[#112b5e]
                        shadow-md hover:shadow-lg transition
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? (
                  <>{formData._id ? "Updating" : "Submiting"}</>
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

