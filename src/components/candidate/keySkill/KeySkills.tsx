import React, { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import API from "../../../lib/axios";
import KeySkillsModal from "./KeySkillsModal";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KeySkills = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keySkills, setKeySkills] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchKeySkills = async () => {
    try {
      setSectionLoading(true);
      const response = await API.get("/api/userdata/candidateskills");
      if (response.status === 200) {
        setKeySkills(response.data?.data || response.data || []);
      }
    } catch (err) {
      console.error("Error fetching key skills:", err);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    fetchKeySkills();
  }, []);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Key Skills</CardTitle>
            <CardDescription>
              Highlight your core areas of expertise to match job roles.
            </CardDescription>
          </div>

          {/* Conditional Rendering for buttons */}
          {!sectionLoading && (
            keySkills.length > 0 ? (
              <Button variant="ghost" size="icon" onClick={openModal}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={openModal}>
                <Plus className=" h-4 w-4" /> Add Skills
              </Button>
            )
          )}
        </CardHeader>

        <CardContent className="pt-2">
          {sectionLoading ? (
            <div className="flex flex-wrap gap-2 animate-pulse pt-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-lg bg-muted" />
              ))}
            </div>
          ) : keySkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {keySkills.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium"
                >
                  {String(skill).charAt(0).toUpperCase() +
                    String(skill).slice(1)}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center w-full shadow-sm">
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <p className="text-sm">No Key Skills added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <KeySkillsModal
          show={isModalOpen}
          onClose={closeModal}
          selectedSkills={keySkills}
          refetchKeySkills={fetchKeySkills}
        />
      )}
    </>
  );
};

export default KeySkills;