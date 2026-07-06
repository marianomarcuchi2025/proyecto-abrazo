import { StorageProvider } from '../../shared/storage.js';
import { EventBus } from '../../shared/event-bus.js';
import { NetworkService } from '../../shared/network.service.js';

export interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  relacion: string;
}

export interface ProtocoloEmergencia {
  contactos: ContactoEmergencia[];
  mensajeSMS: string;
}

export type ResultadoActivacion =
  | { canal: 'cooldown'; confirmado: true }
  // 'confirmado' aquí viene de la respuesta HTTP del backend: es la única
  // vía verificable de que alguien del otro lado recibió la alerta.
  | { canal: 'red'; confirmado: boolean }
  | { canal: 'sin-configurar'; confirmado: false };

const COOLDOWN_MS = 30_000;

interface SemaforoEventoLike {
  estado?: string;
}

export class ServicioEmergencia {
  private lastActivated = 0;
  private protocolo: ProtocoloEmergencia | null = null;
  private ready: Promise<void>;
  private network: NetworkService;

  constructor(private storage: StorageProvider, private alertUrl: string = '/api/alertas-emergencia') {
    this.network = new NetworkService(storage);
    this.ready = this.cargarProtocolo();

    EventBus.getInstance().on<SemaforoEventoLike>('semaforo.cambio', (registro) => {
      if (registro?.estado === 'rojo') {
        console.log(
          '[Emergencia] Semáforo en rojo detectado. No se activa la alerta automáticamente: se requiere confirmación explícita del usuario en el modal.'
        );
      }
    });
  }

  async configurarProtocolo(protocolo: ProtocoloEmergencia): Promise<void> {
    // BUG encontrado al correr los tests (no era visible leyendo el código):
    // si esto se llamaba antes de que terminara la carga inicial del
    // constructor (`cargarProtocolo()`), esa carga podía resolver *después*
    // y pisar `this.protocolo` con `null`, perdiendo el contacto recién
    // guardado. Esperar `this.ready` primero fuerza el orden correcto.
    await this.ready;
    this.protocolo = protocolo;
    await this.storage.setItem('emergencia-protocolo', JSON.stringify(protocolo));
  }

  async tieneProtocoloConfigurado(): Promise<boolean> {
    await this.ready;
    return !!this.protocolo && this.protocolo.contactos.length > 0;
  }

  async obtenerProtocolo(): Promise<ProtocoloEmergencia | null> {
    await this.ready;
    return this.protocolo;
  }

  async activar(): Promise<ResultadoActivacion> {
    await this.ready;
    const now = Date.now();

    if (now - this.lastActivated < COOLDOWN_MS) {
      return { canal: 'cooldown', confirmado: true };
    }
    if (!this.protocolo || this.protocolo.contactos.length === 0) {
      return { canal: 'sin-configurar', confirmado: false };
    }

    this.lastActivated = now;
    const contacto = this.protocolo.contactos[0];
    const mensaje = this.protocolo.mensajeSMS.replace('{nombre}', contacto.nombre);

    /**
     * CORRECCIÓN DE SEGURIDAD (bug original más grave del documento):
     * antes se hacía `window.location.href = 'sms:...'` y eso se reportaba
     * como éxito (`exito: true`) con solo no haber lanzado una excepción.
     * Pero asignar ese href NUNCA lanza excepción aunque el dispositivo no
     * tenga forma de mandar SMS (la mayoría de escritorios, muchos
     * Android/iOS sin SIM) — así que la app podía decirle a un niño en
     * crisis "ya viene un abrazo" sin que nadie se hubiera enterado.
     *
     * Ahora la única vía que se reporta como "confirmado" es la petición
     * de red al backend (fetch con respuesta HTTP real). El intento de
     * abrir la app de SMS/WhatsApp se sigue disparando como ayuda
     * adicional para el adulto que esté cerca, pero nunca como fuente de
     * verdad de que la alerta llegó a alguien.
     */
    const confirmadoPorRed = await this.network.request(this.alertUrl, {
      tipo: 'alerta-emergencia',
      contacto: { nombre: contacto.nombre, telefono: contacto.telefono },
      timestamp: now,
    });

    this.intentarCanalesDirectos(contacto.telefono, mensaje);

    return { canal: 'red', confirmado: confirmadoPorRed };
  }

  /** Best-effort, nunca se usa para decidir si la alerta "tuvo éxito". */
  private intentarCanalesDirectos(telefono: string, mensaje: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.location.href = `sms:${telefono}?body=${encodeURIComponent(mensaje)}`;
    } catch (e) {
      console.warn('[Emergencia] No se pudo abrir la app de SMS', e);
    }
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      try {
        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
      } catch (e) {
        console.warn('[Emergencia] No se pudo abrir WhatsApp', e);
      }
    }
  }

  private async cargarProtocolo(): Promise<void> {
    try {
      const raw = await this.storage.getItem('emergencia-protocolo');
      this.protocolo = raw ? (JSON.parse(raw) as ProtocoloEmergencia) : null;
    } catch {
      this.protocolo = null;
    }
  }
}
