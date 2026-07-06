import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryStorage } from '../../shared/storage.js';
import { ServicioEmergencia } from './emergencia.service.js';

test('sin protocolo configurado, tieneProtocoloConfigurado es false', async () => {
  const servicio = new ServicioEmergencia(new MemoryStorage());
  assert.equal(await servicio.tieneProtocoloConfigurado(), false);
});

test('tras configurar un contacto, tieneProtocoloConfigurado es true y se persiste', async () => {
  const storage = new MemoryStorage();
  const servicio1 = new ServicioEmergencia(storage);
  await servicio1.configurarProtocolo({
    contactos: [{ nombre: 'Ana', telefono: '5551234', relacion: 'madre' }],
    mensajeSMS: 'Hola {nombre}, necesito un abrazo',
  });
  assert.equal(await servicio1.tieneProtocoloConfigurado(), true);

  // Nueva instancia, misma storage: debe recargar lo persistido.
  const servicio2 = new ServicioEmergencia(storage);
  assert.equal(await servicio2.tieneProtocoloConfigurado(), true);
  const protocolo = await servicio2.obtenerProtocolo();
  assert.equal(protocolo?.contactos[0].nombre, 'Ana');
});

test('activar() sin contactos devuelve sin-configurar', async () => {
  const servicio = new ServicioEmergencia(new MemoryStorage());
  const res = await servicio.activar();
  assert.equal(res.canal, 'sin-configurar');
  assert.equal(res.confirmado, false);
});

test('si el último intento FALLÓ, el cooldown no bloquea el reintento ni finge éxito', async () => {
  let redDisponible = false;
  (globalThis as Record<string, unknown>).fetch = async () => {
    if (!redDisponible) throw new Error('red caída');
    return { ok: true, status: 200 };
  };

  const servicio = new ServicioEmergencia(new MemoryStorage(), 'http://test/api/alertas');
  await servicio.configurarProtocolo({
    contactos: [{ nombre: 'Ana', telefono: '5551234', relacion: 'madre' }],
    mensajeSMS: 'Hola {nombre}',
  });

  // Primer intento: la red falla -> no confirmado.
  const r1 = await servicio.activar();
  assert.equal(r1.canal, 'red');
  assert.equal(r1.confirmado, false);

  // Reintento inmediato (dentro de los 30s): NO debe devolver 'cooldown'
  // (el bug original respondía "ya viene el abrazo" sobre un aviso fallido).
  redDisponible = true;
  const r2 = await servicio.activar();
  assert.equal(r2.canal, 'red');
  assert.equal(r2.confirmado, true);

  // Ahora sí: tras un envío CONFIRMADO, el cooldown aplica.
  const r3 = await servicio.activar();
  assert.equal(r3.canal, 'cooldown');
  assert.equal(r3.confirmado, true);
});

test('toques rápidos repetidos antes de resolver NO disparan alertas duplicadas', async () => {
  let llamadas = 0;
  let concurrentesActivas = 0;
  let maxConcurrentes = 0;

  (globalThis as Record<string, unknown>).fetch = async () => {
    llamadas++;
    concurrentesActivas++;
    maxConcurrentes = Math.max(maxConcurrentes, concurrentesActivas);
    await new Promise((r) => setTimeout(r, 50));
    concurrentesActivas--;
    return { ok: true, status: 200 };
  };

  const servicio = new ServicioEmergencia(new MemoryStorage(), 'http://test/api/alertas');
  await servicio.configurarProtocolo({
    contactos: [{ nombre: 'Ana', telefono: '5551234', relacion: 'madre' }],
    mensajeSMS: 'Hola {nombre}',
  });

  const [r1, r2, r3] = await Promise.all([servicio.activar(), servicio.activar(), servicio.activar()]);

  assert.equal(maxConcurrentes, 1, `se esperaba 1 pedido de red en vuelo, hubo ${maxConcurrentes}`);
  assert.equal(llamadas, 1, `se esperaba 1 sola llamada de red, hubo ${llamadas}`);
  assert.deepEqual(r1, r2);
  assert.deepEqual(r2, r3);
});
