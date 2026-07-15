/**
 * Set fijo de símbolos para "Quiero decir algo" (PASADA 9).
 *
 * Contexto (ver AUDIT.md y CONTRIBUTING.md): el botón "Quiero decir algo"
 * del diseño original se había eliminado porque no tenía ninguna función
 * real — mostrar un botón sin función viola la decisión de diseño #2 de
 * esta app ("sin botones muertos"). Esto lo reemplaza con una función
 * real y acotada: un set FIJO de 6 símbolos de necesidades comunes
 * (no un editor de tableros de comunicación completo — eso es un
 * proyecto mucho más grande, ver Aucards/cboard en
 * INVESTIGACION_REPOS_POPULARES_Y_ROADMAP.md).
 *
 * El niño toca un símbolo y la app lo muestra grande en pantalla para que
 * pueda señalarlo o mostrárselo a un adulto — no dispara ningún aviso ni
 * llamada de red propia (a diferencia del botón de emergencia). La única
 * llamada de red es la carga de la imagen del pictograma desde la CDN de
 * ARASAAC, ver limitación documentada en AUDIT.md Pasada 9.
 *
 * Los pictogramas son de ARASAAC (https://arasaac.org), autor Sergio
 * Palao, propiedad del Gobierno de Aragón, licencia CC BY-NC-SA. Los IDs
 * de abajo se buscaron manualmente en la API pública de ARASAAC
 * (bestsearch) el 2026-07-14; no son inventados.
 */

export interface SimboloNecesidad {
  /** Identificador estable para esta app (no cambia aunque cambie el texto). */
  readonly id: string;
  /** Texto que se muestra junto al símbolo, en lenguaje literal y en primera persona. */
  readonly texto: string;
  /** ID real del pictograma en la base de datos pública de ARASAAC. */
  readonly arasaacId: number;
}

export const SIMBOLOS_NECESIDADES: readonly SimboloNecesidad[] = [
  { id: 'hambre', texto: 'Tengo hambre', arasaacId: 35559 },
  { id: 'sed', texto: 'Tengo sed', arasaacId: 7273 },
  { id: 'dolor', texto: 'Me duele', arasaacId: 2367 },
  { id: 'cansado', texto: 'Estoy cansado/a', arasaacId: 35537 },
  { id: 'bano', texto: 'Necesito ir al baño', arasaacId: 6929 },
  { id: 'solo', texto: 'Necesito estar solo/a', arasaacId: 7253 },
];

/**
 * URL pública de la imagen del pictograma en la CDN de ARASAAC.
 * Requiere conexión a internet real — no está bundleada en la app (ver
 * limitación en AUDIT.md Pasada 9: este entorno de desarrollo no pudo
 * descargar las imágenes para embeberlas localmente).
 */
export function urlImagenArasaac(arasaacId: number): string {
  return `https://api.arasaac.org/v1/pictograms/${arasaacId}`;
}

export function buscarSimbolo(id: string): SimboloNecesidad | undefined {
  return SIMBOLOS_NECESIDADES.find((s) => s.id === id);
}
