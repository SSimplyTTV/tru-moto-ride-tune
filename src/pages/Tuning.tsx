import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TuningProps {
  onBack: () => void;
}

export function Tuning({ onBack }: TuningProps) {
  const [throttleCurve, setThrottleCurve] = useState([50]);
  const [regenStrength, setRegenStrength] = useState([30]);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Tuning parameters updated successfully",
    });
  };

  const handleReset = () => {
    setThrottleCurve([50]);
    setRegenStrength([30]);
    toast({
      title: "Settings Reset",
      description: "All values restored to defaults",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Tuning</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Throttle Curve */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-primary/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Throttle Response</h3>
              <span className="text-2xl font-bold text-primary">{throttleCurve[0]}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Gentle</span>
                <span>Aggressive</span>
              </div>
              <Slider
                value={throttleCurve}
                onValueChange={setThrottleCurve}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Visual representation */}
            <div className="h-24 bg-secondary/20 rounded-lg relative overflow-hidden">
              <div 
                className="absolute bottom-0 left-0 bg-gradient-to-t from-primary to-primary/60 transition-all duration-300 rounded-t-lg"
                style={{ 
                  width: '100%', 
                  height: `${throttleCurve[0]}%`,
                  clipPath: 'polygon(0 100%, 100% 0, 100% 100%)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground font-medium">Throttle Curve</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Regenerative Braking */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/80 border-electric-green/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Regenerative Braking</h3>
              <span className="text-2xl font-bold text-electric-green">{regenStrength[0]}%</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Minimal</span>
                <span>Maximum</span>
              </div>
              <Slider
                value={regenStrength}
                onValueChange={setRegenStrength}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            {/* Energy recovery indicator */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Energy Recovery</span>
              <span className="text-electric-green font-medium">
                {regenStrength[0] > 70 ? "High" : regenStrength[0] > 40 ? "Medium" : "Low"}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 border-muted-foreground/30 hover:bg-secondary/50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}