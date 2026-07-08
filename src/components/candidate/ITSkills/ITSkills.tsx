// import React, { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Pencil } from "lucide-react";
// import API from "@/lib/axios";

// const ITSkills = () => {
//   const [sectionLoading, setSectionLoading] = useState(false);
//   const [itSkills, setitSkills] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchitSkills = async () => {
//       try {
//         setSectionLoading(true);
//         const response = await API.get("/api/candidate/itskill/itskill");
//         if (response.status === 200) {
//           setitSkills(response.data?.data || response.data || []);
//         }
//       } catch (err) {
//         console.log("Error fetching it Skills:", err);
//         setError("Failed to load it skills");
//       } finally {
//         setSectionLoading(false);
//       }
//     };

//     fetchitSkills();
//   }, []);

//   return (
//     <Card className="w-full max-w-4xl border border-slate-100 shadow-sm rounded-xl">
//       <CardHeader className="flex flex-row items-center justify-between pb-4">
//         <CardTitle className="text-xl font-semibold text-slate-800">IT Skills</CardTitle>
//         <Button variant="ghost" size="icon" >
//           <Pencil className="h-4 w-4" />
//         </Button>
//       </CardHeader>

//       <CardContent className="pt-0">
//         {sectionLoading ? (
//           <p className="text-slate-500 text-sm">Loading...</p>
//         ) : error ? (
//           <p className="text-red-500 text-sm">{error}</p>
//         ) : itSkills.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="text-slate-900 font-bold text-sm">
//                   <th className="pb-3 pt-2 font-bold w-[30%]">Skill</th>
//                   <th className="pb-3 pt-2 font-bold w-[15%]">Version</th>
//                   <th className="pb-3 pt-2 font-bold w-[15%]">Last Used</th>
//                   <th className="pb-3 pt-2 font-bold w-[35%]">Experience</th>
//                   <th className="pb-3 pt-2 w-[5%]"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 border-t border-b border-slate-200">
//                 {itSkills.map((skill, index) => (
//                   <tr key={skill._id || index} className="text-slate-800 text-sm hover:bg-slate-50/50 group">
//                     <td className="py-3.5 pr-4 text-slate-800">{skill.skillSearch}</td>
//                     <td className="py-3.5 pr-4 text-slate-600">{skill.version || "—"}</td>
//                     <td className="py-3.5 pr-4 text-slate-600">{skill.lastUsed || "—"}</td>
//                     <td className="py-3.5 pr-4 text-slate-600">
//                       {`${skill.experienceyear} Years and ${skill.experiencemonth} Months`}
//                     </td>
//                     <td className="py-2 text-right">
//                       <Button variant="ghost" size="icon" >
//                         <Pencil className="h-3.5 w-3.5" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-slate-500 text-sm">No IT skills found.</p>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ITSkills;

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import API from "@/lib/axios";
import ITSkillModal from "./ITSkillsModal";

const ITSkills = () => {
  const [sectionLoading, setSectionLoading] = useState(false);
  const [itSkills, setitSkills] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null);

  const fetchitSkills = async () => {
    try {
      setSectionLoading(true);
      const response = await API.get("/api/candidate/itskill/itskill");
      if (response.status === 200) {
        setitSkills(response.data?.data || response.data || []);
      }
    } catch (err) {
      console.log("Error fetching it Skills:", err);
      setError("Failed to load it skills");
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

  const handleSaveSkill = async (formData: any) => {
    try {
      setSubmitLoading(true);
      if (selectedSkill?._id) {
        const response = await API.put(
          `/api/candidate/itskill/itskill/${selectedSkill._id}`,
          formData,
        );
        if (response.status === 200 || response.status === 204) {
          setIsModalOpen(false);
          fetchitSkills();
        }
      } else {
        const response = await API.post(
          "/api/candidate/itskill/itskill",
          formData,
        );
        if (response.status === 200 || response.status === 201) {
          setIsModalOpen(false);
          fetchitSkills();
        }
      }
    } catch (err) {
      console.error("Error saving IT Skill:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-4xl border border-slate-100 shadow-sm rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold text-slate-800">
            IT Skills
          </CardTitle>
          <Button
            onClick={handleOpenCreate}
           
          >
            <Plus className="h-4 w-4" />
            Add Skill
          </Button>
        </CardHeader>

        <CardContent className="pt-0">
          {sectionLoading ? (
            <p className="text-slate-500 text-sm">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : itSkills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-900 font-bold text-sm">
                    <th className="pb-3 pt-2 font-bold w-[30%]">Skill</th>
                    <th className="pb-3 pt-2 font-bold w-[15%]">Version</th>
                    <th className="pb-3 pt-2 font-bold w-[15%]">Last Used</th>
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
                        {skill.version || "—"}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">
                        {skill.lastUsed || "—"}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600">
                        {`${skill.experienceyear} Years and ${skill.experiencemonth} Months`}
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
            <p className="text-slate-500 text-sm">No IT skills found.</p>
          )}
        </CardContent>
      </Card>

      <ITSkillModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSkill}
        initialData={selectedSkill}
        isLoading={submitLoading}
      />
    </>
  );
};

export default ITSkills;
