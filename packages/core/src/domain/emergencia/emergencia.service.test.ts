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
