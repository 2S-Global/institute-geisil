// import React, { useEffect, useState } from "react";
// import { Pencil } from "lucide-react";
// import API from "../../../lib/axios";
// import EmploymentModal from "./EmploymentModal";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// // Check icon
// const CheckIcon = ({ className = "w-4 h-4" }) => (
//   <svg
//     className={className}
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth={3}
//   >
//     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//   </svg>
// );

// const GreenCircleCheck = () => (
//   <div className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-green-600 bg-white text-green-600 ml-1.5">
//     <CheckIcon className="w-2.5 h-2.5" />
//   </div>
// );

// export const EmploymentCard = () => {
//   const [employments, setEmployments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedEmployment, setSelectedEmployment] = useState(null);

//   const fetchEmployments = () => {
//     setLoading(true);
//     API.get("api/candidate/employment/get_employment")
//       .then((response) => {
//         const resData = response.data;
//         if (resData.success && resData.data) {
//           setEmployments(resData.data);
//         } else {
//           setError(resData.message || "Failed to fetch data");
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message || "Something went wrong");
//         setLoading(false);
//       });
//   };

//   // FETCH DATA
//   useEffect(() => {
//     fetchEmployments();
//   }, []);

//   const handleEdit = (job) => {
//     setSelectedEmployment(job);
//     setIsModalOpen(true);
//   };

//   const handleAdd = () => {
//     setSelectedEmployment(null);
//     setIsModalOpen(true);
//   };

//   if (loading) {
//     return (
//       <div className="text-center p-8 text-gray-500">
//         Loading employment details...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center p-8 text-red-500">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <>
//       <Card className="max-w-4xl mx-auto my-8 shadow-sm">
//         <CardHeader className="flex flex-row justify-between items-center">
//           <CardTitle>Employment</CardTitle>

//           {/* ADD BUTTON */}
//           <Button onClick={handleAdd}>Add</Button>
//         </CardHeader>

//         <CardContent className="space-y-6">
//           {employments.map((job) => {
//             const durationStr = job.currentlyWorking
//               ? `${job.joining_month_name} ${job.joining_year} to Present`
//               : `${job.joining_month_name} ${job.joining_year} to ${job.leaving_month_name} ${job.leaving_year}`;

//             return (
//               <div key={job._id} className="border-b pb-4">
//                 {/* HEADER ROW */}
//                 <div className="flex justify-between items-start">

//                   <div className="space-y-1">
//                     <div className="flex items-center">
//                       <span className="font-bold uppercase">
//                         {job.job_title}
//                       </span>
//                       {job.designationVerified && <GreenCircleCheck />}
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <span className="font-bold">
//                         {job.company_name}
//                       </span>

//                       {job.isVerified && (
//                         <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded">
//                           Verified
//                         </span>
//                       )}
//                     </div>

//                     <div className="text-sm text-gray-600">
//                       {job.employmenttype}
//                     </div>

//                     <div className="text-sm text-gray-600">
//                       {durationStr}
//                     </div>

//                     {job.notice_period_name && (
//                       <div className="text-sm text-gray-600">
//                         Notice Period: {job.notice_period_name}
//                       </div>
//                     )}
//                   </div>

//                   {/* EDIT BUTTON */}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => handleEdit(job)}
//                   >
//                     <Pencil className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>
//             );
//           })}
//         </CardContent>
//       </Card>

//       {/* MODAL */}
//       <EmploymentModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setSelectedEmployment(null);
//         }}
//         onRefresh={fetchEmployments}
//         jobId={selectedEmployment?._id || ""}
//         editData={selectedEmployment}
//       />
//     </>
//   );
// };

// export default EmploymentCard;

import React, { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import API from "../../../lib/axios";
import EmploymentModal from "./EmploymentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Check icon
const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const GreenCircleCheck = () => (
  <div className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-green-600 bg-white text-green-600 ml-1.5">
    <CheckIcon className="w-2.5 h-2.5" />
  </div>
);

// Convert COMPANY NAME to Camel Case
const toCamelCase = (text = "") => {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const EmploymentCard = () => {
  const [employments, setEmployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployment, setSelectedEmployment] = useState(null);

  const fetchEmployments = () => {
    setLoading(true);

    API.get("api/candidate/employment/get_employment")
      .then((response) => {
        const resData = response.data;

        if (resData.success && resData.data) {
          setEmployments(resData.data);
          setError(null);
        } else {
          setError(resData.message || "Failed to fetch data");
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployments();
  }, []);

  const handleEdit = (job) => {
    setSelectedEmployment(job);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEmployment(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">
        Loading employment details...
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto my-8 shadow-sm">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Employment</CardTitle>

          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add Employment
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {employments.map((job) => {
            const durationStr = job.currentlyWorking
              ? `${job.joining_month_name} ${job.joining_year} to Present`
              : `${job.joining_month_name} ${job.joining_year} to ${job.leaving_month_name} ${job.leaving_year}`;

            return (
              <div key={job._id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    {/* Job Title */}
                    <div className="flex items-center">
                      <span className="font-bold">
                        {toCamelCase(job.job_title)}
                      </span>

                      {job.designationVerified && <GreenCircleCheck />}
                    </div>

                    {/* Company Name + Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold">
                        {toCamelCase(job.company_name)}
                      </span>

                      <span
                        className={`text-xs px-2 py-0.5 rounded text-white ${
                          job.isVerified ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      >
                        {job.isVerified ? "Verified" : "Pending Verification"}
                      </span>
                    </div>

                    {/* Employment Type */}
                    <div className="text-sm text-gray-600 capitalize">
                      {job.employmenttype}
                    </div>

                    {/* Duration */}
                    <div className="text-sm text-gray-600">{durationStr}</div>

                    {/* Notice Period */}
                    {job.notice_period_name && (
                      <div className="text-sm text-gray-600">
                        Notice Period: {job.notice_period_name}
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(job)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <EmploymentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployment(null);
        }}
        onRefresh={fetchEmployments}
        jobId={selectedEmployment?._id || ""}
        editData={selectedEmployment}
      />
    </>
  );
};

export default EmploymentCard;
