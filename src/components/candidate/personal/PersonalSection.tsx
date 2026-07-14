// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { CheckCircle, CircleX, Pencil, CircleCheck } from "lucide-react";
// import API from "../../../lib/axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
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
// import PersonalModal from "./PersonalModal";
// const PersonalSection = () => {
//   //const apiurl =  import.meta.env.VITE_API_URL;
//   const [modalType, setModalType] = useState(null);
//   const [focusSection, setFocusSection] = useState(null);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   // Personal details state (initial data)
//   const [personalDetails, setPersonalDetails] = useState({
//     gender: "",
//     maritalStatus: "",
//     moreinfo: "",
//     dob: "",
//     category: "",
//     differentlyAbled: "",
//     disabilityType: "",
//     disabilityDescription: "",
//     workplaceAssistance: "",
//     partner_name: "",

//     careerBreak: "",
//     careerBreakReason: "",
//     careerBreakStartYear: "",
//     careerBreakStartMonth: "",
//     currentlyOnCareerBreak: false,
//     careerBreakEndYear: "",
//     careerBreakEndMonth: "",

//     workPermit: "",
//     address: "",
//     languages: [],
//     usa_visa_type: "",
//   });

//   const [reload, setReload] = useState(false);
//   const [sectionloading, setSectionloading] = useState(true);

//   useEffect(() => {
//     const fetchuserdata = async () => {
//       try {
//         setSectionloading(true);
//         const token = localStorage.getItem("token");
//         /* const response = await axios.get(
//           `${apiurl}/api/candidate/personal/get_personal_details_with_name`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         ); */
//         const response = await API.get(
//           `/api/candidate/personal/get_personal_details_with_name`,
//         );
//         if (response.status == 200) {
//           const maindata = response.data.data;
//           setPersonalDetails(maindata);
//         }
//       } catch (error) {
//         console.error("Error fetching skills:", error);
//       } finally {
//         setSectionloading(false);
//       }
//     };
//     fetchuserdata();
//   }, [reload]);

//   // Open and close modal handlers
//   const openModalRH = (type) => {
//     setModalType(type);
//     setFocusSection(type); // set the focus section for modal
//     document.body.style.overflow = "hidden";
//   };
//   const closeModalRH = () => {
//     setModalType(null);
//     setFocusSection(null); // reset focus section
//     document.body.style.overflow = "auto";
//   };

//   const getFormattedDOB = (dob) => {
//     if (!dob) return "";
//     const date = new Date(dob); // Input: UTC string like "2000-10-12T18:30:00.000Z"
//     const options = {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: "Asia/Kolkata", // Force IST conversion
//     };
//     return date.toLocaleDateString("en-GB", options); // e.g., "13 Oct 2000"
//   };
//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="text-lg">Personal Details</CardTitle>
//             <CardDescription></CardDescription>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => openModalRH("editPersonal")}
//           >
//             <Pencil className="h-4 w-4" />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {sectionloading ? (
//             "loading............."
//           ) : (
//             <>
//               {/* Personal Details */}
//               <div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Personal */}
//                   <div>
//                     <strong>Personal</strong>

//                     <div className="mt-2  ">
//                       <div>
//                         {[
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ]
//                           .filter(Boolean)
//                           .join(", ")}

//                         {![
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ].every(Boolean) && (
//                           <span
//                             className="ml-2 cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("personalInfo")}
//                           >
//                             Add more info
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Partner */}
//                   {personalDetails.partner_name && (
//                     <div>
//                       <strong>Partner Name</strong>

//                       <div
//                         className="mt-2 truncate "
//                         title={personalDetails.partner_name || ""}
//                       >
//                         {personalDetails.partner_name || "N/A"}
//                       </div>
//                     </div>
//                   )}

//                   {/* Career Break */}
//                   <div>
//                     <strong>Career Break</strong>

//                     <div className="mt-2 ">
//                       {personalDetails.careerBreak ? (
//                         personalDetails.careerBreak.toLowerCase() === "yes" ? (
//                           <div>
//                             <div>
//                               Yes
//                               {personalDetails.careerBreakReason && (
//                                 <> – {personalDetails.careerBreakReason}</>
//                               )}
//                             </div>

//                             <div className="flex flex-wrap gap-3 mt-1">
//                               <div>
//                                 <strong>From:</strong>{" "}
//                                 {personalDetails.careerBreakStartMonth}{" "}
//                                 {personalDetails.careerBreakStartYear}
//                               </div>

//                               <div>
//                                 <strong>To:</strong>{" "}
//                                 {personalDetails.currentlyOnCareerBreak
//                                   ? "Present"
//                                   : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           personalDetails.careerBreak
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("careerBreak")}
//                         >
//                           Add Career Break
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* DOB */}
//                   <div>
//                     <strong>Date of Birth</strong>

//                     <div className="mt-2 ">
//                       {getFormattedDOB(personalDetails.dob) || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("dob")}
//                         >
//                           Add Date of Birth
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <strong>Category</strong>

//                     <div className="mt-2 ">
//                       {personalDetails.category || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("category")}
//                         >
//                           Add Category
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Work Permit */}
//                   <div>
//                     <strong>Work Permit</strong>

//                     <div className="mt-2  space-y-1">
//                       {personalDetails.usa_visa_type && (
//                         <div>{personalDetails.usa_visa_type}</div>
//                       )}

//                       {personalDetails.workPermit && (
//                         <div>{personalDetails.workPermit}</div>
//                       )}

//                       {!personalDetails.usa_visa_type &&
//                         !personalDetails.workPermit && (
//                           <div
//                             className="cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("workPermit")}
//                           >
//                             Add Work Permit
//                           </div>
//                         )}
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div>
//                     <strong>Hometown & Permanent address </strong>

//                     <div className="mt-2">
//                       {personalDetails.address || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("address")}
//                         >
//                           Add Address
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Differently Abled */}
//                   <div>
//                     <strong>Differently Abled</strong>

//                     <div className="mt-2">
//                       {personalDetails.differentlyAbled ? (
//                         personalDetails.differentlyAbled.toLowerCase() ===
//                         "yes" ? (
//                           <>
//                             {[
//                               personalDetails.differentlyAbled,
//                               personalDetails.disabilityType,
//                               personalDetails.disabilityDescription,
//                               personalDetails.workplaceAssistance,
//                             ]
//                               .filter(Boolean)
//                               .join(", ")}
//                           </>
//                         ) : (
//                           personalDetails.differentlyAbled
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("differentlyAbled")}
//                         >
//                           Add Differently Abled Status
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="my-8" />

//                 {/* Languages */}
//                 <div className="mb-4 flex items-center justify-between">
//                   <h5 className="text-lg font-bold">Languages</h5>

//                   <i
//                     className="la la-pencil-alt cursor-pointer text-lg"
//                     onClick={() => openModalRH("languages")}
//                   />
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => openModalRH("languages")}
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </Button>
//                 </div>

//                 {personalDetails.languages.length > 0 && (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full border border-gray-200">
//                       <thead className="bg-gray-100">
//                         <tr>
//                           <th className="px-4 py-2 text-left">Language</th>
//                           <th className="px-4 py-2 text-left">Proficiency</th>
//                           <th className="px-4 py-2 text-center">Read</th>
//                           <th className="px-4 py-2 text-center">Write</th>
//                           <th className="px-4 py-2 text-center">Speak</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {personalDetails.languages.map((lang, index) => (
//                           <tr key={index} className="border-t border-gray-200">
//                             <td className="px-4 py-2">{lang.language}</td>

//                             <td className="px-4 py-2">{lang.proficiency}</td>

//                             <td className="px-4 py-2 text-center">
//                               {lang.read ? (
//                                 <CircleCheck color="#00A85A" size={18} />
//                               ) : (
//                                 <CircleX color="#FF0000" size={18} />
//                               )}
//                             </td>

//                             <td className="px-4 py-2 text-center">
//                               {lang.write ? (
//                                 <CircleCheck color="#00A85A" size={18} />
//                               ) : (
//                                 <CircleX color="#FF0000" size={18} />
//                               )}
//                             </td>

//                             <td className="px-4 py-2 text-center">
//                               {lang.speak ? (
//                                 <CircleCheck color="#00A85A" size={18} />
//                               ) : (
//                                 <CircleX color="#FF0000" size={18} />
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {modalType && (
//         <PersonalModal
//           show={!!modalType}
//           onClose={closeModalRH}
//           focusSection={focusSection}
//           reload={reload}
//           setReload={setReload}
//           setError={setError}
//           setSuccess={setSuccess}
//         />
//       )}
//     </>
//   );
// };

// export default PersonalSection;

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Pencil, CircleX, CircleCheck, Plus } from "lucide-react";
// import API from "../../../lib/axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import FormModal from "./PersonalModal";

// const PersonalSection = () => {
//   const [modalType, setModalType] = useState(null);
//   const [focusSection, setFocusSection] = useState(null);
//   const [targetLanguageId, setTargetLanguageId] = useState(null);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const [personalDetails, setPersonalDetails] = useState({
//     gender: "",
//     maritalStatus: "",
//     moreinfo: "",
//     dob: "",
//     category: "",
//     differentlyAbled: "",
//     disabilityType: "",
//     disabilityDescription: "",
//     workplaceAssistance: "",
//     partner_name: "",
//     careerBreak: "",
//     careerBreakReason: "",
//     careerBreakStartYear: "",
//     careerBreakStartMonth: "",
//     currentlyOnCareerBreak: false,
//     careerBreakEndYear: "",
//     careerBreakEndMonth: "",
//     workPermit: "",
//     address: "",
//     languages: [],
//     languagesDetails: [],
//     usa_visa_type: "",
//   });

//   const [reload, setReload] = useState(false);
//   const [sectionloading, setSectionloading] = useState(true);

//   useEffect(() => {
//     const fetchuserdata = async () => {
//       try {
//         setSectionloading(true);
//         const response = await API.get(
//           `/api/candidate/personal/get_personal_details_with_name`,
//         );
//         if (response.status === 200) {
//           const maindata = response.data.data;
//           setPersonalDetails(maindata);
//         }
//       } catch (error) {
//         console.error("Error fetching personal data:", error);
//       } finally {
//         setSectionloading(false);
//       }
//     };
//     fetchuserdata();
//   }, [reload]);

//   const openModalRH = (type, langId = null) => {
//     setModalType(type);
//     setFocusSection(type);
//     setTargetLanguageId(langId);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModalRH = () => {
//     setModalType(null);
//     setFocusSection(null);
//     setTargetLanguageId(null);
//     document.body.style.overflow = "auto";
//   };

//   const getFormattedDOB = (dob) => {
//     if (!dob) return "";
//     const date = new Date(dob);
//     const options = {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: "Asia/Kolkata",
//     };
//     return date.toLocaleDateString("en-GB", options);
//   };

//   return (
//     <>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between">
//           <div>
//             <CardTitle className="text-lg">Personal Details</CardTitle>
//             <CardDescription></CardDescription>
//           </div>
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => openModalRH("editPersonal")}
//           >
//             <Pencil className="h-4 w-4" />
//           </Button>
//         </CardHeader>
//         <CardContent>
//           {sectionloading ? (
//             "loading............."
//           ) : (
//             <>
//               <div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Personal */}
//                   <div>
//                     <strong>Personal</strong>
//                     <div className="mt-2">
//                       <div>
//                         {[
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ]
//                           .filter(Boolean)
//                           .join(", ")}

//                         {![
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ].every(Boolean) && (
//                           <span
//                             className="ml-2 cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("personalInfo")}
//                           >
//                             Add more info
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Partner Name */}
//                   {personalDetails.partner_name && (
//                     <div>
//                       <strong>Partner Name</strong>
//                       <div
//                         className="mt-2 truncate"
//                         title={personalDetails.partner_name || ""}
//                       >
//                         {personalDetails.partner_name || "N/A"}
//                       </div>
//                     </div>
//                   )}

//                   {/* Career Break */}
//                   <div>
//                     <strong>Career Break</strong>
//                     <div className="mt-2">
//                       {personalDetails.careerBreak ? (
//                         personalDetails.careerBreak.toLowerCase() === "yes" ? (
//                           <div>
//                             <div>
//                               Yes
//                               {personalDetails.careerBreakReason && (
//                                 <> – {personalDetails.careerBreakReason}</>
//                               )}
//                             </div>
//                             <div className="flex flex-wrap gap-3 mt-1">
//                               <div>
//                                 <strong>From:</strong>{" "}
//                                 {personalDetails.careerBreakStartMonth}{" "}
//                                 {personalDetails.careerBreakStartYear}
//                               </div>
//                               <div>
//                                 <strong>To:</strong>{" "}
//                                 {personalDetails.currentlyOnCareerBreak
//                                   ? "Present"
//                                   : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           personalDetails.careerBreak
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("careerBreak")}
//                         >
//                           Add Career Break
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* DOB */}
//                   <div>
//                     <strong>Date of Birth</strong>
//                     <div className="mt-2">
//                       {getFormattedDOB(personalDetails.dob) || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("dob")}
//                         >
//                           Add Date of Birth
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <strong>Category</strong>
//                     <div className="mt-2">
//                       {personalDetails.category || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("category")}
//                         >
//                           Add Category
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Work Permit */}
//                   <div>
//                     <strong>Work Permit</strong>
//                     <div className="mt-2 space-y-1">
//                       {personalDetails.usa_visa_type && (
//                         <div>{personalDetails.usa_visa_type}</div>
//                       )}
//                       {personalDetails.workPermit && (
//                         <div>{personalDetails.workPermit}</div>
//                       )}
//                       {!personalDetails.usa_visa_type &&
//                         !personalDetails.workPermit && (
//                           <div
//                             className="cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("workPermit")}
//                           >
//                             Add Work Permit
//                           </div>
//                         )}
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div>
//                     <strong>Hometown & Permanent address </strong>
//                     <div className="mt-2">
//                       {personalDetails.address || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("address")}
//                         >
//                           Add Address
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Differently Abled */}
//                   <div>
//                     <strong>Differently Abled</strong>
//                     <div className="mt-2">
//                       {personalDetails.differentlyAbled ? (
//                         personalDetails.differentlyAbled.toLowerCase() ===
//                         "yes" ? (
//                           <>
//                             {[
//                               personalDetails.differentlyAbled,
//                               personalDetails.disabilityType,
//                               personalDetails.disabilityDescription,
//                               personalDetails.workplaceAssistance,
//                             ]
//                               .filter(Boolean)
//                               .join(", ")}
//                           </>
//                         ) : (
//                           personalDetails.differentlyAbled
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("differentlyAbled")}
//                         >
//                           Add Differently Abled Status
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="my-8" />

//                 {/* Languages Section Display */}
//                 <div className="mb-4 flex items-center justify-between">
//                   <h5 className="text-lg font-bold">Languages</h5>
//                   <Button
                   
//                     onClick={() => openModalRH("languages", null)}
//                   >
//                     Add New Languages
//                     <Plus className="h-4 w-4" />
//                   </Button>
//                 </div>

//                 {personalDetails.languages &&
//                   personalDetails.languages.length > 0 && (
//                     <div className="overflow-x-auto rounded-lg border border-gray-200">
//                       <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             {/* FIXED: Proper semantic text alignments matching table cell shapes precisely */}
//                             <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/3">Language</th>
//                             <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/4">Proficiency</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Read</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Write</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Speak</th>
//                             <th className="px-6 py-3 text-right font-semibold text-gray-700 w-16">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {personalDetails.languages.map((lang, index) => {
//                             const matchingDetailsObj =
//                               personalDetails.languagesDetails?.[index];
//                             const correctHexId = matchingDetailsObj
//                               ? matchingDetailsObj._id
//                               : null;

//                             return (
//                               <tr key={index} className="hover:bg-gray-50/70 transition-colors">
//                                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
//                                   {lang.language_name || lang.language}
//                                 </td>
//                                 <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
//                                   {lang.proficiency_name || lang.proficiency}
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   {/* FIXED: Added inner flex center containment containers for icons display alignment */}
//                                   <div className="flex justify-center">
//                                     {lang.read ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex justify-center">
//                                     {lang.write ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex justify-center">
//                                     {lang.speak ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-right whitespace-nowrap">
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => openModalRH("languages", correctHexId)}
//                                     className="h-8 w-8 hover:bg-gray-100"
//                                   >
//                                     <Pencil className="h-4 w-4 text-blue-600" />
//                                   </Button>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       {modalType && (
//         <FormModal
//           show={!!modalType}
//           onClose={closeModalRH}
//           focusSection={focusSection}
//           targetLanguageId={targetLanguageId}
//           reload={reload}
//           setReload={setReload}
//           setError={setError}
//           setSuccess={setSuccess}
//           error={error}
//         />
//       )}
//     </>
//   );
// };

// export default PersonalSection;


// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Pencil, CircleX, CircleCheck, Plus } from "lucide-react";
// import API from "../../../lib/axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import FormModal from "./PersonalModal";

// const PersonalSection = () => {
//   const [modalType, setModalType] = useState(null);
//   const [focusSection, setFocusSection] = useState(null);
//   const [targetLanguageId, setTargetLanguageId] = useState(null);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const [personalDetails, setPersonalDetails] = useState({
//     gender: "",
//     maritalStatus: "",
//     moreinfo: "",
//     dob: "",
//     category: "",
//     differentlyAbled: "",
//     disabilityType: "",
//     disabilityDescription: "",
//     workplaceAssistance: "",
//     partner_name: "",
//     careerBreak: "",
//     careerBreakReason: "",
//     careerBreakStartYear: "",
//     careerBreakStartMonth: "",
//     currentlyOnCareerBreak: false,
//     careerBreakEndYear: "",
//     careerBreakEndMonth: "",
//     workPermit: "",
//     address: "",
//     languages: [],
//     languagesDetails: [],
//     usa_visa_type: "",
//   });

//   const [reload, setReload] = useState(false);
//   const [sectionloading, setSectionloading] = useState(true);

//   useEffect(() => {
//     const fetchuserdata = async () => {
//       try {
//         setSectionloading(true);
//         const response = await API.get(
//           `/api/candidate/personal/get_personal_details_with_name`,
//         );
//         if (response.status === 200) {
//           const maindata = response.data.data;
//           setPersonalDetails(maindata);
//         }
//       } catch (error) {
//         console.error("Error fetching personal data:", error);
//       } finally {
//         setSectionloading(false);
//       }
//     };
//     fetchuserdata();
//   }, [reload]);

//   const openModalRH = (type, langId = null) => {
//     setModalType(type);
//     setFocusSection(type);
//     setTargetLanguageId(langId);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModalRH = () => {
//     setModalType(null);
//     setFocusSection(null);
//     setTargetLanguageId(null);
//     document.body.style.overflow = "auto";
//   };

//   const getFormattedDOB = (dob) => {
//     if (!dob) return "";
//     const date = new Date(dob);
//     const options = {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//       timeZone: "Asia/Kolkata",
//     };
//     return date.toLocaleDateString("en-GB", options);
//   };

//   // Helper check to see if the user has filled out any personal data
//   const hasPersonalData = !!(
//     personalDetails.gender ||
//     personalDetails.maritalStatus ||
//     personalDetails.dob ||
//     personalDetails.address ||
//     personalDetails.category
//   );

//   return (
// <>
 
   
    
//         <CardContent>
//           {sectionloading ? (
//             "loading............"
//           ) : (
//             <>
//               <div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Personal */}
//                   <div>
//                     <strong>Personal</strong>
//                     <div className="mt-2">
//                       <div>
//                         {[
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ]
//                           .filter(Boolean)
//                           .join(", ") || <span className="text-gray-400 text-xs italic"></span>}

//                         {![
//                           personalDetails.gender,
//                           personalDetails.maritalStatus,
//                           personalDetails.moreinfo,
//                         ].every(Boolean) && (
//                           <span
//                             className="ml-2 cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("personalInfo")}
//                           >
//                             Add more info
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Partner Name */}
//                   {personalDetails.partner_name && (
//                     <div>
//                       <strong>Partner Name</strong>
//                       <div
//                         className="mt-2 truncate"
//                         title={personalDetails.partner_name || ""}
//                       >
//                         {personalDetails.partner_name || "N/A"}
//                       </div>
//                     </div>
//                   )}

//                   {/* Career Break */}
//                   <div>
//                     <strong>Career Break</strong>
//                     <div className="mt-2">
//                       {personalDetails.careerBreak ? (
//                         personalDetails.careerBreak.toLowerCase() === "yes" ? (
//                           <div>
//                             <div>
//                               Yes
//                               {personalDetails.careerBreakReason && (
//                                 <> – {personalDetails.careerBreakReason}</>
//                               )}
//                             </div>
//                             <div className="flex flex-wrap gap-3 mt-1">
//                               <div>
//                                 <strong>From:</strong>{" "}
//                                 {personalDetails.careerBreakStartMonth}{" "}
//                                 {personalDetails.careerBreakStartYear}
//                               </div>
//                               <div>
//                                 <strong>To:</strong>{" "}
//                                 {personalDetails.currentlyOnCareerBreak
//                                   ? "Present"
//                                   : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
//                               </div>
//                             </div>
//                           </div>
//                         ) : (
//                           personalDetails.careerBreak
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("careerBreak")}
//                         >
//                           Add Career Break
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* DOB */}
//                   <div>
//                     <strong>Date of Birth</strong>
//                     <div className="mt-2">
//                       {getFormattedDOB(personalDetails.dob) || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("dob")}
//                         >
//                           Add Date of Birth
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <strong>Category</strong>
//                     <div className="mt-2">
//                       {personalDetails.category || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("category")}
//                         >
//                           Add Category
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Work Permit */}
//                   <div>
//                     <strong>Work Permit</strong>
//                     <div className="mt-2 space-y-1">
//                       {personalDetails.usa_visa_type && (
//                         <div>{personalDetails.usa_visa_type}</div>
//                       )}
//                       {personalDetails.workPermit && (
//                         <div>{personalDetails.workPermit}</div>
//                       )}
//                       {!personalDetails.usa_visa_type &&
//                         !personalDetails.workPermit && (
//                           <div
//                             className="cursor-pointer font-semibold text-blue-600"
//                             onClick={() => openModalRH("workPermit")}
//                           >
//                             Add Work Permit
//                           </div>
//                         )}
//                     </div>
//                   </div>

//                   {/* Address */}
//                   <div>
//                     <strong>Hometown & Permanent address </strong>
//                     <div className="mt-2">
//                       {personalDetails.address || (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("address")}
//                         >
//                           Add Address
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Differently Abled */}
//                   <div>
//                     <strong>Differently Abled</strong>
//                     <div className="mt-2">
//                       {personalDetails.differentlyAbled ? (
//                         personalDetails.differentlyAbled.toLowerCase() ===
//                         "yes" ? (
//                           <>
//                             {[
//                               personalDetails.differentlyAbled,
//                               personalDetails.disabilityType,
//                               personalDetails.disabilityDescription,
//                               personalDetails.workplaceAssistance,
//                             ]
//                               .filter(Boolean)
//                               .join(", ")}
//                           </>
//                         ) : (
//                           personalDetails.differentlyAbled
//                         )
//                       ) : (
//                         <span
//                           className="cursor-pointer font-semibold text-blue-600"
//                           onClick={() => openModalRH("differentlyAbled")}
//                         >
//                           Add Differently Abled Status
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="my-8" />

//                 {/* Languages Section Display */}
//                 <div className="mb-4 flex items-center justify-between">
//                   <h5 className="text-lg font-bold">Languages</h5>
//                   <Button
//                     onClick={() => openModalRH("languages", null)}
//                   > <Plus className="h-4 w-4" />
//                     Add  Languages
                   
//                   </Button>
//                 </div>

//                 {personalDetails.languages &&
//                   personalDetails.languages.length > 0 && (
//                     <div className="overflow-x-auto rounded-lg border border-gray-200">
//                       <table className="min-w-full divide-y divide-gray-200 text-sm">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/3">Language</th>
//                             <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/4">Proficiency</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Read</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Write</th>
//                             <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Speak</th>
//                             <th className="px-6 py-3 text-right font-semibold text-gray-700 w-16">Action</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {personalDetails.languages.map((lang, index) => {
//                             const matchingDetailsObj =
//                               personalDetails.languagesDetails?.[index];
//                             const correctHexId = matchingDetailsObj
//                               ? matchingDetailsObj._id
//                               : null;

//                             return (
//                               <tr key={index} className="hover:bg-gray-50/70 transition-colors">
//                                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
//                                   {lang.language_name || lang.language}
//                                 </td>
//                                 <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
//                                   {lang.proficiency_name || lang.proficiency}
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex justify-center">
//                                     {lang.read ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex justify-center">
//                                     {lang.write ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-4 py-4 whitespace-nowrap">
//                                   <div className="flex justify-center">
//                                     {lang.speak ? (
//                                       <CircleCheck color="#00A85A" size={18} />
//                                     ) : (
//                                       <CircleX color="#FF0000" size={18} />
//                                     )}
//                                   </div>
//                                 </td>
//                                 <td className="px-6 py-4 text-right whitespace-nowrap">
//                                   <Button
//                                     variant="ghost"
//                                     size="icon"
//                                     onClick={() => openModalRH("languages", correctHexId)}
//                                     className="h-8 w-8 hover:bg-gray-100"
//                                   >
//                                     <Pencil className="h-4 w-4 text-blue-600" />
//                                   </Button>
//                                 </td>
//                               </tr>
//                             );
//                           })}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//               </div>
//             </>
//           )}
//         </CardContent>
      

//       {modalType && (
//         <FormModal
//           show={!!modalType}
//           onClose={closeModalRH}
//           focusSection={focusSection}
//           targetLanguageId={targetLanguageId}
//           reload={reload}
//           setReload={setReload}
//           setError={setError}
//           setSuccess={setSuccess}
//           error={error}
//         />
//       )}
//     </>
//   );
// };

// export default PersonalSection;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, CircleX, CircleCheck, Plus } from "lucide-react";
import API from "../../../lib/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormModal from "./PersonalModal";

const PersonalSection = () => {
  const [modalType, setModalType] = useState(null);
  const [focusSection, setFocusSection] = useState(null);
  const [targetLanguageId, setTargetLanguageId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [personalDetails, setPersonalDetails] = useState({
    gender: "",
    maritalStatus: "",
    moreinfo: "",
    dob: "",
    category: "",
    differentlyAbled: "",
    disabilityType: "",
    disabilityDescription: "",
    workplaceAssistance: "",
    partner_name: "",
    careerBreak: "",
    careerBreakReason: "",
    careerBreakStartYear: "",
    careerBreakStartMonth: "",
    currentlyOnCareerBreak: false,
    careerBreakEndYear: "",
    careerBreakEndMonth: "",
    workPermit: "",
    address: "",
    languages: [],
    languagesDetails: [],
    usa_visa_type: "",
  });

  const [reload, setReload] = useState(false);
  const [sectionloading, setSectionloading] = useState(true);

  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        setSectionloading(true);
        const response = await API.get(
          `/api/candidate/personal/get_personal_details_with_name`,
        );
        if (response.status === 200) {
          const maindata = response.data.data;
          setPersonalDetails(maindata);
        }
      } catch (error) {
        console.error("Error fetching personal data:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchuserdata();
  }, [reload]);

  const openModalRH = (type, langId = null) => {
    setModalType(type);
    setFocusSection(type);
    setTargetLanguageId(langId);
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setModalType(null);
    setFocusSection(null);
    setTargetLanguageId(null);
    document.body.style.overflow = "auto";
  };

  const getFormattedDOB = (dob) => {
    if (!dob) return "";
    const date = new Date(dob);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    return date.toLocaleDateString("en-GB", options);
  };

  // Helper check to see if the user has filled out any personal data
  const hasPersonalData = !!(
    personalDetails.gender ||
    personalDetails.maritalStatus ||
    personalDetails.dob ||
    personalDetails.address ||
    personalDetails.category
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Personal Details</CardTitle>
            <CardDescription></CardDescription>
          </div>
          
          {/* DYNAMIC BUTTON: Changes based on data availability */}
          {hasPersonalData ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openModalRH("editPersonal")}
              title="Edit Personal Details"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => openModalRH("editPersonal")}
            >
              Add Info
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {sectionloading ? (
            "loading............"
          ) : (
            <>
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal */}
                  <div>
                    <strong>Personal</strong>
                    <div className="mt-2">
                      <div>
                        {[
                          personalDetails.gender,
                          personalDetails.maritalStatus,
                          personalDetails.moreinfo,
                        ]
                          .filter(Boolean)
                          .join(", ") || <span className="text-gray-400 text-xs italic"></span>}

                        {![
                          personalDetails.gender,
                          personalDetails.maritalStatus,
                          personalDetails.moreinfo,
                        ].every(Boolean) && (
                          <span
                            className="ml-2 cursor-pointer font-semibold text-blue-600"
                            onClick={() => openModalRH("personalInfo")}
                          >
                            Add more info
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partner Name */}
                  {personalDetails.partner_name && (
                    <div>
                      <strong>Partner Name</strong>
                      <div
                        className="mt-2 truncate"
                        title={personalDetails.partner_name || ""}
                      >
                        {personalDetails.partner_name || "N/A"}
                      </div>
                    </div>
                  )}

                  {/* Career Break */}
                  <div>
                    <strong>Career Break</strong>
                    <div className="mt-2">
                      {personalDetails.careerBreak ? (
                        personalDetails.careerBreak.toLowerCase() === "yes" ? (
                          <div>
                            <div>
                              Yes
                              {personalDetails.careerBreakReason && (
                                <> – {personalDetails.careerBreakReason}</>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-3 mt-1">
                              <div>
                                <strong>From:</strong>{" "}
                                {personalDetails.careerBreakStartMonth}{" "}
                                {personalDetails.careerBreakStartYear}
                              </div>
                              <div>
                                <strong>To:</strong>{" "}
                                {personalDetails.currentlyOnCareerBreak
                                  ? "Present"
                                  : `${personalDetails.careerBreakEndMonth} ${personalDetails.careerBreakEndYear}`}
                              </div>
                            </div>
                          </div>
                        ) : (
                          personalDetails.careerBreak
                        )
                      ) : (
                        <span
                          className="cursor-pointer font-semibold text-blue-600"
                          onClick={() => openModalRH("careerBreak")}
                        >
                          Add Career Break
                        </span>
                      )}
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <strong>Date of Birth</strong>
                    <div className="mt-2">
                      {getFormattedDOB(personalDetails.dob) || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600"
                          onClick={() => openModalRH("dob")}
                        >
                          Add Date of Birth
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <strong>Category</strong>
                    <div className="mt-2">
                      {personalDetails.category || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600"
                          onClick={() => openModalRH("category")}
                        >
                          Add Category
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Work Permit */}
                  <div>
                    <strong>Work Permit</strong>
                    <div className="mt-2 space-y-1">
                      {personalDetails.usa_visa_type && (
                        <div>{personalDetails.usa_visa_type}</div>
                      )}
                      {personalDetails.workPermit && (
                        <div>{personalDetails.workPermit}</div>
                      )}
                      {!personalDetails.usa_visa_type &&
                        !personalDetails.workPermit && (
                          <div
                            className="cursor-pointer font-semibold text-blue-600"
                            onClick={() => openModalRH("workPermit")}
                          >
                            Add Work Permit
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <strong>Hometown & Permanent address </strong>
                    <div className="mt-2">
                      {personalDetails.address || (
                        <span
                          className="cursor-pointer font-semibold text-blue-600"
                          onClick={() => openModalRH("address")}
                        >
                          Add Address
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Differently Abled */}
                  <div>
                    <strong>Differently Abled</strong>
                    <div className="mt-2">
                      {personalDetails.differentlyAbled ? (
                        personalDetails.differentlyAbled.toLowerCase() ===
                        "yes" ? (
                          <>
                            {[
                              personalDetails.differentlyAbled,
                              personalDetails.disabilityType,
                              personalDetails.disabilityDescription,
                              personalDetails.workplaceAssistance,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </>
                        ) : (
                          personalDetails.differentlyAbled
                        )
                      ) : (
                        <span
                          className="cursor-pointer font-semibold text-blue-600"
                          onClick={() => openModalRH("differentlyAbled")}
                        >
                          Add Differently Abled Status
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="my-8" />

                {/* Languages Section Display */}
                <div className="mb-4 flex items-center justify-between">
                  <h5 className="text-lg font-bold">Languages</h5>
                  <Button
                    
                    size="sm"
                    
                    onClick={() => openModalRH("languages", null)}
                  >
                    <Plus className="h-4 w-4" />
                    Add Languages
                  </Button>
                </div>

                {personalDetails.languages &&
                personalDetails.languages.length > 0 ? (
                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/3">Language</th>
                            <th className="px-6 py-3 text-left font-semibold text-gray-700 w-1/4">Proficiency</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Read</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Write</th>
                            <th className="px-4 py-3 text-center font-semibold text-gray-700 w-12">Speak</th>
                            <th className="px-6 py-3 text-right font-semibold text-gray-700 w-16">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {personalDetails.languages.map((lang, index) => {
                            const matchingDetailsObj =
                              personalDetails.languagesDetails?.[index];
                            const correctHexId = matchingDetailsObj
                              ? matchingDetailsObj._id
                              : null;

                            return (
                              <tr key={index} className="hover:bg-gray-50/70 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                  {lang.language_name || lang.language}
                                </td>
                                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                                  {lang.proficiency_name || lang.proficiency}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex justify-center">
                                    {lang.read ? (
                                      <CircleCheck color="#00A85A" size={18} />
                                    ) : (
                                      <CircleX color="#FF0000" size={18} />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex justify-center">
                                    {lang.write ? (
                                      <CircleCheck color="#00A85A" size={18} />
                                    ) : (
                                      <CircleX color="#FF0000" size={18} />
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <div className="flex justify-center">
                                    {lang.speak ? (
                                      <CircleCheck color="#00A85A" size={18} />
                                    ) : (
                                      <CircleX color="#FF0000" size={18} />
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openModalRH("languages", correctHexId)}
                                    className="h-8 w-8 hover:bg-gray-100"
                                  >
                                    <Pencil className="h-4 w-4 text-blue-600" />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600">
                      No languages added yet. Use the button above to add your language proficiency.
                    </div>
                  )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {modalType && (
        <FormModal
          show={!!modalType}
          onClose={closeModalRH}
          focusSection={focusSection}
          targetLanguageId={targetLanguageId}
          reload={reload}
          setReload={setReload}
          setError={setError}
          setSuccess={setSuccess}
          error={error}
        />
      )}
    </>
  );
};

export default PersonalSection;