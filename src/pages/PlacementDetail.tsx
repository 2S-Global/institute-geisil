import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, MapPin, Building2, IndianRupee, Calendar, CheckCircle2, FileText, Briefcase } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const timeline = [
  { date: "Apr 28", title: "Offer accepted", desc: "Candidate signed offer letter", color: "text-success", done: true },
  { date: "Apr 24", title: "Offer extended", desc: "₹ 32 LPA package issued by Google India", color: "text-primary", done: true },
  { date: "Apr 18", title: "Final interview cleared", desc: "Hiring manager round + culture fit", color: "text-accent", done: true },
  { date: "Apr 12", title: "Technical rounds (3)", desc: "DSA + System design + DSA-2", color: "text-warning", done: true },
  { date: "Apr 04", title: "Online assessment", desc: "Score: 92 / 100", color: "text-muted-foreground", done: true },
];

const PlacementDetail = () => {
  const { id } = useParams();
  return (
    <DashboardLayout>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground hover:text-foreground">
        <Link to="/institute/placements"><ArrowLeft className="h-4 w-4" /> Back to placements</Link>
      </Button>

      <PageHeader
        eyebrow={`Offer • ${id ?? "OFR-4821"}`}
        title="Software Engineer I — Google India"
        description="Offer extended to Priya Menon on April 24, 2026"
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Letter</Button>
            <Button className="gap-2 bg-primary hover:bg-[hsl(var(--primary-hover))] text-primary-foreground shadow-brand">
              <CheckCircle2 className="h-4 w-4" /> Mark joined
            </Button>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Offer Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-primary-soft text-primary flex items-center justify-center"><Building2 className="h-5 w-5" /></div>
                <div><p className="text-xs text-muted-foreground">Company</p><p className="font-semibold text-foreground">Google India</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center"><Briefcase className="h-5 w-5" /></div>
                <div><p className="text-xs text-muted-foreground">Role</p><p className="font-semibold text-foreground">Software Engineer I</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-success/10 text-success flex items-center justify-center"><IndianRupee className="h-5 w-5" /></div>
                <div><p className="text-xs text-muted-foreground">CTC</p><p className="font-semibold text-foreground">₹ 32.0 LPA</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-warning/10 text-warning flex items-center justify-center"><MapPin className="h-5 w-5" /></div>
                <div><p className="text-xs text-muted-foreground">Location</p><p className="font-semibold text-foreground">Bengaluru, KA</p></div>
              </div>
            </div>
            <Separator className="my-5" />
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div><p className="text-xs text-muted-foreground">Joining date</p><p className="text-foreground font-medium">July 14, 2026</p></div>
              <div><p className="text-xs text-muted-foreground">Bond</p><p className="text-foreground font-medium">None</p></div>
              <div><p className="text-xs text-muted-foreground">Probation</p><p className="text-foreground font-medium">3 months</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Candidate</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary-soft text-primary font-semibold">PM</AvatarFallback></Avatar>
              <div>
                <Link to="/students/STU-10241" className="font-semibold text-foreground hover:underline">Priya Menon</Link>
                <p className="text-xs text-muted-foreground">STU-10241</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20 w-full justify-center py-1.5">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Offer Accepted
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Process Timeline</CardTitle><CardDescription>From application to offer acceptance</CardDescription></CardHeader>
          <CardContent>
            <ol className="relative border-l border-border ml-3 space-y-6">
              {timeline.map((t, i) => (
                <li key={i} className="ml-6">
                  <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-card border">
                    <Calendar className={`h-3.5 w-3.5 ${t.color}`} />
                  </span>
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.date}, 2026</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="text-base">Documents</CardTitle></CardHeader>
          <CardContent className="divide-y divide-border/60 p-0">
            {[{ n: "Offer_Letter_Google.pdf", s: "284 KB" }, { n: "Joining_Kit.pdf", s: "1.4 MB" }, { n: "Background_Check_Consent.pdf", s: "112 KB" }].map(d => (
              <div key={d.n} className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-md bg-primary-soft text-primary flex items-center justify-center"><FileText className="h-5 w-5" /></div>
                  <div><p className="font-medium text-foreground text-sm">{d.n}</p><p className="text-xs text-muted-foreground">{d.s}</p></div>
                </div>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlacementDetail;
