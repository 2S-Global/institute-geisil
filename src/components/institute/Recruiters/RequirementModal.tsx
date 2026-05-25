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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

const sectors = [
  "IT Services",
  "Consulting",
  "Banking",
  "Manufacturing",
  "Healthcare",
  "E-commerce",
  "Education",
  "Other",
];

const recruiterSchema = z.object({
  numberOfHired: z.string().trim().min(2, "Hired is required"),
  numberOfOpenings: z.string().trim().min(2, "Opening is required"),
  
});

type RecruiterForm = z.infer<typeof recruiterSchema>;

const emptyForm: RecruiterForm = {
  numberOfHired: "",
  numberOfOpenings: ""
};

const FormModal = ({ show, onClose, data = {},recruiterID=null, setRefresh }) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecruiterForm, string>>
  >({});
  //const [contact, setContact] = useState<Recruiter | null>(null);

   const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();


  useEffect(()=>{
      if (show && data?._id) {
          setForm({
            numberOfHired:data?.numberOfHired||'' ,
            numberOfOpenings: data?.numberOfOpenings||''
          })
      }

  },[show && data?._id])

  const update = <K extends keyof RecruiterForm>(
    key: K,
    value: RecruiterForm[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    // Remove error message while typing
    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  // ✅ Submit
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        
    const result = recruiterSchema.safeParse(form);
    console.log('result',result)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RecruiterForm, string>> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof RecruiterForm;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      console.log("fieldErrors",fieldErrors)
      return;
    }
    setErrors({});
   
    const payload = {
      numberOfHired: result.data.numberOfHired,
      numberOfOpenings: result.data.numberOfOpenings,
      companyName:recruiterID
    };

   
    let response = "";
    try {
      response = await API({
        method: "post",
        url: "/api/instituteprofile/add_company_requirement",
        data: payload,
      });
      onClose();
      setRefresh((p)=>p+1)
      toast({
        title: "Success",
        description: "Requirement save successfully",
      });
      //await fetchRecruiterList();
      setForm(emptyForm);
    } catch (err) {
       if (err.response) {
          toast({
            title: "Error",
            description: `${err.response.data.message || "Something went wrong"}`,
          });
        
        }
    }
  };
  if (!show) return null;

  return (
   <Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="font-display text-2xl">
        {data?._id ? "Requirement Job" : "Requirement Job"}
      </DialogTitle>

      <DialogDescription>
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="grid gap-4 md:grid-cols-2">

                  <div className="space-y-1.5">
                    <Label htmlFor="numberOfOpenings">Openings *</Label>

                    <Input
                      id="numberOfOpenings"
                      value={form.numberOfOpenings}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                          update("numberOfOpenings", value);
                        }
                      }}
                      placeholder="Openings"
                    />

                    {errors.numberOfOpenings && (
                      <p className="text-xs text-destructive">
                        {errors.numberOfOpenings}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Hired *</Label>
                    <Input
                      id="numberOfHired"
                      type="text"
                      value={form.numberOfHired}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value)) {
                          update("numberOfHired", value);
                        }
                      }}
                      placeholder="Hired"
                    />
                    {errors.numberOfHired && (
                      <p className="text-xs text-destructive">{errors.numberOfHired}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="notes">Remarks</Label>
                    <Textarea
                      id="remarks"
                      value={form.remarks}
                      onChange={(e) => update("remarks", e.target.value)}
                      placeholder="remarks"
                      maxLength={500}
                      rows={3}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
  </DialogContent>
   </Dialog>
  );
};

export default FormModal;
