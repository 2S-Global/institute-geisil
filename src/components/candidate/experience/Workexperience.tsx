

import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar, Briefcase } from "lucide-react";
import API from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WorkProfileModal from "./ExperienceModal";

const WorkProfileList = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, [reload]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await API.get(
        "/api/candidate/accomplishments/get_work_samples",
      );
      if (response.status === 200) {
        setProfiles(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load work profiles.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProfile(null);
    setShowModal(true);
  };

  const handleEdit = (prof) => {
    setSelectedProfile(prof);
    setShowModal(true);
  };

  const handleDeleteClick = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this work profile?"))
      return;

    try {
      const response = await API.delete(
        "/api/candidate/accomplishments/delete_work_sample",
        { data: { _id: id } },
      );
      if (response.status === 200 || response.data?.success) {
        toast({
          title: "Deleted",
          description:
            response.data.message || "Work profile removed successfully.",
        });
        setReload((prev) => !prev);
      }
    } catch (error) {
      console.error("Error deleting work profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete work profile. Please try again.",
      });
    }
  };

  // Uses the explicit string month names returned directly from your API data
  const getDurationString = (prof) => {
    const fromYear = prof.durationFrom?.year || prof.year;
    const fromMonth = prof.durationFrom?.month || prof.month;

    if (!fromYear) return "Dates unspecified";

    const startText = fromMonth ? `${fromMonth} ${fromYear}` : `${fromYear}`;

    if (prof.currentlyWorking || (!prof.durationTo?.year && !prof.toYear)) {
      return `${startText} — Present`;
    }

    const toYear = prof.durationTo?.year || prof.toYear;
    const toMonth = prof.durationTo?.month || prof.toMonth;
    const endText = toMonth ? `${toMonth} ${toYear}` : `${toYear}`;

    return `${startText} — ${endText}`;
  };

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-6 ">
        <div>
          <CardTitle className="text-xl font-semibold text-[#1F2937]">
            Work experience
          </CardTitle>
          <CardDescription>
            Detail your professional journey and key responsibilities.
          </CardDescription>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add experience
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-12 w-full">
            <p className="text-sm text-gray-500 font-medium animate-pulse">
              Loading work experiences...
            </p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="flex flex-1 items-center justify-center w-full shadow-sm">
            <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <p className="text-sm">No work experiences added yet.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {profiles.map((p, i) => (
              <div
                key={p._id || i}
                className="w-full border border-gray-100 bg-white shadow-none rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-[#F3F4F6] text-[#4B5563] flex items-center justify-center shrink-0 border border-gray-200">
                    <Briefcase className="h-5 w-5 text-blue-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 text-left">
                        <h2 className="font-bold text-gray-900 text-lg capitalize">
                          {p.workTitle || "Untitled Position"}
                        </h2>

                        <p className="text-sm text-blue-600 font-medium mt-1">
                          {p.url || "Company Unspecified"}
                          {p.employmentType ? ` • ${p.employmentType}` : ""}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1.5 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {getDurationString(p)}
                          </span>
                          {p.location && (
                            <>
                              <span>•</span>
                              <span>{p.location}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 hover:bg-gray-100"
                          onClick={() => handleEdit(p)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100"
                          onClick={() => handleDeleteClick(p._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {p.description && (
                      <div
                        className="text-sm text-[#4B5563] mt-4 leading-relaxed text-left break-words prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: p.description }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {showModal && (
        <WorkProfileModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedProfile(null); 
          }}
          item={selectedProfile}
          setReload={() => setReload((prev) => !prev)}
        />
      )}
    </Card>
  );
};

export default WorkProfileList;
