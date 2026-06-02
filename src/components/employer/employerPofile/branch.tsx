import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import API from "../../../lib/axios";
import { YMD } from "../../../lib/utils";
import { PencilLine, Trash2 } from "lucide-react";
import Select from "react-select";
import LogoCoverUploader from "./LogoCoverUploader";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import BranchModal from "./BranchModal";
import Swal from "sweetalert2"
const BranchBox = () => {
  const { toast } = useToast();

 const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [errorId, setErrorId] = useState(null);
  const [message_id, setMessageId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const apiurl = "";
  const token = localStorage.getItem("employer_token");
  const [Branch, setBranch] = useState([]);
  const [edititem, setEditItem] = useState({});

  useEffect(() => {
    fetchbranch();
  }, []);

  useEffect(() => {
    if (refresh) {
      fetchbranch();
      setRefresh(false);
    }
  }, [refresh]);

  const fetchbranch = async () => {
    const response = await API.get(
      `/api/companyprofile/get_branches`
    );
    if (response.data.success) {
      setBranch(response.data.data);
    }
  };

  const HandelDelete = async (id) => {
    // Confirm before deleting
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This branch will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    // If user cancels, just return
    if (!result.isConfirmed) return;

    setLoading(true);
    setError(null);
    setErrorId(null);
    setSuccess(null);
    setMessageId(null);

    try {
      const response = await API.delete(
        `/api/companyprofile/delete_branch`,
        {
          data: { id }, // ✅ Correct way to send body with DELETE
        }
      );

      if (response.data.success) {
        setRefresh(true);
        setSuccess(response.data.message);
        setMessageId(Date.now());

        // Show success alert
        Swal.fire({
          title: "Deleted!",
          text: "Branch deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        setError(response.data.message);
        setErrorId(Date.now());
      }
    } catch (error) {
      console.error("Error deleting branch:", error);
      setError("An error occurred while deleting the branch.");
      setErrorId(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const openModalRH = (skill = {}) => {
    setIsModalOpen(true);
    setEditItem(skill);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModalRH = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  return (
<>
 {/*  <MessageComponent
    error={error}
    success={success}
    errorId={errorId}
    message_id={message_id}
  /> */}

{/*   {loading && (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
      style={{ zIndex: 1050 }}
    >
    
    </div>
  )} */}

  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <div>
    {/*   <h4 className="text-xl font-semibold">Branch Information</h4>
      <p className="text-sm text-muted-foreground">
        Manage your branch details and locations
      </p> */}
    </div>

    <Button
      type="button"
      onClick={openModalRH}
      className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground"
    >
      Add Details
    </Button>
  </div>

  {/* Table/Card Container */}
  <div className="rounded-lg border border-border bg-background overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium">
              S.No
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Branch Details
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Location
            </th>

            <th className="px-4 py-3 text-left text-sm font-medium">
              Full Address
            </th>

            <th className="px-4 py-3 text-center text-sm font-medium">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {Branch.map((skill, index) => (
            <tr
              key={index}
              className="border-b last:border-0 hover:bg-muted/30 transition-colors"
            >
              {/* Serial Number */}
              <td className="px-4 py-4 align-middle font-medium">
                {index + 1}
              </td>

              {/* Branch Info */}
              <td className="px-4 py-4 align-middle">
                <div className="space-y-1">
                  <div className="font-semibold text-foreground">
                    {skill.name || "-"}
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <i className="la la-envelope"></i>
                    {skill.email || "-"}
                  </div>

                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <i className="la la-phone"></i>
                    {skill.phone || "-"}
                  </div>
                </div>
              </td>

              {/* Location */}
              <td className="px-4 py-4 align-middle">
                <div className="flex flex-col gap-2">
                  <span className="inline-flex w-fit rounded-md border px-2 py-1 text-xs bg-muted">
                    {skill.country?.name || "-"}
                  </span>

                  <span className="inline-flex w-fit rounded-md border px-2 py-1 text-xs bg-muted">
                    {skill.state?.name || "-"}
                  </span>

                  <span className="inline-flex w-fit rounded-md border px-2 py-1 text-xs bg-muted">
                    {skill.city?.name || "-"}
                  </span>
                </div>
              </td>

              {/* Address */}
              <td
                className="px-4 py-4 align-middle text-sm text-muted-foreground"
                style={{ maxWidth: "250px" }}
              >
                {skill.address || "-"}
              </td>

              {/* Actions */}
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => openModalRH(skill)}
                    className="text-primary hover:opacity-80 transition"
                  >
                    <PencilLine size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => HandelDelete(skill._id)}
                    className="text-red-500 hover:opacity-80 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {Branch.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-muted-foreground"
              >
                No branch information available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Modal */}
  {isModalOpen && (
    <BranchModal
      show={isModalOpen}
      onClose={closeModalRH}
      setError={setError}
      setErrorId={setErrorId}
      setSuccess={setSuccess}
      setMessageId={setMessageId}
      setRefresh={setRefresh}
      item={edititem}
    />
  )}
</>
  );
};

export default BranchBox;
