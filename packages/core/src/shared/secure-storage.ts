import { StorageProvider } from './storage.js';

const KEY_STORAGE_NAME = '__abrazo_master_key';

/**
 * Cifrado real con AES-GCM 256 (Web Crypto API), no Base64.
 *
 * LÍMITE HONESTO que hay que documentar y no ocultar:
 * la clave simétrica se guarda en el mismo `baseStorage` (sin cifrar) porque
 * un cliente sin backend de autenticación no tiene otro lugar seguro donde
 * guardarla. Esto protege contra lectura casual de los datos guardados
 * (p. ej. un backup de disco, o que otra app en el mismo origen intente leer
 * el string a simple vista) pero NO protege contra alguien con acceso
 * completo al dispositivo o a las devtools. Para ese nivel de amenaza se
 * necesitaría derivar la clave de un secreto que el usuario ingresa (PIN) o
 * custodiarla en un backend. Ninguna de las dos cosas estaba en el texto
 * original, así que no se inventan aquí — se deja explícito como pendiente.
 */
export class SecureStorage implements StorageProvider {
  private keyPromise: Promise<CryptoKey> | null = null;

  constructor(private baseStorage: StorageProvider) {}

  async getItem(key: string): Promise<string | null> {
    const stored = await this.baseStorage.getItem(key);
    if (!stored) return null;
    try {
      const raw = base64ToBytes(stored);
      const iv = raw.slice(0, 12);
      const ciphertext = raw.slice(12);
      const cryptoKey = await this.getKey();
      const plainBuf = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        cryptoKey,
        ciphertext as BufferSource
      );
      return new TextDecoder().decode(plainBuf);
    } catch (e) {
      console.error('[SecureStorage] No se pudo desencriptar', key, e);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      const cryptoKey = await this.getKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        cryptoKey,
        new TextEncoder().encode(value) as BufferSource
      );
      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(ciphertext), iv.length);
      await this.baseStorage.setItem(key, bytesToBase64(combined));
    } catch (e) {
      console.error('[SecureStorage] Error cifrando', key, e);
    }
  }

  async removeItem(key: string): Promise<void> {
    await this.baseStorage.removeItem(key);
  }

  private getKey(): Promise<CryptoKey> {
    if (!this.keyPromise) this.keyPromise = this.loadOrCreateKey();
    return this.keyPromise;
  }

  private async loadOrCreateKey(): Promise<CryptoKey> {
    const existing = await this.baseStorage.getItem(KEY_STORAGE_NAME);
    if (existing) {
      const raw = base64ToBytes(existing);
      return crypto.subtle.importKey(
        'raw',
        raw as BufferSource,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    }
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const exported = await crypto.subtle.exportKey('raw', key);
    await this.baseStorage.setItem(KEY_STORAGE_NAME, bytesToBase64(new Uint8Array(exported)));
    return key;
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
