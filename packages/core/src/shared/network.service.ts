import { StorageProvider } from './storage.js';
import { DeviceProfiler } from './device-profiler.js';

interface QueuedRequest {
  url: string;
  body: unknown;
}

export class NetworkService {
  private isOnline: boolean;
  private queue: QueuedRequest[] = [];
  private ready: Promise<void>;

  constructor(private storage: StorageProvider) {
    // BUG encontrado al probar en tiempo de ejecución (no era visible solo
    // leyendo el código): en entornos donde existe un `navigator` parcial
    // sin `.onLine` (p. ej. Node 21+, algunos webviews/workers),
    // `navigator.onLine` es `undefined` -> falsy -> este servicio se creía
    // "offline" para siempre. Ahora solo se confía en `.onLine` si es
    // explícitamente un booleano; si no, se asume online por defecto.
    this.isOnline =
      typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;

    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        void this.flushQueue();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }

    this.ready = this.loadQueue().then(() => {
      // BUG ORIGINAL: si la app se recargaba estando online con mensajes
      // pendientes de una sesión anterior, quedaban varados hasta el
      // próximo ciclo offline->online (que podía no llegar nunca).
      if (this.isOnline) return this.flushQueue();
    });
  }

  async request(url: string, body: unknown): Promise<boolean> {
    await this.ready;

    if (!this.isOnline) {
      this.queue.push({ url, body });
      await this.saveQueue();
      return false;
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Server respondió ${res.status}`);
      return true;
    } catch {
      this.queue.push({ url, body });
      await this.saveQueue();
      return false;
    }
  }

  private async flushQueue(): Promise<void> {
    if (this.queue.length === 0) return;

    const batchSize = DeviceProfiler.getInstance().tier === 'low' ? 3 : 15;
    const toSend = this.queue.splice(0, batchSize);

    for (let i = 0; i < toSend.length; i++) {
      const item = toSend[i];
      try {
        const res = await fetch(item.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.body),
        });
        if (!res.ok) throw new Error(`Server respondió ${res.status}`);
      } catch {
        // BUG ORIGINAL: los items restantes de `toSend` se perdían para
        // siempre porque ya habían sido removidos de this.queue por el
        // splice() de arriba y nunca se reinsertaban. Se re-encolan aquí.
        this.queue.unshift(...toSend.slice(i));
        break;
      }
    }
    await this.saveQueue();
  }

  private async saveQueue(): Promise<void> {
    await this.storage.setItem('network-queue', JSON.stringify(this.queue));
  }

  private async loadQueue(): Promise<void> {
    try {
      const raw = await this.storage.getItem('network-queue');
      this.queue = raw ? (JSON.parse(raw) as QueuedRequest[]) : [];
    } catch {
      this.queue = [];
    }
  }
}
