// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import API from "../../../lib/axios";
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
// import Disability from "./Disability";
// import CareerBreak from "./CareerBreak";
// const Language = ({ formData, setFormData }) => {
//   const apiurl =  import.meta.env.VITE_API_URL;
//    //list

// const [languages, setLanguages] = useState([]);

//   const [languageOptions, setLanguageOptions] = useState([]);
//   const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState(
//     []
//   );
//   const [loading, setLoading] = useState(true);
//     useEffect(() => {
//     if (Array.isArray(formData?.languages)) {
//       setLanguages(formData.languages);
//     }
//   }, [formData?.languages]);
//   useEffect(() => {
//      if (Array.isArray(formData?.languages) && formData?.languages?.length>0) {
//           setFormData((prevData) => ({ ...prevData, languages }));
//      }
//   }, [languages]);

//   useEffect(() => {
//     const fetchLanguageOptions = async () => {
//       //setLoading(true);
//       try {
//         const response = await fetch(`${apiurl}/api/sql/dropdown/language`);
//         const data = await response.json();
//         setLanguageOptions(data.data);
//       } catch (error) {
//         console.error("Error fetching language options:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     /* /api/sql/dropdown/language_proficiency */
//     const fetchLanguageproficiencyOptions = async () => {
//       //setLoading(true);
//       try {
//         const response = await fetch(
//           `${apiurl}/api/sql/dropdown/language_proficiency`
//         );
//         const data = await response.json();
//         setLanguageproficiencyOptions(data.data);
//       } catch (error) {
//         console.error("Error fetching language proficiency options:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLanguageOptions();
//     fetchLanguageproficiencyOptions();
//   }, [apiurl]);

//   const addLanguage = () => {
//     setLanguages([
//       ...languages,
//       {
//         language: "",
//         proficiency: "",
//         read: false,
//         write: false,
//         speak: false,
//       },
//     ]);
//   };

//   const deleteLanguage = (index) => {
//     const updatedLanguages = languages.filter((_, i) => i !== index);
//     setLanguages(updatedLanguages);
//   };

//   const handleChange = (index, field, value) => {
//     const proficiency = languageproficiencyOptions.find(
//       (item) => item.id === value
//     );
//     //console.log("Proficiency:", proficiency);

//     const updatedLanguages = [...languages];
//     updatedLanguages[index][field] = value;

//     if (field === "proficiency") {
//       updatedLanguages[index]["read"] = proficiency.read;
//       updatedLanguages[index]["write"] = proficiency.write;
//       updatedLanguages[index]["speak"] = proficiency.speak;
//     }

//     setLanguages(updatedLanguages);
//     if(Array.isArray(formData?.languages) && formData?.languages?.length===0){
//        setFormData((prevData) => ({ ...prevData, languages:updatedLanguages }));
//     }

//   };

//   const handleCheckboxChange = (index, field) => {
//     const updatedLanguages = [...languages];
//     updatedLanguages[index][field] = !updatedLanguages[index][field];
//     setLanguages(updatedLanguages);
//   };

//   return (
// <div>
//   <label className="block text-xl font-semibold text-gray-900">
//     Language Proficiency
//   </label>

//   <p
//     className="mt-1 text-sm text-gray-500"
//     onClick={() => {
//       console.log("Language :", languages);
//     }}
//   >
//     Strengthen your resume by letting recruiters know you can communicate in
//     multiple languages
//   </p>

//   {languages.map((lang, index) => (
//     <div
//       key={index}
//       className="mb-5 border-b border-gray-200 pb-4"
//     >
//       {/* Language & Proficiency */}
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
//         <div>
//           <label className="block text-sm font-semibold mb-2">
//             Language <span className="text-red-500">*</span>
//           </label>

//           <select
//             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//             value={lang.language}
//             onChange={(e) =>
//               handleChange(index, "language", e.target.value)
//             }
//           >
//             <option value="">Select language</option>
//             {languageOptions.map((option) => (
//               <option key={option.id} value={option.id}>
//                 {option.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-semibold mb-2">
//             Proficiency <span className="text-red-500">*</span>
//           </label>

//           <select
//             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//             value={lang.proficiency}
//             onChange={(e) =>
//               handleChange(index, "proficiency", e.target.value)
//             }
//           >
//             <option value="">Select proficiency</option>
//             {languageproficiencyOptions.map((option) => (
//               <option key={option.id} value={option.id}>
//                 {option.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Read / Write / Speak */}
//       <div className="flex flex-wrap items-center gap-4">
//         <label className="flex items-center gap-2 text-sm text-gray-700">
//           <input
//             type="checkbox"
//             checked={lang.read}
//             onChange={() => handleCheckboxChange(index, "read")}
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           Read
//         </label>

//         <label className="flex items-center gap-2 text-sm text-gray-700">
//           <input
//             type="checkbox"
//             checked={lang.write}
//             onChange={() => handleCheckboxChange(index, "write")}
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           Write
//         </label>

//         <label className="flex items-center gap-2 text-sm text-gray-700">
//           <input
//             type="checkbox"
//             checked={lang.speak}
//             onChange={() => handleCheckboxChange(index, "speak")}
//             className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//           />
//           Speak
//         </label>

//         <button
//           type="button"
//           onClick={() => deleteLanguage(index)}
//           className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-800"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   ))}

//   <button
//     type="button"
//     onClick={addLanguage}
//     className="text-sm font-medium text-blue-600 hover:text-blue-800"
//   >
//     + Add language
//   </button>
// </div>
//   );
// };

// export default Language;

import { Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";

const LanguageProficiency = ({ formData, setFormData, targetLanguageId, onClose }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  
  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch dropdown configurations from API
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [langRes, profRes] = await Promise.all([
          fetch(`${apiurl}/api/sql/dropdown/language`),
          fetch(`${apiurl}/api/sql/dropdown/language_proficiency`),
        ]);
        const langData = await langRes.json();
        const profData = await profRes.json();

        setLanguageOptions(langData.data || []);
        setLanguageproficiencyOptions(profData.data || []);
      } catch (error) {
        console.error("Error fetching language options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [apiurl]);

  const masterDetails = Array.isArray(formData?.languagesDetails) ? formData.languagesDetails : [];
  const masterTextList = Array.isArray(formData?.languages) ? formData.languages : [];

  // 2. Locate the index alignment safely via unique _id string match logic
  let targetIndex = -1;
  if (targetLanguageId !== undefined && targetLanguageId !== null && targetLanguageId !== "") {
    const targetStr = String(targetLanguageId).trim().toLowerCase();
    targetIndex = masterDetails.findIndex((l) => String(l._id || "").trim().toLowerCase() === targetStr);
  } else {
    // ADD NEW MODE: Target index defaults to the pristine empty row structure position
    targetIndex = masterDetails.length - 1;
  }

  // 3. Populate display rows safely
  let displayRows = [];
  if (targetIndex !== -1 && masterDetails[targetIndex]) {
    displayRows = [{ ...masterDetails[targetIndex], _absoluteIndex: targetIndex }];
  } else {
    displayRows = [{ language: "", proficiency: "", read: false, write: false, speak: false, _absoluteIndex: 0 }];
  }

  const handleChange = (index, field, value) => {
    if (index === -1) return;

    const updatedDetails = [...masterDetails];
    const updatedTextList = [...masterTextList];

    if (!updatedDetails[index]) updatedDetails[index] = { language: "", proficiency: "", read: false, write: false, speak: false };
    if (!updatedTextList[index]) updatedTextList[index] = { language: "", proficiency: "", read: false, write: false, speak: false };

    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value,
    };

    if (field === "language") {
      const selectedLangOption = languageOptions.find((o) => String(o.id).trim().toLowerCase() === String(value).trim().toLowerCase());
      updatedTextList[index]["language"] = selectedLangOption ? selectedLangOption.name : value;
      updatedTextList[index]["language_name"] = selectedLangOption ? selectedLangOption.name : value;
    }

    if (field === "proficiency") {
      const selectedProfOption = languageproficiencyOptions.find((p) => String(p.id).trim().toLowerCase() === String(value).trim().toLowerCase());
      updatedTextList[index]["proficiency"] = selectedProfOption ? selectedProfOption.name : value;
      updatedTextList[index]["proficiency_name"] = selectedProfOption ? selectedProfOption.name : value;

      if (selectedProfOption) {
        const r = !!selectedProfOption.read;
        const w = !!selectedProfOption.write;
        const s = !!selectedProfOption.speak;

        updatedDetails[index]["read"] = r;
        updatedDetails[index]["write"] = w;
        updatedDetails[index]["speak"] = s;

        updatedTextList[index]["read"] = r;
        updatedTextList[index]["write"] = w;
        updatedTextList[index]["speak"] = s;
      } else {
        updatedDetails[index]["read"] = false;
        updatedDetails[index]["write"] = false;
        updatedDetails[index]["speak"] = false;

        updatedTextList[index]["read"] = false;
        updatedTextList[index]["write"] = false;
        updatedTextList[index]["speak"] = false;
      }
    }

    setFormData((prev) => ({ 
      ...prev, 
      languagesDetails: updatedDetails,
      languages: updatedTextList 
    }));
  };

  // FIXED: Modeled precisely after your standard deleteLanguage method logic signature loop
  const deleteLanguage = (index) => {
    if (index === -1) return;
    
    // Filters items out completely from both layout tracking arrays arrays
    const updatedDetails = masterDetails.filter((_, i) => i !== index);
    const updatedTextList = masterTextList.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      languagesDetails: updatedDetails,
      languages: updatedTextList
    }));

    // Instantly close modal context loop frame so it can be updated on save execution automatically
    if (onClose) {
      onClose();
    }
  };

  if (loading || languageOptions.length === 0 || languageproficiencyOptions.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-12 text-center flex flex-col items-center justify-center space-y-2">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Loading configurations...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xl font-semibold text-gray-900">
          {targetLanguageId ? "Modify Language Details" : "Language Proficiency"}
        </label>
        
        {/* Render Delete button option only during editing sequence validation operations */}
        {targetLanguageId && targetIndex !== -1 && (
          <button
            type="button"
            onClick={() => deleteLanguage(targetIndex)}
            className="text-red-500 hover:text-red-700 transition-colors pt-0.5"
          >
           <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="mt-1 text-sm text-gray-500 mb-4">
        Strengthen your profile by letting recruiters know you can communicate in multiple languages.
      </p>

      {displayRows.map((lang) => {
        const index = lang._absoluteIndex;

        const matchedLanguage = languageOptions.find(
          (o) => String(o.id).trim().toLowerCase() === String(lang.language || "").trim().toLowerCase() ||
                 String(o.name).trim().toLowerCase() === String(lang.language || "").trim().toLowerCase()
        );
        const languageValue = matchedLanguage ? String(matchedLanguage.id) : "";

        const matchedProficiency = languageproficiencyOptions.find(
          (p) => String(p.id).trim().toLowerCase() === String(lang.proficiency || "").trim().toLowerCase() ||
                 String(p.name).trim().toLowerCase() === String(lang.proficiency || "").trim().toLowerCase()
        );
        const proficiencyValue = matchedProficiency ? String(matchedProficiency.id) : "";

        return (
          <div key={index} className="mb-5 border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
              {/* Language Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">Language *</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={languageValue}
                  onChange={(e) => handleChange(index, "language", e.target.value)}
                >
                  <option value="">Select language</option>
                  {languageOptions.map((option) => (
                    <option key={option.id} value={String(option.id)}>{option.name}</option>
                  ))}
                </select>
              </div>

              {/* Proficiency Dropdown */}
              <div>
                <label className="block text-sm font-semibold mb-2">Proficiency *</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={proficiencyValue}
                  onChange={(e) => handleChange(index, "proficiency", e.target.value)}
                >
                  <option value="">Select proficiency</option>
                  {languageproficiencyOptions.map((option) => (
                    <option key={option.id} value={String(option.id)}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {["read", "write", "speak"].map((field) => (
                <label 
                  key={field} 
                  className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default select-none pointer-events-none"
                >
                  <input
                    type="checkbox"
                    checked={!!lang[field]}
                    readOnly
                    className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-0 shadow-sm accent-indigo-600 cursor-default"
                  />
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LanguageProficiency;