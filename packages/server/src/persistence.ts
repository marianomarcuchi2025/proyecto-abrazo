import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Almacenamiento en disco simple, basado en un archivo JSON por colección,
 * con escritura atómica (escribe a un .tmp y renombra) para no corromper
 * el archivo si el proceso se cae a mitad de una escritura.
 *
 * LÍMITE HONESTO: esto NO es una base de datos. No hay transacciones, no
 * hay índices, no soporta escrituras concurrentes seguras desde múltiples
 * procesos, y reescribe el archivo completo en cada `agregar()` (O(n) por
 * escritura). Para el volumen de un MVP de una sola instancia (miles de
 * registros, un solo proceso Node) es correcto y evita perder todo al
 * reiniciar — que es el problema real que tenía el array en memoria
 * (AUDIT.md, punto 10). Para producción con más de una instancia o
 * volumen serio, esto necesita convertirse en una base de datos real
 * (Postgres/SQLite con locking adecuado), como ya estaba documentado
 * como pendiente.
 */
export class JsonFileStore<T> {
  private items: T[] = [];
  private ready: Promise<void>;

  constructor(private filePath: string, private maxItems: number) {
    this.ready = this.cargar();
  }

  private async cargar(): Promise<void> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(raw);
      this.items = Array.isArray(data) ? data.slice(-this.maxItems) : [];
    } catch (e) {
      const err = e as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        console.error(`[JsonFileStore] No se pudo leer ${this.filePath}, arrancando vacío:`, err.message);
      }
      this.items = [];
    }
  }

  async listo(): Promise<void> {
    await this.ready;
  }

  async agregar(item: T): Promise<void> {
    await this.ready;
    this.items.push(item);
    if (this.items.length > this.maxItems) {
      this.items.splice(0, this.items.length - this.maxItems);
    }
    await this.persistir();
  }

  async todos(): Promise<readonly T[]> {
    await this.ready;
    return this.items;
  }

  async cantidad(): Promise<number> {
    await this.ready;
    return this.items.length;
  }

  private async persistir(): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(this.items), 'utf-8');
    await fs.rename(tmp, this.filePath);
  }
}
