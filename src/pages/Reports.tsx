import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FileText, Download, Calendar as CalendarIcon, BarChart3, PieChart as PieIcon, TrendingUp, Users } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const templates = [
  { title: "Placement Summary", desc: "Offers, acceptances, sector mix, CTC bands.", icon: TrendingUp, tag: "Quarterly" },
  { title: "Student Employability", desc: "Cohort-wise employability scores and skill gaps.", icon: Users, tag: "Monthly" },
  { title: "Recruiter Engagement", desc: "Hiring partner activity, conversion and SLAs.", icon: BarChart3, tag: "Monthly" },
  { title: "Evaluation Insights", desc: "Score distributions and assessment performance.", icon: PieIcon, tag: "Weekly" },
];

interface ReportItem { name: string; type: string; date: string; size: string; }

const initialRecent: ReportItem[] = [
  { name: "Q4 FY26 Placement Report", type: "PDF", date: "Apr 28, 2026", size: "2.4 MB" },
  { name: "March Employability Index", type: "XLSX", date: "Apr 02, 2026", size: "812 KB" },
  { name: "Recruiter Engagement – Mar", type: "PDF", date: "Apr 01, 2026", size: "1.1 MB" },
  { name: "Cohort Skill Audit – B.Tech CSE", type: "PDF", date: "Mar 24, 2026", size: "3.6 MB" },
];

const Reports = () => {
  const { toast } = useToast();
  const [recent, setRecent] = useState<ReportItem[]>(initialRecent);

  const [openNew, setOpenNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [newType, setNewType] = useState("PDF");
  const [newNotes, setNewNotes] = useState("");

  const [openSched, setOpenSched] = useState(false);
  const [schedTemplate, setSchedTemplate] = useState("");
  const [schedFreq, setSchedFreq] = useState("monthly");
  const [schedDate, setSchedDate] = useState<Date | undefined>();
  const [schedRecipients, setSchedRecipients] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTemplate) {
      toast({ title: "Missing info", description: "Name and template are required.", variant: "destructive" });
      return;
    }
    setRecent((r) => [
      { name: newName, type: newType, date: format(new Date(), "MMM dd, yyyy"), size: "—" },
      ...r,
    ]);
    toast({ title: "Report generated", description: `${newName} added to recent.` });
    setOpenNew(false);
    setNewName(""); setNewTemplate(""); setNewType("PDF"); setNewNotes("");
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTemplate || !schedDate) {
      toast({ title: "Missing info", description: "Template and start date are required.", variant: "destructive" });
      return;
    }
    toast({
      title: "Schedule created",
      description: `${schedTemplate} • ${schedFreq} from ${format(schedDate, "PPP")}`,
    });
    setOpenSched(false);
    setSchedTemplate(""); setSchedFreq("monthly"); setSchedDate(undefined); setSchedRecipients("");
  };

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Reports"
        description="Generate, schedule and download institutional reports for stakeholders."
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={() => setOpenSched(true)}>
              <CalendarIcon className="h-4 w-4" />Schedule
            </Button>
            <Button
              className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand"
              onClick={() => setOpenNew(true)}
            >
              <FileText className="h-4 w-4" /> New report
            </Button>
          </>
        }
      />

      <h2 className="font-display text-lg font-semibold text-foreground mb-3">Templates</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        {templates.map((t) => (
          <Link key={t.title} to={`/institute/reports/${t.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <Card className="shadow-sm hover:shadow-md transition-shadow border-border/60 cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-11 w-11 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="bg-muted/60 text-muted-foreground border-border text-[10px]">{t.tag}</Badge>
                </div>
                <h3 className="font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{t.title}</h3>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
                <p className="text-primary mt-3 text-sm font-medium group-hover:underline">Generate report →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-display">Recent reports</CardTitle>
          <CardDescription>Generated and downloaded in the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border/60">
            {recent.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-3 hover:bg-muted/30 px-3 -mx-3 rounded-md transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {r.type}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.date} · {r.size}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New report dialog */}
      <Dialog open={openNew} onOpenChange={setOpenNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">New report</DialogTitle>
            <DialogDescription>Generate a one-off report from a template.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="r-name">Report name</Label>
              <Input id="r-name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. May Placement Snapshot" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select value={newTemplate} onValueChange={setNewTemplate}>
                  <SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => <SelectItem key={t.title} value={t.title}>{t.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="r-notes">Notes (optional)</Label>
              <Textarea id="r-notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Filters, cohorts, date ranges…" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenNew(false)}>Cancel</Button>
              <Button type="submit">Generate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule dialog */}
      <Dialog open={openSched} onOpenChange={setOpenSched}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Schedule a report</DialogTitle>
            <DialogDescription>Automatically generate and email reports on a cadence.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={schedTemplate} onValueChange={setSchedTemplate}>
                <SelectTrigger><SelectValue placeholder="Choose template" /></SelectTrigger>
                <SelectContent>
                  {templates.map((t) => <SelectItem key={t.title} value={t.title}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={schedFreq} onValueChange={setSchedFreq}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !schedDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {schedDate ? format(schedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={schedDate}
                      onSelect={setSchedDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Input
                id="recipients"
                value={schedRecipients}
                onChange={(e) => setSchedRecipients(e.target.value)}
                placeholder="dean@geisil.edu, placements@geisil.edu"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpenSched(false)}>Cancel</Button>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reports;
