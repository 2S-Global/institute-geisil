

import React, { useEffect, useRef, useState } from "react";
import API from "@/lib/axios";

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
  setKeySkill: React.Dispatch<React.SetStateAction<string[]>>;
}

const KeySkillsModal = ({
  show,
  onClose,
  selectedSkills,
  setKeySkill,
}: Props) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSkills(selectedSkills);
  }, [selectedSkills]);

  // SEARCH API
  useEffect(() => {
    const timer = setTimeout(async () => {
      const value = newSkill.trim();

      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await API.get(
          `/api/sql/dropdown/matching_Skill?skill_name=${value}`,
        );

        const data =
          (response.data.data || []).map((item: string) =>
            item
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" "),
          ) || [];

        setSuggestions(data);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [newSkill]);

  const addSkill = (skill: string) => {
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setNewSkill("");
      setSuggestions([]);
      return;
    }

    setSkills((prev) => [...prev, skill]);
    setNewSkill("");
    setSuggestions([]);
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

      if (response.status === 201) {
        setKeySkill(skills);

        // 1. CLOSE MODAL FIRST
        onClose();
        toast({
          title: "Success",
          description: "Key Skills updated successfully.",
        });
        // 2. SHOW TOAST AFTER CLOSE (IMPORTANT FIX)
        // setTimeout(() => {

        // }, 150);
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

        {/* Selected Skills */}
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

        {/* Input + Suggestions */}
        <div className="relative" ref={dropdownRef}>
          <Input
            placeholder="Enter or search a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (newSkill.trim()) {
                  addSkill(newSkill.trim());
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
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="secondary" onClick={onClose}>
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
