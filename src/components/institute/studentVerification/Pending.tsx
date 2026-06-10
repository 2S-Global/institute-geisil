import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/axios";
import { Filter, Plus, Search, Edit, Trash ,Eye} from "lucide-react";
import Modal from "./Modal"
import { Button } from "@/components/ui/button"
const Pending = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  
  const [loading, setLoading] = useState(true);
  const [candidatesData, setCandidatesData] = useState([]);

  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(1);

  const [can_id, setCanId] = useState(null);
  const [employmentId, setEmploymentId] = useState(null);
  const [token, setToken] = useState(null);

  const [search, setSearch] = useState("");

  const apiurl = import.meta.env.VITE_API_URL;
  const [status, setStatus] = useState(null);
  const itemsPerPage = 2; // change as needed




  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("Institute_token"));
    }
  }, []);


  const { toast } = useToast();

  // ✅ Get token
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);


      const fetchCandidates = async () => {
        setLoading(true);
        try {
          const response = await api.get(
            `/api/institutestudent/get_students_by_status`,
            {
          params: {
            status: "unverified",
          },
         
        }
            
          );

          if (response.data.success) {
            setCandidatesData(response.data.data);
          }
        } catch (error) {
          setError("Failed to fetch candidates");
        } finally {
          setLoading(false);
        }
      };

  // ✅ Fetch data
useEffect(() => {
  if (token) fetchCandidates();
}, [token,error,success]);

  // ✅ Search filter
  const filteredData = candidatesData.filter((item) => {
    const text = query.toLowerCase();

    return (
      item.name?.toLowerCase().includes(text) ||
      item.email?.toLowerCase().includes(text) ||
      item.details?.toLowerCase().includes(text) 
    );
  });


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

const totalPages = Math.ceil(filteredData.length / itemsPerPage);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(1);
  }
}, [filteredData, totalPages]);

  
  // ✅ Modal
  const openModalRH = (id, empId, statusValue) => {
    console.log('kkk uuu',id, empId, statusValue)
    setIsModalOpen(true);
    setCanId(id);
    setEmploymentId(empId);
    setStatus(statusValue); // ✅ store status
    document.body.style.overflow = "hidden";
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const getPageNumbers = () => {
    const pages = [];
    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  };


  const statusName={
    "verified":"Verified",
    "unverified":"Pending",
    "rejected":"Rejected",
  }

  return (
    <>
     <Card className="shadow-sm border-border/60 w-full">
  <CardContent className="p-3 sm:p-4 md:p-6">
    
    {/* Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
      <div className="text-base font-semibold">Pending Students</div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student…"
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
          {currentItems.map((s, i) => (
            <tr
              key={s?.id}
              className="hover:bg-muted/30 transition-colors  group"
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
                     s?.status === "verified"
                      ? "bg-green-100 text-green-700"
                      :  s?.status === "unverified"?"bg-orange-100 text-orange-700":"bg-red-100 text-red-700"
                  }`}
                >
                  {statusName[s?.status]}
                </span>
              </td>

              {/* Actions */}
              <td className="py-3 px-3">
                <div className="flex items-center justify-center gap-3">
                  <Eye
                    className="h-4 w-4 cursor-pointer hover:text-primary"
                   /*  onClick={() => openModalEdit(s)} */
                    onClick={() =>
                          openModalRH(
                            s.userId,
                            s.employmentId,
                            s.status,
                          )
                        }
                  />

                
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
  {totalPages > 1 && (
  <div className="flex items-center justify-between mt-4">
    <p className="text-sm text-muted-foreground">
      Page {currentPage} of {totalPages}
    </p>

    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        Previous
      </Button>

      {getPageNumbers().map((page) => (
        <Button
          key={page}
          size="sm"
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  </div>
)}
  </CardContent>
</Card>

 {/* ✅ Modal */}
      {isModalOpen && (
        <Modal
          show={isModalOpen}
          onClose={closeModalRH}
          can_id={can_id}
          emp_id={employmentId}
          is_complete={status?.toLowerCase() !== "unverified"}
          refreshList={fetchCandidates} // ✅ ADD THIS
            setSuccess={setSuccess}
          setError={setError}
           setErrorId={setErrorId}
          setMessageId={setMessageId}
        />
      )}
    </>
  );
};

export default Pending;
