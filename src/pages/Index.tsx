import { useState } from "react";
import { Splash } from "./Splash";
import { Dashboard } from "./Dashboard";
import { Tuning } from "./Tuning";
import { Profiles } from "./Profiles";
import { Settings } from "./Settings";
import { BottomNav } from "@/components/layout/bottom-nav";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<"splash" | "dashboard" | "tuning" | "profiles" | "settings">("splash");
  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);
  const [rideData] = useState({
    speed: 45,
    voltage: 48.2,
    current: 12.3,
    temperature: 65,
  });

  const handleConnect = () => {
    setIsBluetoothConnected(true);
    setCurrentScreen("dashboard");
  };

  const handleBluetoothToggle = () => {
    setIsBluetoothConnected(!isBluetoothConnected);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "splash":
        return <Splash onConnect={handleConnect} />;
      case "dashboard":
        return (
          <Dashboard
            batteryLevel={85}
            isBluetoothConnected={isBluetoothConnected}
            rideData={rideData}
            onTuningClick={() => setCurrentScreen("tuning")}
          />
        );
      case "tuning":
        return <Tuning onBack={() => setCurrentScreen("dashboard")} />;
      case "profiles":
        return <Profiles onBack={() => setCurrentScreen("dashboard")} />;
      case "settings":
        return (
          <Settings
            onBack={() => setCurrentScreen("dashboard")}
            isBluetoothConnected={isBluetoothConnected}
            onBluetoothToggle={handleBluetoothToggle}
          />
        );
      default:
        return <Dashboard
          batteryLevel={85}
          isBluetoothConnected={isBluetoothConnected}
          rideData={rideData}
          onTuningClick={() => setCurrentScreen("tuning")}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentScreen()}
      
      {currentScreen !== "splash" && (
        <BottomNav
          activeTab={currentScreen}
          onTabChange={setCurrentScreen}
        />
      )}
    </div>
  );
};

export default Index;
