import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FASES_RESPIRACION, faseEnPaso } from './respiracion.js';

test('el ciclo tiene 3 fases: inhalar, sostener, exhalar', () => {
  assert.equal(FASES_RESPIRACION.length, 3);
  assert.equal(FASES_RESPIRACION[0].circuloGrande, true, 'inhalar: círculo grande');
  assert.equal(FASES_RESPIRACION[1].circuloGrande, true, 'sostener: círculo grande');
  assert.equal(FASES_RESPIRACION[2].circuloGrande, false, 'exhalar: círculo chico');
});

test('la duración total del ciclo es 12s (4-2-6)', () => {
  const total = FASES_RESPIRACION.reduce((acc, f) => acc + f.duracionMs, 0);
  assert.equal(total, 12000);
});

test('faseEnPaso cicla correctamente sobre las 3 fases', () => {
  assert.equal(faseEnPaso(0), FASES_RESPIRACION[0]);
  assert.equal(faseEnPaso(1), FASES_RESPIRACION[1]);
  assert.equal(faseEnPaso(2), FASES_RESPIRACION[2]);
  assert.equal(faseEnPaso(3), FASES_RESPIRACION[0], 'debe volver a empezar el ciclo');
  assert.equal(faseEnPaso(4), FASES_RESPIRACION[1]);
});

test('faseEnPaso rechaza pasos inválidos', () => {
  assert.throws(() => faseEnPaso(-1), RangeError);
  assert.throws(() => faseEnPaso(1.5), RangeError);
});
