// Global type definitions
interface Navigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
}

interface NetworkInformation {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Window {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
}

interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

interface IdleRequestOptions {
  timeout?: number;
}

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

// Extend Error for better error handling
interface AppError extends Error {
  code?: string;
  statusCode?: number;
  details?: unknown;
}
