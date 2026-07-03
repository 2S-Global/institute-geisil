import React, { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import API from "@/lib/axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProjectModal from "./projectModal";

interface ProjectType {
  _id?: string;
  project_title?: string;
  project_name?: string;
  title?: string;
  project_description?: string;
  description?: string;
  skills?: string[];
  tags?: string[];
  workfromyear?: number | string;
  workfrommonth?: number | string;
  workfrommonth_name?: string;
  worktoyear?: number | string;
  worktomonth?: number | string;
  worktomonth_name?: string;
  status?: string;
}

const Project = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );

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

      console.log("Response Data Payload:", response.data);

      if (response.status === 200) {
        setProjects(response.data.data || response.data || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response) {
        console.error("Server Error Data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProject(null);
    setShowModal(true);
  };

  const handleEdit = (project: ProjectType) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  const getDurationString = (project: ProjectType): string => {
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
    <div className="flex flex-col w-full min-h-[300px] justify-start items-stretch space-y-4">
     
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-semibold">Projects</h2>

        <Button size="sm" className="gap-1.5 shrink-0" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-12 w-full">
          <p className="text-sm text-gray-500 font-medium animate-pulse">
            Loading projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-1 items-center justify-center w-full">
          <Card className="w-full border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <p className="text-sm">No projects found.</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Click "Add Project" to display your academic or professional
                works.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full items-start">
          {projects.map((project, index) => {
            const durationText = getDurationString(project);

            return (
              <Card
                key={project._id || index}
                className="w-full transition-all duration-200 hover:shadow-sm"
              >
                <CardContent className="space-y-3 p-5">
                  
                  <div className="flex items-start justify-between w-full gap-4">
                    <p className="font-semibold text-base leading-snug break-words capitalize max-w-[calc(100%-40px)]">
                      {project.project_title ||
                        project.project_name ||
                        project.title ||
                        "Untitled Project"}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 hover:bg-blue-950"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>

                  
                  {durationText && (
                    <p className="text-xs text-muted-foreground font-medium bg-secondary/40 inline-block px-2.5 py-0.5 rounded-md">
                      Duration: {durationText}
                    </p>
                  )}

                 
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed break-words whitespace-pre-line">
                    {project.project_description ||
                      project.description ||
                      "No description available."}
                  </p>

                  
                  {(project.skills || project.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(project.skills || project.tags || []).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      
      {showModal && (
        <ProjectModal
          show={showModal}
          onClose={handleClose}
          item={selectedProject}
          setReload={setReload}
        />
      )}
    </div>
  );
};

export default Project;
