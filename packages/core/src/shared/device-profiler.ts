export type DeviceTier = 'low' | 'mid' | 'high';

/**
 * navigator.deviceMemory es una API no estándar (solo Chromium). En
 * Safari/Firefox no existe, así que el fallback conservador ('low') es
 * intencional: preferimos infra-estimar el dispositivo antes que asumir
 * más capacidad de la real.
 */
export class DeviceProfiler {
  private static instance: DeviceProfiler;
  readonly tier: DeviceTier;

  private constructor() {
    const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & { deviceMemory?: number }) : undefined;
    const deviceMemory = nav?.deviceMemory ?? 2;
    const cores = nav?.hardwareConcurrency ?? 2;

    if (deviceMemory <= 2 || cores <= 2) this.tier = 'low';
    else if (deviceMemory >= 6 && cores >= 6) this.tier = 'high';
    else this.tier = 'mid';
  }

  static getInstance(): DeviceProfiler {
    if (!DeviceProfiler.instance) DeviceProfiler.instance = new DeviceProfiler();
    return DeviceProfiler.instance;
  }
}
