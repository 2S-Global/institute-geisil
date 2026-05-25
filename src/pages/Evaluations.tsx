import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, CheckCircle2, Clock, AlertCircle, Plus, Download } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {nameFormate,timeAgo} from "../lib/utils"
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
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const monthly = [
  { month: "Nov", count: 142 },
  { month: "Dec", count: 168 },
  { month: "Jan", count: 201 },
  { month: "Feb", count: 234 },
  { month: "Mar", count: 268 },
  { month: "Apr", count: 312 },
];

const initialEvaluations = [
  { id: "EV-2841", student: "Priya Menon", type: "Aptitude + Coding", score: 92, status: "Completed", date: "2 hrs ago" },
  { id: "EV-2840", student: "Rohan Verma", type: "Case Study", score: 87, status: "Completed", date: "5 hrs ago" },
  { id: "EV-2839", student: "Aisha Khan", type: "Technical", score: 81, status: "Reviewing", date: "Yesterday" },
  { id: "EV-2838", student: "Karthik Iyer", type: "Aptitude + Coding", score: 78, status: "Completed", date: "Yesterday" },
  { id: "EV-2837", student: "Neha Gupta", type: "Group Discussion", score: 74, status: "Reviewing", date: "2 days ago" },
  { id: "EV-2836", student: "Arjun Reddy", type: "Technical", score: 0, status: "Pending", date: "Scheduled" },
];

const statusStyles: Record<string, string> = {
  Completed: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-muted text-muted-foreground border-border",
};

const evaluationTypes = [
  {key:"Aptitude_Coding",value:"Aptitude + Coding"},
  {key:"Technical",value:"Technical"},
  {key:"Case_Study",value:"Case Study"},
  {key:"Group_Discussion",value:"Group Discussion"},
  {key:"Behavioral",value:"Behavioral"},
  {key:"Domain_Knowledge",value:"Domain Knowledge"} 
];

const evaluationSchema = z
  .object({
    student: z.string().trim().min(2, "Student name is required").max(80),
    rollNo: z.string().trim().max(40).optional().or(z.literal("")),
    type: z.string().min(1, "Select an evaluation type"),
    status: z.enum(["Completed", "Reviewing", "Pending"]),
    score: z.coerce.number().int().min(0).max(100),
    scheduledDate:z.string().trim().min(1, "Date is required").pipe(z.coerce.date()),
    evaluator: z.string().regex(/^[A-Za-z ]*$/,  "only letters allow").trim().max(80).optional().or(z.literal("")),
    notes: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((d) => d.status === "Pending" || d.score > 0, {
    message: "Score is required for completed/reviewing evaluations",
    path: ["score"],
  });

type EvaluationForm = z.infer<typeof evaluationSchema>;

const emptyForm: EvaluationForm = {
  student: "",
  rollNo: "",
  type: "",
  status: "Completed",
  score: 0,
  scheduledDate: "",
  evaluator: "",
  notes: "",
};



const Evaluations = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [evaluations, setEvaluations] = useState();
  const [studentList, setStudentList] = useState([]);
  const [edit, setEdit] = useState();
  const [form, setForm] = useState<EvaluationForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof EvaluationForm, string>>>({});

  const update = <K extends keyof EvaluationForm>(key: K, value: EvaluationForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSelect = (key,value) => {
    if (value) {
      setForm((f) => ({ ...f, [key]: value }));
    
      const findData = studentList.find(
        (u) => u._id === value,
      );
      setForm((f) => ({ ...f, 'rollNo': findData.USN }));
     
    } else {
      setForm((f) => ({ ...f, 'rollNo': '' }));
    }
   
  };




  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    const result = evaluationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof EvaluationForm, string>> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as keyof EvaluationForm;
        if (!fieldErrors[k]) fieldErrors[k] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast({})
    //const nextId = `EV-${2842 + (evaluations.length - initialEvaluations.length)}`;
    /* setEvaluations((prev) => [
      {
        id: nextId,
        student: result.data.student,
        type: result.data.type,
        score: result.data.status === "Pending" ? 0 : result.data.score,
        status: result.data.status,
        date: result.data.status === "Pending" ? "Scheduled" : "Just now",
      },
      ...prev,
    ]); */
    console.log("result",result.data);
      let sendData={
      student_name:result.data.student,
      role:result.data.rollNo,
      evaluation_type:result.data.type,
      status:result.data.status,
      score:result.data.score,
      date:result.data.scheduledDate,
      evaluator_name:result.data.evaluator,
      notes:result.data.notes
    }

      let response = "";
          try {
            response = await api.post("/api/instituteprofile/add_evaluation",
              sendData,
            );
           
            if(response?.data?.success){
                  toast({
                    title: "success",
                    description: "Evaluations saved successfully",
                  });
                  fetchEvaluationList()
            }
            else{
              toast({
                    title: "Error",
                    description:response?.data?.message ||"",
                  });
            }
          
            //await fetchRecruiterList();
            setForm(emptyForm);
            setOpen(false);
          } catch (err) {
            console.log(err.response);
            toast({
              title: "Failed",
              description: err?.response?.data?.message?.replace("_"," "),
            });
          }

    //toast({ title: "Success", description: `Evaluation added successfully` });
    setForm(emptyForm);
    setOpen(false);
  };
  const fetchSudentList = async () => {
    try {
      const res = await api.get(
        "/api/institutestudent/institute-student-list-by-placement-ready",
      );
      const data = res?.data?.data || [];
      setStudentList(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  const fetchEvaluationList = async () => {
    try {
      const res = await api.get(
        "/api/instituteprofile/get_evaluation",
      );
      const data = res?.data?.data || [];
      console.log('data',data)
      setEvaluations(data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

  useEffect(() => {
    fetchSudentList();
    fetchEvaluationList();
  }, []);

  console.log('evaluations',evaluations)
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Workspace"
        title="Evaluations"
        description="Configure assessments, monitor results and review pending submissions."
        actions={
          <>
           {/*  <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button> */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
                  <Plus className="h-4 w-4" /> New evaluation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Add new evaluation</DialogTitle>
                  <DialogDescription>
                    Record a new assessment result or schedule one for an upcoming candidate.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="student">Student name *</Label>
                    {/*   <Input
                        id="student"
                        value={form.student}
                        onChange={(e) => update("student", e.target.value)}
                        placeholder="e.g. Priya Menon"
                        maxLength={80}
                      />
                      {errors.student && <p className="text-xs text-destructive">{errors.student}</p>} */}

                      <Select value={form.student} onValueChange={(v) => handleSelect("student", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {studentList.map((t) => (
                            <SelectItem key={t._id} value={t._id}>{nameFormate(t.name)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.student && <p className="text-xs text-destructive">{errors.student}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="rollNo">USN</Label>
                      <Input
                        id="rollNo"
                        value={form.rollNo}
                        onChange={(e) => update("rollNo", e.target.value)}
                        placeholder="e.g. 22BCE1234"
                        readonly="readonly"
                       
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Evaluation type *</Label>
                      <Select value={form.type} onValueChange={(v) => update("type", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {evaluationTypes.map((t) => (
                            <SelectItem key={t.key} value={t.key}>{t.value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label>Status *</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => update("status", v as EvaluationForm["status"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Reviewing">Reviewing</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="score">Score (0–100) *</Label>
                      <Input
                        id="score"
                        type="number"
                        min={0}
                        max={100}
                        value={form.score}
                        onChange={(e) => update("score", Number(e.target.value) as never)}
                        disabled={form.status === "Pending"}
                      />
                      {errors.score && <p className="text-xs text-destructive">{errors.score}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="scheduledDate">Date *</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={form.scheduledDate}
                        onChange={(e) => update("scheduledDate", e.target.value)}
                      />
                        {errors.scheduledDate && <p className="text-xs text-destructive">{errors.scheduledDate}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="evaluator">Evaluator</Label>
                      <Input
                        id="evaluator"
                        value={form.evaluator}
                        onChange={(e) => update("evaluator", e.target.value)}
                        placeholder="Faculty or panelist name"
                        maxLength={80}
                      />
                      {errors.evaluator && <p className="text-xs text-destructive">{errors.evaluator}</p>}
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="Strengths, areas to improve, panel observations…"
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
                      Add evaluation
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Total (MTD)" value="1,267" delta={24} icon={ClipboardCheck} tint="primary" />
        <StatCard label="Completed" value="982" delta={18} icon={CheckCircle2} tint="success" />
        <StatCard label="In Review" value="218" delta={6} icon={Clock} tint="warning" />
        <StatCard label="Flagged" value="12" delta={-3} icon={AlertCircle} tint="accent" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-display">Evaluations per month</CardTitle>
            <CardDescription>Volume trend across the last six months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 5, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-display">Score Distribution</CardTitle>
            <CardDescription>Across completed evaluations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "90 – 100", value: 18, color: "bg-success" },
              { label: "75 – 89", value: 42, color: "bg-primary" },
              { label: "60 – 74", value: 28, color: "bg-accent" },
              { label: "Below 60", value: 12, color: "bg-warning" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex items-center justify-between mb-1.5 text-sm">
                  <span className="text-muted-foreground">{b.label}</span>
                  <span className="font-semibold text-foreground">{b.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.value}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-display">All Evaluations</CardTitle>
          <CardDescription>Most recent submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <th className="font-medium py-3 px-4">Student</th>
                  <th className="font-medium py-3 px-4">Type</th>
                  <th className="font-medium py-3 px-4 min-w-[180px]">Score</th>
                  <th className="font-medium py-3 px-4">When</th>
                  <th className="font-medium py-3 px-4 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60">
                {evaluations?.map((e) =>{
                const last=e?.evaluations?.length-1;
                let lastEvaluation=last>0?e?.evaluations[last]:e?.evaluations[0];
                
                return(
                  <tr
                    key={e?._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Student */}
                    <td className="py-3 px-4">
                      <Link
                        to={`/institute/evaluations/${e?._id}`}
                        className="flex items-center gap-3 min-w-[220px]"
                      >
                        <Avatar className="h-9 w-9 border shrink-0">
                          <AvatarFallback className="bg-accent/10 text-accent text-xs font-semibold">
                            {e?.student_name
                              .charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {e?.student_name && nameFormate(e?.student_name)}
                          </p>

                          <p className="text-xs text-muted-foreground truncate">
                           
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {lastEvaluation?.evaluation_type?.replace("_"," ")}
                    </td>

                    {/* Score */}
                    <td className="py-3 px-4">
                      {lastEvaluation?.status === "Pending" ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <Progress value={lastEvaluation?.score} className="h-1.5 flex-1" />

                          <span className="text-sm font-semibold text-foreground w-10 text-right shrink-0">
                            {lastEvaluation?.score}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                       {lastEvaluation?.date && timeAgo(lastEvaluation?.date)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant="outline"
                        className={`${statusStyles[lastEvaluation?.status]} whitespace-nowrap`}
                      >
                        {lastEvaluation?.status}
                      </Badge>
                    </td>
                  </tr>
                )}
              
              )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Evaluations;
