import { LucideIcon, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta: number;
  icon: LucideIcon;
  tint?: "primary" | "success" | "warning" | "accent";
  link?: string;
}

const tints = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/10 text-accent",
};

export function StatCard({ label, value, delta, icon: Icon, tint = "primary", link }: StatCardProps) {
  const positive = delta >= 0;
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow border-border/60 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground tracking-tight">{value}</p>
          <div
            className={cn(
              "mt-3 inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}
          >
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}
            {delta}% vs last month
          </div>
        </div>
        <div className={cn("h-11 w-11 rounded-lg flex items-center justify-center shrink-0", tints[tint])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {link && (
        <div className="mt-auto pt-4">
          <Link
            to={link}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            View <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </Card>
  );
}
