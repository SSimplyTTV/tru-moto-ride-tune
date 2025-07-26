import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DataCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "warning";
  className?: string;
}

export function DataCard({ 
  title, 
  value, 
  unit, 
  icon, 
  variant = "default",
  className 
}: DataCardProps) {
  return (
    <div className={cn(
      "rounded-lg p-4 transition-all duration-300",
      "bg-gradient-to-br from-card to-card/80 border border-border",
      "hover:shadow-lg hover:shadow-primary/10",
      variant === "primary" && "border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10",
      variant === "warning" && "border-warning-orange/30 bg-gradient-to-br from-warning-orange/5 to-warning-orange/10",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <div className="flex items-end gap-1">
        <span className={cn(
          "text-2xl font-bold",
          variant === "primary" && "text-data-value",
          variant === "warning" && "text-warning-orange",
          variant === "default" && "text-foreground"
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground mb-1">{unit}</span>
        )}
      </div>
    </div>
  );
}