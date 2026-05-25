import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle2, Clock, AlertCircle, FileText, Award } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState,useEffect } from "react";
import {nameFormate,timeAgo,DM} from "../lib/utils"
const sections = [
  { name: "Quantitative Aptitude", score: 92, max: 100, time: "18 min" },
  { name: "Logical Reasoning", score: 88, max: 100, time: "16 min" },
  { name: "Verbal Ability", score: 84, max: 100, time: "14 min" },
  { name: "Coding — Easy", score: 100, max: 100, time: "12 min" },
  { name: "Coding — Medium", score: 86, max: 100, time: "28 min" },
  { name: "Coding — Hard", score: 72, max: 100, time: "32 min" },
];
const statusStyles={
  Completed: "bg-success/10 text-success border-success/20",
  Reviewing: "bg-warning/10 text-warning border-warning/20",
  Pending: "bg-muted text-muted-foreground border-border",
};
import api from "@/lib/axios";
const EvaluationDetail = () => {
  const { id } = useParams();
  const overall = Math.round(sections.reduce((a, s) => a + s.score, 0) / sections.length);
  const [evaluations, setEvaluations] = useState();

  const fetchEvaluationList = async () => {
    try {
      const res = await api.get(
        `/api/instituteprofile/get_evaluation`,
      );
      const data = res?.data?.data || [];
      const row=data.find((item)=>item._id===id);
     
      setEvaluations(row);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

    useEffect(() => {
      fetchEvaluationList();
    }, []);
    let len=evaluations?.evaluations?.length
  let LastEvaluations=len>0?evaluations?.evaluations[len-1]:evaluations?.evaluations[0]
  let total=evaluations?.evaluations?.reduce((acc,item)=>{
      return acc+=item.score
  },0)

  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/evaluations"><ArrowLeft className="h-4 w-4" /> Back to evaluations</Link>
      </Button>

      <PageHeader
        eyebrow={``}
        title=""
        description=""
        actions={
          <>
           {/*  <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button> */}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Candidate</CardTitle>
            <CardDescription>Submission and review summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border"><AvatarFallback className="bg-primary-soft text-primary font-bold">{evaluations?.student_name?.split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("").toUpperCase()}</AvatarFallback></Avatar>
              <div className="flex-1">
                <p className="font-display font-bold text-foreground text-lg ">{nameFormate(evaluations?.student_name||"")}</p>
               {/*  <p className="text-sm text-muted-foreground">STU-10241 • B.Tech CSE • Final Year</p> */}
              </div>
              <Badge variant="outline" className={statusStyles[LastEvaluations?.status||""]}><CheckCircle2 className="h-3 w-3 mr-1" />{LastEvaluations?.status||""}</Badge>
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-foreground">{DM(LastEvaluations?.date||"")}</p></div>
             {/*  <div><p className="text-xs text-muted-foreground">Started</p><p className="text-foreground">{DM(LastEvaluations?.date||"")}</p></div>
              <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-foreground">28 Apr, 11:48 AM</p></div>
              <div><p className="text-xs text-muted-foreground">Time taken</p><p className="text-foreground">1h 48m</p></div>
              <div><p className="text-xs text-muted-foreground">Proctor flags</p><p className="text-foreground">0</p></div> */}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-gradient-to-br from-primary to-[hsl(var(--primary-hover))] text-primary-foreground">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <p className="text-sm opacity-80">Overall Score</p>
            <p className="font-display text-6xl font-bold mt-1">{total && Math.round(total/len)}</p>
           {/*  <p className="text-sm opacity-80 mt-2">Top 8% of cohort</p> */}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="text-base">Section-wise Performance</CardTitle>
          <CardDescription>Breakdown across assessment modules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {evaluations?.evaluations?.map(s => (
            <div key={s.evaluation_id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-foreground font-medium">{s?.evaluation_type?.replace("_"," ")}</span>
                <span className="text-muted-foreground">{s.time} • <span className="text-foreground font-semibold">{s.score}/{100}</span></span>
              </div>
              <Progress value={s.score} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-5 ">
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Evaluator Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
             {evaluations?.evaluations?.map(s => (
                s.notes?<div className="p-4 rounded-md bg-primary/5 border border-primary/20">
              {/*   <p className="font-semibold text-success mb-1">Strengths</p> */}
                <p className="text-muted-foreground">{s.notes}</p>
              </div>:""
             ))}
           {/*  <div className="p-4 rounded-md bg-success/5 border border-success/20">
              <p className="font-semibold text-success mb-1">Strengths</p>
              <p className="text-muted-foreground">Excellent algorithmic thinking. Solved hard DP problem within optimal time complexity.</p>
            </div>
            <div className="p-4 rounded-md bg-warning/5 border border-warning/20">
              <p className="font-semibold text-warning mb-1">Areas to improve</p>
              <p className="text-muted-foreground">Verbal section pacing — review reading comprehension speed drills.</p>
            </div> */}
          </CardContent>
        </Card>

       {/*  <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Attachments</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border/60 p-0">
            {[{ n: "Submission_PriyaMenon.zip", s: "8.4 MB" }, { n: "Proctoring_Report.pdf", s: "412 KB" }, { n: "Coding_Console_Logs.txt", s: "62 KB" }].map(a => (
              <div key={a.n} className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-muted text-muted-foreground flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                  <div><p className="font-medium text-foreground text-sm">{a.n}</p><p className="text-xs text-muted-foreground">{a.s}</p></div>
                </div>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card> */}
      </div>
    </DashboardLayout>
  );
};

export default EvaluationDetail;
