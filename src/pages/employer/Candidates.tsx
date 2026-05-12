import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Download, Plus } from "lucide-react";
import { EmployerLayout } from "@/components/EmployerLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Candidate {
  name: string;
  role: string;
  exp: string;
  loc: string;
  score: number;
  stage: "Applied" | "Screened" | "Interview" | "Offer";
}

const initialData: Candidate[] = [
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
  const [data, setData] = useState<Candidate[]>(initialData);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [exp, setExp] = useState("");
  const [loc, setLoc] = useState("");
  const [score, setScore] = useState("");
  const [stage, setStage] = useState<Candidate["stage"]>("Applied");

  const filtered = data.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.loc.toLowerCase().includes(q);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !loc.trim()) {
      toast.error("Name, role and location are required.");
      return;
    }
    const numScore = Math.max(0, Math.min(100, Number(score) || 0));
    const newCandidate: Candidate = {
      name: name.trim(),
      role: role.trim(),
      exp: exp.trim() || "—",
      loc: loc.trim(),
      score: numScore,
      stage,
    };
    setData((prev) => [newCandidate, ...prev]);
    toast.success(`${newCandidate.name} added to candidates.`);
    setOpen(false);
    setName(""); setRole(""); setExp(""); setLoc(""); setScore(""); setStage("Applied");
  };

  return (
    <EmployerLayout>
      <PageHeader
        title="Candidates"
        description="Profiles applied or sourced for your roles."
        actions={
          <>
            <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
            <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button className="gap-2 shadow-brand" onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4" /> Add candidate
            </Button>
          </>
        }
      />
      <Card className="p-4 mb-4 border-border/60 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, skill, or role…"
            className="pl-9 h-10"
          />
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
              {filtered.map((c) => (
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Add candidate</DialogTitle>
            <DialogDescription>Manually source a candidate into the pipeline.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="c-name">Full name</Label>
                <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Anya Sharma" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-role">Role</Label>
                <Input id="c-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Backend Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-exp">Experience</Label>
                <Input id="c-exp" value={exp} onChange={(e) => setExp(e.target.value)} placeholder="e.g. 4 yrs" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-loc">Location</Label>
                <Input id="c-loc" value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="e.g. Bengaluru" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-score">Match score</Label>
                <Input id="c-score" type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} placeholder="0–100" />
              </div>
              <div className="space-y-2">
                <Label>Stage</Label>
                <Select value={stage} onValueChange={(v) => setStage(v as Candidate["stage"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Screened">Screened</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Add candidate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </EmployerLayout>
  );
}
