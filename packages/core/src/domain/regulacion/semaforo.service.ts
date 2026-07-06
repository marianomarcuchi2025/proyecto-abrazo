import { StorageProvider } from '../../shared/storage.js';
import { EventBus } from '../../shared/event-bus.js';

export type EstadoSemaforo = 'verde' | 'amarillo' | 'rojo';

export interface RegistroSemaforo {
  estado: EstadoSemaforo;
  timestamp: number;
  contexto?: string;
}

const MAX_HISTORIAL_RAM = 100;
const RETENCION_DIAS = 30;

export class SemaforoDelCuerpo {
  private historial: RegistroSemaforo[] = [];
  private ready: Promise<void>;

  constructor(private storage: StorageProvider, private storageKey = 'semaforo-historial') {
    this.ready = this.cargarHistorial();
  }

  async registrar(estado: EstadoSemaforo, contexto?: string): Promise<RegistroSemaforo> {
    await this.ready;
    const r: RegistroSemaforo = { estado, timestamp: Date.now(), contexto };
    this.historial.push(r);
    if (this.historial.length > MAX_HISTORIAL_RAM) this.historial.shift();
    await this.guardarLocalmente();
    EventBus.getInstance().dispatch('semaforo.cambio', r);
    return r;
  }

  async obtenerHistorial(dias?: number): Promise<RegistroSemaforo[]> {
    await this.ready;
    if (!dias) return [...this.historial];
    const desde = Date.now() - dias * 86400000;
    return this.historial.filter((r) => r.timestamp > desde);
  }

  private async guardarLocalmente(): Promise<void> {
    const limite = Date.now() - RETENCION_DIAS * 86400000;
    const dataFiltrada = this.historial.filter((r) => r.timestamp > limite);
    await this.storage.setItem(this.storageKey, JSON.stringify(dataFiltrada));
  }

  private async cargarHistorial(): Promise<void> {
    try {
      const raw = await this.storage.getItem(this.storageKey);
      const data = raw ? JSON.parse(raw) : [];
      this.historial = Array.isArray(data) ? data.slice(-MAX_HISTORIAL_RAM) : [];
    } catch {
      this.historial = [];
    }
  }
}
