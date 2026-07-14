


// import { useEffect, useState } from "react";
// import { Pencil } from "lucide-react";
// import API from "../../../lib/axios";
// import CareerProfileModal from "./CareerProfileModal";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const CareerProfile = () => {
//   const [profileData, setProfileData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [activeHighlightField, setActiveHighlightField] = useState(null);

//   const fetchCareerProfile = async () => {
//     try {
//       setIsLoading(true);
//       const response = await API.get("/api/useraction/get_career_profile");

//       if (response.data && response.data.success === true) {
//         setProfileData(response.data.data);
//       } else {
//         setProfileData({});
//       }
//       setError(null);
//     } catch (err) {
//       console.error("Error fetching career profile:", err);
//       setProfileData({});
//       setError(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCareerProfile();
//   }, []);

//   const openModalWithHighlight = (fieldName = null) => {
//     setActiveHighlightField(fieldName);
//     setIsModalOpen(true);
//   };

//   if (isLoading) {
//     return (
//       <Card className="w-full max-w-4xl bg-white shadow-sm border border-slate-100 rounded-xl p-6">
//         <div className="text-slate-500 text-sm animate-pulse">
//           Loading Career Profile...
//         </div>
//       </Card>
//     );
//   }

//   const data = profileData || {};

//   const formatSalary = (salary) => {
//     if (!salary) return null;
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(salary);
//   };

//   const renderField = (fieldValue, labelText, fieldKey) => {
//     if (fieldValue && fieldValue.toString().trim() !== "") {
//       return <p className="text-sm text-slate-700 font-medium">{fieldValue}</p>;
//     }
//     return (
//       <button
//         type="button"
//         onClick={() => openModalWithHighlight(fieldKey)}
//         className="block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors p-0 bg-transparent border-0 text-left cursor-pointer"
//       >
//         Add {labelText}
//       </button>
//     );
//   };

//   return (
//     <>
//       <Card className="w-full max-w-4xl bg-white shadow-sm border border-slate-100 rounded-xl">
//         <CardContent className="p-8">
//           {/* Header Row */}
//           <div className="flex justify-between items-center mb-6">
//             <div>
//               <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
//                 Career Profile
//               </h2>
//               <p className="text-sm text-slate-500 mt-1">
//                 Your preferred work locations, industry, and role expectations.
//               </p>
//             </div>
//             {/* <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
//               Career Profile
//             </h2> */}

//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => openModalWithHighlight(null)}
//             >
//               <Pencil className="w-4 h-4" />
//             </Button>
//           </div>

//           {/* Grid Layout */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
//             {/* Left Column */}
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Current Industry
//                 </label>
//                 {renderField(data.industry_name, "Current Industry", "industry")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Job Role
//                 </label>
//                 {renderField(data.job_role_name, "Job Role", "job_role")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Desired Employment Type
//                 </label>
//                 {renderField(data.employment_type, "Employment Type", "employment_type")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Preferred Work Location
//                 </label>
//                 {renderField(data.work_location_name, "Work Location", "work_location")}
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Department
//                 </label>
//                 {renderField(data.department_name, "Department", "department")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Desired Job Type
//                 </label>
//                 {renderField(data.job_type, "Job Type", "job_type")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Preferred Shift
//                 </label>
//                 {renderField(data.shift, "Shift", "shift")}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-900 mb-1">
//                   Expected Salary
//                 </label>
//                 {renderField(formatSalary(data.expected_salary), "Expected Salary", "expected_salary")}
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {isModalOpen && (
//         <CareerProfileModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setActiveHighlightField(null);
//           }}
          
//           currentData={{
//             _id: data._id || "",
//             industry: data.industry || "",
//             department: data.department || "",
//             job_role: data.job_role || "",
//             job_type: data.job_type || "",
//             employment_type: data.employment_type || "",
//             shift: data.shift || "",
//             work_location: data.work_location || [],
//             expected_salary: data.expected_salary || "",
//             currency_type: data.currency_type || "INR"
//           }}
//           highlightField={activeHighlightField}
//           onSaveSuccess={fetchCareerProfile}
//         />
//       )}
//     </>
//   );
// };

// export default CareerProfile;


import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react"; // Added Plus icon
import API from "../../../lib/axios";
import CareerProfileModal from "./CareerProfileModal";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CareerProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeHighlightField, setActiveHighlightField] = useState(null);

  const fetchCareerProfile = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("/api/useraction/get_career_profile");

      if (response.data && response.data.success === true) {
        setProfileData(response.data.data);
      } else {
        setProfileData({});
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching career profile:", err);
      setProfileData({});
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerProfile();
  }, []);

  const openModalWithHighlight = (fieldName = null) => {
    setActiveHighlightField(fieldName);
    setIsModalOpen(true);
  };

  // Helper to check if data exists
  const data = profileData || {};
  const hasData = data && Object.keys(data).length > 0 && (data.job_role_name || data.industry_name);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl bg-white shadow-sm border border-slate-100 rounded-xl p-6">
        <div className="text-slate-500 text-sm animate-pulse">
          Loading Career Profile...
        </div>
      </Card>
    );
  }

  const formatSalary = (salary) => {
    if (!salary) return null;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const renderField = (fieldValue, labelText, fieldKey) => {
    if (fieldValue && fieldValue.toString().trim() !== "") {
      return <p className="text-sm text-slate-700 font-medium">{fieldValue}</p>;
    }
    return (
      <button
        type="button"
        onClick={() => openModalWithHighlight(fieldKey)}
        className="block text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors p-0 bg-transparent border-0 text-left cursor-pointer"
      >
        Add {labelText}
      </button>
    );
  };

  return (
    <>
      <Card className="w-full max-w-4xl bg-white shadow-sm border border-slate-100 rounded-xl">
        <CardContent className="p-8">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                Career Profile
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your preferred work locations, industry, and role expectations.
              </p>
            </div>

            {hasData ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openModalWithHighlight(null)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                
                size="sm"
                onClick={() => openModalWithHighlight(null)}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Career Profile
              </Button>
            )}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Current Industry
                </label>
                {renderField(data.industry_name, "Current Industry", "industry")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Job Role
                </label>
                {renderField(data.job_role_name, "Job Role", "job_role")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Desired Employment Type
                </label>
                {renderField(data.employment_type, "Employment Type", "employment_type")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Preferred Work Location
                </label>
                {renderField(data.work_location_name, "Work Location", "work_location")}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Department
                </label>
                {renderField(data.department_name, "Department", "department")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Desired Job Type
                </label>
                {renderField(data.job_type, "Job Type", "job_type")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Preferred Shift
                </label>
                {renderField(data.shift, "Shift", "shift")}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-1">
                  Expected Salary
                </label>
                {renderField(formatSalary(data.expected_salary), "Expected Salary", "expected_salary")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isModalOpen && (
        <CareerProfileModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveHighlightField(null);
          }}
          currentData={{
            _id: data._id || "",
            industry: data.industry || "",
            department: data.department || "",
            job_role: data.job_role || "",
            job_type: data.job_type || "",
            employment_type: data.employment_type || "",
            shift: data.shift || "",
            work_location: data.work_location || [],
            expected_salary: data.expected_salary || "",
            currency_type: data.currency_type || "INR"
          }}
          highlightField={activeHighlightField}
          onSaveSuccess={fetchCareerProfile}
        />
      )}
    </>
  );
};

export default CareerProfile;