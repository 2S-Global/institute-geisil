import { useEffect, useState } from "react";
import api from "@/lib/axios";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
const ManageStudents = () => {
  const [programData, setProgramData] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [students, setStudents] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [gender, setGender] = useState("");
  const [tenMin, setTenMin] = useState(0);
  const [tenMax, setTenMax] = useState(100);
  const [twelveMin, setTwelveMin] = useState(0);
  const [twelveMax, setTwelveMax] = useState(100);
  const [gradMin, setGradMin] = useState(0);
  const [gradMax, setGradMax] = useState(100);
const [searchLoading, setSearchLoading] = useState(false);
const [filterLoading, setFilterLoading] = useState(false);
const [allStudents, setAllStudents] = useState([]);
  // FETCH COURSE LIST
  useEffect(() => {
    const token = localStorage.getItem("Institute_token");

    const fetchData = async () => {
      try {
        const response = await api.get("/api/institute-course/course", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = response?.data?.data.map((item) => ({
          label:
            item?.type !== "custom"
              ? `${item?.name} (${item?.type})`
              : item?.name,

          value: item?._id,

          totalSem: Number(item?.total_number_of_semesters || 0),

          structure: item?.courseStructure || "semester",
        }));

        setProgramData(responseData || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // PROGRAM SELECT
  const handleProgramSelect = (value) => {
    const selected = programData.find((item) => item.value === value);

    setSelectedProgram(selected);

    // GENERATE SEMESTERS
    if (selected?.totalSem) {
      const sems = Array.from({ length: selected.totalSem }, (_, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`,
      }));

      setSemesterOptions(sems);
    } else {
      setSemesterOptions([]);
    }

    setSelectedSemester(null);
  };

  // SEARCH
const handleSearch = async () => {
  try {
    setSearchLoading(true);

    setSearched(true);

    const token = localStorage.getItem("Institute_token");

    const res = await api.get(
      "/api/institutestudent/institute-student-search",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        params: {
          course: selectedProgram?.value,
          semester: selectedSemester?.value,
        },
      },
    );

    let data = res?.data?.data || [];

    data = data.filter((item) => {
      const genderMatch = !gender || item?.gender === gender;

      const tenMatch =
        Number(item?.tenTh || 0) >= Number(tenMin) &&
        Number(item?.tenTh || 0) <= Number(tenMax);

      const twelveMatch =
        Number(item?.twelveTh || 0) >= Number(twelveMin) &&
        Number(item?.twelveTh || 0) <= Number(twelveMax);

      const gradMatch =
        Number(item?.graduationMarks || 0) >= Number(gradMin) &&
        Number(item?.graduationMarks || 0) <= Number(gradMax);

      return genderMatch && tenMatch && twelveMatch && gradMatch;
    });

setAllStudents(data);
setStudents(data);
  } catch (err) {
    console.error(err);
  } finally {
    setSearchLoading(false);
  }
};

  const handleReset = () => {
    setSelectedProgram(null);

    setSelectedSemester(null);

    setSemesterOptions([]);

    // RESET STUDENT LIST
    setStudents([]);

    // RESET SEARCH STATE
    setSearched(false);

    // RESET ADVANCED FILTER
    setShowAdvanced(false);

    setGender("");

    setTenMin(0);
    setTenMax(100);

    setTwelveMin(0);
    setTwelveMax(100);

    setGradMin(0);
    setGradMax(100);
  };

const handleApplyFilter = async () => {
  try {
    setFilterLoading(true);

    let data = [...allStudents];

    data = data.filter((item) => {
      const genderMatch = !gender || item?.gender === gender;

      const tenMatch =
        Number(item?.tenTh || 0) >= Number(tenMin) &&
        Number(item?.tenTh || 0) <= Number(tenMax);

      const twelveMatch =
        Number(item?.twelveTh || 0) >= Number(twelveMin) &&
        Number(item?.twelveTh || 0) <= Number(twelveMax);

      const gradMatch =
        Number(item?.graduationMarks || 0) >= Number(gradMin) &&
        Number(item?.graduationMarks || 0) <= Number(gradMax);

      return genderMatch && tenMatch && twelveMatch && gradMatch;
    });

    setStudents(data);
  } catch (err) {
    console.error(err);
  } finally {
    setFilterLoading(false);
  }
};

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Search Students"
        description="Search students by program and semester."
      />

      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5 overflow-visible">
          <div className="rounded-xl border border-border/60 p-5 bg-background overflow-visible">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PROGRAM */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Program
                </label>

                <Select
                  options={programData}
                  value={selectedProgram}
                  onChange={(selected) => {
                    setSelectedProgram(selected);

                    if (selected?.totalSem) {
                      const sems = Array.from(
                        { length: selected.totalSem },
                        (_, i) => ({
                          label: `${i + 1}`,
                          value: `${i + 1}`,
                        }),
                      );

                      setSemesterOptions(sems);
                    } else {
                      setSemesterOptions([]);
                    }

                    setSelectedSemester(null);
                  }}
                  placeholder="Select Program"
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                />
              </div>

              {/* SEMESTER */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Semester/Year
                </label>

                <Select
                  options={semesterOptions}
                  value={selectedSemester}
                  onChange={(selected) => setSelectedSemester(selected)}
                  placeholder="Select Semester/Year"
                  isDisabled={!selectedProgram}
                  menuPlacement="bottom"
                  menuPosition="fixed"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-between items-center gap-3 mt-5 flex-wrap">
              {/* LEFT SIDE */}

              {searched && (
                <Button
                  variant="secondary"
                  className="mb-5"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  Advanced Search
                </Button>
              )}
              {/* RIGHT SIDE */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>

                <Button
                  onClick={handleSearch}
                  disabled={
                    !selectedProgram || !selectedSemester || searchLoading
                  }
                >
                  {searchLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            {/* ADVANCED FILTER */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 mb-5 rounded-xl border border-border/60 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      {/* GENDER */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Gender
                        </label>

                        <Select
                          options={[
                            {
                              label: "Male",
                              value: "m",
                            },
                            {
                              label: "Female",
                              value: "f",
                            },
                            {
                              label: "Other",
                              value: "o",
                            },
                          ]}
                          value={
                            gender
                              ? {
                                  label:
                                    gender === "m"
                                      ? "Male"
                                      : gender === "f"
                                        ? "Female"
                                        : "Other",
                                  value: gender,
                                }
                              : null
                          }
                          onChange={(selected) =>
                            setGender(selected?.value || "")
                          }
                          placeholder="Select Gender"
                          menuPlacement="bottom"
                          menuPosition="fixed"
                        />
                      </div>

                      {/* 10TH */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          10th Marks
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tenMin}
                            onChange={(e) => setTenMin(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />

                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={tenMax}
                            onChange={(e) => setTenMax(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {tenMin}% - {tenMax}%
                        </p>
                      </div>

                      {/* 12TH */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          12th Marks
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={twelveMin}
                            onChange={(e) => setTwelveMin(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />

                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={twelveMax}
                            onChange={(e) => setTwelveMax(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {twelveMin}% - {twelveMax}%
                        </p>
                      </div>

                      {/* GRADUATION */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Graduation Marks
                        </label>

                        <div className="flex gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradMin}
                            onChange={(e) => setGradMin(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />

                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradMax}
                            onChange={(e) => setGradMax(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                          />
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {gradMin}% - {gradMax}%
                        </p>
                      </div>
                    </div>

                    {/* APPLY FILTER */}
                    {/* APPLY FILTER */}
                    <div className="flex justify-end gap-3 mt-5">
                      <Button
                        variant="outline"
                        onClick={async () => {
                          setGender("");

                          setTenMin(0);
                          setTenMax(100);

                          setTwelveMin(0);
                          setTwelveMax(100);

                          setGradMin(0);
                          setGradMax(100);

                          // RELOAD ORIGINAL LIST
                          const token = localStorage.getItem("token");

                          const res = await api.get(
                            "/api/institutestudent/institute-student-search",
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },

                              params: {
                                course: selectedProgram?.value,
                                semester: selectedSemester?.value,
                              },
                            },
                          );

                          setStudents(res?.data?.data || []);
                        }}
                      >
                        Reset Filter
                      </Button>

                      <Button
                        onClick={handleApplyFilter}
                        disabled={filterLoading}
                      >
                        {filterLoading ? "Applying..." : "Apply Filter"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {searched && (
              <Card className="border-border/60 shadow-sm mt-6">
                <CardContent className="p-5">
                  {/* HEADER */}
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Student List</h2>
                  </div>

                  {/* STUDENT LIST */}
                  {searchLoading ? (
                    <div className="text-center py-10">Loading...</div>
                  ) : students?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-border/60">
                      <table className="w-full text-sm text-center">
                        <thead>
                          <tr className="border-b border-border/60 bg-muted/40">
                            <th className="px-4 py-3 text-center">Name</th>

                            <th className="px-4 py-3 text-center">Gender</th>

                            <th className="px-4 py-3 text-center">10th</th>

                            <th className="px-4 py-3 text-center">12th</th>

                            <th className="px-4 py-3 text-center">
                              Graduation
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {students?.map((item) => (
                            <tr
                              key={item?._id}
                              className="border-b border-border/50"
                            >
                              <td className="px-4 py-3 text-center">
                                {item?.name?.toUpperCase()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {item?.gender?.toUpperCase()}
                              </td>

                              <td className="px-4 py-3 text-center">
                                {item?.tenTh}%
                              </td>

                              <td className="px-4 py-3 text-center">
                                {item?.twelveTh}%
                              </td>

                              <td className="px-4 py-3 text-center">
                                {item?.graduationMarks}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      No students found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ManageStudents;
