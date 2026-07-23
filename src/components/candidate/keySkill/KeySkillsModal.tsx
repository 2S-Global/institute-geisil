
import React, { useEffect, useRef, useState } from "react";
import API from "@/lib/axios";
import { useDebounce } from "@/hooks/use-debounce";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  show: boolean;
  onClose: () => void;
  selectedSkills: string[];
  refetchKeySkills: () => Promise<void>;
  
}

// Helper function to format strings to "Title Case"
const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/) // Split by any number of spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "); // Join words back with a single space
};

const KeySkillsModal = ({
  show,
  onClose,
  selectedSkills,
  refetchKeySkills,
  setRefresh,
}: Props) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Formats selectedSkills array to Title Case immediately when modal loads
  useEffect(() => {
    if (selectedSkills) {
      setSkills(selectedSkills.map(toTitleCase));
    }
  }, [selectedSkills]);

  const debouncedSkill = useDebounce(newSkill, 300);

  // SEARCH API
  useEffect(() => {
    const fetchSuggestions = async () => {
      const value = debouncedSkill.trim();

      if (!value) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await API.get(
          `/api/sql/dropdown/matching_Skill?skill_name=${value}`
        );

        const rawData = response.data.data || [];

        // Formats dropdown suggestions to match Title Case layout
        const formattedSuggestions = rawData.map((item: string) =>
          toTitleCase(item)
        );

        setSuggestions(formattedSuggestions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuggestions();
  }, [debouncedSkill]);

  const addSkill = (rawSkill: string) => {
    const formattedSkill = toTitleCase(rawSkill);

    if (!formattedSkill) return;

    // Checks clean duplicates comparison
    if (skills.includes(formattedSkill)) {
      setNewSkill("");
      setSuggestions([]);
      return;
    }

    setSkills((prev) => [...prev, formattedSkill]);
    setNewSkill("");
    setSuggestions([]); // Removed the broken 'if()' here
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (skills.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please specify at least one Key Skill.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await API.post("/api/useraction/keyskills", { skills });

      if (response.status === 200 || response.status === 201) {
        await refetchKeySkills();

        // 1. CLOSE MODAL FIRST
        onClose();
        if (setRefresh) {
          setRefresh((prev) => prev + 1);
        }
        toast({
          title: "Success",
          description: "Key Skills updated successfully.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Error updating skills.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Key Skills</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          Add skills that define your expertise (Minimum 1).
        </p>

        {/* Selected Skills - rendered in Title Case */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill) => (
            <Badge key={skill} variant="outline" className="px-3 py-2 text-sm">
              {skill}
              <button className="ml-2" onClick={() => removeSkill(skill)}>
                <X className="h-3 w-3 text-red-500" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Input field + popup elements */}
        <div className="relative" ref={dropdownRef}>
          <Input
            placeholder="Enter or search a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newSkill.trim()) {
                  addSkill(newSkill);
                }
              }
            }}
          />

          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-50 max-h-60 overflow-y-auto rounded-md border bg-white shadow-lg">
              {suggestions.map((skill) => (
                <div
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 text-sm text-slate-700"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeySkillsModal;