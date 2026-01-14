import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  default: "bg-secondary text-foreground",
};

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "primary" | "accent" | "success" | "default";
}

const StatsCard = ({ icon: Icon, label, value, subtext, variant = "default" }: StatsCardProps) => {
  const iconClass = variantStyles[variant] ?? variantStyles.default;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl", iconClass)}>
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
    </div>
  );
};

export default StatsCard;