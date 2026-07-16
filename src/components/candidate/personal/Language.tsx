// import { Trash2 } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import API from "@/lib/axios";
// import { useToast } from "@/hooks/use-toast";
// const LanguageProficiency = ({
//   formData,
//   setFormData,
//   targetLanguageId,
//   onClose,
//   setReload
// }) => {
//   const apiurl = import.meta.env.VITE_API_URL;
//   const { toast } = useToast();
//   const [languageOptions, setLanguageOptions] = useState([]);
//   const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState(
//     [],
//   );
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         setLoading(true);

//         const langRes = await API.get(`/api/sql/dropdown/language`);
//         setLanguageOptions(langRes.data.data || []);

//         const profRes = await API.get(`/api/sql/dropdown/language_proficiency`);
//         setLanguageproficiencyOptions(profRes.data.data || []);
//       } catch (error) {
//         console.error("Error fetching language options:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOptions();
//   }, [apiurl]);

//   const deleteLanguage = async (index) => {
//     const languageId = masterDetails[index]?._id;

//     if (!languageId) {
//       toast({
//         title: "Error",
//         description: "No language ID found to delete.",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const delte = await API.delete(
//         `/api/candidate/personal/language/${languageId}`,
//       );

//       console.log("dlllll", delte);

//       toast({
//         title: "Success",
//         description: "Language deleted successfully.",
//       });
//       onClose();
//       setReload(p=>p+1)
//     } catch (error) {
//       console.error("Error deleting language:", error);
//       toast({
//         title: "Deletion Failed",
//         description:
//           "There was a problem deleting the language. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };
//   const masterDetails = Array.isArray(formData?.languagesDetails)
//     ? formData.languagesDetails
//     : [];
//   const masterTextList = Array.isArray(formData?.languages)
//     ? formData.languages
//     : [];

//   let targetIndex = -1;
//   if (
//     targetLanguageId !== undefined &&
//     targetLanguageId !== null &&
//     targetLanguageId !== ""
//   ) {
//     const targetStr = String(targetLanguageId).trim().toLowerCase();
//     targetIndex = masterDetails.findIndex(
//       (l) =>
//         String(l._id || "")
//           .trim()
//           .toLowerCase() === targetStr,
//     );
//   } else {
//     targetIndex = masterDetails.length - 1;
//   }

//   let displayRows = [];
//   if (targetIndex !== -1 && masterDetails[targetIndex]) {
//     displayRows = [
//       { ...masterDetails[targetIndex], _absoluteIndex: targetIndex },
//     ];
//   } else {
//     displayRows = [
//       {
//         language: "",
//         proficiency: "",
//         read: false,
//         write: false,
//         speak: false,
//         _absoluteIndex: 0,
//       },
//     ];
//   }

//   const handleChange = (index, field, value) => {
//     if (index === -1) return;

//     const updatedDetails = [...masterDetails];
//     const updatedTextList = [...masterTextList];

//     if (!updatedDetails[index])
//       updatedDetails[index] = {
//         language: "",
//         proficiency: "",
//         read: false,
//         write: false,
//         speak: false,
//       };
//     if (!updatedTextList[index])
//       updatedTextList[index] = {
//         language: "",
//         proficiency: "",
//         read: false,
//         write: false,
//         speak: false,
//       };

//     updatedDetails[index] = {
//       ...updatedDetails[index],
//       [field]: value,
//     };

//     if (field === "language") {
//       const selectedLangOption = languageOptions.find(
//         (o) =>
//           String(o.id).trim().toLowerCase() ===
//           String(value).trim().toLowerCase(),
//       );
//       updatedTextList[index]["language"] = selectedLangOption
//         ? selectedLangOption.name
//         : value;
//       updatedTextList[index]["language_name"] = selectedLangOption
//         ? selectedLangOption.name
//         : value;
//     }

//     if (field === "proficiency") {
//       const selectedProfOption = languageproficiencyOptions.find(
//         (p) =>
//           String(p.id).trim().toLowerCase() ===
//           String(value).trim().toLowerCase(),
//       );
//       updatedTextList[index]["proficiency"] = selectedProfOption
//         ? selectedProfOption.name
//         : value;
//       updatedTextList[index]["proficiency_name"] = selectedProfOption
//         ? selectedProfOption.name
//         : value;

//       if (selectedProfOption) {
//         const r = !!selectedProfOption.read;
//         const w = !!selectedProfOption.write;
//         const s = !!selectedProfOption.speak;

//         updatedDetails[index]["read"] = r;
//         updatedDetails[index]["write"] = w;
//         updatedDetails[index]["speak"] = s;

//         updatedTextList[index]["read"] = r;
//         updatedTextList[index]["write"] = w;
//         updatedTextList[index]["speak"] = s;
//       } else {
//         updatedDetails[index]["read"] = false;
//         updatedDetails[index]["write"] = false;
//         updatedDetails[index]["speak"] = false;

//         updatedTextList[index]["read"] = false;
//         updatedTextList[index]["write"] = false;
//         updatedTextList[index]["speak"] = false;
//       }
//     }

//     setFormData((prev) => ({
//       ...prev,
//       languagesDetails: updatedDetails,
//       languages: updatedTextList,
//     }));
//   };

//   if (
//     loading ||
//     languageOptions.length === 0 ||
//     languageproficiencyOptions.length === 0
//   ) {
//     return (
//       <div className="text-sm text-gray-500 py-12 text-center flex flex-col items-center justify-center space-y-2">
//         <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
//         <span>Loading configurations...</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-2">
//         <label className="block text-xl font-semibold text-gray-900">
//           {targetLanguageId
//             ? "Modify Language Details"
//             : "Language Proficiency"}
//         </label>

//         {targetLanguageId && targetIndex !== -1 && (
//           <button
//             type="button"
//             onClick={() => deleteLanguage(targetIndex)}
//             className="text-red-500 hover:text-red-700 transition-colors pt-0.5"
//           >
//             <Trash2 className="w-4 h-4" />
//           </button>
//         )}
//       </div>

//       <p className="mt-1 text-sm text-gray-500 mb-4">
//         Strengthen your profile by letting recruiters know you can communicate
//         in multiple languages.
//       </p>

//       {displayRows.map((lang) => {
//         const index = lang._absoluteIndex;

//         const matchedLanguage = languageOptions.find(
//           (o) =>
//             String(o.id).trim().toLowerCase() ===
//               String(lang.language || "")
//                 .trim()
//                 .toLowerCase() ||
//             String(o.name).trim().toLowerCase() ===
//               String(lang.language || "")
//                 .trim()
//                 .toLowerCase(),
//         );
//         const languageValue = matchedLanguage ? String(matchedLanguage.id) : "";

//         const matchedProficiency = languageproficiencyOptions.find(
//           (p) =>
//             String(p.id).trim().toLowerCase() ===
//               String(lang.proficiency || "")
//                 .trim()
//                 .toLowerCase() ||
//             String(p.name).trim().toLowerCase() ===
//               String(lang.proficiency || "")
//                 .trim()
//                 .toLowerCase(),
//         );
//         const proficiencyValue = matchedProficiency
//           ? String(matchedProficiency.id)
//           : "";

//         return (
//           <div
//             key={index}
//             className="mb-5 border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl shadow-sm"
//           >
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Language *
//                 </label>
//                 <select
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//                   value={languageValue}
//                   onChange={(e) =>
//                     handleChange(index, "language", e.target.value)
//                   }
//                 >
//                   <option value="">Select language</option>
//                   {languageOptions.map((option) => (
//                     <option key={option.id} value={String(option.id)}>
//                       {option.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold mb-2">
//                   Proficiency *
//                 </label>
//                 <select
//                   className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
//                   value={proficiencyValue}
//                   onChange={(e) =>
//                     handleChange(index, "proficiency", e.target.value)
//                   }
//                 >
//                   <option value="">Select proficiency</option>
//                   {languageproficiencyOptions.map((option) => (
//                     <option key={option.id} value={String(option.id)}>
//                       {option.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-4 mt-2">
//               {["read", "write", "speak"].map((field) => (
//                 <label
//                   key={field}
//                   className="flex items-center gap-2 text-sm text-gray-700 font-medium cursor-default select-none pointer-events-none"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={!!lang[field]}
//                     readOnly
//                     className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-0 shadow-sm accent-indigo-600 cursor-default"
//                   />
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </label>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default LanguageProficiency;


import { Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import API from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

const LanguageProficiency = ({
  formData,
  setFormData,
  targetLanguageId,
  onClose,
  setReload
}) => {
  const apiurl = import.meta.env.VITE_API_URL;
  const { toast } = useToast();
  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageproficiencyOptions, setLanguageproficiencyOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const langRes = await API.get(`/api/sql/dropdown/language`);
        setLanguageOptions(langRes.data.data || []);

        const profRes = await API.get(`/api/sql/dropdown/language_proficiency`);
        setLanguageproficiencyOptions(profRes.data.data || []);
      } catch (error) {
        console.error("Error fetching language options:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [apiurl]);

  const deleteLanguage = async (index) => {
    const languageId = masterDetails[index]?._id;

    if (!languageId) {
      toast({
        title: "Error",
        description: "No language ID found to delete.",
        variant: "destructive",
      });
      return;
    }

    try {
      await API.delete(`/api/candidate/personal/language/${languageId}`);
      toast({
        title: "Success",
        description: "Language deleted successfully.",
      });
      onClose();
      setReload(p => p + 1);
    } catch (error) {
      console.error("Error deleting language:", error);
      toast({
        title: "Deletion Failed",
        description: "There was a problem deleting the language. Please try again.",
        variant: "destructive",
      });
    }
  };

  const masterDetails = Array.isArray(formData?.languagesDetails) ? formData.languagesDetails : [];
  const masterTextList = Array.isArray(formData?.languages) ? formData.languages : [];

  let targetIndex = -1;
  if (targetLanguageId !== undefined && targetLanguageId !== null && targetLanguageId !== "") {
    const targetStr = String(targetLanguageId).trim().toLowerCase();
    targetIndex = masterDetails.findIndex(
      (l) => String(l._id || "").trim().toLowerCase() === targetStr,
    );
  } else {
    targetIndex = masterDetails.length - 1;
  }

  let displayRows = [];
  if (targetIndex !== -1 && masterDetails[targetIndex]) {
    displayRows = [{ ...masterDetails[targetIndex], _absoluteIndex: targetIndex }];
  } else {
    displayRows = [
      {
        language: "",
        proficiency: "",
        read: false,
        write: false,
        speak: false,
        _absoluteIndex: 0,
      },
    ];
  }

  const handleChange = (index, field, value) => {
    if (index === -1) return;

    const updatedDetails = [...masterDetails];
    const updatedTextList = [...masterTextList];

    if (!updatedDetails[index]) {
      updatedDetails[index] = { language: "", proficiency: "", read: false, write: false, speak: false };
    }
    if (!updatedTextList[index]) {
      updatedTextList[index] = { language: "", proficiency: "", read: false, write: false, speak: false };
    }

    updatedDetails[index] = {
      ...updatedDetails[index],
      [field]: value, // Saves Hex ID into details
    };

    if (field === "language") {
      const selectedLangOption = languageOptions.find(
        (o) => String(o.id).trim().toLowerCase() === String(value).trim().toLowerCase()
      );
      // Keep string name mapping for interface display logic safety sync loops
      updatedTextList[index]["language"] = value; 
      updatedTextList[index]["language_name"] = selectedLangOption ? selectedLangOption.name : value;
    }

    if (field === "proficiency") {
      const selectedProfOption = languageproficiencyOptions.find(
        (p) => String(p.id).trim().toLowerCase() === String(value).trim().toLowerCase()
      );
      updatedTextList[index]["proficiency"] = value;
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
      languages: updatedTextList,
    }));
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
          (o) =>
            String(o.id).trim().toLowerCase() === String(lang.language || "").trim().toLowerCase() ||
            String(o.name).trim().toLowerCase() === String(lang.language || "").trim().toLowerCase(),
        );
        const languageValue = matchedLanguage ? String(matchedLanguage.id) : "";

        const matchedProficiency = languageproficiencyOptions.find(
          (p) =>
            String(p.id).trim().toLowerCase() === String(lang.proficiency || "").trim().toLowerCase() ||
            String(p.name).trim().toLowerCase() === String(lang.proficiency || "").trim().toLowerCase(),
        );
        const proficiencyValue = matchedProficiency ? String(matchedProficiency.id) : "";

        return (
          <div key={index} className="mb-5 border border-indigo-100 bg-indigo-50/20 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Language *</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={languageValue}
                  onChange={(e) => handleChange(index, "language", e.target.value)}
                >
                  <option value="">Select language</option>
                  {languageOptions.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Proficiency *</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  value={proficiencyValue}
                  onChange={(e) => handleChange(index, "proficiency", e.target.value)}
                >
                  <option value="">Select proficiency</option>
                  {languageproficiencyOptions.map((option) => (
                    <option key={option.id} value={String(option.id)}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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