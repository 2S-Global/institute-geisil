import { useState, useEffect } from "react";
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
import API from "@/lib/axios";
import { useCompanyStore } from "@/components/institute/Placements/RecruitersStore";
import { useRefresh } from "@/components/common/Refresh";

interface Offer {
  student: string;
  company: string;
  role: string;
  ctc: string;
  location: string;
  offerDate?: string;
  status: "Offered" | "Pending" | "Rejected";
}

const trend = [
  { month: "Nov", offers: 124, accepted: 98 },
  { month: "Dec", offers: 168, accepted: 142 },
  { month: "Jan", offers: 198, accepted: 168 },
  { month: "Feb", offers: 234, accepted: 201 },
  { month: "Mar", offers: 286, accepted: 248 },
  { month: "Apr", offers: 322, accepted: 281 },
];

const offerSchema = z
  .object({
    student: z.string().trim().min(2, "Student name is required").max(80),

    company: z.string().trim().min(2, "Company name is required").max(80),

    role: z.string().trim().min(1, "Role is required").max(80),

    ctc: z.string().trim().min(1, "CTC is required").max(20),

    location: z.string().trim().min(1, "Location is required").max(40),

    // Offer date is optional by default.
    // It becomes required only when status is "Offered".
    offerDate: z.string().trim().optional(),

    status: z.string().trim().min(1, "status is required").max(80),
  })
  .superRefine((data, ctx) => {
    if (data.status === "Offered" && !data.offerDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["offerDate"],
        message: "Offer date is required when status is Offered",
      });
    }
  });

type OfferForm = z.infer<typeof offerSchema>;

const emptyForm: OfferForm = {
  student: "",
  company: "",
  role: "",
  ctc: "",
  location: "",
  offerDate: "",
  status: "Pending",
};

type CompanyOption = {
  value: string;
  label: string;
  id?: string;
  companyRequirementId?: string;
};

const Placements = () => {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<OfferForm>(emptyForm);

  const [errors, setErrors] = useState<
    Partial<Record<keyof OfferForm, string>>
  >({});

  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [placementsGraph, setPlacementsGraph] = useState();
  const [statistics, Setstatistics] = useState();

  const [studentOptions, setStudentOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const [selectedCompanyData, setSelectedCompanyData] =
    useState<CompanyOption | null>(null);

  const getSelectedCompany = useCompanyStore((state) => state.getItem);
  const triggerRefresh = useRefresh((state) => state.triggerRefresh);
  const getSelecteCompany = getSelectedCompany() || "";

  /*
   * Clear only one field's error.
   * Existing form update logic remains unchanged.
   */
  const clearError = (field: keyof OfferForm) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;

      return {
        ...prev,
        [field]: undefined,
      };
    });
  };

  // 1. Fetch Companies for Dropdown
  useEffect(() => {
    let mounted = true;

    const fetchRecruiterList = async () => {
      try {
        const res = await API.get(
          "/api/instituteprofile/get_all_companies_by_institute_placement",
        );

        if (!mounted) return;

        const rawData = res?.data?.data || [];

        const mappedCompanies: CompanyOption[] = rawData.map((item: any) => ({
          value: item?._id,
          label: item?.companyName,
          companyRequirementId: item?.latestRequirement?._id,
        }));

        setCompanyOptions(mappedCompanies);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
      }
    };

    fetchRecruiterList();

    return () => {
      mounted = false;
    };
  }, []);

  // 1. Fetch placements graph
  useEffect(() => {
    let mounted = true;

    const fetchRecruiterList = async () => {
      try {
        const res = await API.get("/api/instituteprofile/placements-graph");

        if (!mounted) return;

        const rawData = res?.data?.data || [];

        setPlacementsGraph(rawData);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
      }
    };

    fetchRecruiterList();

    return () => {
      mounted = false;
    };
  }, []);

  // 1. Fetch placements statistics statistics
  useEffect(() => {
    let mounted = true;

    const fetchStatistics = async () => {
      try {
        const res = await API.get(
          "/api/instituteprofile/placements-statistics",
        );

        if (!mounted) return;

        const rawData = res?.data?.data || [];

        Setstatistics(rawData);
      } catch (err) {
        console.error("Error fetching recruiters:", err);
      }
    };

    fetchStatistics();

    return () => {
      mounted = false;
    };
  }, []);

  // 2. Fetch Students based on Selected Company Dropdown
  const fetchStudentList = async () => {
    try {
      const params: {
        page: number;
        limit: number;
        companyRequirementId?: string;
        id?: string;
      } = {
        page: 1,
        limit: 500,
      };

      if (selectedCompanyId) {
        params.id =
          selectedCompanyData?.companyRequirementId || "No interview yet.";
      }

      const res = await API.get(
        "/api/instituteprofile/get_all_companies_institute_placement_student",
        {
          params,
        },
      );

      const responseData = res?.data?.data || [];

      const mappedStudents = responseData.map((item: any) => ({
        value: item?._id || "",
        label: item?.studentName || "",
      }));

      /*
       * IMPORTANT:
       * Do not check getSelecteCompany?.companyName here.
       *
       * The company can be selected manually from ReactSelect.
       * Therefore, always use the API response.
       */
      setStudentOptions(mappedStudents);
    } catch (err) {
      console.error("Error fetching student list for dropdown:", err);

      setStudentOptions([]);
    }
  };

  useEffect(() => {
    if (!selectedCompanyId) {
      setStudentOptions([]);
      return;
    }

    fetchStudentList();
  }, [selectedCompanyId, selectedCompanyData]);

  const update = <K extends keyof OfferForm>(key: K, value: OfferForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = offerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof OfferForm, string>> = {};

      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof OfferForm;

        if (!fieldErrors[k]) {
          fieldErrors[k] = i.message;
        }
      });

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const res = await API.put(
        "/api/instituteprofile/student_offer_update",
        result.data,
      );

      toast({
        title: "Offer logged",
        description: "The offer has been successfully logged.",
      });
      triggerRefresh();
      update("ctc", "");
      update("student", "");
      update("location", "");

      // NEW: reset offer date after successful save
      update("offerDate", "");

      update("status", "Pending");

      //setSelectedCompanyId(null);
      //setSelectedCompanyData(null);
      //setStudentOptions([]);
      setErrors({});
      setOpen(false);
    } catch (error) {
      toast({
        title: "Failed to log offer",
        description:
          "Something went wrong while logging the offer. Please try again.",
        variant: "destructive",
      });
    }
  };

  /*
   * Company selected from another part of the application/store.
   *
   * IMPORTANT:
   * There is intentionally NO "else" here.
   *
   * The old else block was clearing manually selected companies,
   * which caused the student list to disappear after validation.
   */
  useEffect(() => {
    if (!getSelecteCompany?.companyName) {
      setStudentOptions([]);
      update("company", "");
      update("student", "");
      update("role", "");
      return;
    }

    const companyId = getSelecteCompany?._id || null;

    const companyData: CompanyOption = {
      value: companyId || "",
      label: getSelecteCompany.companyName,
      companyRequirementId: getSelecteCompany?.latestRequirement?._id,
    };

    update("company", getSelecteCompany.companyName);

    update("role", getSelecteCompany?.latestRequirement?.role || "");

    setSelectedCompanyId(companyId);
    setSelectedCompanyData(companyData);

    clearError("company");
    clearError("role");
    clearError("student");
  }, [
    getSelecteCompany?._id,
    getSelecteCompany?.companyName,
    getSelecteCompany?.latestRequirement?._id,
    getSelecteCompany?.latestRequirement?.role,
  ]);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Placements"
        description="Track offers extended, accepted and overall placement performance."
        actions={
          <>
            {/* <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button> */}

            <Dialog
              open={open}
              onOpenChange={(value) => {
                setOpen(value);

                if (value) {
                  // Don't remove existing errors here.
                  // Validation errors should remain until user changes a field.
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                  <Plus className="h-4 w-4" />
                  Log offer
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
                    {/* Company */}
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
                            ? {
                                label: form.company,
                                value: form.company,
                              }
                            : null)
                        }
                        onChange={(selected) => {
                          update("company", selected?.label || "");
                          clearError("company");

                          // Reset student when company changes
                          update("student", "");
                          clearError("student");

                          setSelectedCompanyId(selected?.value || null);

                          setSelectedCompanyData(
                            selected
                              ? {
                                  value: selected.value,
                                  label: selected.label,
                                  companyRequirementId:
                                    selected.companyRequirementId,
                                }
                              : null,
                          );
                        }}
                        onInputChange={(inputValue, { action }) => {
                          if (action === "input-change") {
                            /*
                             * Existing logic preserved.
                             */
                            if (
                              !companyOptions.some(
                                (o) =>
                                  o.value.toLowerCase() ===
                                  inputValue.toLowerCase(),
                              )
                            ) {
                              update("company", inputValue);
                            }

                            clearError("company");
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

                    {/* Student */}
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
                            ? {
                                label: form.student,
                                value: form.student,
                              }
                            : null)
                        }
                        onChange={(selected) => {
                          update("student", selected ? selected.value : "");

                          clearError("student");
                        }}
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

                          if (action === "input-change") {
                            clearError("student");
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

                    {/* Role */}
                    <div className="space-y-1.5">
                      <Label htmlFor="role">Role *</Label>

                      <Input
                        id="role"
                        value={form.role}
                        onChange={(e) => {
                          update("role", e.target.value);
                          clearError("role");
                        }}
                        placeholder="e.g. SWE I"
                        maxLength={80}
                        readOnly={getSelecteCompany?.companyName ? true : false}
                        className={
                          getSelecteCompany?.companyName
                            ? "cursor-wait pointer-events-none"
                            : ""
                        }
                      />

                      {errors.role && (
                        <p className="text-xs text-destructive">
                          {errors.role}
                        </p>
                      )}
                    </div>

                    {/* CTC */}
                    <div className="space-y-1.5">
                      <Label htmlFor="ctc">CTC *</Label>

                      <Input
                        id="ctc"
                        type="text"
                        inputMode="numeric"
                        value={form.ctc}
                        onChange={(e) => {
                          /*
                           * Numbers only.
                           * Any text, spaces, dots, letters, etc.
                           * are removed.
                           */
                          const value = e.target.value.replace(/\D/g, "");

                          update("ctc", value);
                          clearError("ctc");
                        }}
                        placeholder="e.g. 32"
                        maxLength={20}
                      />

                      {errors.ctc && (
                        <p className="text-xs text-destructive">{errors.ctc}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location *</Label>

                      <Input
                        id="location"
                        value={form.location}
                        onChange={(e) => {
                          update("location", e.target.value);
                          clearError("location");
                        }}
                        placeholder="e.g. Bengaluru"
                        maxLength={40}
                      />

                      {errors.location && (
                        <p className="text-xs text-destructive">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Offer Date */}
                    <div className="space-y-1.5">
                      <Label htmlFor="offerDate">
                        Offer Date {form.status === "Offered" && "*"}
                      </Label>

                      <div className="relative w-full">
                        <Input
                          id="offerDate"
                          type="date"
                          className="w-full min-w-0 pr-10"
                          value={form.offerDate || ""}
                          onChange={(e) => {
                            update("offerDate", e.target.value);
                            clearError("offerDate");
                          }}
                        />
                      </div>

                      {errors.offerDate && (
                        <p className="text-xs text-destructive">
                          {errors.offerDate}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="space-y-1.5">
                      <Label>Status *</Label>

                      <ShadcnSelect
                        value={form.status}
                        onValueChange={(v) => {
                          update("status", v as OfferForm["status"]);

                          clearError("status");

                          // Clear offer date validation error when status changes
                          clearError("offerDate");
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="Offered">Offered</SelectItem>

                          <SelectItem value="Pending">Pending</SelectItem>

                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </ShadcnSelect>

                      {errors.status && (
                        <p className="text-xs text-destructive">
                          {errors.status}
                        </p>
                      )}
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
          value={statistics?.OfferExtended || 0}
          delta={16}
          icon={Building2}
          tint="primary"
        />

        <StatCard
          label="Offers Accepted"
          value={statistics?.OfferAccepted || 0}
          delta={11}
          icon={Users}
          tint="success"
        />

        <StatCard
          label="Avg. CTC"
          value={statistics?.avgCtc || 0}
          delta={7}
          icon={IndianRupee}
          tint="accent"
        />

        <StatCard
          label="Placement Rate"
          value={statistics?.placementRate || 0}
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
                data={placementsGraph}
                margin={{
                  top: 5,
                  right: 8,
                  left: -16,
                  bottom: 0,
                }}
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
