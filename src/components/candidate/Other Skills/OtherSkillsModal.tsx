import React, { useEffect, useState, useRef } from "react";
import { X, Loader2, Trash2, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios"; 
import { useToast } from "@/hooks/use-toast";

const OtherSkillsModal = ({ isOpen, onClose, editData = null, onSuccess }) => {
  const { toast } = useToast();

  // Form States
  const [skillSearch, setSkillSearch] = useState("");
  const [experienceYear, setExperienceYear] = useState("");
  const [experienceMonth, setExperienceMonth] = useState("");
  
  // Frontend Storage States for Dropdown Filtering
  const [allSkills, setAllSkills] = useState([]);          
  const [filteredOptions, setFilteredOptions] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);     

  const dropdownRef = useRef(null);

  // Safely check if we are truly in Edit Mode based on an existing _id
  const isEditMode = !!(editData && editData._id);

  // Helper to extract text cleanly whether items are string elements or objects
  const getSkillName = (skill) => {
    if (!skill) return "";
    if (typeof skill === "object") {
      return skill.name || skill.skillSearch || skill.skill_name || Object.values(skill)[0] || "";
    }
    return String(skill);
  };

  // 1. Setup / Reset form field states accurately on Open/Close
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setSkillSearch(editData.skillSearch || "");
        setExperienceYear(editData.experienceyear !== undefined ? String(editData.experienceyear) : "");
        setExperienceMonth(editData.experiencemonth !== undefined ? String(editData.experiencemonth) : "");
      } else {
        // Force completely blank values on Add Mode
        setSkillSearch("");
        setExperienceYear("");
        setExperienceMonth("");
      }
      setShowDropdown(false);
    }
  }, [isOpen, editData, isEditMode]);

  // 2. Fetch everything ONCE on focus/click and store inside frontend state
  const handleFieldClickOrFocus = async () => {
    setShowDropdown(true);
    if (hasFetched) {
      setFilteredOptions(allSkills);
      return;
    }

    try {
      setLoadingDropdown(true);
      const response = await api.get("/api/sql/dropdown/get_non_tech_skills");
      
      const dataArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data && Array.isArray(response.data.data)) 
          ? response.data.data 
          : [];

      setAllSkills(dataArray);       
      setFilteredOptions(dataArray); 
      setHasFetched(true);           
    } catch (error) {
      console.error("Error fetching matching skills:", error);
    } finally {
      setLoadingDropdown(false);
    }
  };

  // 3. Dynamic client-side input string filter mapping
  useEffect(() => {
    if (!skillSearch.trim()) {
      setFilteredOptions(allSkills);
      return;
    }

    const filtered = allSkills.filter((skill) => {
      const name = getSkillName(skill);
      return name.toLowerCase().includes(skillSearch.toLowerCase());
    });
    setFilteredOptions(filtered);
  }, [skillSearch, allSkills]);

  // Close dropdown overlay when clicking outside component element boxes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Form Submission Routing (Add vs Edit Payload)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillSearch.trim()) {
      toast({
        variant: "destructive",
        title: "Required Field",
        description: "Skill Name is required.",
      });
      return;
    }

    const payload = {
      skillSearch,
      version: editData?.version || "",
      lastUsed: editData?.lastUsed || "",
      experienceyear: experienceYear,
      experiencemonth: experienceMonth,
    };

    try {
      if (isEditMode) {
        await api.put("/api/candidate/itskill/editotherskill", {
          _id: editData._id,
          ...payload,
        });
        toast({ title: "Success", description: "Skill updated successfully!" });
      } else {
        await api.post("/api/candidate/itskill/addotherskill", payload);
        toast({ title: "Success", description: "Skill added successfully!" });
      }
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  // Delete Action Request Handler 
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.post("api/candidate/itskill/deleteotherskill", {
         _id:  editData._id 
      });
      
      toast({ title: "Deleted", description: "Skill deleted successfully!" });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to delete skill.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 rounded-xl overflow-hidden bg-white gap-0 border-none font-sans [&>button]:hidden">
        
        {/* Modal Top Header Layout */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <DialogTitle className="text-xl font-bold text-gray-800">Other skills</DialogTitle>
          
          {/* Action Action Buttons: Top Right Corner Group */}
          <div className="flex items-center space-x-2">
            {isEditMode && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                title="Delete Skill"
              >
                <Trash2 className="w-[18px] h-[18px] stroke-[2.2]" />
              </button>
            )}
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          
          <div className="flex items-start justify-between bg-white mt-1 mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Mention skills like communication, teamwork, problem-solving, leadership, and other personal strengths to highlight your overall abilities.
            </p>
          </div>

          {/* Skill Input with Frontend Filter Dropdown Box */}
          <div className="mb-4 relative" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Skill Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => {
                setSkillSearch(e.target.value);
                setShowDropdown(true);
              }}
              onClick={handleFieldClickOrFocus}
              onFocus={handleFieldClickOrFocus}
              className="w-full px-4 py-3 bg-[#f4f7f9] text-gray-800 rounded-xl border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all placeholder-gray-400"
            />
            
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50">
                {loadingDropdown ? (
                  <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Fetching skills...
                  </div>
                ) : filteredOptions.length > 0 ? (
                  filteredOptions.map((skill, index) => {
                    const skillName = getSkillName(skill);
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          setSkillSearch(skillName);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {skillName}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500">No matching skills found</div>
                )}
              </div>
            )}
          </div>

          {/* Experience Grid Fields */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Experience
            </label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Dropdown for Years */}
              <div className="relative">
                <select
                  value={experienceYear}
                  onChange={(e) => setExperienceYear(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f4f7f9] text-gray-700 rounded-xl border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all appearance-none pr-10"
                >
                  <option value="" disabled hidden>Select Year</option>
                  <option value="0">0 Years</option>
                  {[...Array(30).keys()].map((y) => {
                    const yearNum = y + 1;
                    return (
                      <option key={yearNum} value={yearNum}>
                        {yearNum} {yearNum === 1 ? "Year" : "Years"}
                      </option>
                    );
                  })}
                  <option value="31">30+ Years</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              
              {/* Dropdown for Months */}
              <div className="relative">
                <select
                  value={experienceMonth}
                  onChange={(e) => setExperienceMonth(e.target.value)}
                  className="w-full px-4 py-3 bg-[#f4f7f9] text-gray-700 rounded-xl border border-transparent focus:border-blue-400 focus:bg-white focus:outline-none transition-all appearance-none pr-10"
                >
                  <option value="" disabled hidden>Select Month</option>
                  <option value="0">0 Months</option>
                  {[...Array(12).keys()].slice(1).map((m) => (
                    <option key={m} value={m}>{m} {m === 1 ? 'Month' : 'Months'}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>

          <hr className="border-gray-100 -mx-6 mb-4" />

          {/* Dialog Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#6c757d] hover:bg-gray-600 text-white font-medium rounded-lg border-none shadow-none h-auto transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-5 py-2.5 bg-[#007bff] hover:bg-blue-600 text-white font-medium rounded-lg border-none shadow-none h-auto transition-colors"
            >
              Update
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OtherSkillsModal;