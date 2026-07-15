import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import type { AddressInfo } from 'net';
import { contieneClaveProhibida, createApp } from './server.js';

test('detecta clave prohibida en el primer nivel', () => {
  assert.equal(contieneClaveProhibida({ hrv: 70 }), true);
});

test('detecta clave prohibida anidada (bug original: solo miraba el primer nivel)', () => {
  assert.equal(contieneClaveProhibida({ datos: { anidado: { hrv: 70 } } }), true);
});

test('no marca payloads legítimos como prohibidos', () => {
  assert.equal(contieneClaveProhibida({ estado: 'rojo', contexto: 'recreo' }), false);
});

/** Levanta createApp() en un puerto efímero y devuelve la URL base + una función para cerrarlo. */
async function levantar(opciones: Parameters<typeof createApp>[0]) {
  const app = createApp(opciones);
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    cerrar: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}

test('sin API_KEY configurada, /api/postales acepta pedidos sin Authorization', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-test-'));
  const { baseUrl, cerrar } = await levantar({ dataDir });
  try {
    const res = await fetch(`${baseUrl}/api/postales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'semaforo', payload: { estado: 'verde' } }),
    });
    assert.equal(res.status, 201);

    const salud = (await (await fetch(`${baseUrl}/api/health`)).json()) as {
      status: string;
      postales: number;
      alertas: number;
      autenticado: boolean;
    };
    assert.equal(salud.autenticado, false);
    assert.equal(salud.postales, 1);
  } finally {
    await cerrar();
    await rm(dataDir, { recursive: true, force: true });
  }
});

test('con API_KEY configurada, rechaza pedidos sin token o con token incorrecto', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-test-'));
  const { baseUrl, cerrar } = await levantar({ dataDir, apiKey: 'secreto-123' });
  try {
    const sinToken = await fetch(`${baseUrl}/api/postales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'semaforo', payload: { estado: 'verde' } }),
    });
    assert.equal(sinToken.status, 401);

    const tokenMalo = await fetch(`${baseUrl}/api/postales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer no-es-el-secreto' },
      body: JSON.stringify({ tipo: 'semaforo', payload: { estado: 'verde' } }),
    });
    assert.equal(tokenMalo.status, 401);

    const tokenBueno = await fetch(`${baseUrl}/api/postales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer secreto-123' },
      body: JSON.stringify({ tipo: 'semaforo', payload: { estado: 'verde' } }),
    });
    assert.equal(tokenBueno.status, 201);
  } finally {
    await cerrar();
    await rm(dataDir, { recursive: true, force: true });
  }
});

test('/api/alertas-emergencia acepta múltiples contactos y los persiste', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-test-'));
  const { baseUrl, cerrar } = await levantar({ dataDir });
  try {
    const res = await fetch(`${baseUrl}/api/alertas-emergencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactos: [
          { nombre: 'Ana', telefono: '5551234' },
          { nombre: 'Luis', telefono: '5555678' },
        ],
        timestamp: Date.now(),
      }),
    });
    assert.equal(res.status, 201);

    const salud = (await (await fetch(`${baseUrl}/api/health`)).json()) as {
      status: string;
      postales: number;
      alertas: number;
      autenticado: boolean;
    };
    assert.equal(salud.alertas, 1);
  } finally {
    await cerrar();
    await rm(dataDir, { recursive: true, force: true });
  }
});

test('/api/alertas-emergencia rechaza sin contactos o con contacto inválido', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-test-'));
  const { baseUrl, cerrar } = await levantar({ dataDir });
  try {
    const sinContactos = await fetch(`${baseUrl}/api/alertas-emergencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactos: [] }),
    });
    assert.equal(sinContactos.status, 400);

    const contactoInvalido = await fetch(`${baseUrl}/api/alertas-emergencia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactos: [{ nombre: 'Ana' }] }),
    });
    assert.equal(contactoInvalido.status, 400);
  } finally {
    await cerrar();
    await rm(dataDir, { recursive: true, force: true });
  }
});

test('la persistencia sobrevive a "reiniciar" el servidor (nueva instancia, mismo dataDir)', async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-test-'));
  try {
    const primera = await levantar({ dataDir });
    await fetch(`${primera.baseUrl}/api/postales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'semaforo', payload: { estado: 'rojo' } }),
    });
    await primera.cerrar();

    // "Reinicio": nueva app, nuevo puerto, mismo dataDir en disco.
    const segunda = await levantar({ dataDir });
    const salud = (await (await fetch(`${segunda.baseUrl}/api/health`)).json()) as {
      status: string;
      postales: number;
      alertas: number;
      autenticado: boolean;
    };
    assert.equal(salud.postales, 1, 'la postal guardada antes de "reiniciar" debe seguir contada');
    await segunda.cerrar();
  } finally {
    await rm(dataDir, { recursive: true, force: true });
  }
});
