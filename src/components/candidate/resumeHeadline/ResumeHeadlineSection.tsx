import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
//import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResumeHeadline from "./ResumeHeadline"
const ResumeHeadlineSection = ({ show, onClose, data = {}, setRefresh ,setReload,
  setError_main,
  setSuccess_main}) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  console.log("show",show)
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeHeadline, setResumeHeadline] = useState("");

  const [sectionloading, setSectionloading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const openModalRH = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };
  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  useEffect(() => {
    const fetchResumeHeadline = async () => {
      try {
        setSectionloading(true);
        const token = localStorage.getItem("token");
        const response = await API.get(`/api/userdata/resume_headline`)
      
        //set only if response code is 200

        setResumeHeadline(response.data.resumeHeadline);
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      } finally {
        setSectionloading(false);
      }
    };

    fetchResumeHeadline();
  }, [apiurl]);
  //if (!show) return null;

  return (

<>
 
  {/* Resume Headline Section */}



     <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Resume Headline</CardTitle>
                      <CardDescription>A short summary recruiters see first.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={openModalRH}><Pencil className="h-4 w-4"/></Button>
                  </CardHeader>
                  <CardContent>
                  
    {sectionloading ? (
      'loading.............'
    ) : (
      <div className="mt-4">
        <p >
          {resumeHeadline?.trim() || "Add Your Resume Headline"}
        </p>
      </div>
    )}
                  </CardContent>
                </Card>

  {/* Modal */}
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
