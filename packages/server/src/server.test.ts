import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contieneClaveProhibida } from './server';

test('detecta clave prohibida en el primer nivel', () => {
  assert.equal(contieneClaveProhibida({ hrv: 70 }), true);
});

test('detecta clave prohibida anidada (bug original: solo miraba el primer nivel)', () => {
  assert.equal(contieneClaveProhibida({ datos: { anidado: { hrv: 70 } } }), true);
});

test('no marca payloads legítimos como prohibidos', () => {
  assert.equal(contieneClaveProhibida({ estado: 'rojo', contexto: 'recreo' }), false);
});
