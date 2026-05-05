import { Plus, Clock, Users } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tests = [
  { name: "Frontend Fundamentals", type: "Technical", duration: "60 min", taken: 142, avg: 76 },
  { name: "Aptitude & Reasoning", type: "Cognitive", duration: "45 min", taken: 218, avg: 71 },
  { name: "Product Sense", type: "Case study", duration: "90 min", taken: 38, avg: 68 },
  { name: "SQL & Data", type: "Technical", duration: "60 min", taken: 96, avg: 74 },
  { name: "Behavioral Survey", type: "Psychometric", duration: "30 min", taken: 312, avg: 82 },
  { name: "DevOps Essentials", type: "Technical", duration: "75 min", taken: 54, avg: 69 },
];

export default function Assessments() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Assessments"
        description="Pre-built and custom tests for evaluating candidates."
        actions={<Button className="gap-2 shadow-brand"><Plus className="h-4 w-4" /> Create assessment</Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tests.map((t) => (
          <Card key={t.name} className="p-5 border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-3">{t.type}</Badge>
            <h3 className="font-display text-lg font-bold text-foreground">{t.name}</h3>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {t.duration}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {t.taken} attempts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/60">
              <div>
                <p className="text-xs text-muted-foreground">Avg score</p>
                <p className="font-display text-xl font-bold text-foreground">{t.avg}%</p>
              </div>
              <div className="flex items-end justify-end">
                <Button size="sm" variant="outline">Assign</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </EmployerLayout>
  );
}
