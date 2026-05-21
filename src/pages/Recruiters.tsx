import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  ExternalLink,
  Mail,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  User,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Copy,
} from "lucide-react";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import API from "../lib/axios";
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
import FormModal from "@/components/institute/Recruiters/FormModal";
import { useSidebar } from "@/components/ui/sidebar"

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
  openings: z.coerce.number().int().min(0).max(10000),
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
const ITEMS_PER_PAGE = 9;

const Recruiters = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [recruiters, setRecruiters] = useState([]);
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecruiterForm, string>>
  >({});
  const [contact, setContact] = useState<Recruiter | null>(null);

  const [edit, setEdit] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const {toggleSidebarOpen}=useSidebar()

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


 const closeModalRH = () => {
    setEdit({});
    setIsModalOpen(false);
    //document.body.style.overflow = "auto";
  };

    const openModalEdit = (row) => {
    setEdit(row);
    setIsModalOpen(true);
    //document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const copy = async (value: string, label: string) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);

      toast({
        title: `${label} copied`,
        description: value,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = recruiterSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RecruiterForm, string>> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof RecruiterForm;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    /*     setRecruiters((prev) => [
      {
        name: result.data.name,
        sector: result.data.sector,
        openings: result.data.openings,
        hired: 0,
        rating: 0,
        status: result.data.status,
      },
      ...prev,
    ]); */
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
    };
    let response = "";
    try {
      response = await API({
        method: "post",
        url: "/api/instituteprofile/add_company",
        data: payload,
      });
      toast({
        title: "Recruiter added",
        description: "Recruiter saved successfully",
      });
      await fetchRecruiterList();
      setForm(emptyForm);
      setOpen(false);
    } catch (err) {
      toast({
        title: "Failed",
        description: "This email already exists",
      });
    }
  };

  const fetchRecruiterList = async () => {
    try {
      const res = await API.get(
        "/api/instituteprofile/get_all_companies_by_institute",
      );
      const data = res?.data?.data || [];
      setRecruiters(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchRecruiterList();
  }, [recruiters.length,refresh]);

  const totalPages = Math.ceil(recruiters.length / ITEMS_PER_PAGE);

  // Current page data
  const paginatedRecruiters = recruiters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const generatePagination = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Left dots
    if (currentPage > 3) {
      pages.push("...");
    }

    // Middle pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    // Right dots
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    return pages;
    //return [...new Set(pages)];
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Recruiters"
        description="Manage hiring partners, open positions and engagement across sectors."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                <Plus className="h-4 w-4" /> Add recruiter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  Add new recruiter
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
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
                  >
                    Add recruiter
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Active Recruiters"
          value={String(recruiters.length)}
          delta={8}
          icon={Briefcase}
          tint="primary"
        />
        <StatCard
          label="Open Positions"
          value="612"
          delta={14}
          icon={Building2}
          tint="accent"
        />
        <StatCard
          label="Hires (MTD)"
          value="248"
          delta={11}
          icon={Users}
          tint="success"
        />
        <StatCard
          label="Conversion"
          value="41.2%"
          delta={3}
          icon={TrendingUp}
          tint="warning"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedRecruiters?.map((r, i) => (
          <Card
            key={r?.companyName + i}
            className="shadow-sm hover:shadow-md transition-shadow border-border/60"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11 border">
                  <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                    {r?.companyName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">
                    {r?.companyName}
                  </CardTitle>
                  <CardDescription>{r.sector}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={statusStyles[r?.status]}>
                {r.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Openings</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.openings}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hired</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.hired}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-display text-xl font-bold text-foreground">
                    {r.rating}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
              
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {setContact(r)}}
                >
                  
                  <Mail className="h-3.5 w-3.5" /> Contact
                </Button>
               
                  <Link
                    to={`/institute/recruiters/${r?._id}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-primary flex-1 gap-1"
                    >
                      View <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                   
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() =>{openModalEdit(r)}}
                >
                  <Mail className="h-3.5 w-3.5" /> Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Numbers */}
            {generatePagination().map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="px-2 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <button
                  key={`${page}-${index}`}
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-[36px] rounded-lg border px-3 text-sm transition ${
                    currentPage === page
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <Dialog open={!!contact} onOpenChange={(o) => !o && setContact(null)}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
          {contact && (
            <>
              <div className="h-20 bg-gradient-to-r from-primary to-[hsl(var(--primary-hover))]" />
              <div className="px-6 pb-6 -mt-10">
                <div className="flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-card shadow-md">
                    <AvatarFallback className="bg-primary-soft text-primary font-display font-bold text-2xl">
                      {contact.companyName
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 pb-1">
                    <DialogHeader className="text-left space-y-0">
                      <DialogTitle className="font-display text-xl truncate">
                        {contact.companyName}
                      </DialogTitle>
                      <DialogDescription className="text-xs">
                        {contact.sector}
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusStyles[contact.status]}
                  >
                    {contact.status}
                  </Badge>
                </div>

                <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-soft flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">
                        {contact.primaryContact}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.role}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  {[
                    {
                      icon: Mail,
                      label: "Email",
                      value: contact.email,
                      copyable: true,
                    },
                    {
                      icon: Phone,
                      label: "Phone",
                      value: contact.phone,
                      copyable: true,
                    },
                    {
                      icon: Globe,
                      label: "Website",
                      value: contact.website,
                      copyable: true,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors group"
                    >
                      <row.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {row.label}
                        </p>
                        <p className="text-sm text-foreground truncate">
                          {row.value}
                        </p>
                      </div>
                      {row.copyable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copy(row.value, row.label)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <DialogFooter className="mt-5 gap-2 sm:gap-2">
                  <Button variant="outline" className="gap-2 flex-1" asChild>
                    <a href={`mailto:${contact.email}`}>
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </Button>
                  <Button
                    className="gap-2 flex-1 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
                    asChild
                  >
                    <Link
                      to={`/institute/recruiters/${encodeURIComponent(contact.companyName.toLowerCase().replace(/\s+/g, "-"))}`}
                    >
                      <MessageSquare className="h-4 w-4" /> Open profile
                    </Link>
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
       <FormModal
        show={isModalOpen}
        onClose={closeModalRH}
        data={edit}
        setRefresh={setRefresh}
      />
    </DashboardLayout>
  );
};

export default Recruiters;
