import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { timingSafeEqual } from 'crypto';
import * as path from 'path';
import type { TipoPostal } from '@abrazo/core';
import { JsonFileStore } from './persistence.js';

const ALLOWED_TIPOS: TipoPostal[] = ['semaforo', 'estrategia-usada', 'alerta-emergencia'];

// Coincidencias de subcadena a propósito ("hr" matchea "hrv", etc. via includes),
// igual que en el documento original.
const FORBIDDEN_KEYS = [
  'frecuenciacardiaca',
  'hrv',
  'grabacionvoz',
  'audio',
  'fotos',
  'geolocationexact',
];

const MAX_ITEMS_POR_COLECCION = 5000;

interface PostalGuardada {
  tipo: TipoPostal;
  payload: Record<string, unknown>;
  recibidaEnServidor: number;
}

interface ContactoAlerta {
  nombre: string;
  telefono: string;
}

interface AlertaGuardada {
  contactos: ContactoAlerta[];
  timestamp: number;
  recibidaEnServidor: number;
}

/**
 * BUG ORIGINAL: el filtro solo miraba Object.keys(payload) de primer nivel.
 * Un payload como { datos: { hrv: 123 } } pasaba sin problema porque "hrv"
 * está anidado. Esta versión recorre el objeto recursivamente.
 */
export function contieneClaveProhibida(value: unknown, profundidad = 0): boolean {
  if (profundidad > 5 || value === null || typeof value !== 'object') return false;

  for (const key of Object.keys(value as Record<string, unknown>)) {
    const normalizada = key.toLowerCase().replace(/[^a-z]/g, '');
    if (FORBIDDEN_KEYS.some((fk) => normalizada.includes(fk))) return true;
    if (contieneClaveProhibida((value as Record<string, unknown>)[key], profundidad + 1)) return true;
  }
  return false;
}

/** Comparación en tiempo constante para no filtrar el API key por timing attack. */
function tokensIguales(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export interface CrearAppOpciones {
  /** Directorio donde se guardan postales.json y alertas.json. Default: $DATA_DIR o ./data */
  dataDir?: string;
  /**
   * Si se define, todos los pedidos a /api/* deben incluir
   * `Authorization: Bearer <apiKey>`. Si no se define (ni acá ni en la env
   * var API_KEY), el servidor arranca sin autenticación — aceptable para
   * probar en localhost, NO para exponer a internet público.
   */
  apiKey?: string;
  corsOrigin?: string;
}

export function createApp(opciones: CrearAppOpciones = {}) {
  const dataDir = opciones.dataDir ?? process.env.DATA_DIR ?? path.join(process.cwd(), 'data');
  const apiKey = opciones.apiKey ?? process.env.API_KEY ?? undefined;
  // BUG ORIGINAL: el default era '*' (cualquier origen). Para una app que
  // maneja datos emocionales de menores, el default debería ser restrictivo;
  // quien despliegue esto en producción tiene que fijar CORS_ORIGIN a propósito.
  const corsOrigin = opciones.corsOrigin ?? process.env.CORS_ORIGIN ?? 'http://localhost:3000';

  if (!apiKey) {
    console.warn(
      '[Abrazo Server] ADVERTENCIA: arrancando SIN autenticación (no hay API_KEY configurada). ' +
        'Cualquiera con la URL puede escribir postales y alertas de emergencia falsas. ' +
        'No exponer así a una red que no sea de confianza. Ver README/SECURITY.md.'
    );
  }

  const postales = new JsonFileStore<PostalGuardada>(path.join(dataDir, 'postales.json'), MAX_ITEMS_POR_COLECCION);
  const alertas = new JsonFileStore<AlertaGuardada>(path.join(dataDir, 'alertas.json'), MAX_ITEMS_POR_COLECCION);

  const app = express();
  app.use(helmet());
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json({ limit: '10kb' }));

  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
  app.use('/api/', limiter);

  // Autenticación mínima: un único API key compartido por instancia (no hay
  // cuentas de usuario ni por-dispositivo). Suficiente para que un
  // despliegue self-hosted no quede abierto a cualquiera en internet;
  // insuficiente para distinguir qué dispositivo/familia mandó qué dato —
  // eso sigue pendiente (ver AUDIT.md).
  app.use('/api/', (req, res, next) => {
    if (!apiKey) return next();
    const header = req.header('authorization') || '';
    const provisto = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!provisto || !tokensIguales(provisto, apiKey)) {
      return res.status(401).json({ error: 'No autorizado' });
    }
    next();
  });

  app.post('/api/postales', async (req, res) => {
    const { tipo, payload } = req.body ?? {};
    if (!tipo || !ALLOWED_TIPOS.includes(tipo)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Payload inválido' });
    }
    if (contieneClaveProhibida(payload)) {
      return res.status(400).json({ error: 'Datos biométricos no permitidos' });
    }

    await postales.agregar({ tipo, payload, recibidaEnServidor: Date.now() });
    res.status(201).json({ ok: true });
  });

  /**
   * GAP CORREGIDO EN PASADA 5/6: antes el cliente solo mandaba UN contacto
   * (`contacto: {...}`), aunque el modelo de datos del cliente siempre
   * soportó varios. Ahora acepta `contactos: [...]` (array, al menos uno).
   */
  app.post('/api/alertas-emergencia', async (req, res) => {
    const { contactos, timestamp } = req.body ?? {};
    if (!Array.isArray(contactos) || contactos.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un contacto' });
    }
    const todosValidos = contactos.every(
      (c: unknown) =>
        c !== null &&
        typeof c === 'object' &&
        typeof (c as Record<string, unknown>).nombre === 'string' &&
        typeof (c as Record<string, unknown>).telefono === 'string'
    );
    if (!todosValidos) {
      return res.status(400).json({ error: 'Contacto inválido' });
    }

    await alertas.agregar({
      contactos: contactos as ContactoAlerta[],
      timestamp: typeof timestamp === 'number' ? timestamp : Date.now(),
      recibidaEnServidor: Date.now(),
    });
    // TODO real (fuera del alcance de este MVP): aquí es donde debería
    // dispararse una notificación push/SMS server-side de verdad, con
    // confirmación de entrega, en vez de depender del navegador del niño.
    res.status(201).json({ ok: true });
  });

  app.get('/api/health', async (_req, res) => {
    res.json({
      status: 'ok',
      postales: await postales.cantidad(),
      alertas: await alertas.cantidad(),
      autenticado: !!apiKey,
    });
  });

  return app;
}

export const app = createApp();

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => console.log(`🛡️ Abrazo Server escuchando en puerto ${PORT}`));
}
