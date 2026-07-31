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

const AcademicSection = ({ setRefresh = () => {} }) => {
  const apiurl = import.meta.env.VITE_API_URL;
  // console.log("show",show)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expanded, setExpanded] = useState({}); // Track expanded descriptions
  const [listlevel, setListlevel] = useState([]);
  const [reload, setReload] = useState(false);
  // const [missingLevels, setMissingLevels] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [userdata, setUserdata] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [edit_id, setEdit_id] = useState("");

  const normalizeLevelName = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase();

  const getLevelLabel = (levelItem) => {
    if (!levelItem) return "";
    return normalizeLevelName(
      levelItem.level || levelItem.name || levelItem.label,
    );
  };

  const getRecordLevelLabel = (record) => {
    const recordLevel =
      record?.level_name ?? record?.levelName ?? record?.level;
    if (typeof recordLevel === "string" && Number.isNaN(Number(recordLevel))) {
      return normalizeLevelName(recordLevel);
    }

    const levelId = record?.level_id ?? recordLevel ?? "";
    if (levelId === "") return "";

    const matchedLevel = listlevel.find(
      (level) => String(level.id) === String(levelId),
    );
    return getLevelLabel(matchedLevel);
  };

  // Keep these conditions in sync with EducationModal's Select Level dropdown.
  const getAllowedLevelsForAdd = (allLevels, records) => {
    if (!allLevels.length) return [];

    const existingLabels = records
      .map((record) => getRecordLevelLabel(record))
      .filter(Boolean);

    const has10th = existingLabels.includes("10th standard");
    const has12th = existingLabels.includes("12th standard");
    const hasDiploma = existingLabels.includes("diploma");
    const hasUndergraduate = existingLabels.some(
      (label) =>
        label === "undergraduate" ||
        label === "under graduate" ||
        label === "graduation",
    );
    const hasPostgraduate = existingLabels.some(
      (label) => label === "postgraduate" || label === "post graduate",
    );
    const hasDoctorate = existingLabels.some(
      (label) =>
        label === "doctorate/phd" || label === "doctorate" || label === "phd",
    );
    const onlyLevels = (...labels) =>
      allLevels.filter((level) => !labels.includes(getLevelLabel(level)));

    if (has10th && has12th) {
      if (!hasUndergraduate) {
        return onlyLevels(
          "10th standard",
          "12th standard",
          "postgraduate",
          "post graduate",
          "post graduation",
          "doctorate/phd",
          "doctorate",
          "phd",
        );
      } else if (!hasPostgraduate) {
        return onlyLevels(
          "10th standard",
          "12th standard",
          "doctorate/phd",
          "doctorate",
          "phd",
        );
      }
      return onlyLevels("10th standard", "12th standard");
    } else if (has10th) {
      return onlyLevels(
        "10th standard",
        "postgraduate",
        "post graduate",
        "post graduation",
        "under graduate",
        "graduation",
        "undergraduate",
        "doctorate/phd",
        "doctorate",
        "phd",
      );
    } else {
      return onlyLevels(
        "12th standard",
        "postgraduate",
        "post graduate",
        "post graduation",
        "under graduate",
        "graduation",
        "undergraduate",
        "diploma",
        "doctorate/phd",
        "doctorate",
        "phd",
      );
    }
  };

  // const getAllowedAddLevelIds = () => {
  //   return getAllowedLevelsForAdd(listlevel, userdata).map((level) =>
  //     String(level.id),
  //   );
  // };

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

  const handleEducationChanged = async (deletedId = "") => {
    if (deletedId) {
      setUserdata((current) =>
        current.filter((record) => String(record._id) !== String(deletedId)),
      );
      return;
    }

    await fetchuserdata();
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

  // useEffect(() => {
  //   const compareLevels = async () => {
  //     //map missing levels from userdata
  //     const missingLevels = listlevel.filter((level) => {
  //       return !userdata.some((item) => item.level_id == level.id);
  //     });

  //     // console.log("Missing Levels:", missingLevels);
  //     setMissingLevels(missingLevels);
  //   };

  //   compareLevels();
  // }, [userdata, listlevel]);

  const openModalRH = (level = "", edit_id = "") => {
    setIsModalOpen(true);
    setSelectedLevel(level || "");
    setEdit_id(edit_id || "");
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
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-display text-lg font-semibold">
              Academic Achievements
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              Details about your academic qualifications and schools/colleges.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => openModalRH()}>
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        </CardHeader>

        <CardContent>
          {sectionloading ? (
            <div className="space-y-4 animate-pulse mt-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 items-start border border-gray-100 rounded-lg p-5"
                >
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
                          <SchoolDisplay
                            data={item}
                            openModalRH={openModalRH}
                          />
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

                {/* Available Levels - Same logic as EducationModal */}
                {getAllowedLevelsForAdd(listlevel, userdata).length > 0 && (
                  <div className="space-y-2 mt-3">
                    {getAllowedLevelsForAdd(listlevel, userdata).map(
                      (level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => openModalRH(level.id)}
                          className="block w-full rounded bg-blue-50 px-3 py-2 text-left font-bold text-blue-600 transition hover:underline"
                        >
                          Add {level.level}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <EducationModal
          setRefresh={setRefresh}
          show={isModalOpen}
          onClose={closeModalRH}
          reload={reload}
          setReload={setReload}
          selectedLevel={selectedLevel}
          edit_id={edit_id}
          setError={setError}
          setSuccess={setSuccess}
          onEducationChanged={handleEducationChanged}
        />
      )}
    </>
  );
};

export default AcademicSection;
