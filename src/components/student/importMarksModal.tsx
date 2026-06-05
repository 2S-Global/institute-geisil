import { useState, useEffect ,useRef} from "react";
import Select from "react-select";
import { z } from "zod";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import API from "../../lib/axios";

export default function ImportMarksModal({ open, setOpen }) {
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessage_id] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalSemesters, setTotalSemesters] = useState(0);
  const [programData, setProgramData] = useState([]);
  const [programDataResp, setProgramDataResp] = useState([]);
  const [selectProgram, setSelectProgram] = useState([]);
  const [formData, setFormData] = useState({
    semester: "",
    program: "",
    semesterYear: "",
    semesterMonth: "",
    admissionYear: "",
  });
  const [err, setErr] = useState(null);
  const [audit, setAudit] = useState([]);
const fileInputRef = useRef(null);
  //const router = useRouter();
  const apiurl =import.meta.env.VITE_API_URL;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
  const Semesters = Array.from({ length: totalSemesters }, (_, i) => 1 + i);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErr((prev) => ({ ...prev, [name]: "" }));
    const newValue = value;
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
    const newErrors = {};
    if (!formData.semester?.trim()) {
      newErrors.semester = "Semester is required";
    }
    if (!formData.program?.trim()) {
      newErrors.program = "Program is required";
    }
  
    if (!formData.admissionYear?.trim()) {
      newErrors.admissionYear = "Admission year is required";
    }
   
    return newErrors;
  };

 

  // ------------------------------
  // HANDLE FILE SELECTION
  // ------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setError("No file selected.");
      setCsvFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only csv files are allowed.");
      setCsvFile(null);

      // reset input immediately
      e.target.value = "";
      return;
    }

    setError(null);
    setCsvFile(file);
  };
  

  // ------------------------------
  // SUBMIT CSV IMPORT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErr(validationErrors);
    //console.log(err);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formPayload = new FormData();
      formPayload.append("role", 1);
      formPayload.append("csv", csvFile);
      formPayload.append("program", formData.program);
      formPayload.append("semesterYear", formData.semesterYear);
      formPayload.append("semesterMonth", formData.semesterMonth);
      //formPayload.append("marksType", formData?.marksType);
      formPayload.append("admissionYear", formData.admissionYear);
      formPayload.append("semester", formData.semester);
      try {
        const response = await API.post(
          `/api/institutestudent/import-candidates-marks`,
          formPayload
        );

        if (!response.data.success) throw new Error(response.data.message);
            if (response.data.success) {
              setOpen(false);
            }
            if(response.data.success){
                  toast({
                  title: "Success!",
                  description: 'Import completed',
                });
            }
        //setSuccess(response.data.message);
        //setMessage_id(Date.now());
        setFormData({
          semester: "",
          program: "",
          semesterYear: "",
          semesterMonth: "",
          admissionYear: "",
        });

        setSelectProgram(null);
        setCsvFile(null);
        setTotalSemesters(0);
        setErr({});
        setTimeout(() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }, 0);


        setTimeout(() => {
          //setRefresh(true);
        }, 1000);
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

  //fetch program list

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get(
          `/api/institute-course/course`,
        );

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

  // ================= UI =================

  // ================= UI =================
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
            Import Student Marks Semester/Yearly
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
     <form onSubmit={handleSubmit} id="Form" className="space-y-5">
  {/* <MessageComponent
    error={error}
    success={success}
    errorId={errorId}
    message_id={message_id}
  /> */}

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
        onChange={(e) => {
          handleChange(e);
        }}
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
        <div className="text-xs text-red-500 mt-1">
          {err.semester}
        </div>
      )}
    </div>

    {/* Upload CSV */}
    <div>
      <label className="text-sm font-medium text-gray-700">
        Upload CSV
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className={`
          mt-1
          w-full
          rounded-xl
          border
          px-4
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#112b5e]
          ${error ? "border-red-500" : "border-gray-200"}
        `}
        onChange={handleFileChange}
      />

      {error && (
        <div className="text-xs text-red-500 mt-1">
          {error}
        </div>
      )}
    </div>
  </div>

  {/* Uncomment if needed later */}

  {/* Semester Year */}
  {/*
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="text-sm font-medium text-gray-700">
        Semester Year
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
        name="semesterYear"
        onChange={handleChange}
        value={formData.semesterYear || ""}
      >
        <option value="">Please select</option>

        {years?.map((year) => (
          <option key={year}>{year}</option>
        ))}
      </select>

      {err?.semesterYear && (
        <div className="text-xs text-red-500 mt-1">
          {err.semesterYear}
        </div>
      )}
    </div>
  </div>
  */}

  {/* Semester Month */}
  {/*
  <div>
    <label className="text-sm font-medium text-gray-700">
      Semester Month
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
      name="semesterMonth"
      onChange={handleChange}
      value={formData.semesterMonth || ""}
    >
      <option value="">Please select</option>

      {months?.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>

    {err?.semesterMonth && (
      <div className="text-xs text-red-500 mt-1">
        {err.semesterMonth}
      </div>
    )}
  </div>
  */}

  {/* Grading System */}
  {/*
  <div>
    <label className="text-sm font-medium text-gray-700">
      Grading System
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
      name="marksType"
      onChange={handleChange}
      value={formData.marksType || ""}
    >
      <option value="">Please select</option>

      {marksTypes?.map((item) => (
        <option key={item}>{item}</option>
      ))}
    </select>

    {err?.marksType && (
      <div className="text-xs text-red-500 mt-1">
        {err.marksType}
      </div>
    )}
  </div>
  */}
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


import csvFile from "../../assets/files/institute-student-import-marks.csv?url";
const handleDownload = () => {
  const a = document.createElement("a");
  a.href = csvFile;
  a.download = "institute-student-import-marks.csv";
  a.click();
};