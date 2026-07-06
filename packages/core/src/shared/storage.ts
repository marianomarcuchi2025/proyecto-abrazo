/**
 * StorageProvider es asíncrono a propósito.
 *
 * BUG ORIGINAL: la versión previa de este archivo definía getItem/setItem como
 * síncronos. Eso hacía imposible usar Web Crypto API (que es 100% asíncrona)
 * en SecureStorage, y por eso terminó implementado con Base64 (que no es
 * cifrado). Ver secure-storage.ts para el cifrado real.
 */
export interface StorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export class BrowserStorage implements StorageProvider {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('[BrowserStorage] Storage lleno o no disponible', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

/** Útil para tests y para entornos sin `window` (Node/servidor). */
export class MemoryStorage implements StorageProvider {
  private store: Record<string, string> = {};

  async getItem(key: string): Promise<string | null> {
    return key in this.store ? this.store[key] : null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.store[key] = value;
  }

  async removeItem(key: string): Promise<void> {
    delete this.store[key];
  }
}
