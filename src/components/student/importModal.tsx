import { useState, useEffect } from "react";
import Select from "react-select";
import { z } from "zod";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import API from "../../lib/axios";

export default function AddStudentDialog({ open, setOpen }) {
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [programData, setProgramData] = useState<any>(null);
  const [programDataResp, setProgramDataResp] = useState([]);
  const [selectProgram, setSelectProgram] = useState<any>(null);
  const [audit, setAudit] = useState([]);
  const [formData, setFormData] = useState({
    semester: "",
    program: "",
    admissionYear: "",
    //presentYear: "",
  });
  const [err, setErr] = useState(null);

  const apiurl = import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const Semesters = Array.from({ length: totalSemesters }, (_, i) => 1 + i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr((prev) => ({ ...prev, [name]: "" }));
    let newValue = value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleProgramSelect = (selectedOptions) => {
    if (selectedOptions?.value) {
      setErr((prev) => ({ ...prev, program: "" }));
      setFormData((prev) => ({ ...prev, program: selectedOptions?.value }));
      const findData = programDataResp.find(
        (u) => u._id === selectedOptions?.value,
      );
      setTotalSemesters(findData?.total_number_of_semesters || 0);
    } else {
      setTotalSemesters(0);
    }
    setSelectProgram(selectedOptions);
  };

  // validation
  const validate = () => {
    let newErrors = {};
    if (!formData.semester?.trim()) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.program?.trim()) {
      newErrors.program = "Program is required";
    }
    if (!formData.admissionYear?.trim()) {
      newErrors.admissionYear = "Admission Year is required";
    }
    /*   if (!formData.presentYear?.trim()) {
         newErrors.presentYear = "Present Year is required";
       }  */

    return newErrors;
  };

  // ------------------------------
  // HANDLE FILE SELECTION
  // ------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected.");
      setErrorId(Date.now());
      setCsvFile(null);
      return;
    }
    // Check extension
    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "csv") {
      setError("Only csv files are allowed.");
      setErrorId(Date.now());
      setCsvFile(null);
      return;
    }

    setError(null);
    setCsvFile(file);
  };
  const token = "";
  /*   typeof window !== "undefined"
         ? localStorage.getItem("Institute_token")
         : null;
     if (!token) {
       setError("Token not found. Please log in again.");
       setLoading(false);
       return;
     } */
  // ------------------------------
  // SUBMIT CSV IMPORT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErr(validationErrors);
    console.log(err);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formPayload = new FormData();
      formPayload.append("role", 1);
      formPayload.append("csv", csvFile);
      formPayload.append("semester", formData.semester);
      formPayload.append("program", formData.program);
      formPayload.append("admissionYear", formData.admissionYear);

      try {
        const response = await API.post(
          `${apiurl}/api/institutestudent/import-candidates`,
          formPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (!response.data.success) throw new Error(response.data.message);

        if (response.data.success) {
          setOpen(false);
        }

        // ✅ success message
        setSuccess(response.data.message);
        setMessage_id(Date.now());

        // ✅ RESET FORM (IMPORTANT)
        setFormData({
          semester: "",
          program: "",
          admissionYear: "",
        });

        setSelectProgram(null); // reset react-select
        setTotalSemesters(0); // reset semester list
        setCsvFile(null); // reset file
        setErr(null); // clear validation errors

        // ✅ clear file input manually
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";

        setSuccess(response.data.message);
        if(response.data.message){
             toast({
              title: "Success!",
              description: 'Import completed',
            });
        }


        setMessage_id(Date.now());
      } catch (err) {
        setError(err.response?.data?.message || "Import failed. Try again.");
        setErrorId(Date.now());
      } finally {
        setLoading(false);
      }
    }
  };

  // ------------------------------
  // UI
  // ------------------------------

  //fetch program list

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
        console.log("responseData", responseData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
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
            className="relative w-full max-w-3xl h-[65vh] bg-white rounded-2xl shadow-2xl
            flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="p-6 bg-[#112b5e] text-white shrink-0">
             

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">
                    Import New Student
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="text-sm text-white/80 hover:text-white   transition-colors"
                >
                  Download Template CSV
                </button>
            </div>
            </div>
            {/* CONTENT (scrolls) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* form */}
              <form onSubmit={handleSubmit} id="Form" className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="text-xs text-red-500 mt-1">{err.program}</div>
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
                      <div className="text-xs text-red-500 mt-1">{err.admissionYear}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Exam/Semester
                    </label>
                    <select
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                      name="semester"
                      onChange={handleChange}
                      value={formData.semester || ""}
                    >
                      <option value="">Please select</option>
                      {Semesters?.map((sem) => (
                        <option key={sem}>{sem}</option>
                      ))}
                    </select>
                    {err?.semester && (
                      <div className="text-xs text-red-600 mt-1">{err.semester}</div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Upload Csv
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#112b5e]"
                      onChange={handleFileChange}
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
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
                  disabled={loading || !csvFile}
                  className="px-5 py-2 rounded-xl text-white bg-[#112b5e]
                        shadow-md hover:shadow-lg transition
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


import csvFile from "../../assets/files/institute-student-import.csv?url";
const handleDownload = () => {
  const a = document.createElement("a");
  a.href = csvFile;
  a.download = "institute-student-import.csv";
  a.click();
};