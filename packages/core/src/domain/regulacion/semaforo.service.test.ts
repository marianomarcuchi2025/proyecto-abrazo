import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage } from '../../shared/storage.js';
import { SemaforoDelCuerpo } from './semaforo.service.js';

test('registra un estado y lo devuelve en el historial', async () => {
  const semaforo = new SemaforoDelCuerpo(new MemoryStorage());
  await semaforo.registrar('rojo', 'contexto de prueba');
  const historial = await semaforo.obtenerHistorial();
  assert.equal(historial.length, 1);
  assert.equal(historial[0].estado, 'rojo');
});

test('respeta el límite de historial en RAM', async () => {
  const semaforo = new SemaforoDelCuerpo(new MemoryStorage());
  for (let i = 0; i < 150; i++) {
    await semaforo.registrar('verde');
  }
  const historial = await semaforo.obtenerHistorial();
  assert.ok(historial.length <= 100, `esperado <= 100, recibido ${historial.length}`);
});

test('persiste y recarga el historial desde el storage', async () => {
  const storage = new MemoryStorage();
  const semaforo1 = new SemaforoDelCuerpo(storage);
  await semaforo1.registrar('amarillo');

  const semaforo2 = new SemaforoDelCuerpo(storage);
  const historial = await semaforo2.obtenerHistorial();
  assert.equal(historial.length, 1);
  assert.equal(historial[0].estado, 'amarillo');
});
