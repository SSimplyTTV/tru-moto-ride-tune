import { TopBar } from "@/components/layout/top-bar";
import { SpeedDisplay } from "@/components/ui/speed-display";
import { DataCard } from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Battery, Zap, Thermometer, Settings2, Gauge } from "lucide-react";

interface DashboardProps {
  batteryLevel: number;
  isBluetoothConnected: boolean;
  rideData: {
    speed: number;
    voltage: number;
    current: number;
    temperature: number;
  };
  onTuningClick: () => void;
}

export function Dashboard({ 
  batteryLevel, 
  isBluetoothConnected, 
  rideData,
  onTuningClick 
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <TopBar 
        batteryLevel={batteryLevel} 
        isBluetoothConnected={isBluetoothConnected}
      />
      
      <div className="p-6 space-y-6">
        {/* Speed Display */}
        <div className="flex justify-center">
          <SpeedDisplay speed={rideData.speed} />
        </div>

        {/* Ride Data Grid */}
        <div className="grid grid-cols-2 gap-4">
          <DataCard
            title="Battery"
            value={rideData.voltage}
            unit="V"
            icon={<Battery className="w-5 h-5" />}
            variant="primary"
          />
          <DataCard
            title="Current"
            value={rideData.current}
            unit="A"
            icon={<Zap className="w-5 h-5" />}
            variant="default"
          />
          <DataCard
            title="Temperature"
            value={rideData.temperature}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            variant={rideData.temperature > 80 ? "warning" : "default"}
          />
          <DataCard
            title="Power"
            value={Math.round(rideData.voltage * rideData.current)}
            unit="W"
            icon={<Gauge className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Quick Tuning</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-16 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              onClick={onTuningClick}
            >
              <div className="flex flex-col items-center gap-1">
                <Settings2 className="w-5 h-5" />
                <span className="text-sm">Throttle</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-16 border-primary/30 hover:bg-primary/10 hover:border-primary/50"
              onClick={onTuningClick}
            >
              <div className="flex flex-col items-center gap-1">
                <Gauge className="w-5 h-5" />
                <span className="text-sm">Regen</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Status Messages */}
        {!isBluetoothConnected && (
          <div className="bg-warning-orange/10 border border-warning-orange/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-warning-orange">
              <div className="w-2 h-2 rounded-full bg-warning-orange animate-pulse"></div>
              <span className="text-sm font-medium">Controller disconnected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}