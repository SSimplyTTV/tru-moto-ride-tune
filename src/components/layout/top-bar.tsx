import { Battery, Bluetooth, BluetoothConnected } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopBarProps {
  batteryLevel: number;
  isBluetoothConnected: boolean;
  className?: string;
}

export function TopBar({ batteryLevel, isBluetoothConnected, className }: TopBarProps) {
  const getBatteryColor = (level: number) => {
    if (level > 50) return "text-electric-green";
    if (level > 20) return "text-warning-orange";
    return "text-destructive";
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border-b border-border",
      className
    )}>
      <div className="flex items-center gap-2">
        {isBluetoothConnected ? (
          <BluetoothConnected className="w-5 h-5 text-primary animate-pulse-glow" />
        ) : (
          <Bluetooth className="w-5 h-5 text-muted-foreground" />
        )}
        <span className={cn(
          "text-sm font-medium",
          isBluetoothConnected ? "text-primary" : "text-muted-foreground"
        )}>
          {isBluetoothConnected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Battery className={cn("w-5 h-5", getBatteryColor(batteryLevel))} />
        <span className={cn("text-sm font-bold", getBatteryColor(batteryLevel))}>
          {batteryLevel}%
        </span>
      </div>
    </div>
  );
}