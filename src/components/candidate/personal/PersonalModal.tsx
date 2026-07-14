// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import API from "../../../lib/axios";
// import PersonalInfoForm from "./PersonalInfoForm";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// //import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/hooks/use-toast";

// const FormModal = ({
//   show,
//   onClose,
//   data = {},
//   setRefresh,
//   reload,
//   error,
//   setReload,
//   setError,
//   focusSection,
//   setSuccess,
// }) => {
//   const apiurl = import.meta.env.VITE_API_URL;
//   console.log("show", show);
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     gender: "",
//     dob: null,
//     more_info: [],
//     marital_status: "",
//     partner_name: "",
//     category: "",
//     differently_abled: "",
//     disability_type: "",
//     disability_description: "",
//     workplace_assistance: "",
//     career_break: "",
//     career_break_reason: "",
//     career_break_start_year: "",
//     career_break_start_month: "",
//     currently_on_career_break: false,
//     career_break_end_year: "",
//     career_break_end_month: "",
//     usa_visa_type: "",
//     work_permit_other_countries: [],
//     permanent_address: "",
//     hometown: "",
//     pincode: "",
//     languages: [],
//     have_usa_visa: false,
//   });

//   const formatPersonalDetailsResponse = (data) => {
//     return {
//       gender: String(data.gender || ""),
//       dob: data.dob ? new Date(data.dob) : null,
//       more_info: Array.isArray(data.more_info)
//         ? data.more_info.map(String)
//         : [],
//       have_usa_visa: data.have_usa_visa,
//       partner_name: data.partner_name || "",
//       marital_status: String(data.marital_status || ""),
//       category: String(data.category || ""),
//       differently_abled: data.differently_abled || "",
//       disability_type: String(data.disability_type || ""),
//       disability_description: data.disability_description || "",
//       workplace_assistance: data.workplace_assistance || "",
//       career_break: data.career_break || "",
//       career_break_reason: String(data.career_break_reason || ""),
//       career_break_start_year: String(data.career_break_start_year || ""),
//       career_break_start_month: String(data.career_break_start_month || ""),
//       currently_on_career_break: !!data.currently_on_career_break,
//       career_break_end_year: String(data.career_break_end_year || ""),
//       career_break_end_month: String(data.career_break_end_month || ""),
//       usa_visa_type: String(data.usa_visa_type || ""),
//       work_permit_other_countries: Array.isArray(
//         data.work_permit_other_countries,
//       )
//         ? data.work_permit_other_countries.map(
//             Number,
//           ) /* change to String if objectid */
//         : [],
//       permanent_address: data.permanent_address || "",
//       hometown: data.hometown || "",
//       pincode: data.pincode || "",
//       languages:
//         Array.isArray(data.languages) && data.languages.length > 0
//           ? data.languages.map((lang) => ({
//               language: String(lang.language || ""),
//               proficiency: String(lang.proficiency || ""),
//               read: !!lang.read,
//               write: !!lang.write,
//               speak: !!lang.speak,
//             }))
//           : [],
//     };
//   };

//   const [loading, setLoading] = useState(false);
//   // const apiurl = process.env.NEXT_PUBLIC_API_URL;
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.log("No token");
//   }
//   const [isFormValid, setIsFormValid] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [wrongdate, setWrongDate] = useState(false);
//   const [wrongdate2, setWrongDate2] = useState(false);

//   useEffect(() => {
//     /* /get_personal_details */
//     const fetchPersonalDetails = async () => {
//       //setLoading(true);
//       try {
//         const response = await API.get(
//           `/api/candidate/personal/get_personal_details`,
//         );
//         if (response.status === 200) {
//           console.log("Personal details fetched successfully");
//           const formatted = formatPersonalDetailsResponse(response.data);
//           setFormData(formatted);
//         }
//       } catch (error) {
//         console.error("Error fetching personal details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPersonalDetails();
//   }, [apiurl, token]);

//   useEffect(() => {
//     setIsFormValid(validateForm());
//   }, [formData]);

//   useEffect(() => {
//     if (formData.currently_on_career_break) {
//       setWrongDate2(false);
//     } else {
//       if (wrongdate) {
//         setWrongDate2(true);
//       } else {
//         setWrongDate2(false);
//       }
//     }
//   }, [formData?.currently_on_career_break]);

//   useEffect(() => {
//     setWrongDate2(wrongdate);
//   }, [wrongdate]);

//   const validateForm = () => {
//     if (!formData.gender || formData.gender.toString().trim() === "") {
//       return false;
//     }
//     if (!formData.dob) {
//       return false;
//     }
//     if (formData.differently_abled === "Yes") {
//       if (
//         !formData.disability_type ||
//         formData.disability_type.toString().trim() === ""
//       ) {
//         return false;
//       }
//       if (formData?.disability_type == 999) {
//         if (
//           !formData.disability_description ||
//           formData.disability_description.toString().trim() === ""
//         ) {
//           return false;
//         }
//       }
//     }
//     if (formData.career_break === "Yes") {
//       if (
//         !formData.career_break_reason ||
//         formData.career_break_reason.toString().trim() === ""
//       ) {
//         return false;
//       }
//       if (
//         !formData.career_break_start_year ||
//         formData.career_break_start_year.toString().trim() === ""
//       ) {
//         return false;
//       }
//       if (
//         !formData.career_break_start_month ||
//         formData.career_break_start_month.toString().trim() === ""
//       ) {
//         return false;
//       }

//       if (formData.currently_on_career_break === false) {
//         if (
//           !formData.career_break_end_year ||
//           formData.career_break_end_year.toString().trim() === ""
//         ) {
//           return false;
//         }
//         if (
//           !formData.career_break_end_month ||
//           formData.career_break_end_month.toString().trim() === ""
//         ) {
//           return false;
//         }
//       }
//     }
//     if (formData.languages.length > 0) {
//       for (let i = 0; i < formData.languages.length; i++) {
//         if (
//           !formData.languages[i].language ||
//           formData.languages[i].language.toString().trim() === ""
//         ) {
//           return false;
//         }
//         if (
//           !formData.languages[i].proficiency ||
//           formData.languages[i].proficiency.toString().trim() === ""
//         ) {
//           return false;
//         }
//         const lang = formData.languages[i];
//         if (!(lang.read || lang.write || lang.speak)) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   if (!show) return null;

//   const handleSave = async () => {
//     if (!token) {
//       console.error("Authorization token is missing. Please log in.");
//       return;
//     }
//     if (!validateForm()) {
//       console.log("Please fill in all required fields.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const response = await API.post(
//         `/api/candidate/personal/submit_personal_details`,
//         formData,
//       );
//       console.log("Response:", response.data);
//       setSaving(false);
//       setReload(!reload);
//       //setSuccess("Personal details updated successfully");
//       toast({
//         title: "Success",
//         description: "Personal details updated successfully",
//       });

//       onClose();
//     } catch (error) {
//       console.error("Error saving personal details:", error);
//       setSaving(false);
//       setError("Error saving personal details. Please try again.");
//       toast({
//         title: "Error",
//         variant: "destructive",
//         description: "Error saving personal details. Please try again.",
//       });
//     }
//   };
//   if (!show) return null;

//   return (
//     <>
//       <style>
//         {`
//         .custom-textarea::placeholder {
//           color: #c7c5c5 !important;
//           font-size: 15px !important;
//         }

//         .option-btn {
//           border: 1px solid #8c8c8c;
//           color: #333;
//           background: white;
//           font-size: 15px;
//           padding: 6px 15px;
//           transition: all 0.2s ease-in-out;
//         }

//         .option-btn.active {
//           background: #f0efff;
//           font-weight: bold;
//           border-color: #635bff;
//           color: black;
//         }

//         .info-btn {
//           border: 1px solid #a5a5a5;
//           background: white;
//           color: #333;
//           font-size: 14px;
//           padding: 6px 12px;
//           transition: all 0.2s ease-in-out;
//         }

//         .info-btn.active {
//           background: #eaeafc;
//           font-weight: bold;
//           border-color: #635bff;
//           color: black;
//         }

//         .tooltip-wrapper {
//           position: relative;
//           display: inline-block;
//         }

//         .tooltip-wrapper .custom-tooltip {
//           visibility: hidden;
//           background-color: white;
//           color: red;
//           font-weight: bold;
//           border: 1px solid red;
//           border-radius: 4px;
//           padding: 5px 10px;
//           position: absolute;
//           bottom: 100%;
//           left: 0;
//           margin-bottom: 6px;
//           white-space: nowrap;
//           z-index: 10;
//         }

//         .tooltip-wrapper:hover .custom-tooltip {
//           visibility: visible;
//         }
//       `}
//       </style>

//       <Dialog open={show} onOpenChange={onClose}>
//         <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
//           {/* Header */}
//           <DialogHeader>
//             <DialogTitle className="font-display text-xl">
//               Personal Details
//             </DialogTitle>

//             <DialogDescription>
//               This information helps employers know you better.
//             </DialogDescription>
//           </DialogHeader>

//           {/* Body */}
//           <div className="space-y-4 pt-2">
//             {loading ? (
//               "loading......"
//             ) : (
//               <>
//                 {error && (
//                   <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
//                     {error}
//                   </div>
//                 )}

//                 <PersonalInfoForm
//                   formData={formData}
//                   setFormData={setFormData}
//                   focusSection={focusSection}
//                   show={show}
//                   setWrongDate={setWrongDate}
//                 />
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           {/*  <div className="flex justify-end gap-3 pt-4">

//           <button
//             className="btn btn-secondary"
//             onClick={onClose}
//             type="button"
//           >
//             Cancel
//           </button>

//           <div className="tooltip-wrapper">
//             {!isFormValid && (
//               <div className="custom-tooltip">
//                 Please fill all required fields
//               </div>
//             )}

//             {wrongdate2 && (
//               <div className="custom-tooltip">
//                 Not valid Date Range
//               </div>
//             )}

//             <button
//               className="btn btn-primary"
//               onClick={handleSave}
//               disabled={!isFormValid || saving || wrongdate2}
//               type="button"
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </div> */}

//         {/*   <div className="flex justify-end gap-3 pt-4">
//             <button
//               className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
//               onClick={onClose}
//               type="button"
//             >
//               Cancel
//             </button>

//             <div className="relative inline-block">
//               {(!isFormValid || wrongdate2) && (
//                 <div className="absolute bottom-full right-0 mb-2 z-50 w-max max-w-[220px] rounded bg-gray-800 px-3 py-2 text-sm text-white shadow-lg">
//                   {!isFormValid
//                     ? "Please fill all required fields"
//                     : "Not valid Date Range"}

//                   <div className="absolute right-6 top-full border-4 border-transparent border-t-gray-800" />
//                 </div>
//               )}

//               <Button disabled={!isFormValid || saving || wrongdate2}>
//                 {saving ? "Saving..." : "Save"}
//               </Button>
//             </div>
//           </div> */}

//  {/* Footer */}
//            <div className="flex justify-end gap-3 pt-6">

//         <button
//           type="button"
//           onClick={onClose}
//           className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
//         >
//           Cancel
//         </button>

//         <div className="relative inline-flex group">
//         <button
//         type="submit"
//             onClick={handleSave}
//             disabled={!isFormValid || saving || wrongdate2}
//              className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:cursor-not-allowed disabled:bg-[#27406F]/50"
//         >
//             {saving ? "Saving..." : "Save"}
//         </button>

//         {!isFormValid && (
//             <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
//             Please fill all required fields.
//             </div>
//         )}
//         </div>

//       </div>

//           {/* <div className="flex justify-end gap-3 pt-4">

//            {!isFormValid && (
//               <div className="custom-tooltip">
//                 Please fill all required fields
//               </div>
//             )}

//             {wrongdate2 && (
//               <div className="custom-tooltip">
//                 Not valid Date Range
//               </div>
//             )}

//   <button
//     type="button"
//     onClick={onClose}
//     className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors"
//   >
//     Cancel
//   </button>

//   <button
//     type="button"
//     onClick={handleSave}
//               disabled={!isFormValid || saving || wrongdate2}
//     className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
//   >
//      {saving ? "Saving..." : "Save"}
//   </button>
// </div> */}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default FormModal;

// import React, { useState, useEffect } from "react";
// import API from "../../../lib/axios";
// import PersonalInfoForm from "./PersonalInfoForm";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useToast } from "@/hooks/use-toast";

// const FormModal = ({
//   show,
//   onClose,
//   reload,
//   setReload,
//   error,
//   setError,
//   focusSection,
//   targetLanguageId,
//   setSuccess,
// }) => {
//   const { toast } = useToast();
//   const [formData, setFormData] = useState({
//     gender: "",
//     dob: null,
//     more_info: [],
//     marital_status: "",
//     partner_name: "",
//     category: "",
//     differently_abled: "",
//     disability_type: "",
//     disability_description: "",
//     workplace_assistance: "",
//     career_break: "",
//     career_break_reason: "",
//     career_break_start_year: "",
//     career_break_start_month: "",
//     currently_on_career_break: false,
//     career_break_end_year: "",
//     career_break_end_month: "",
//     usa_visa_type: "",
//     work_permit_other_countries: [],
//     permanent_address: "",
//     hometown: "",
//     pincode: "",
//     languages: [],
//     languagesDetails: [], 
//     have_usa_visa: false,
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [wrongdate, setWrongDate] = useState(false);
//   const [wrongdate2, setWrongDate2] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);

//   const formatPersonalDetailsResponse = (data) => {
//     return {
//       gender: String(data.gender || ""),
//       dob: data.dob ? new Date(data.dob) : null,
//       more_info: Array.isArray(data.more_info) ? data.more_info.map(String) : [],
//       have_usa_visa: !!data.have_usa_visa,
//       partner_name: data.partner_name || "",
//       marital_status: String(data.marital_status || ""),
//       category: String(data.category || ""),
//       differently_abled: data.differently_abled || "",
//       disability_type: String(data.disability_type || ""),
//       disability_description: data.disability_description || "",
//       workplace_assistance: data.workplace_assistance || "",
//       career_break: data.career_break || "",
//       career_break_reason: String(data.career_break_reason || ""),
//       career_break_start_year: String(data.career_break_start_year || ""),
//       career_break_start_month: String(data.career_break_start_month || ""),
//       currently_on_career_break: !!data.currently_on_career_break,
//       career_break_end_year: String(data.career_break_end_year || ""),
//       career_break_end_month: String(data.career_break_end_month || ""),
//       usa_visa_type: String(data.usa_visa_type || ""),
//       work_permit_other_countries: Array.isArray(data.work_permit_other_countries) ? data.work_permit_other_countries.map(Number) : [],
//       permanent_address: data.permanent_address || "",
//       hometown: data.hometown || "",
//       pincode: data.pincode || "",
//       languages: Array.isArray(data.languages) ? data.languages : [],
//       languagesDetails: Array.isArray(data.languagesDetails)
//         ? data.languagesDetails.map((lang) => ({
//             language: String(lang.language || ""),
//             proficiency: String(lang.proficiency || ""),
//             read: !!lang.read,
//             write: !!lang.write,
//             speak: !!lang.speak,
//             _id: lang._id || undefined
//           }))
//         : [],
//     };
//   };

//   useEffect(() => {
//     const fetchPersonalDetails = async () => {
//       try {
//         setLoading(true);
//         const response = await API.get(`/api/candidate/personal/get_personal_details_with_name`);
//         if (response.status === 200) {
//           const formatted = formatPersonalDetailsResponse(response.data.data);
//           setFormData(formatted);
//         }
//       } catch (error) {
//         console.error("Error fetching personal details:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (show) fetchPersonalDetails();
//   }, [show]);

//   const validateForm = () => {
//     // 1. If currently editing languages, isolate validation logic strictly to the language subfields
//     if (focusSection === "languages") {
//       if (!formData.languagesDetails || formData.languagesDetails.length === 0) return false;
//       for (let i = 0; i < formData.languagesDetails.length; i++) {
//         const lang = formData.languagesDetails[i];
//         if (!lang.language || lang.language.toString().trim() === "") return false;
//         if (!lang.proficiency || lang.proficiency.toString().trim() === "") return false;
//         if (!(lang.read || lang.write || lang.speak)) return false;
//       }
//       return true;
//     }

//     // 2. Main profile submission validation paths
//     if (!formData.gender || formData.gender.toString().trim() === "") return false;
//     if (!formData.dob) return false;

//     if (formData.differently_abled === "Yes") {
//       if (!formData.disability_type || formData.disability_type.toString().trim() === "") return false;
//       if (formData.disability_type === "999" && (!formData.disability_description || formData.disability_description.toString().trim() === "")) return false;
//     }

//     if (formData.career_break === "Yes") {
//       if (!formData.career_break_reason || formData.career_break_reason.toString().trim() === "") return false;
//       if (!formData.career_break_start_year || formData.career_break_start_year.toString().trim() === "") return false;
//       if (!formData.career_break_start_month || formData.career_break_start_month.toString().trim() === "") return false;
//       if (!formData.currently_on_career_break) {
//         if (!formData.career_break_end_year || formData.career_break_end_year.toString().trim() === "") return false;
//         if (!formData.career_break_end_month || formData.career_break_end_month.toString().trim() === "") return false;
//       }
//     }

//     return true;
//   };

//   useEffect(() => {
//     setIsFormValid(validateForm());
//   }, [formData]);

//   useEffect(() => {
//     setWrongDate2(formData.currently_on_career_break ? false : wrongdate);
//   }, [formData.currently_on_career_break, wrongdate]);

//   const handleSave = async () => {
//     if (!validateForm()) return;
//     setSaving(true);
//     try {
//       let finalFormData = { ...formData };

//       if (focusSection === "languages") {
//         finalFormData.languagesDetails = formData.languagesDetails.filter(
//           (lang) => lang.language && lang.proficiency
//         );
//       }

//       await API.post(`/api/candidate/personal/submit_personal_details`, finalFormData);
//       setSaving(false);
//       setReload(!reload);
//       toast({
//         title: "Success",
//         description: "Personal details updated successfully",
//       });
//       onClose();
//     } catch (error) {
//       console.error("Error saving personal details:", error);
//       setSaving(false);
//       setError("Error saving personal details. Please try again.");
//       toast({
//         title: "Error",
//         variant: "destructive",
//         description: "Error saving personal details. Please try again.",
//       });
//     }
//   };

//   if (!show) return null;

//   return (
//     <Dialog open={show} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="font-display text-xl">Personal Details</DialogTitle>
//           <DialogDescription>This information helps employers know you better.</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 pt-2">
//           {loading ? (
//             <div className="text-center py-4 text-sm text-gray-500">loading details...</div>
//           ) : (
//             <>
//               {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
//               <PersonalInfoForm
//                 formData={formData}
//                 setFormData={setFormData}
//                 focusSection={focusSection}
//                 targetLanguageId={targetLanguageId}
//                 show={show}
//                 setWrongDate={setWrongDate}
//               />
//             </>
//           )}
//         </div>

//         <div className="flex justify-end gap-3 pt-6">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
//           >
//             Cancel
//           </button>
//           <div className="relative inline-flex group">
//             <button
//               type="submit"
//               onClick={handleSave}
//               disabled={!isFormValid || saving || wrongdate2}
//               className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:cursor-not-allowed disabled:bg-[#27406F]/50"
//             >
//               {saving ? "Saving..." : "Save"}
//             </button>
//             {!isFormValid && (
//               <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
//                 Please fill all required fields.
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default FormModal;

import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import PersonalInfoForm from "./PersonalInfoForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const FormModal = ({
  show,
  onClose,
  reload,
  setReload,
  error,
  setError,
  focusSection,
  targetLanguageId,
  setSuccess,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    gender: "",
    dob: null,
    more_info: [],
    marital_status: "",
    partner_name: "",
    category: "",
    differently_abled: "",
    disability_type: "",
    disability_description: "",
    workplace_assistance: "",
    career_break: "",
    career_break_reason: "",
    career_break_start_year: "",
    career_break_start_month: "",
    currently_on_career_break: false,
    career_break_end_year: "",
    career_break_end_month: "",
    usa_visa_type: "",
    work_permit_other_countries: [],
    permanent_address: "",
    hometown: "",
    pincode: "",
    languages: [],
    languagesDetails: [], 
    have_usa_visa: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [wrongdate, setWrongDate] = useState(false);
  const [wrongdate2, setWrongDate2] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const formatPersonalDetailsResponse = (data) => {
    return {
      gender: String(data.gender || ""),
      dob: data.dob ? new Date(data.dob) : null,
      more_info: Array.isArray(data.more_info) ? data.more_info.map(String) : [],
      have_usa_visa: !!data.have_usa_visa,
      partner_name: data.partner_name || "",
      marital_status: String(data.marital_status || ""),
      category: String(data.category || ""),
      differently_abled: data.differently_abled || "",
      disability_type: String(data.disability_type || ""),
      disability_description: data.disability_description || "",
      workplace_assistance: data.workplace_assistance || "",
      career_break: data.career_break || "",
      career_break_reason: String(data.career_break_reason || ""),
      career_break_start_year: String(data.career_break_start_year || ""),
      career_break_start_month: String(data.career_break_start_month || ""),
      currently_on_career_break: !!data.currently_on_career_break,
      career_break_end_year: String(data.career_break_end_year || ""),
      career_break_end_month: String(data.career_break_end_month || ""),
      usa_visa_type: String(data.usa_visa_type || ""),
      work_permit_other_countries: Array.isArray(data.work_permit_other_countries) ? data.work_permit_other_countries.map(Number) : [],
      permanent_address: data.permanent_address || "",
      hometown: data.hometown || "",
      pincode: data.pincode || "",
      languages: Array.isArray(data.languages) ? data.languages : [],
      languagesDetails: Array.isArray(data.languagesDetails)
        ? data.languagesDetails.map((lang) => ({
            language: String(lang.language || ""),
            proficiency: String(lang.proficiency || ""),
            read: !!lang.read,
            write: !!lang.write,
            speak: !!lang.speak,
            _id: lang._id || undefined
          }))
        : [],
    };
  };

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/api/candidate/personal/get_personal_details_with_name`);
        if (response.status === 200) {
          const formatted = formatPersonalDetailsResponse(response.data.data);
          
          // FIXED: If user clicked "Add New Languages", inject a pristine blank item row structure straight away
          if (focusSection === "languages" && !targetLanguageId) {
            formatted.languagesDetails = [
              ...formatted.languagesDetails,
              { language: "", proficiency: "", read: false, write: false, speak: false }
            ];
            formatted.languages = [
              ...formatted.languages,
              { language: "", proficiency: "", read: false, write: false, speak: false }
            ];
          }

          setFormData(formatted);
        }
      } catch (error) {
        console.error("Error fetching personal details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (show) fetchPersonalDetails();
  }, [show, focusSection, targetLanguageId]);

  const validateForm = () => {
    if (focusSection === "languages") {
      // Find the row we are currently editing/adding
      let targetIndex = -1;
      if (targetLanguageId) {
        const targetStr = String(targetLanguageId).trim().toLowerCase();
        targetIndex = formData.languagesDetails.findIndex((l) => String(l._id || "").trim().toLowerCase() === targetStr);
      } else {
        // If adding new, the target is the last item we just injected
        targetIndex = formData.languagesDetails.length - 1;
      }

      if (targetIndex === -1 || !formData.languagesDetails[targetIndex]) return false;

      const currentLangRow = formData.languagesDetails[targetIndex];
      
      // FIXED: Ensure the language field drop-down has a valid selection
      if (!currentLangRow.language || currentLangRow.language.toString().trim() === "") return false;
      // FIXED: Ensure the proficiency field drop-down has a valid selection
      if (!currentLangRow.proficiency || currentLangRow.proficiency.toString().trim() === "") return false;
      // Ensure at least one skill checkbox is checked
      if (!(currentLangRow.read || currentLangRow.write || currentLangRow.speak)) return false;

      return true;
    }

    // Main details fallback paths
    if (!formData.gender || formData.gender.toString().trim() === "") return false;
    if (!formData.dob) return false;

    if (formData.differently_abled === "Yes") {
      if (!formData.disability_type || formData.disability_type.toString().trim() === "") return false;
      if (formData.disability_type === "999" && (!formData.disability_description || formData.disability_description.toString().trim() === "")) return false;
    }

    if (formData.career_break === "Yes") {
      if (!formData.career_break_reason || formData.career_break_reason.toString().trim() === "") return false;
      if (!formData.career_break_start_year || formData.career_break_start_year.toString().trim() === "") return false;
      if (!formData.career_break_start_month || formData.career_break_start_month.toString().trim() === "") return false;
      if (!formData.currently_on_career_break) {
        if (!formData.career_break_end_year || formData.career_break_end_year.toString().trim() === "") return false;
        if (!formData.career_break_end_month || formData.career_break_end_month.toString().trim() === "") return false;
      }
    }

    return true;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  useEffect(() => {
    setWrongDate2(formData.currently_on_career_break ? false : wrongdate);
  }, [formData.currently_on_career_break, wrongdate]);

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      let finalFormData = { ...formData };

      if (focusSection === "languages") {
        finalFormData.languagesDetails = formData.languagesDetails.filter(
          (lang) => lang.language && lang.proficiency
        );
      }

      await API.post(`/api/candidate/personal/submit_personal_details`, finalFormData);
      setSaving(false);
      setReload(!reload);
      toast({
        title: "Success",
        description: "Personal details updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Error saving personal details:", error);
      setSaving(false);
      setError("Error saving personal details. Please try again.");
      toast({
        title: "Error",
        variant: "destructive",
        description: "Error saving personal details. Please try again.",
      });
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Personal Details</DialogTitle>
          <DialogDescription>This information helps employers know you better.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {loading ? (
            <div className="text-center py-4 text-sm text-gray-500">loading details...</div>
          ) : (
            <>
              {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded">{error}</div>}
              <PersonalInfoForm
                formData={formData}
                setFormData={setFormData}
                focusSection={focusSection}
                targetLanguageId={targetLanguageId}
                show={show}
                setWrongDate={setWrongDate}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <div className="relative inline-flex group">
            <button
              type="submit"
              onClick={handleSave}
              disabled={!isFormValid || saving || wrongdate2}
              className="rounded-md bg-[#27406F] px-4 py-2 text-white hover:bg-[#1F3358] disabled:cursor-not-allowed disabled:bg-[#27406F]/50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            {!isFormValid && (
              <div className="pointer-events-none absolute bottom-full right-0 mb-2 hidden w-52 rounded-md border border-red-300 bg-white p-2 text-center text-sm text-red-600 shadow-lg group-hover:block">
                Please fill all required fields.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;