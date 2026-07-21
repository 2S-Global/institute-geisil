

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
import {
  BadgeCheck,
  BadgeAlert,
  Pencil,
  GraduationCap,
  Calendar,
  Info,
  Plus,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SchoolDisplay from "./SchoolDisplay";
import ClgDisplay from "./ClgDisplay";
import EducationModal from "./EducationModal";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AcademicSection = () => {
  const apiurl = import.meta.env.VITE_API_URL;
  // console.log("show",show)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded descriptions
  const [listlevel, setListlevel] = useState([]);
  const [reload, setReload] = useState(false);
  const [missingLevels, setMissingLevels] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [userdata, setUserdata] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [edit_id, setEdit_id] = useState("");

  const [sectionloading, setSectionloading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    if (reload) {
      fetchuserdata();
      fetchLevels();
      setReload(false);
    }
  }, [reload]);

  const fetchuserdata = async () => {
    try {
      setSectionloading(true);

      /*   const response = await axios.get(
        `${apiurl}/api/userdata/get_user_education`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await API.get(`/api/userdata/get_user_education`);

      if (response.status == 200) {
        setUserdata(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setSectionloading(false);
    }
  };
  const fetchLevels = async () => {
    try {
      /*   const response = await axios.get(
        `${apiurl}/api/sql/dropdown/education_level`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      ); */
      const response = await API.get(`/api/sql/dropdown/education_level`);

      setListlevel(response.data.data);
    } catch (error) {
      //  console.error("Error fetching levels:", error);
    } finally {
      //  console.error("Error fetching levels:", error);
    }
  };

  useEffect(() => {
    fetchLevels();
    fetchuserdata();
  }, []);

  useEffect(() => {
    const compareLevels = async () => {
      //map missing levels from userdata
      const missingLevels = listlevel.filter((level) => {
        return !userdata.some((item) => item.level_id == level.id);
      });

      // console.log("Missing Levels:", missingLevels);
      setMissingLevels(missingLevels);
    };

    compareLevels();
  }, [userdata, listlevel]);

  const openModalRH = (level, edit_id) => {
    setIsModalOpen(true);
    if (level) {
      console.log("Selected Level:", level);
      setSelectedLevel(level);
    } else {
      setSelectedLevel("");
    }

    if (edit_id) {
      setEdit_id(edit_id);
    } else {
      setEdit_id("");
    }

    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };
  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle expanded state for the specific item
    }));
  };
  //if (!show) return null;

  return (
    <>
      {/*   <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-lg">Academics</CardTitle>
        <CardDescription></CardDescription>
      </div>

      <Button variant="ghost" size="icon" onClick={() => openModalRH()}>
        <Pencil className="h-4 w-4" />
      </Button>
    </CardHeader>

    <CardContent> */}
      <div>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Education
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Details about your academic qualifications and
              schools/colleges.
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => openModalRH()}
          >
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        </div>

        {sectionloading ? (
          <div className="space-y-4 animate-pulse mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-4 items-start border border-gray-100 rounded-lg p-5">
                <Skeleton className="h-10 w-10 rounded bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48 bg-muted" />
                  <Skeleton className="h-4 w-36 bg-muted" />
                  <Skeleton className="h-3.5 w-20 bg-muted mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div>
              {/* Existing Education List */}
              <div className="space-y-4">
                {userdata.map((item, index) => {
                  // 1. VERIFIED: Master boolean is true
                  const isVerified = item.is_verified === true;

                  // 2. REJECTED: Not verified, and explicitly marked false for studying there
                  const isRejected =
                    !isVerified && item.is_studied_here === false;

                  // 3. PENDING: Not verified, and has not been marked false (e.g., it is true or undefined/null)
                  const isPending = !isVerified && !isRejected;

                  return (
                    <div key={index}>
                      {item.level_id == 1 || item.level_id == 2 ? (
                        <SchoolDisplay data={item} openModalRH={openModalRH} />
                      ) : (
                        <ClgDisplay
                          data={item}
                          openModalRH={openModalRH}
                          isVerified={isVerified}
                          isPending={isPending}
                          isRejected={isRejected}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Missing Levels */}
              {missingLevels.length > 0 && (
                <div className="space-y-2">
                  {missingLevels.map((level) => (
                    <span
                      key={level.id}
                      className="block font-bold text-blue-600 cursor-pointer hover:underline mt-3"
                      onClick={() => openModalRH(level.id)}
                    >
                      Add {level.level}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/*   </Card> */}

      {/* Modal */}
      {isModalOpen && (
        <EducationModal
          show={isModalOpen}
          onClose={closeModalRH}
          reload={reload}
          setReload={setReload}
          selectedLevel={selectedLevel}
          edit_id={edit_id}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
    </>
  );
};

export default AcademicSection;
