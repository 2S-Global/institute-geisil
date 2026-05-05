import { Building2, Globe, MapPin, Users, Edit } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Company() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Company Profile"
        description="Information visible to candidates and partner institutes."
        actions={<Button className="gap-2 shadow-brand"><Edit className="h-4 w-4" /> Edit profile</Button>}
      />
      <Card className="p-6 mb-6 border-border/60 shadow-sm bg-gradient-to-br from-primary-soft to-card">
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          <div className="h-20 w-20 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-display text-3xl font-bold shadow-brand">A</div>
          <div className="flex-1">
            <h1 className="font-display text-3xl font-bold text-foreground">Acme Corporation</h1>
            <p className="text-muted-foreground mt-1">Building reliable enterprise software for global teams.</p>
            <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> Technology · SaaS</span>
              <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> acme.com</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Bengaluru, India</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> 1,200+ employees</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/60 shadow-sm">
          <CardHeader><CardTitle className="font-display">About</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-3">
            <p>Acme Corporation is a leading SaaS company building tools that help enterprise teams collaborate, ship, and scale.</p>
            <p>We hire across engineering, product, design, and go-to-market — and partner with top institutes for early-career programs.</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 shadow-sm">
          <CardHeader><CardTitle className="font-display">Hiring focus</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["Engineering", "Product", "Design", "Data Science", "Sales", "Customer Success"].map(s => (
              <Badge key={s} variant="outline" className="bg-primary/10 text-primary border-primary/20">{s}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60 shadow-sm mt-6">
        <CardHeader><CardTitle className="font-display">Office locations</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {[["Bengaluru", "HQ · 600 employees"], ["Hyderabad", "Engineering · 240"], ["Mumbai", "Sales · 120"]].map(([c, d]) => (
            <div key={c} className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-foreground">{c}</p>
              <p className="text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </EmployerLayout>
  );
}
