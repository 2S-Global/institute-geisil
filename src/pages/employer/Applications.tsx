import { Link } from "react-router-dom";
import { Filter, Download } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const apps = [
  { id: "AP-9012", name: "Priya Menon", job: "Frontend Engineer", date: "Apr 28", stage: "Interview" },
  { id: "AP-9011", name: "Rohan Verma", job: "Data Analyst", date: "Apr 27", stage: "Screened" },
  { id: "AP-9010", name: "Aisha Khan", job: "Product Manager", date: "Apr 26", stage: "Offer" },
  { id: "AP-9009", name: "Karthik Iyer", job: "QA Engineer", date: "Apr 25", stage: "Interview" },
  { id: "AP-9008", name: "Neha Gupta", job: "Frontend Engineer", date: "Apr 24", stage: "Applied" },
  { id: "AP-9007", name: "Arjun Rao", job: "DevOps Engineer", date: "Apr 23", stage: "Rejected" },
];

const styles: Record<string, string> = {
  Applied: "bg-muted text-muted-foreground border-border",
  Screened: "bg-primary/10 text-primary border-primary/20",
  Interview: "bg-accent/10 text-accent border-accent/20",
  Offer: "bg-success/10 text-success border-success/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Applications() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Applications"
        description="All applications received across your job postings."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          </>
        }
      />
      <div className="grid gap-3 md:grid-cols-5 mb-4">
        {[["Total", 482], ["New", 64], ["Screened", 268], ["Interview", 124], ["Offer", 38]].map(([k, v]) => (
          <Card key={k as string} className="p-4 border-border/60 shadow-sm">
            <p className="text-xs uppercase text-muted-foreground tracking-wider">{k}</p>
            <p className="font-display text-2xl font-bold text-foreground mt-1">{v}</p>
          </Card>
        ))}
      </div>
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-4 py-3">ID</th>
                <th className="font-medium px-4 py-3">Candidate</th>
                <th className="font-medium px-4 py-3">Role</th>
                <th className="font-medium px-4 py-3">Applied</th>
                <th className="font-medium px-4 py-3">Stage</th>
                <th className="font-medium px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{a.id}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{a.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.job}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className={styles[a.stage]}>{a.stage}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="ghost"><Link to={`/employer/candidates/${a.name.toLowerCase().replace(/\s+/g,"-")}`}>Open</Link></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </EmployerLayout>
  );
}
