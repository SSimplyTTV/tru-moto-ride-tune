import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bluetooth } from "lucide-react";
import truMotoLogo from "@/assets/trumoto-logo.png";

interface SplashProps {
  onConnect: () => void;
}

export function Splash({ onConnect }: SplashProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleConnect = () => {
    setIsLoading(true);
    // Simulate connection process
    setTimeout(() => {
      onConnect();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-sm">
        {/* Logo */}
        <div className="space-y-4">
          <img 
            src={truMotoLogo} 
            alt="TruMoto" 
            className="w-64 h-32 mx-auto object-contain"
          />
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto animate-pulse-glow"></div>
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Motorcycle Controller
          </h2>
          <p className="text-muted-foreground">
            Connect and customize your ride
          </p>
        </div>

        {/* Connect Button */}
        <Button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              Connecting...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Bluetooth className="w-5 h-5" />
              Connect Controller
            </div>
          )}
        </Button>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></div>
          Ready to connect
        </div>
      </div>
    </div>
  );
}