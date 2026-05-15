import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { Filter, Plus, Search, Edit, Trash } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesFormModal from "@/components/institute/courses/FormModal";
import { useToast } from "@/hooks/use-toast";
import {nameFormate} from "../lib/utils"
const statusStyles: Record<string, string> = {
  Placed: "bg-success/10 text-success border-success/20",
  "In Process": "bg-accent/10 text-accent border-accent/20",
  Evaluated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const ManageCourses = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { toast } = useToast();
  const openModalRH = () => {
    setEdit({});
    setIsModalOpen(true);
    //document.body.style.overflow = "hidden";
  };

  const openModalEdit = (row) => {
    setEdit(row);
    setIsModalOpen(true);
    //document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setEdit({});
    setIsModalOpen(false);
    //document.body.style.overflow = "auto";
  };

  const itemsPerPage = 10;
  const filtered = list?.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLists = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const [stats, setStats] = useState({
    total: 0,
    placementReady: 0,
    avgScore: 0,
    pending: 0,
  });

  const fetchList = async () => {
    try {
      const res = await api.get("/api/institute-course/course");
      const data = res?.data?.data || [];
      setList(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchList();
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(
        `/api/institutestudent/delete-custom-course`,
        {
          data: { courseId: id }, // ✅ matches backend
        },
      );

      if (response.data.success) {
        // ✅ OPTION 1 (current way)
        toast({
          title: "Success",
          description: response.data.message,
        });
        setRefresh((p) => p + 1);

        // ✅ OPTION 2 (better UX ⚡ instant)
        // setTestimonials(prev => prev.filter(item => item._id !== id));

        //setSuccess(response.data.message);
      } else {
        //setError(response.data.message);
      }
    } catch (err) {
      //setError(err.response?.data?.message || "Delete failed");
      toast({
        title: "Error",
        description: "Delete failed",
      });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Manage Courses"
        description="Manage courses efficiently with easy creation, tracking."
        actions={
          <>
            <Button
              className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
              onClick={() => openModalRH()}
            >
              <Plus className="h-4 w-4" /> Add Course
            </Button>
          </>
        }
      />
      {/*  <ImportModal open={importOpen} setOpen={setImportOpen} />
      <CoursesFormModal show={addStudentOpen} onClose={setStudentOpen} /> */}

      <CoursesFormModal
        show={isModalOpen}
        onClose={closeModalRH}
        data={edit}
        setRefresh={setRefresh}
      />

      {/*  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Total Students"
          value={stats.total.toString()}
          delta={12}
          icon={GraduationCap}
          tint="primary"
        />

        <StatCard
          label="Placement Ready"
          value={stats.placementReady.toString()}
          delta={9}
          icon={UserCheck}
          tint="accent"
        />

        <StatCard
          label="Avg. Score"
          value={stats.avgScore.toString()}
          delta={4}
          icon={Award}
          tint="success"
        />

        <StatCard
          label="Pending Eval."
          value={stats.pending.toString()}
          delta={-6}
          icon={Clock}
          tint="warning"
        />
      </div>
 */}
      <Card className="shadow-sm border-border/60">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div></div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search course…"
                  className="pl-9 w-full md:w-72"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[700px] text-sm text-center">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium py-3 px-4 text-center">
                    Course Name
                  </th>
                  <th className="font-medium py-3 px-4 text-center">
                    Duration
                  </th>
                  <th className="font-medium py-3 px-4 text-center">
                    Exam Type
                  </th>
                  <th className="font-medium py-3 px-4 text-center">
                    Marks Type
                  </th>
                  <th className="font-medium py-3 px-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedLists.map((s) => (
                  <tr
                    key={s?.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <div className="text-center sm:text-left max-w-[260px]">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {s?.name?.length > 35
                              ? `${s?.name?.slice(0, 35)}...`
                              : s?.name}
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                            {s?.id?.length > 25
                              ? `${s?.id?.slice(0, 25)}...`
                              : s?.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-center">
                      {s?.course_durartion}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-center">
                      {s?.courseStructure && nameFormate(s?.courseStructure)}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-center uppercase">
                      {s?.marksType && nameFormate(s?.marksType)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-4">
                        <Edit
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => openModalEdit(s)}
                        />

                        <Trash
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => {
                            if (confirm("Delete this course?")) {
                              handleDelete(s._id);
                            }
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default ManageCourses;
