import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Bluetooth, Smartphone, Info, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  onBack: () => void;
  isBluetoothConnected: boolean;
  onBluetoothToggle: () => void;
}

export function Settings({ onBack, isBluetoothConnected, onBluetoothToggle }: SettingsProps) {
  const { toast } = useToast();

  const handleFirmwareCheck = () => {
    toast({
      title: "Checking for Updates",
      description: "Your firmware is up to date",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Bluetooth Settings */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Bluetooth className="w-5 h-5" />
              Bluetooth
            </h3>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Controller Connection</p>
                <p className="text-sm text-muted-foreground">
                  {isBluetoothConnected ? "Connected to TruMoto Controller" : "Not connected"}
                </p>
              </div>
              <Switch 
                checked={isBluetoothConnected} 
                onCheckedChange={onBluetoothToggle}
              />
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={onBluetoothToggle}
            >
              {isBluetoothConnected ? "Disconnect" : "Scan for Devices"}
            </Button>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              App Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-Connect</p>
                  <p className="text-sm text-muted-foreground">Automatically connect on app start</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Keep Screen On</p>
                  <p className="text-sm text-muted-foreground">Prevent screen timeout while riding</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </Card>

        {/* Firmware Updates */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Download className="w-5 h-5" />
              Firmware
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Controller Firmware</p>
                  <p className="text-sm text-muted-foreground">Version 2.1.3</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleFirmwareCheck}>
                  Check
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Info className="w-5 h-5" />
              About
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">App Version</span>
                <span>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Build</span>
                <span>2024.01.001</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <Button variant="ghost" className="w-full justify-start p-0 h-auto text-primary">
                Support & Contact
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}