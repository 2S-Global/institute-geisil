import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Briefcase, Building2, Users, TrendingUp, ExternalLink, Mail } from "lucide-react";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

const initialRecruiters = [
  { name: "Tata Consultancy Services", sector: "IT Services", openings: 42, hired: 28, rating: 4.8, status: "Active" },
  { name: "Infosys Limited", sector: "IT Services", openings: 36, hired: 22, rating: 4.6, status: "Active" },
  { name: "Deloitte India", sector: "Consulting", openings: 18, hired: 14, rating: 4.7, status: "Reviewing" },
  { name: "Wipro Technologies", sector: "IT Services", openings: 24, hired: 19, rating: 4.5, status: "Active" },
  { name: "HDFC Bank", sector: "Banking", openings: 14, hired: 11, rating: 4.4, status: "Closed" },
  { name: "Accenture", sector: "Consulting", openings: 30, hired: 21, rating: 4.6, status: "Active" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

const sectors = ["IT Services", "Consulting", "Banking", "Manufacturing", "Healthcare", "E-commerce", "Education", "Other"];

const recruiterSchema = z.object({
  name: z.string().trim().min(2, "Company name is required").max(120),
  sector: z.string().min(1, "Select a sector"),
  contactName: z.string().trim().min(2, "Contact name is required").max(80),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
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
  phone: "",
  website: "",
  openings: 0,
  status: "Active",
  notes: "",
};

const Recruiters = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [recruiters, setRecruiters] = useState(initialRecruiters);
  const [form, setForm] = useState<RecruiterForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof RecruiterForm, string>>>({});

  const update = <K extends keyof RecruiterForm>(key: K, value: RecruiterForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    setRecruiters((prev) => [
      {
        name: result.data.name,
        sector: result.data.sector,
        openings: result.data.openings,
        hired: 0,
        rating: 0,
        status: result.data.status,
      },
      ...prev,
    ]);
    toast({ title: "Recruiter added", description: `${result.data.name} has been added to your partners.` });
    setForm(emptyForm);
    setOpen(false);
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
                <DialogTitle className="font-display text-2xl">Add new recruiter</DialogTitle>
                <DialogDescription>
                  Onboard a hiring partner to start sharing requisitions and tracking placements.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="name">Company name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Acme Technologies Pvt. Ltd."
                      maxLength={120}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Sector *</Label>
                    <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.sector && <p className="text-xs text-destructive">{errors.sector}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Status *</Label>
                    <Select
                      value={form.status}
                      onValueChange={(v) => update("status", v as RecruiterForm["status"])}
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
                    <Label htmlFor="contactName">Primary contact *</Label>
                    <Input
                      id="contactName"
                      value={form.contactName}
                      onChange={(e) => update("contactName", e.target.value)}
                      placeholder="Full name"
                      maxLength={80}
                    />
                    {errors.contactName && <p className="text-xs text-destructive">{errors.contactName}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="hr@company.com"
                      maxLength={255}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      maxLength={20}
                    />
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

                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="openings">Initial open positions</Label>
                    <Input
                      id="openings"
                      type="number"
                      min={0}
                      value={form.openings}
                      onChange={(e) => update("openings", Number(e.target.value) as never)}
                    />
                    {errors.openings && <p className="text-xs text-destructive">{errors.openings}</p>}
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
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
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
        <StatCard label="Active Recruiters" value={String(180 + recruiters.length - initialRecruiters.length + 4)} delta={8} icon={Briefcase} tint="primary" />
        <StatCard label="Open Positions" value="612" delta={14} icon={Building2} tint="accent" />
        <StatCard label="Hires (MTD)" value="248" delta={11} icon={Users} tint="success" />
        <StatCard label="Conversion" value="41.2%" delta={3} icon={TrendingUp} tint="warning" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recruiters.map((r) => (
          <Card key={r.name} className="shadow-sm hover:shadow-md transition-shadow border-border/60">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-11 w-11 border">
                  <AvatarFallback className="bg-primary-soft text-primary font-semibold">
                    {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="text-base truncate">{r.name}</CardTitle>
                  <CardDescription>{r.sector}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={statusStyles[r.status]}>{r.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Openings</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.openings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hired</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.hired}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-display text-xl font-bold text-foreground">{r.rating}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1.5"><Mail className="h-3.5 w-3.5" /> Contact</Button>
                <Button asChild variant="ghost" size="sm" className="text-primary gap-1">
                  <Link to={`/institute/recruiters/${encodeURIComponent(r.name.toLowerCase().replace(/\s+/g, "-"))}`}>
                    View <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Recruiters;
