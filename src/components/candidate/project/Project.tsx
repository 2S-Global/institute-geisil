import React, { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import API from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import ProjectModal from "./projectModal";

const Project = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [reload]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/api/candidate/project/get_project_details",
      );

      if (response.status === 200) {
        setProjects(response.data.data || response.data || []);
      }
    } catch (error: any) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const getDurationString = (project: any): string => {
    const startMonth = project.workfrommonth_name;
    const startYear = project.workfromyear;

    const isOngoing =
      project.status?.toLowerCase() === "currently working" ||
      !project.worktoyear;

    const endMonth = isOngoing ? "Present" : project.worktomonth_name;
    const endYear = isOngoing ? "" : project.worktoyear;

    if (startMonth && startYear) {
      const startText = `${startMonth} ${startYear}`;
      const endText = endYear ? `${endMonth} ${endYear}` : endMonth;

      return `${startText} to ${endText}`;
    }

    return "";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Projects</CardTitle>

            <CardDescription>
              Showcase projects you've worked on, including academic and
              personal ones.
            </CardDescription>
          </div>

          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Add Project
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-sm text-gray-500 font-medium">
              Loading projects...
            </p>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 w-full">
              {projects.map((project, index) => {
                const durationText = getDurationString(project);

                return (
                  <Card
                    key={project._id || index}
                    className="w-full border shadow-none"
                  >
                    <CardContent className="space-y-3 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-base font-semibold capitalize leading-snug break-words">
                          {project.project_title ||
                            project.project_name ||
                            project.title ||
                            "Untitled Project"}
                        </CardTitle>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleEdit(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>

                      {durationText && (
                        <CardDescription className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 w-fit">
                          Duration: {durationText}
                        </CardDescription>
                      )}

                      <CardDescription className="  text-justify break-words">
                        {project.project_description ||
                          project.description ||
                          "No description available."}
                      </CardDescription>

                      {(project.skills || project.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(project.skills || project.tags || []).map(
                            (tag: string, i: number) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="w-full border border-dashed border-gray-200 rounded-xl p-8 text-center text-muted-foreground">
                <p className="text-sm">No Project added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <ProjectModal
          show={showModal}
          onClose={handleClose}
          item={selectedProject}
          setReload={setReload}
        />
      )}
    </>
  );
};

export default Project;
