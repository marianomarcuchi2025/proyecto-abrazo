import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { TipoPostal } from '@abrazo/core';

const app = express();
app.use(helmet());

// BUG ORIGINAL: el default era '*' (cualquier origen). Para una app que
// maneja datos emocionales de menores, el default debería ser restrictivo;
// quien despliegue esto en producción tiene que fijar CORS_ORIGIN a propósito.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

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

const MAX_POSTALES_EN_MEMORIA = 5000;

interface PostalGuardada {
  tipo: TipoPostal;
  payload: Record<string, unknown>;
  recibidaEnServidor: number;
}

const postales: PostalGuardada[] = [];
const alertas: Array<{ contacto: unknown; timestamp: number }> = [];

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

app.post('/api/postales', (req, res) => {
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

  postales.push({ tipo, payload, recibidaEnServidor: Date.now() });
  // Sin esta poda, un array en memoria sin límite es una fuga de memoria
  // garantizada en un proceso de larga duración. Esto sigue siendo un MVP:
  // para producción esto necesita una base de datos real, no un array.
  if (postales.length > MAX_POSTALES_EN_MEMORIA) {
    postales.splice(0, postales.length - MAX_POSTALES_EN_MEMORIA);
  }

  res.status(201).json({ ok: true });
});

/**
 * Endpoint nuevo: el servicio de emergencia del cliente ahora depende de
 * una respuesta HTTP real para saber si la alerta se confirmó (ver el
 * comentario en emergencia.service.ts sobre por qué el canal SMS ya no se
 * reporta como fuente de verdad). Sin este endpoint, "activar()" nunca
 * podría devolver confirmado: true.
 */
app.post('/api/alertas-emergencia', (req, res) => {
  const { contacto, timestamp } = req.body ?? {};
  if (!contacto || typeof contacto !== 'object') {
    return res.status(400).json({ error: 'Contacto inválido' });
  }
  alertas.push({ contacto, timestamp: typeof timestamp === 'number' ? timestamp : Date.now() });
  // TODO real (fuera del alcance de este MVP): aquí es donde debería
  // dispararse una notificación push/SMS server-side de verdad, con
  // confirmación de entrega, en vez de depender del navegador del niño.
  res.status(201).json({ ok: true });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', postales: postales.length, alertas: alertas.length });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => console.log(`🛡️ Abrazo Server escuchando en puerto ${PORT}`));
}

export { app };
