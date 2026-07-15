import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage } from './storage.js';
import { NetworkService } from './network.service.js';
import { EventBus } from './event-bus.js';

/**
 * NetworkService solo escucha el evento 'online' del navegador si existe
 * `window` (a propósito: en un proceso Node puro sin window no tiene
 * sentido intentarlo). Para probar el flush automático sin jsdom, se
 * simula un `window` mínimo que solo sabe registrar y disparar listeners.
 */
function instalarWindowFalso() {
  const listeners: Record<string, Array<() => void>> = {};
  (globalThis as unknown as { window: unknown }).window = {
    addEventListener: (evento: string, cb: () => void) => {
      (listeners[evento] ??= []).push(cb);
    },
  };
  return {
    dispararOnline: () => listeners['online']?.forEach((cb) => cb()),
    limpiar: () => {
      delete (globalThis as Record<string, unknown>).window;
    },
  };
}

test('si el pedido falla, se encola y no se emite el evento de entrega', async () => {
  (globalThis as Record<string, unknown>).fetch = async () => {
    throw new Error('red caída');
  };
  const eventos: unknown[] = [];
  const listener = (e: unknown) => eventos.push(e);
  EventBus.getInstance().on('network.entregado-tarde', listener);

  const network = new NetworkService(new MemoryStorage());
  const ok = await network.request('http://test/x', { a: 1 }, { tipo: 'x' });

  assert.equal(ok, false);
  assert.equal(eventos.length, 0);
  EventBus.getInstance().off('network.entregado-tarde', listener);
});

test('un pedido encolado offline que se entrega tarde emite network.entregado-tarde con su meta', async () => {
  let redDisponible = false;
  (globalThis as Record<string, unknown>).fetch = async () => {
    if (!redDisponible) throw new Error('red caída');
    return { ok: true, status: 200 };
  };

  const win = instalarWindowFalso();
  const eventos: Array<{ url: string; body: unknown; meta?: Record<string, unknown> }> = [];
  const listener = (e: unknown) => eventos.push(e as { url: string; body: unknown; meta?: Record<string, unknown> });
  EventBus.getInstance().on('network.entregado-tarde', listener);

  try {
    const network = new NetworkService(new MemoryStorage());
    const ok1 = await network.request('http://test/alerta', { contactos: ['ana'] }, { tipo: 'alerta-emergencia' });
    assert.equal(ok1, false, 'primer intento offline: no confirmado, como se espera');
    assert.equal(eventos.length, 0, 'todavía no debería haberse entregado');

    redDisponible = true;
    win.dispararOnline();
    // flushQueue() es async; darle una vuelta al event loop para que corra.
    await new Promise((r) => setTimeout(r, 10));

    assert.equal(eventos.length, 1, 'debería haberse emitido exactamente un evento de entrega tardía');
    assert.equal(eventos[0].meta?.tipo, 'alerta-emergencia');
    assert.equal(eventos[0].url, 'http://test/alerta');
  } finally {
    EventBus.getInstance().off('network.entregado-tarde', listener);
    win.limpiar();
  }
});
