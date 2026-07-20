import React, { useState, useEffect } from "react";
import { Pencil, Plus } from "lucide-react";
import API from "../../../lib/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResumeHeadline from "./ResumeHeadline";
import { Skeleton } from "@/components/ui/skeleton";

const ResumeHeadlineSection = ({
  setReload,
  setError_main,
  setSuccess_main,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeHeadline, setResumeHeadline] = useState("");
  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const fetchResumeHeadline = async () => {
      try {
        setSectionloading(true);
        const response = await API.get(`/api/userdata/resume_headline`);
        setResumeHeadline(response.data.resumeHeadline || "");
      } catch (error) {
        console.error("Error fetching resume headline:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchResumeHeadline();
  }, []);

  const hasData = resumeHeadline?.trim().length > 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Resume Headline</CardTitle>
            <CardDescription>
              A short summary recruiters see first.
            </CardDescription>
          </div>

          {!sectionloading && (
            hasData ? (
              <Button variant="ghost" size="icon" onClick={openModalRH}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button  size="sm" onClick={openModalRH}>
                <Plus className="mr-2 h-4 w-4" /> Add Headline
              </Button>
            )
          )}
        </CardHeader>

        <CardContent>
          {sectionloading ? (
            <div className="space-y-2 animate-pulse pt-2">
              <Skeleton className="h-4 w-full bg-muted" />
              <Skeleton className="h-4 w-5/6 bg-muted" />
            </div>
          ) : hasData ? (
            <div className="pt-2">
              <p className="text-sm">{resumeHeadline.trim()}</p>
            </div>
          ) : (
            <div
              className="flex flex-1 items-center justify-center w-full cursor-pointer mt-2"
              onClick={openModalRH}
            >
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center hover:border-gray-300 transition-colors">
                <p className="text-sm">No Resume Headline added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
        <ResumeHeadline
          show={isModalOpen}
          onClose={closeModalRH}
          mainresumeHeadline={resumeHeadline}
          mainsetResumeHeadline={setResumeHeadline}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ResumeHeadlineSection;