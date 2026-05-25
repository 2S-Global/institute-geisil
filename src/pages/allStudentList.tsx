import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Link } from "react-router-dom";
import { Filter, Plus, Search, Edit, Trash,ArrowLeft ,Eye} from "lucide-react";
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
import StudentModal from "@/components/student/addModal"
import { useNavigate } from 'react-router-dom';




const statusStyles: Record<string, string> = {
  Placed: "bg-success/10 text-success border-success/20",
  "In Process": "bg-accent/10 text-accent border-accent/20",
  Evaluated: "bg-primary/10 text-primary border-primary/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const AllStudentList = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
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
    s?.name.toLowerCase().includes(query.toLowerCase())||
    String(s?.admissionYear)?.includes(query)||
    String(s?.USN)?.includes(query)||
    String(s?.tenTh)?.includes(query)||
    String(s?.twelveTh)?.includes(query)
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLists = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );



  const fetchList = async () => {
    try {
      const res = await api.get("/api/institutestudent/institute-student-list");
      const data = res?.data?.data || [];
      setList(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };
  useEffect(() => {
   fetchList()
  }, []);
  useEffect(() => {
    if (refresh) {
    window.location.reload();
  }
  }, [refresh]);

 
  return (
    <DashboardLayout>
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/students"><ArrowLeft className="h-4 w-4" /> Back to students</Link>
      </Button>
      <PageHeader
        eyebrow="Workspace"
        title="Student List"
        description=""
        actions=""
      />
      
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
                  placeholder="Search student…"
                  className="pl-9 w-full md:w-72"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[700px] text-sm text-left">
              <thead>
                <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="font-medium py-3 px-4 text-left">
                    Name
                  </th>
                  <th className="font-medium py-3 px-4 text-left">
                    Admission Year
                  </th>
                  <th className="font-medium py-3 px-4 text-left">
                    USN
                  </th>
                  <th className="font-medium py-3 px-4 text-left">
                    Program
                  </th>
                  <th className="font-medium py-3 px-4 text-left">
                    10th(%)
                  </th>
                  <th className="font-medium py-3 px-4 text-left">
                    12th(%)
                  </th>
                  <th className="font-medium py-3 px-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {paginatedLists.map((s) => (
                  <tr
                    key={'allStudent'+s?.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4 text-left">
                      <div className="">
                        <div className="text-left sm:text-left max-w-[260px]">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {s?.name?.length > 35
                              ? `${nameFormate(s?.name?.slice(0, 35))}...`
                              : nameFormate(s?.name)||""}
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                            {s?.id?.length > 25
                              ? `${s?.id?.slice(0, 25)}...`
                              : s?.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-left">
                      {s?.admissionYear||""}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-left">
                      {s?.USN||""}
                    </td>

                    <td className="py-4 px-4 text-muted-foreground text-left ">
                      {s?.programDetails?.name||""}
                    </td>
                     <td className="py-4 px-4 text-muted-foreground text-left ">
                      {s?.tenTh||""}
                    </td>
                     <td className="py-4 px-4 text-muted-foreground text-left ">
                      {s?.twelveTh||""}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex  gap-4">
                        <Edit
                          className="h-4 w-4 cursor-pointer"
                          onClick={() => openModalEdit(()=>s)}
                        />

                         <Eye
                            className="h-4 w-4 cursor-pointer hover:text-primary"
                          onClick={() => {
                            navigate(`/institute/students/${s?._id}`)
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
       <StudentModal open={isModalOpen} setOpen={setIsModalOpen} data={edit} setRefresh={setRefresh}/>
    </DashboardLayout>
  );
};

export default AllStudentList;
