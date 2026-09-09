import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  IndianRupee,
  TrendingUp,
  Users,
  Download,
  Plus,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { z } from "zod";
import ReactSelect from "react-select";
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
import RecruitersCard from "@/components/institute/Placements/RecruitersCard";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  student: string;
  company: string;
  role: string;
  ctc: string;
  location: string;
  status: "Accepted" | "Pending" | "Negotiating";
}

const trend = [
  { month: "Nov", offers: 124, accepted: 98 },
  { month: "Dec", offers: 168, accepted: 142 },
  { month: "Jan", offers: 198, accepted: 168 },
  { month: "Feb", offers: 234, accepted: 201 },
  { month: "Mar", offers: 286, accepted: 248 },
  { month: "Apr", offers: 322, accepted: 281 },
];

const initialOffers: Offer[] = [
  {
    student: "Priya Menon",
    company: "Google India",
    role: "SWE I",
    ctc: "32 LPA",
    location: "Bengaluru",
    status: "Accepted",
  },
  {
    student: "Rohan Verma",
    company: "Goldman Sachs",
    role: "Analyst",
    ctc: "24 LPA",
    location: "Mumbai",
    status: "Accepted",
  },
  {
    student: "Aisha Khan",
    company: "Microsoft",
    role: "Data Scientist",
    ctc: "28 LPA",
    location: "Hyderabad",
    status: "Pending",
  },
  {
    student: "Karthik Iyer",
    company: "Qualcomm",
    role: "Hardware Eng.",
    ctc: "22 LPA",
    location: "Bengaluru",
    status: "Accepted",
  },
  {
    student: "Neha Gupta",
    company: "Deloitte",
    role: "Consultant",
    ctc: "14 LPA",
    location: "Gurugram",
    status: "Negotiating",
  },
];

const offerSchema = z.object({
  student: z.string().trim().min(2, "Student name is required").max(80),
  company: z.string().trim().min(2, "Company name is required").max(80),
  role: z.string().trim().min(1, "Role is required").max(80),
  ctc: z.string().trim().min(1, "CTC is required").max(20),
  location: z.string().trim().min(1, "Location is required").max(40),
  status: z.enum(["Accepted", "Pending", "Negotiating"]),
});

type OfferForm = z.infer<typeof offerSchema>;

const emptyForm: OfferForm = {
  student: "",
  company: "",
  role: "",
  ctc: "",
  location: "",
  status: "Pending",
};

const companyOptions = [
  { value: "Google India", label: "Google India" },
  { value: "Microsoft", label: "Microsoft" },
  { value: "Amazon", label: "Amazon" },
  { value: "Flipkart", label: "Flipkart" },
  { value: "Atlassian", label: "Atlassian" },
  { value: "Adobe", label: "Adobe" },
  { value: "Goldman Sachs", label: "Goldman Sachs" },
];

const studentOptions = [
  { value: "Priya Menon", label: "Priya Menon" },
  { value: "Aarav Sharma", label: "Aarav Sharma" },
  { value: "Neha Patel", label: "Neha Patel" },
  { value: "Rohan Gupta", label: "Rohan Gupta" },
  { value: "Ananya Iyer", label: "Ananya Iyer" },
  { value: "Kabir Verma", label: "Kabir Verma" },
];

const Placements = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState(initialOffers);
  const [form, setForm] = useState<OfferForm>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof OfferForm, string>>
  >({});

  const update = <K extends keyof OfferForm>(key: K, value: OfferForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = offerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OfferForm, string>> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof OfferForm;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setOffers((prev) => [
      {
        student: result.data.student,
        company: result.data.company,
        role: result.data.role,
        ctc: result.data.ctc,
        location: result.data.location,
        status: result.data.status,
      },
      ...prev,
    ]);
    toast({
      title: "Offer logged",
      description: `${result.data.student} • ${result.data.company}`,
    });
    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Placements"
        description="Track offers extended, accepted and overall placement performance."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                  <Plus className="h-4 w-4" /> Log offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    Log new offer
                  </DialogTitle>
                  <DialogDescription>
                    Record a placement offer extended to a student.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="company">Company *</Label>
                      <ReactSelect
                        isCreatable={false}
                        isClearable
                        options={companyOptions}
                        value={
                          companyOptions.find(
                            (opt) => opt.value === form.company,
                          ) ||
                          (form.company
                            ? { label: form.company, value: form.company }
                            : null)
                        }
                        onChange={(selected) =>
                          update("company", selected ? selected.value : "")
                        }
                        onInputChange={(inputValue, { action }) => {
                          if (
                            action === "input-change" &&
                            !companyOptions.some(
                              (o) =>
                                o.value.toLowerCase() ===
                                inputValue.toLowerCase(),
                            )
                          ) {
                            update("company", inputValue);
                          }
                        }}
                        placeholder="Select or type company..."
                        classNamePrefix="react-select"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "hsl(var(--background))",
                            borderColor: errors.company
                              ? "hsl(var(--destructive))"
                              : state.isFocused
                                ? "hsl(var(--ring))"
                                : "hsl(var(--input))",
                            borderRadius: "calc(var(--radius) - 2px)",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: errors.company
                                ? "hsl(var(--destructive))"
                                : "hsl(var(--ring))",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "calc(var(--radius) - 2px)",
                            zIndex: 50,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#0D214A"
                              : state.isFocused
                                ? "#0D214A"
                                : "transparent",
                            color:
                              state.isSelected || state.isFocused
                                ? "#ffffff"
                                : "hsl(var(--foreground))",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#0D214A",
                              color: "#ffffff",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "hsl(var(--foreground))",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "hsl(var(--foreground))",
                          }),
                        }}
                      />
                      {errors.company && (
                        <p className="text-xs text-destructive">
                          {errors.company}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="student">Student name *</Label>
                      <ReactSelect
                        isClearable
                        options={studentOptions}
                        value={
                          studentOptions.find(
                            (opt) => opt.value === form.student,
                          ) ||
                          (form.student
                            ? { label: form.student, value: form.student }
                            : null)
                        }
                        onChange={(selected) =>
                          update("student", selected ? selected.value : "")
                        }
                        onInputChange={(inputValue, { action }) => {
                          if (
                            action === "input-change" &&
                            !studentOptions.some(
                              (o) =>
                                o.value.toLowerCase() ===
                                inputValue.toLowerCase(),
                            )
                          ) {
                            update("student", inputValue);
                          }
                        }}
                        placeholder="Select or type student..."
                        classNamePrefix="react-select"
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            backgroundColor: "hsl(var(--background))",
                            borderColor: errors.student
                              ? "hsl(var(--destructive))"
                              : state.isFocused
                                ? "hsl(var(--ring))"
                                : "hsl(var(--input))",
                            borderRadius: "calc(var(--radius) - 2px)",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: errors.student
                                ? "hsl(var(--destructive))"
                                : "hsl(var(--ring))",
                            },
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "calc(var(--radius) - 2px)",
                            zIndex: 50,
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected
                              ? "#0D214A"
                              : state.isFocused
                                ? "#0D214A"
                                : "transparent",
                            color:
                              state.isSelected || state.isFocused
                                ? "#ffffff"
                                : "hsl(var(--foreground))",
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#0D214A",
                              color: "#ffffff",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "hsl(var(--foreground))",
                          }),
                          input: (base) => ({
                            ...base,
                            color: "hsl(var(--foreground))",
                          }),
                        }}
                      />
                      {errors.student && (
                        <p className="text-xs text-destructive">
                          {errors.student}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="role">Role *</Label>
                      <Input
                        id="role"
                        value={form.role}
                        onChange={(e) => update("role", e.target.value)}
                        placeholder="e.g. SWE I"
                        maxLength={80}
                      />
                      {errors.role && (
                        <p className="text-xs text-destructive">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ctc">CTC *</Label>
                      <Input
                        id="ctc"
                        value={form.ctc}
                        onChange={(e) => update("ctc", e.target.value)}
                        placeholder="e.g. 32 LPA"
                        maxLength={20}
                      />
                      {errors.ctc && (
                        <p className="text-xs text-destructive">{errors.ctc}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        placeholder="e.g. Bengaluru"
                        maxLength={40}
                      />
                      {errors.location && (
                        <p className="text-xs text-destructive">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Status *</Label>
                      <ShadcnSelect
                        value={form.status}
                        onValueChange={(v) =>
                          update("status", v as OfferForm["status"])
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Accepted">Offered</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Negotiating">Rejected</SelectItem>
                        </SelectContent>
                      </ShadcnSelect>
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
                      Log offer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard
          label="Offers Extended"
          value="1,438"
          delta={16}
          icon={Building2}
          tint="primary"
        />
        <StatCard
          label="Offers Accepted"
          value="1,182"
          delta={11}
          icon={Users}
          tint="success"
        />
        <StatCard
          label="Avg. CTC"
          value="₹ 9.4 LPA"
          delta={7}
          icon={IndianRupee}
          tint="accent"
        />
        <StatCard
          label="Placement Rate"
          value="86.4%"
          delta={-2}
          icon={TrendingUp}
          tint="warning"
        />
      </div>

      <Card className="shadow-sm border-border/60 mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-display">
            Offers vs Acceptances
          </CardTitle>
          <CardDescription>Six-month rolling trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trend}
                margin={{ top: 5, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ofGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--accent))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--accent))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="acGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="offers"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  fill="url(#ofGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="accepted"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#acGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-sm border-border/60 mb-6">
        <CardContent>
          <RecruitersCard />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Placements;
