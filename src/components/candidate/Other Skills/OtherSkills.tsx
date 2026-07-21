import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import API from "@/lib/axios";
import OtherSkillsModal from "./OtherSkillsModal";
import { Skeleton } from "@/components/ui/skeleton";

const OtherSkills = () => {
  const [sectionLoading, setSectionLoading] = useState(false);
  const [itSkills, setitSkills] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  const fetchitSkills = async () => {
    try {
      setSectionLoading(true);
      setError(null);
      const response = await API.get("/api/candidate/itskill/getotherskill");

      if (response.status === 200) {
        setitSkills(response.data?.data || response.data || []);
      }
    } catch (err: any) {
      console.log("Error fetching it Skills:", err);

      // If the API drops a 404 because no skills are added yet,
      // treat it cleanly as an empty array instead of displaying a system error.
      if (err.response && err.response.status === 404) {
        setitSkills([]);
        setError(null);
      } else {
        setError("Failed to load IT skills");
      }
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    fetchitSkills();
  }, []);

  const handleOpenCreate = () => {
    setSelectedSkill(null);
    setIsModalOpen(true);
  };

  const handleOpenUpdate = (skill: any) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-4xl border border-slate-100 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">
              Other Skills
            </CardTitle>
            <CardDescription>
              Add other relevant professional skills and competencies.
            </CardDescription>
          </div>

          <Button type="button" onClick={handleOpenCreate} size="sm">
            <Plus className="h-4 w-4" /> Add Other Skills
          </Button>
        </CardHeader>

        <CardContent className="pt-0">
          {sectionLoading ? (
            <div className="space-y-4 animate-pulse pt-2">
              <div className="flex gap-4 border-b pb-3">
                <Skeleton className="h-4 w-1/2 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </div>
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 py-2">
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                  <Skeleton className="h-4 w-1/2 bg-muted" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : itSkills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-900 font-bold text-sm">
                    <th className="pb-3 pt-2 font-bold w-[30%]">Skill</th>
                    <th className="pb-3 pt-2 font-bold w-[35%]">Experience</th>
                    <th className="pb-3 pt-2 w-[5%]"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 border-t border-b border-slate-200">
                  {itSkills.map((skill, index) => (
                    <tr
                      key={skill._id || index}
                      className="text-slate-800 text-sm hover:bg-slate-50/50 group"
                    >
                      <td className="py-3.5 pr-4 text-slate-800">
                        {skill.skillSearch}
                      </td>

                      <td className="py-3.5 pr-4 text-slate-600">
                        {`${skill.experienceyear || 0} Years and ${
                          skill.experiencemonth || 0
                        } Months`}
                      </td>

                      <td className="py-2 text-right">
                        <Button
                          onClick={() => handleOpenUpdate(skill)}
                          variant="ghost"
                          size="icon"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Integrates your elegant dashed placeholder for empty records */
            <div className="flex flex-1 items-center justify-center w-full shadow-sm">
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                <p className="text-sm">No Other Skills added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <OtherSkillsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={selectedSkill}
        onSuccess={fetchitSkills}
      />
    </>
  );
};

export default OtherSkills;
