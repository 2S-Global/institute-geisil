

// import React, { useEffect, useState } from "react";
// import { X } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// const ITSkillModal = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
//   const [formData, setFormData] = useState({
//     skillSearch: "",
//     version: "",
//     lastUsed: "",
//     experienceyear: "",
//     experiencemonth: "",
//   });

  
//   useEffect(() => {
//     if (isOpen) {
//       if (initialData) {
//         setFormData({
//           skillSearch: initialData.skillSearch || "",
//           version: initialData.version || "",
//           lastUsed: initialData.lastUsed || "",
//           experienceyear: initialData.experienceyear || "",
//           experiencemonth: initialData.experiencemonth || "",
//         });
//       } else {
//         setFormData({
//           skillSearch: "",
//           version: "",
//           lastUsed: "",
//           experienceyear: "",
//           experiencemonth: "",
//         });
//       }
//     }
//   }, [initialData, isOpen]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(formData);
//   };

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[540px] p-0 border-none rounded-xl gap-0 overflow-hidden [&>button]:hidden bg-white shadow-2xl">
        
//         {/* Header Section */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//           <DialogTitle className="text-xl font-bold text-[#2d3748]">
//             IT skills
//           </DialogTitle>
//           <Button
//             type="button" 
//             onClick={onClose} 
//             className="text-slate-50 hover:text-slate-600 transition-colors"
//           >
//             <X className="h-6 w-6 stroke-[1.5]" />
//           </Button>
//         </div>

//         <form onSubmit={handleSubmit} className="flex flex-col">
//           {/* Main Body */}
//           <div className="px-6 py-5 flex flex-col gap-5">
//             <p className="text-[14px] leading-[22px] text-[#2d3748]">
//               Mention skills like programming languages (Java, Python), software (Microsoft Word, Excel), and more to show your technical expertise.
//             </p>

//             {/* Input: Skill Name */}
//             <div className="flex flex-col gap-2">
//               <label className="text-[14px] font-semibold text-[#2d3748]">
//                 Skill / software name<span className="text-red-500 ml-0.5">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="skillSearch"
//                 value={formData.skillSearch}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Search Skill / software name"
//                 className="w-full h-[46px] px-4 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] placeholder-[#a0aec0] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
//               />
//             </div>

//             {/* Version and Last Used Split Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-2">
//                 <label className="text-[14px] font-semibold text-[#2d3748]">
//                   Software version
//                 </label>
//                 <input
//                   type="text"
//                   name="version"
//                   value={formData.version}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 1.0.0"
//                   className="w-full h-[46px] px-4 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] placeholder-[#a0aec0] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
//                 />
//               </div>

//               <div className="flex flex-col gap-2">
//                 <label className="text-[14px] font-semibold text-[#2d3748]">
//                   Last used
//                 </label>
//                 <select
//                   name="lastUsed"
//                   value={formData.lastUsed}
//                   onChange={handleInputChange}
//                   className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all appearance-none cursor-pointer py-2"
//                   style={{
//                     backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '16px'
//                   }}
//                 >
//                   <option value="" disabled className="text-[#a0aec0]">Select year</option>
//                   {years.map((yr) => (
//                     <option key={yr} value={yr}>{yr}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Experience Split Section */}
//             <div className="flex flex-col gap-2">
//               <label className="text-[14px] font-semibold text-[#2d3748]">
//                 Experience
//               </label>
//               <div className="grid grid-cols-2 gap-4">
//                 <select
//                   name="experienceyear"
//                   value={formData.experienceyear}
//                   onChange={handleInputChange}
//                   className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all appearance-none cursor-pointer py-2"
//                   style={{
//                     backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '16px'
//                   }}
//                 >
//                   <option value="" disabled className="text-[#a0aec0]">Select years</option>
//                   {Array.from({ length: 31 }, (_, i) => (
//                     <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
//                   ))}
//                 </select>

//                 <select
//                   name="experiencemonth"
//                   value={formData.experiencemonth}
//                   onChange={handleInputChange}
//                   className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all appearance-none cursor-pointer py-2"
//                   style={{
//                     backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '16px'
//                   }}
//                 >
//                   <option value="" disabled className="text-[#a0aec0]">Select Month</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i} value={i}>{i} {i === 1 ? 'month' : 'months'}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Footer CTA Actions */}
//           <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
//             <button
//               type="button"
//               onClick={onClose}
//               className="h-[38px] px-5 rounded-md text-[14px] font-medium bg-[#6c757d] hover:bg-[#5a6268] text-white transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="h-[38px] px-5 rounded-md text-[14px] font-medium bg-[#4ea2ff] hover:bg-[#3b8ee6] text-white transition-colors disabled:opacity-70"
//             >
//               {isLoading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default ITSkillModal;


import React, { useEffect, useState, useRef } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ITSkillModal = ({ isOpen, onClose, onSave, initialData, isLoading }) => {
  const [formData, setFormData] = useState({
    skillSearch: "",
    version: "",
    lastUsed: "",
    experienceyear: "",
    experiencemonth: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          skillSearch: initialData.skillSearch || "",
          version: initialData.version || "",
          lastUsed: initialData.lastUsed || "",
          experienceyear: initialData.experienceyear || "",
          experiencemonth: initialData.experiencemonth || "",
        });
      } else {
        setFormData({
          skillSearch: "",
          version: "",
          lastUsed: "",
          experienceyear: "",
          experiencemonth: "",
        });
      }
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [initialData, isOpen]);

  // Dynamic API Fetching and Robust Filtering
  useEffect(() => {
    if (!formData.skillSearch.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/sql/dropdown/get_tech_skills?query=${encodeURIComponent(formData.skillSearch)}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            const filteredData = data.filter((skill) => {
              // Robust check: matches strings, skill.name, skill.skill_name, or skill.text
              const skillName = typeof skill === 'object' 
                ? (skill.name || skill.skill_name || skill.text || Object.values(skill)[0] || "") 
                : skill;
                
              return String(skillName)
                .toLowerCase()
                .includes(formData.skillSearch.toLowerCase());
            });

            setSuggestions(filteredData);
          }
        }
      } catch (error) {
        console.error("Error fetching tech skills:", error);
      } finally {
        setIsSearching(false);
      }
    }, 150); // Snappy 150ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [formData.skillSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "skillSearch") {
      setShowDropdown(true);
    }
  };

  const handleSuggestionClick = (skill) => {
    const displayValue = typeof skill === 'object' 
      ? (skill.name || skill.skill_name || skill.text || Object.values(skill)[0]) 
      : skill;

    setFormData((prev) => ({ ...prev, skillSearch: displayValue }));
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* <DialogContent className="sm:max-w-[540px] p-0 border-none rounded-xl gap-0 overflow-visible bg-white shadow-2xl"> */}
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-[#2d3748]">
            IT skills
          </DialogTitle>
          <Button
            type="button" 
            onClick={onClose} 
           
          >
            <X className="h-6 w-6 stroke-[1.5]" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-visible">
          <div className="px-6 py-5 flex flex-col gap-5 overflow-visible">
            <p className="text-[14px] leading-[22px] text-[#2d3748]">
              Mention skills like programming languages (Java, Python), software (Microsoft Word, Excel), and more to show your technical expertise.
            </p>

            {/* Input Element Container */}
            <div className="flex flex-col gap-2 relative z-50" ref={dropdownRef}>
              <label className="text-[14px] font-semibold text-[#2d3748]">
                Skill / software name<span className="text-red-500 ml-0.5">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="skillSearch"
                  value={formData.skillSearch}
                  onChange={handleInputChange}
                  onFocus={() => setShowDropdown(true)}
                  required
                  placeholder="Search Skill / software name"
                  autoComplete="off"
                  className="w-full h-[46px] px-4 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] placeholder-[#a0aec0] text-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 transition-all"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 h-4 w-4 animate-spin text-slate-400" />
                )}
              </div>

              
              {showDropdown && formData.skillSearch.trim() !== "" && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-slate-200 rounded-lg shadow-xl max-h-[220px] overflow-y-auto z-[9999] py-1">
                  {suggestions.length > 0 ? (
                    suggestions.map((skill, index) => {
                      const displayValue = typeof skill === 'object' 
                        ? (skill.name || skill.skill_name || skill.text || Object.values(skill)[0]) 
                        : skill;
                      return (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(skill)}
                          className="w-full text-left px-4 py-2.5 text-[14px] text-[#2d3748] hover:bg-[#f4f9fd] transition-colors focus:bg-[#f4f9fd] focus:outline-none"
                        >
                          {displayValue}
                        </button>
                      );
                    })
                  ) : (
                    !isSearching && (
                      <div className="px-4 py-3 text-[14px] text-slate-400 italic bg-white">
                        No skills match your search
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Form Grids */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#2d3748]">
                  Software version
                </label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="e.g., 1.0.0"
                  className="w-full h-[46px] px-4 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] placeholder-[#a0aec0] text-[14px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-semibold text-[#2d3748]">
                  Last used
                </label>
                <select
                  name="lastUsed"
                  value={formData.lastUsed}
                  onChange={handleInputChange}
                  className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] appearance-none cursor-pointer py-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" disabled>Select year</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
              <label className="text-[14px] font-semibold text-[#2d3748]">
                Experience
              </label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="experienceyear"
                  value={formData.experienceyear}
                  onChange={handleInputChange}
                  className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] appearance-none cursor-pointer py-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" disabled>Select years</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i} value={i}>{i} {i === 1 ? 'year' : 'years'}</option>
                  ))}
                </select>

                <select
                  name="experiencemonth"
                  value={formData.experiencemonth}
                  onChange={handleInputChange}
                  className="w-full h-[46px] pl-4 pr-10 rounded-lg bg-[#f4f9fd] border-none text-[#2d3748] text-[14px] appearance-none cursor-pointer py-2"
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '16px'
                  }}
                >
                  <option value="" disabled>Select Month</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>{i} {i === 1 ? 'month' : 'months'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white relative z-10">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-5 rounded-md text-[14px] font-medium bg-[#6c757d] hover:bg-[#5a6268] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="h-[38px] px-5 rounded-md text-[14px] font-medium bg-[#4ea2ff] hover:bg-[#3b8ee6] text-white transition-colors disabled:opacity-70"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ITSkillModal;