
import React, { useState, useEffect } from "react";
import { Pencil, Plus } from "lucide-react";
import API from "../../../lib/axios";
import Profilesum from "./Profilesum";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ProfileSummarySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profilesummary, setProfilesummary] = useState("");
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
    const fetchprofilesummary = async () => {
      try {
        setSectionloading(true);
        const response = await API.get(`/api/userdata/profile_summary`);
        setProfilesummary(response.data.profileSummary || "");
      } catch (error) {
        console.error("Error fetching profile summary:", error);
      } finally {
        setSectionloading(false);
      }
    };
    fetchprofilesummary();
  }, []);

  // Determine if content exists
  const hasData = profilesummary?.trim().length > 0;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg">Profile Summary</CardTitle>
            <CardDescription>
              A brief overview of your professional background and key strengths.
            </CardDescription>
          </div>

          {/* Conditional Rendering: Pencil if data exists, Add button if empty */}
          {!sectionloading && (
            hasData ? (
              <Button variant="ghost" size="icon" onClick={openModalRH}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <Button  size="sm" onClick={openModalRH}>
                <Plus className="mr-2 h-4 w-4" /> Add Summary
              </Button>
            )
          )}
        </CardHeader>

        <CardContent>
          {sectionloading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : hasData ? (
            <div className="pt-2">
              <p className="whitespace-pre-line text-justify text-sm">
                {profilesummary}
              </p>
            </div>
          ) : (
            <div
              className="flex flex-1 items-center justify-center w-full cursor-pointer mt-2"
              onClick={openModalRH}
            >
              <div className="w-full border-dashed border border-gray-200 rounded-xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center hover:border-gray-300 transition-colors">
                <p className="text-sm">No Profile Summary added yet.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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