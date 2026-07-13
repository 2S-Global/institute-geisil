


import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, CircleX, Pencil, CircleCheck } from "lucide-react";
import API from "../../../lib/axios";
import Profilesum from "./Profilesum";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import PersonalModal from "../personal/PersonalModal";

const ProfileSummarySection = () => {
  const apiurl = import.meta.env.VITE_API_URL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilesummary, setProfilesummary] = useState();
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
    const fetchprofilesummary = async () => {
      try {
        setSectionloading(true);
        const token = localStorage.getItem("candidate_token");
        /*   const response = await axios.get(
          `${apiurl}/api/userdata/profile_summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); */
        const response = await API.get(`/api/userdata/profile_summary`);

        //set only if response code is 200
        setProfilesummary(response.data.profileSummary);
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchprofilesummary();
  }, [apiurl]);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Profile Summary</CardTitle>
            <CardDescription>A brief overview of your professional background and key strengths.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={openModalRH}>
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {sectionloading ? (
            "loading............"
          ) : profilesummary?.trim() ? (
            <div>
              <p className="whitespace-pre-line text-justify">
                {profilesummary}
              </p>
            </div>
          ) : (
            <div 
              className="flex flex-1 items-center justify-center w-full shadow-sm cursor-pointer" 
              onClick={openModalRH}
            >
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center hover:border-gray-300 transition-colors">
                <p className="text-sm">No Profile Summary added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <Profilesum
          show={isModalOpen}
          onClose={closeModalRH}
          mainprofilesummary={profilesummary}
          mainsetProfilesummary={setProfilesummary}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default ProfileSummarySection;