import { BleClient, BleDevice, ScanResult, numbersToDataView, dataViewToNumbers } from '@capacitor-community/bluetooth-le';
import { toast } from '@/hooks/use-toast';

// TruMoto Controller BLE UUIDs
const TRUMOTO_SERVICE_UUID = '12345678-1234-1234-1234-123456789abc';
const TELEMETRY_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789def';
const THROTTLE_CURVE_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789fed';
const REGEN_CHARACTERISTIC_UUID = '12345678-1234-1234-1234-123456789cba';

export interface TelemetryData {
  speed: number; // km/h
  batteryVoltage: number; // V
  motorCurrent: number; // A
  motorTemperature: number; // °C
  batteryPercentage: number; // %
}

export interface ThrottleCurve {
  points: [number, number, number, number, number]; // 5 power values for 0%, 25%, 50%, 75%, 100%
}

export class BLEService {
  private device: BleDevice | null = null;
  private isConnected = false;
  private onTelemetryCallback: ((data: TelemetryData) => void) | null = null;
  private onConnectionStatusCallback: ((connected: boolean) => void) | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  async initialize(): Promise<void> {
    try {
      await BleClient.initialize();
      console.log('BLE Client initialized');
    } catch (error) {
      console.error('Failed to initialize BLE:', error);
      throw error;
    }
  }

  async scanForTruMoto(): Promise<BleDevice[]> {
    try {
      const devices: BleDevice[] = [];
      
      await BleClient.requestLEScan(
        {
          services: [TRUMOTO_SERVICE_UUID],
        },
        (result: ScanResult) => {
          if (result.device.name?.includes('TruMoto')) {
            devices.push(result.device);
          }
        }
      );

      // Scan for 5 seconds
      await new Promise(resolve => setTimeout(resolve, 5000));
      await BleClient.stopLEScan();

      return devices;
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for TruMoto devices",
        variant: "destructive",
      });
      throw error;
    }
  }

  async connect(device: BleDevice): Promise<void> {
    try {
      await BleClient.connect(device.deviceId, this.onDisconnect.bind(this));
      this.device = device;
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Discover services and characteristics
      await this.setupCharacteristics();
      
      this.notifyConnectionStatus(true);
      
      toast({
        title: "Connected",
        description: `Connected to ${device.name || 'TruMoto Controller'}`,
      });

      console.log('Connected to TruMoto controller');
    } catch (error) {
      console.error('Connection failed:', error);
      this.isConnected = false;
      this.notifyConnectionStatus(false);
      
      toast({
        title: "Connection Failed",
        description: "Failed to connect to TruMoto controller",
        variant: "destructive",
      });
      
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await BleClient.disconnect(this.device.deviceId);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
    
    this.cleanup();
  }

  private async setupCharacteristics(): Promise<void> {
    if (!this.device) return;

    try {
      // Start notifications for telemetry data
      await BleClient.startNotifications(
        this.device.deviceId,
        TRUMOTO_SERVICE_UUID,
        TELEMETRY_CHARACTERISTIC_UUID,
        this.onTelemetryReceived.bind(this)
      );
    } catch (error) {
      console.error('Failed to setup characteristics:', error);
      throw error;
    }
  }

  private onTelemetryReceived(value: DataView): void {
    try {
      // Parse the telemetry data from the DataView
      // Assuming the data format: [speed(4), voltage(4), current(4), temperature(4), battery%(4)]
      const numbers = dataViewToNumbers(value);
      
      if (numbers.length >= 5) {
        const telemetry: TelemetryData = {
          speed: numbers[0],
          batteryVoltage: numbers[1],
          motorCurrent: numbers[2],
          motorTemperature: numbers[3],
          batteryPercentage: numbers[4],
        };

        // Cache the data
        localStorage.setItem('lastTelemetry', JSON.stringify(telemetry));
        
        if (this.onTelemetryCallback) {
          this.onTelemetryCallback(telemetry);
        }
      }
    } catch (error) {
      console.error('Failed to parse telemetry data:', error);
    }
  }

  private onDisconnect(): void {
    console.log('Device disconnected');
    this.isConnected = false;
    this.notifyConnectionStatus(false);
    
    toast({
      title: "Disconnected",
      description: "Lost connection to TruMoto controller",
      variant: "destructive",
    });

    // Attempt auto-reconnect
    this.attemptReconnect();
  }

  private async attemptReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || !this.device) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    this.reconnectTimeout = setTimeout(async () => {
      try {
        await this.connect(this.device!);
      } catch (error) {
        console.error('Reconnect failed:', error);
        this.attemptReconnect();
      }
    }, 2000 * this.reconnectAttempts); // Exponential backoff
  }

  async writeThrottleCurve(curve: ThrottleCurve): Promise<void> {
    if (!this.device || !this.isConnected) {
      throw new Error('Not connected to device');
    }

    try {
      const dataView = numbersToDataView(Array.from(curve.points));
      
      await BleClient.write(
        this.device.deviceId,
        TRUMOTO_SERVICE_UUID,
        THROTTLE_CURVE_CHARACTERISTIC_UUID,
        dataView
      );

      toast({
        title: "Throttle Curve Updated",
        description: "Successfully updated throttle curve settings",
      });
    } catch (error) {
      console.error('Failed to write throttle curve:', error);
      toast({
        title: "Update Failed", 
        description: "Failed to update throttle curve",
        variant: "destructive",
      });
      throw error;
    }
  }

  async writeRegenBraking(strength: number): Promise<void> {
    if (!this.device || !this.isConnected) {
      throw new Error('Not connected to device');
    }

    try {
      const dataView = numbersToDataView([strength]);
      
      await BleClient.write(
        this.device.deviceId,
        TRUMOTO_SERVICE_UUID,
        REGEN_CHARACTERISTIC_UUID,
        dataView
      );

      toast({
        title: "Regen Braking Updated",
        description: `Regen braking set to ${Math.round(strength * 100)}%`,
      });
    } catch (error) {
      console.error('Failed to write regen braking:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update regen braking",
        variant: "destructive",
      });
      throw error;
    }
  }

  getLastCachedTelemetry(): TelemetryData | null {
    try {
      const cached = localStorage.getItem('lastTelemetry');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  onTelemetryUpdate(callback: (data: TelemetryData) => void): void {
    this.onTelemetryCallback = callback;
  }

  onConnectionStatusChange(callback: (connected: boolean) => void): void {
    this.onConnectionStatusCallback = callback;
  }

  private notifyConnectionStatus(connected: boolean): void {
    if (this.onConnectionStatusCallback) {
      this.onConnectionStatusCallback(connected);
    }
  }

  private cleanup(): void {
    this.device = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.notifyConnectionStatus(false);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getConnectedDevice(): BleDevice | null {
    return this.device;
  }
}

// Singleton instance
export const bleService = new BLEService();