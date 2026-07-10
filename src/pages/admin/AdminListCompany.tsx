import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Download,
  Eye,
  Filter,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { AdminLayout } from "@/components/AdminLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

type Company = {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone: string;
  location: string;
  jobs: number;
  employees: string;
  plan: "Free" | "Starter" | "Growth" | "Enterprise";
  status: "Active" | "Pending" | "Suspended";
  joined: string;
};

const COMPANIES: Company[] = [
  { id: "CMP-1001", name: "Infosys Technologies", industry: "IT Services", email: "hr@infosys.com", phone: "+91 80 4116 7744", location: "Bengaluru, KA", jobs: 42, employees: "10,000+", plan: "Enterprise", status: "Active", joined: "12 Jan 2024" },
  { id: "CMP-1002", name: "Wipro Limited", industry: "IT & Consulting", email: "careers@wipro.com", phone: "+91 80 2844 0011", location: "Bengaluru, KA", jobs: 28, employees: "10,000+", plan: "Enterprise", status: "Active", joined: "03 Feb 2024" },
  { id: "CMP-1003", name: "TCS Digital", industry: "IT Services", email: "hire@tcs.com", phone: "+91 22 6778 9999", location: "Mumbai, MH", jobs: 61, employees: "10,000+", plan: "Enterprise", status: "Active", joined: "18 Feb 2024" },
  { id: "CMP-1004", name: "Zoho Corporation", industry: "SaaS", email: "jobs@zoho.com", phone: "+91 44 6744 7000", location: "Chennai, TN", jobs: 17, employees: "5,000-10,000", plan: "Growth", status: "Active", joined: "22 Feb 2024" },
  { id: "CMP-1005", name: "Freshworks Inc.", industry: "SaaS", email: "talent@freshworks.com", phone: "+91 44 6667 8888", location: "Chennai, TN", jobs: 12, employees: "1,000-5,000", plan: "Growth", status: "Pending", joined: "05 Mar 2024" },
  { id: "CMP-1006", name: "Razorpay", industry: "Fintech", email: "careers@razorpay.com", phone: "+91 80 4718 1000", location: "Bengaluru, KA", jobs: 9, employees: "1,000-5,000", plan: "Growth", status: "Active", joined: "14 Mar 2024" },
  { id: "CMP-1007", name: "CRED", industry: "Fintech", email: "hire@cred.club", phone: "+91 80 5000 2200", location: "Bengaluru, KA", jobs: 6, employees: "500-1,000", plan: "Starter", status: "Active", joined: "20 Mar 2024" },
  { id: "CMP-1008", name: "Byju's Learning", industry: "EdTech", email: "hr@byjus.com", phone: "+91 80 6748 9000", location: "Bengaluru, KA", jobs: 4, employees: "10,000+", plan: "Starter", status: "Suspended", joined: "01 Apr 2024" },
  { id: "CMP-1009", name: "Unacademy", industry: "EdTech", email: "jobs@unacademy.com", phone: "+91 80 4718 2200", location: "Bengaluru, KA", jobs: 8, employees: "1,000-5,000", plan: "Starter", status: "Active", joined: "11 Apr 2024" },
  { id: "CMP-1010", name: "Swiggy", industry: "Food Delivery", email: "careers@swiggy.in", phone: "+91 80 6748 1111", location: "Bengaluru, KA", jobs: 22, employees: "5,000-10,000", plan: "Growth", status: "Active", joined: "23 Apr 2024" },
  { id: "CMP-1011", name: "Zomato", industry: "Food Delivery", email: "hr@zomato.com", phone: "+91 124 4628 100", location: "Gurugram, HR", jobs: 15, employees: "5,000-10,000", plan: "Growth", status: "Active", joined: "02 May 2024" },
  { id: "CMP-1012", name: "PayTM", industry: "Fintech", email: "talent@paytm.com", phone: "+91 120 4770 770", location: "Noida, UP", jobs: 11, employees: "5,000-10,000", plan: "Growth", status: "Pending", joined: "16 May 2024" },
];

const planTone: Record<Company["plan"], string> = {
  Free: "bg-muted text-muted-foreground",
  Starter: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  Growth: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  Enterprise: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
};

const statusTone: Record<Company["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  Suspended: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function AdminListCompany() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [plan, setPlan] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return COMPANIES.filter((c) => {
      const matchQ = [c.name, c.email, c.industry, c.location, c.id]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchS = status === "all" || c.status.toLowerCase() === status;
      const matchP = plan === "all" || c.plan.toLowerCase() === plan;
      return matchQ && matchS && matchP;
    });
  }, [query, status, plan]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

  const stats = [
    { label: "Total companies", value: COMPANIES.length, tone: "text-primary" },
    { label: "Active", value: COMPANIES.filter((c) => c.status === "Active").length, tone: "text-emerald-600" },
    { label: "Pending review", value: COMPANIES.filter((c) => c.status === "Pending").length, tone: "text-amber-600" },
    { label: "Enterprise plans", value: COMPANIES.filter((c) => c.plan === "Enterprise").length, tone: "text-violet-600" },
  ];

  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Employers"
        title="Companies"
        description="Manage all registered employer companies, their subscriptions and hiring activity."
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))]">
              <Plus className="h-4 w-4" /> Add company
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {s.label}
              </p>
              <p className={`mt-2 text-3xl font-display font-bold ${s.tone}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <div className="p-4 md:p-5 border-b flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, industry, ID…"
              className="pl-9 h-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger className="w-[150px] h-10">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 h-10">
              <Filter className="h-4 w-4" /> More filters
            </Button>
          </div>
        </div>

        {selected.length > 0 && (
          <div className="px-5 py-2.5 bg-primary/5 border-b flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              {selected.length} selected
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">Suspend</Button>
              <Button size="sm" variant="outline">Approve</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="w-10">
                  <Checkbox
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-center">Jobs</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(c.id)}
                      onCheckedChange={() => toggle(c.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                          {initials(c.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <Building2 className="h-3 w-3" /> {c.industry} · {c.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1 min-w-[200px]">
                      <p className="flex items-center gap-1.5 text-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {c.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="flex items-center gap-1.5 text-sm text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {c.location}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Users className="h-3 w-3" /> {c.employees}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.25rem] h-7 rounded-md bg-muted font-semibold text-foreground text-sm">
                      {c.jobs}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${planTone[c.plan]} border-0 font-medium`}>{c.plan}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusTone[c.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {c.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {c.joined}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" /> View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="h-4 w-4" /> Edit details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-muted-foreground">
                    No companies match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            <span className="font-semibold text-foreground">{COMPANIES.length}</span> companies
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-hover))] hover:text-primary-foreground">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Need help managing companies?{" "}
        <Link to="/admin/dashboard" className="text-primary hover:underline font-medium">
          Back to dashboard
        </Link>
      </p>
    </AdminLayout>
  );
}
