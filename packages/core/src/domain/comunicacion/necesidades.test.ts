import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SIMBOLOS_NECESIDADES, urlImagenArasaac, buscarSimbolo } from './necesidades.js';

test('hay exactamente 6 símbolos, todos con id y texto únicos y no vacíos', () => {
  assert.equal(SIMBOLOS_NECESIDADES.length, 6);
  const ids = SIMBOLOS_NECESIDADES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'los ids deben ser únicos');
  for (const simbolo of SIMBOLOS_NECESIDADES) {
    assert.ok(simbolo.texto.trim().length > 0, `texto vacío para ${simbolo.id}`);
    assert.ok(Number.isInteger(simbolo.arasaacId) && simbolo.arasaacId > 0, `arasaacId inválido para ${simbolo.id}`);
  }
});

test('urlImagenArasaac arma la URL pública correcta de la CDN de ARASAAC', () => {
  assert.equal(urlImagenArasaac(35559), 'https://api.arasaac.org/v1/pictograms/35559');
});

test('buscarSimbolo encuentra por id y devuelve undefined si no existe', () => {
  assert.equal(buscarSimbolo('hambre')?.texto, 'Tengo hambre');
  assert.equal(buscarSimbolo('no-existe'), undefined);
});
