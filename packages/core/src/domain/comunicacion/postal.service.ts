import { StorageProvider } from '../../shared/storage.js';
import { NetworkService } from '../../shared/network.service.js';

export type TipoPostal = 'semaforo' | 'estrategia-usada' | 'alerta-emergencia';

export interface Postal {
  id: string;
  tipo: TipoPostal;
  timestamp: number;
  payload: Record<string, unknown>;
}

const MAX_COLA = 50;

export class ServicioPostal {
  private cola: Postal[] = [];
  private network: NetworkService;
  private ready: Promise<void>;

  constructor(private storage: StorageProvider, private endpoint = '/api/postales', apiKey?: string) {
    this.network = new NetworkService(storage, apiKey);
    this.ready = this.cargarCola();
  }

  async encolar(tipo: TipoPostal, payload: Record<string, unknown>): Promise<Postal> {
    await this.ready;
    const postal: Postal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      tipo,
      timestamp: Date.now(),
      payload,
    };
    this.cola.push(postal);
    if (this.cola.length > MAX_COLA) this.cola.shift();
    await this.guardarCola();
    // NetworkService ya maneja reintentos y cola offline internamente.
    void this.network.request(this.endpoint, postal, { tipo: postal.tipo });
    return postal;
  }

  private async guardarCola(): Promise<void> {
    try {
      await this.storage.setItem('postales-cola', JSON.stringify(this.cola));
    } catch {
      /* no-op: pérdida aceptable de la copia local, el envío real ya está en NetworkService */
    }
  }

  private async cargarCola(): Promise<void> {
    try {
      const raw = await this.storage.getItem('postales-cola');
      this.cola = raw ? (JSON.parse(raw) as Postal[]) : [];
    } catch {
      this.cola = [];
    }
  }
}
