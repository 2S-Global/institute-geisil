import { Link } from "react-router-dom";
import { Search, Filter, Download } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const data = [
  { name: "Priya Menon", role: "Frontend Engineer", exp: "4 yrs", loc: "Bengaluru", score: 92, stage: "Interview" },
  { name: "Rohan Verma", role: "Data Analyst", exp: "3 yrs", loc: "Hyderabad", score: 87, stage: "Screened" },
  { name: "Aisha Khan", role: "Product Manager", exp: "6 yrs", loc: "Remote", score: 84, stage: "Offer" },
  { name: "Karthik Iyer", role: "QA Engineer", exp: "2 yrs", loc: "Pune", score: 78, stage: "Interview" },
  { name: "Neha Gupta", role: "Frontend Engineer", exp: "3 yrs", loc: "Bengaluru", score: 75, stage: "Applied" },
  { name: "Arjun Rao", role: "DevOps Engineer", exp: "5 yrs", loc: "Bengaluru", score: 88, stage: "Screened" },
];

const styles: Record<string, string> = {
  Applied: "bg-muted text-muted-foreground border-border",
  Screened: "bg-primary/10 text-primary border-primary/20",
  Interview: "bg-accent/10 text-accent border-accent/20",
  Offer: "bg-success/10 text-success border-success/20",
};

export default function Candidates() {
  return (
    <EmployerLayout>
      <PageHeader
        title="Candidates"
        description="Profiles applied or sourced for your roles."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          </>
        }
      />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search candidates by name, skill, or role…" className="pl-9 h-10" />
        </div>
      </Card>
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="font-medium px-4 py-3">Candidate</th>
                <th className="font-medium px-4 py-3">Role</th>
                <th className="font-medium px-4 py-3">Experience</th>
                <th className="font-medium px-4 py-3">Match</th>
                <th className="font-medium px-4 py-3">Stage</th>
                <th className="font-medium px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {data.map((c) => (
                <tr key={c.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border"><AvatarFallback className="bg-primary-soft text-primary text-xs font-semibold">{c.name.split(" ").map(w=>w[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <Link to={`/employer/candidates/${c.name.toLowerCase().replace(/\s+/g,"-")}`} className="font-semibold text-foreground hover:text-primary">{c.name}</Link>
                        <p className="text-xs text-muted-foreground">{c.loc}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.exp}</td>
                  <td className="px-4 py-3 w-48">
                    <div className="flex items-center gap-2">
                      <Progress value={c.score} className="h-1.5 flex-1" />
                      <span className="text-xs font-semibold text-foreground">{c.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className={styles[c.stage]}>{c.stage}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild size="sm" variant="ghost"><Link to={`/employer/candidates/${c.name.toLowerCase().replace(/\s+/g,"-")}`}>View</Link></Button>
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
