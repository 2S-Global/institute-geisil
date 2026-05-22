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
  name: z.string().trim().min(2, "Company name is required").max(120),
  sector: z.string().min(1, "Select a sector"),
  contactName: z.string().trim().min(2, "Contact name is required").max(80),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email")
    .max(255),
  address: z.string().trim().min(2, "Address is required").max(255),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  openings: z.coerce.number().int().min(0).max(10000).optional(),
  status: z.enum(["Active", "Reviewing", "Closed"]),
  notes: z.string().max(500).optional().or(z.literal("")),
});

type RecruiterForm = z.infer<typeof recruiterSchema>;

const emptyForm: RecruiterForm = {
  name: "",
  sector: "",
  contactName: "",
  email: "",
  address: "",
  phone: "",
  website: "",
  openings: 0,
  status: "Active",
  notes: "",
};

const FormModal = ({ show, onClose, data = {}, setRefresh }) => {
  const apiurl =  import.meta.env.VITE_API_URL;
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecruiterForm, string>>
  >({});
  //const [contact, setContact] = useState<Recruiter | null>(null);

   const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
console.log(data)

  useEffect(()=>{
setForm({
  name:data?.companyName||'' ,
  sector: data?.sector||'',
  contactName: data?.primaryContact||'',
  email: data?.email||'',
  address: data?.address||'',
  phone: data?.phone||'',
  website: data?.website||'',
  status: data?.status||'',
  notes: data?.notes||''
})

  },[data])

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
      companyName: result.data.name,
      sector: result.data.sector,
      primaryContact: result.data.contactName,
      email: result.data.email,
      address: result.data.address,
      phone: result.data.phone,
      website: result.data.website,
      notes: result.data.notes,
      status: result.data.status,
      id:data?._id
    };
    console.log('payload',payload)
    let response = "";
    try {
      response = await API({
        method: "put",
        url: "/api/instituteprofile/update_company_by_institute",
        data: payload,
      });
      onClose();
      setRefresh((p)=>p+1)
      toast({
        title: "Recruiter updated",
        description: "Recruiter updated successfully",
      });
      //await fetchRecruiterList();
      setForm(emptyForm);
    } catch (err) {
      toast({
        title: "Failed",
        description: "This email already exists",
      });
    }
  };
  if (!show) return null;

  return (
   <Dialog open={show} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="font-display text-2xl">
        {data?._id ? "Edit Recruiter" : "Add Recruiter"}
      </DialogTitle>

      <DialogDescription>
         Onboard a hiring partner to start sharing requisitions and
                  tracking placements.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="name">Recruiter name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Acme Technologies Pvt. Ltd."
                      maxLength={120}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Sector *</Label>
                    <Select
                      value={form.sector}
                      onValueChange={(v) => update("sector", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sector && (
                      <p className="text-xs text-destructive">
                        {errors.sector}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Status *</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) =>
                        update("status", v as RecruiterForm["status"])
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Reviewing">Reviewing</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contactName">Contact Person *</Label>

                    <Input
                      id="contactName"
                      value={form.contactName}
                      onChange={(e) => {
                        const value = e.target.value;

                        // Only alphabets and spaces allowed
                        if (/^[A-Za-z\s]*$/.test(value)) {
                          update("contactName", value);
                        }
                      }}
                      placeholder="Full name"
                      maxLength={80}
                    />

                    {errors.contactName && (
                      <p className="text-xs text-destructive">
                        {errors.contactName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="text"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="hr@company.com"
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (/^\d*$/.test(value)) {
                          update("phone", value);
                        }
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
                      placeholder="https://company.com"
                      maxLength={255}
                    />
                  </div>

                  {/*  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="openings">Initial open positions</Label>
                    <Input
                      id="openings"
                      type="number"
                      min={0}
                      value={form.openings}
                      onChange={(e) => update("openings", Number(e.target.value) as never)}
                    />
                    {errors.openings && <p className="text-xs text-destructive">{errors.openings}</p>}
                  </div> */}

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="address">Address </Label>

                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="Enter company address"
                      maxLength={255}
                      rows={3}
                    />
                     {errors.address && (
                      <p className="text-xs text-destructive">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Engagement details, hiring focus, MoU notes…"
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
                    Update Recruiter
                  </Button>
                </DialogFooter>
              </form>
  </DialogContent>
   </Dialog>
  );
};

export default FormModal;
