import { useState, useEffect, useCallback } from 'react';
import { bleService, TelemetryData, ThrottleCurve } from '@/services/bleService';
import { BleDevice } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

export function useBLE() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BleDevice | null>(null);
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<BleDevice[]>([]);

  // Initialize BLE service
  useEffect(() => {
    const initializeBLE = async () => {
      try {
        await bleService.initialize();
        setIsInitialized(true);
        
        // Load cached telemetry data
        const cached = bleService.getLastCachedTelemetry();
        if (cached) {
          setTelemetryData(cached);
        }
        
        // Set up callbacks
        bleService.onTelemetryUpdate((data) => {
          setTelemetryData(data);
        });
        
        bleService.onConnectionStatusChange((connected) => {
          setIsConnected(connected);
          setConnectedDevice(connected ? bleService.getConnectedDevice() : null);
        });
        
      } catch (error) {
        console.error('Failed to initialize BLE:', error);
        toast({
          title: "BLE Initialization Failed",
          description: "Failed to initialize Bluetooth. Please check permissions.",
          variant: "destructive",
        });
      }
    };

    initializeBLE();
  }, []);

  const scanForDevices = useCallback(async () => {
    if (!isInitialized) {
      toast({
        title: "BLE Not Ready",
        description: "Bluetooth is not initialized yet",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const devices = await bleService.scanForTruMoto();
      setAvailableDevices(devices);
      
      if (devices.length === 0) {
        toast({
          title: "No Devices Found",
          description: "No TruMoto controllers found nearby",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Scan failed:', error);
    } finally {
      setIsScanning(false);
    }
  }, [isInitialized]);

  const connectToDevice = useCallback(async (device: BleDevice) => {
    try {
      await bleService.connect(device);
    } catch (error) {
      console.error('Connection failed:', error);
    }
  }, []);

  const disconnect = useCallback(async () => {
    try {
      await bleService.disconnect();
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  }, []);

  const updateThrottleCurve = useCallback(async (curve: ThrottleCurve) => {
    try {
      await bleService.writeThrottleCurve(curve);
    } catch (error) {
      console.error('Failed to update throttle curve:', error);
      throw error;
    }
  }, []);

  const updateRegenBraking = useCallback(async (strength: number) => {
    try {
      await bleService.writeRegenBraking(strength);
    } catch (error) {
      console.error('Failed to update regen braking:', error);
      throw error;
    }
  }, []);

  return {
    isInitialized,
    isConnected,
    connectedDevice,
    telemetryData,
    isScanning,
    availableDevices,
    scanForDevices,
    connectToDevice,
    disconnect,
    updateThrottleCurve,
    updateRegenBraking,
  };
}