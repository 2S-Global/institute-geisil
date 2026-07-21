
import React, { useEffect, useState, useRef } from "react";
import { X, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios"; // Uses your configured global axios instance
import { useToast } from "@/hooks/use-toast"; // Integrated Toast Hook

const ITSkillModal = ({ isOpen, onClose, initialData, apiurl, setReload }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    skillSearch: "",
    version: "",
    lastUsed: "",
    experienceyear: "",
    experiencemonth: "",
  });

  const [allSkills, setAllSkills] = useState([]); 
  const [suggestions, setSuggestions] = useState([]); 
  const [isFetchingSkills, setIsFetchingSkills] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

 
  useEffect(() => {
    const fetchAllSkills = async () => {
      if (!isOpen) return;

      setIsFetchingSkills(true);
      try {
        const response = await api.get("/api/sql/dropdown/get_tech_skills");
        const skillsList = response.data?.data || response.data?.skills || response.data;

        if (Array.isArray(skillsList)) {
          setAllSkills(skillsList);
        } else if (skillsList && typeof skillsList === 'object') {
          setAllSkills(Object.values(skillsList));
        }
      } catch (error) {
        console.error("Error fetching tech skills:", error);
      } finally {
        setIsFetchingSkills(false);
      }
    };

    fetchAllSkills();
  }, [isOpen]);

  // 2️⃣ Sync layout when modal status or initialData changes
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

  // Helper function to capture skill string safely whether it's an object or primitive string
  const getSkillText = (item) => {
    if (!item) return "";
    if (typeof item === 'object') {
      return (item.name || item.skill_name || item.text || Object.values(item)[0] || "").toString().toLowerCase();
    }
    return item.toString().toLowerCase();
  };

  // 3️⃣ Real-time multi-tier array parsing logic (Client-side tracking)
  useEffect(() => {
    const query = formData.skillSearch.toLowerCase().trim();

    if (!query) {
      setSuggestions([]);
      return;
    }

    const filtered = allSkills
      .filter((item) => getSkillText(item).includes(query))
      .sort((a, b) => {
        const aText = getSkillText(a);
        const bText = getSkillText(b);

        if (aText === query && bText !== query) return -1;
        if (bText === query && aText !== query) return 1;

        const aPrefix = aText.startsWith(query);
        const bPrefix = bText.startsWith(query);
        if (aPrefix && !bPrefix) return -1;
        if (!aPrefix && bPrefix) return 1;

        const posDiff = aText.indexOf(query) - bText.indexOf(query);
        if (posDiff !== 0) return posDiff;

        return aText.localeCompare(bText);
      });

    setSuggestions(filtered);
  }, [formData.skillSearch, allSkills]);

  // Handle external modal body clicks to cleanly blur dropboxes
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

  // 4️⃣ Integrated Add & Edit API logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let response = null;
      const payload = {
        skillSearch: formData.skillSearch,
        version: formData.version,
        lastUsed: formData.lastUsed,
        experienceyear: formData.experienceyear,
        experiencemonth: formData.experiencemonth,
      };

      if (initialData?._id) {
        response = await api.put(
          `/api/candidate/itskill/edititskill`,
          { _id: initialData._id, ...payload }
        );
      } else {
        response = await api.post(
          `/api/candidate/itskill/additskill`,
          payload
        );
      }

      if (response.data?.success || response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: response.data.message || "Your skill profile has been updated.",
          variant: "default",
        });
        if (setReload) setReload(true);
        onClose();
      }
    } catch (error) {
      console.error("Error executing save action:", error);
      toast({
        title: "Error saving details",
        description: error.response?.data?.message || "Something went wrong. Please check your network.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // 5️⃣ NEW Delete Handler directly inside the Modal Footer
  const handleDelete = async () => {
    if (!initialData?._id) return;
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    setIsDeleting(true);
    try {
      const response = await api.delete("/api/candidate/itskill/deleteitskill", {
        data: { _id: initialData._id }
      });

      if (response.data?.success || response.status === 200) {
        toast({
          title: "Deleted Successfully",
          description: response.data?.message || "The skill has been removed.",
          variant: "default",
        });
        if (setReload) setReload(true);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Delete failed",
        description: error.response?.data?.message || "Could not remove the item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[540px] p-0 border-none rounded-xl gap-0 overflow-visible bg-white shadow-2xl [&>button]:hidden">
        
        {/* Header Container */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <DialogTitle className="text-xl font-bold text-[#2d3748]">
            {initialData?._id ? "Edit IT Skill" : " IT Skill"}
          </DialogTitle>
          
          <div className="flex items-center gap-2">
           
            {initialData?._id && (
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-md transition-colors"
              >
                {isDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                
              </Button>
            )}
            
            <Button type="button" onClick={onClose} variant="ghost" >
              <X className="h-6 w-6 stroke-[1.5]" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col overflow-visible">
          <div className="px-6 py-5 flex flex-col gap-5 overflow-visible">
            <p className="text-[14px] leading-[22px] text-[#4a5568]">
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
                {isFetchingSkills && (
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
                    !isFetchingSkills && (
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

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-white relative z-10 gap-3">
            <Button type="button" onClick={onClose} variant="outline" disabled={isSaving || isDeleting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isDeleting}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ITSkillModal;