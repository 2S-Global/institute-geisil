import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import API from "../../../lib/axios";
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
import { useToast } from "@/hooks/use-toast";

const FormModal = ({ show, onClose, data = {}, setRefresh }) => {
  const [formData, setFormData] = useState({
    campus_name: "",
    campus_type: "",
    city: "",
    total_students: "",
    id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [err, setErr] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (data?._id) {
      setFormData({
        campus_name: data.campus_name || "",
        campus_type: data.campus_type || "",
        city: data.city || "",
        total_students: data.total_students || "",
        id: data._id || "",
      });
    } else {
      setFormData({
        campus_name: "",
        campus_type: "",
        city: "",
        total_students: "",
        id: "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (show) {
      setErr({});
      setError(null);
      setSuccess(null);
    }
  }, [show]);

  // ✅ Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.campus_name)
      newErrors.campus_name = "Campus Name is required";

    if (!formData.city) newErrors.city = "City is required";

    if (!formData.campus_type)
      newErrors.campus_type = "Campus Type is required";

   if (!formData.total_students) {
     newErrors.total_students = "Total Students is required";
   } else if (Number(formData.total_students) <= 0) {
     newErrors.total_students = "Total Students must be greater than 0";
   }

    

    return newErrors;
  };

  
  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErr((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErr(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const sendformData = new FormData();

      

      // ✅ FIXED FIELD NAMES
      sendformData.append("campus_name", formData.campus_name);
      sendformData.append("campus_type", formData.campus_type);
      sendformData.append("city", formData.city);
      sendformData.append("total_students", formData.total_students);

      try {
        let response;

        if (data?._id) {
          response = await API.put(`/api/campus/${formData.id}`, sendformData);
        } else {
          response = await API.post(`/api/campus`, sendformData);
        }

        setSuccess(response.data.message);
        toast({
          title: "Success",
          description: response.data.message,
        });
        setRefresh((p) => p + 1);
        onClose();
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
        toast({
          title: "Error",
          variant: "destructive",
          description: "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }
  };
  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data?._id ? "Edit Campus" : "Add Campus"}</DialogTitle>

          <DialogDescription>
            Manage campus details and student strength.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campus Name */}
            <div className="space-y-1.5">
              <Label>
                Campus Name <span className="text-destructive">*</span>
              </Label>

              <Input
                name="campus_name"
                value={formData.campus_name}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
              />

              {err?.campus_name && (
                <p className="text-xs text-destructive">{err.campus_name}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label>
                City <span className="text-destructive">*</span>
              </Label>

              <Input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
              />

              {err?.city && (
                <p className="text-xs text-destructive">{err.city}</p>
              )}
            </div>

            {/* Campus Type */}
            <div className="space-y-1.5">
              <Label>
                Campus Type <span className="text-destructive">*</span>
              </Label>

              <Input
                name="campus_type"
                value={formData.campus_type}
                onChange={handleChange}
                placeholder="e.g. Main Campus"
              />

              {err?.campus_type && (
                <p className="text-xs text-destructive">{err.campus_type}</p>
              )}
            </div>

            {/* Total Students */}
            <div className="space-y-1.5">
              <Label>
                Total Students <span className="text-destructive">*</span>
              </Label>

              <Input
                type="number"
                name="total_students"
                value={formData.total_students}
                onChange={handleChange}
                placeholder="e.g. 3200"
              />

              {err?.total_students && (
                <p className="text-xs text-destructive">{err.total_students}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
            >
              {loading ? "Saving..." : data?._id ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
