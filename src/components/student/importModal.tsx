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
          `/api/institutestudent/import-candidates`,
          formPayload,
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
         toast({
              title: "Error",
               variant: "destructive",
              description: 'Import failed. Try again.',
            });
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 shrink-0" />

          <h2 className="text-base sm:text-lg font-semibold">
            Import New Student
          </h2>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="
            text-sm
            text-left
            sm:text-right
            text-white/80
            hover:text-white
            transition-colors
          "
        >
          Download Template CSV
        </button>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        id="Form"
        className="space-y-5"
      >
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Program */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Program
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
              <div className="text-xs text-red-500 mt-1">
                {err.program}
              </div>
            )}
          </div>

          {/* Admission Year */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Admission Year
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
              <div className="text-xs text-red-500 mt-1">
                {err.admissionYear}
              </div>
            )}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Semester */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Semester/Yearly
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
              <div className="text-xs text-red-600 mt-1">
                {err.semester}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload CSV
            </label>

            <input
              type="file"
              accept=".csv"
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
              onChange={handleFileChange}
            />

            {error && (
              <div className="text-xs text-red-500 mt-1">
                {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>

    {/* Footer */}
    <div
      className="
        p-4
        border-t
        bg-white
        shrink-0
      "
    >
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
          onClick={() => setOpen(false)}
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
          disabled={loading || !csvFile}
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