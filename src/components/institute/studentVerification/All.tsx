import { useState, useEffect } from "react";
import { nameFormate } from "../../../lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Filter, Plus, Search, Edit, Trash } from "lucide-react";
const StudentVerification = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [list, setList] = useState([]);
  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const itemsPerPage = 10;
  const filtered = list?.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLists = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fetchList = async () => {
    try {
      const res = await api.get("/api/institutestudent/get_students_by_status");
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

  const { toast } = useToast();

  return (
    <>
     <Card className="shadow-sm border-border/60 w-full">
  <CardContent className="p-3 sm:p-4 md:p-6">
    
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div className="text-base font-semibold">All Students</div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search course…"
            className="pl-9 w-full md:w-72"
          />
        </div>
      </div>
    </div>

    {/* Table */}
    <div className="w-full overflow-x-auto rounded-md border border-border/50">
      <table className="min-w-[750px] w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60 whitespace-nowrap">
            <th className="font-medium py-3 px-3">#</th>
            <th className="font-medium py-3 px-3">Image</th>
            <th className="font-medium py-3 px-3">Name</th>
            <th className="font-medium py-3 px-3">Email</th>
            <th className="font-medium py-3 px-3">Details</th>
            <th className="font-medium py-3 px-3">Status</th>
            <th className="font-medium py-3 px-3 text-center">View</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/60">
          {paginatedLists.map((s, i) => (
            <tr
              key={s?.id}
              className="hover:bg-muted/30 transition-colors cursor-pointer group"
            >
              <td className="py-3 px-3 whitespace-nowrap">
                {i + 1}
              </td>

              {/* Image */}
              <td className="py-3 px-3 whitespace-nowrap">
                {s?.photo ? (
                  <img
                    src={s.photo}
                    alt='photo'
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs">
                    N/A
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="py-3 px-3 font-medium whitespace-nowrap">
                {s?.name}
              </td>

              {/* Email */}
              <td className="py-3 px-3 text-muted-foreground break-all">
                {s?.email}
              </td>

              {/* Details */}
              <td className="py-3 px-3 text-muted-foreground  truncate">
                {s?.details}
              </td>

              {/* Status */}
              <td className="py-3 px-3 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    s?.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {s?.status}
                </span>
              </td>

              {/* Actions */}
              <td className="py-3 px-3">
                <div className="flex items-center justify-center gap-3">
                  <Edit
                    className="h-4 w-4 cursor-pointer hover:text-primary"
                    onClick={() => openModalEdit(s)}
                  />

                  <Trash
                    className="h-4 w-4 cursor-pointer hover:text-red-500"
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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
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
    </>
  );
};

export default StudentVerification;
