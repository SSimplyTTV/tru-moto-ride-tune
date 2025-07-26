import { cn } from "@/lib/utils";

interface SpeedDisplayProps {
  speed: number;
  unit?: string;
  className?: string;
}

export function SpeedDisplay({ speed, unit = "MPH", className }: SpeedDisplayProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 rounded-2xl",
      "bg-gradient-to-br from-card via-card/90 to-card/80",
      "border-2 border-primary/20 shadow-lg shadow-primary/10",
      "transition-all duration-300 hover:border-primary/30",
      className
    )}>
      <div className="text-6xl font-bold text-speed-display mb-2 animate-speed-update">
        {speed}
      </div>
      <div className="text-lg text-primary font-semibold uppercase tracking-wider">
        {unit}
      </div>
      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-2 animate-pulse-glow"></div>
    </div>
  );
}