import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { JsonFileStore } from './persistence.js';

test('agrega y devuelve items, respetando el orden', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-store-'));
  try {
    const store = new JsonFileStore<{ n: number }>(path.join(dir, 'x.json'), 100);
    await store.agregar({ n: 1 });
    await store.agregar({ n: 2 });
    assert.deepEqual(await store.todos(), [{ n: 1 }, { n: 2 }]);
    assert.equal(await store.cantidad(), 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('respeta el límite máximo, descartando los más viejos', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-store-'));
  try {
    const store = new JsonFileStore<{ n: number }>(path.join(dir, 'x.json'), 3);
    for (let i = 1; i <= 5; i++) await store.agregar({ n: i });
    assert.deepEqual(await store.todos(), [{ n: 3 }, { n: 4 }, { n: 5 }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('una nueva instancia con el mismo archivo recarga lo guardado', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-store-'));
  try {
    const filePath = path.join(dir, 'x.json');
    const store1 = new JsonFileStore<{ n: number }>(filePath, 100);
    await store1.agregar({ n: 42 });

    const store2 = new JsonFileStore<{ n: number }>(filePath, 100);
    assert.deepEqual(await store2.todos(), [{ n: 42 }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('si el archivo no existe todavía, arranca vacío sin lanzar', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'abrazo-store-'));
  try {
    const store = new JsonFileStore<{ n: number }>(path.join(dir, 'no-existe.json'), 100);
    assert.deepEqual(await store.todos(), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
