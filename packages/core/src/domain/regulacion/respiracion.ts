export interface FaseRespiracion {
  texto: string;
  duracionMs: number;
  circuloGrande: boolean;
}

/**
 * Ciclo de respiración guiada 4-2-6 (inhalar 4s, sostener 2s, exhalar 6s).
 *
 * Extraído de `ui-nino/pantalla-abrazo.ts` a `core` por dos motivos: (1) es
 * lógica pura sin DOM, así que puede testearse con `node:test` sin jsdom ni
 * navegador (antes vivía embebida en el componente Lit y no tenía ningún
 * test); (2) si en el futuro se quiere ajustar el patrón por perfil
 * sensorial (ver "Qué NO se hizo" en AUDIT.md, Pasada 3), conviene que la
 * fuente de verdad esté en un solo lugar.
 */
export const FASES_RESPIRACION: readonly FaseRespiracion[] = [
  { texto: 'Toma aire por la nariz', duracionMs: 4000, circuloGrande: true },
  { texto: 'Aguanta el aire', duracionMs: 2000, circuloGrande: true },
  { texto: 'Suelta el aire despacio', duracionMs: 6000, circuloGrande: false },
];

/**
 * Devuelve la fase que corresponde al paso `i` (0-indexado), ciclando
 * indefinidamente sobre `FASES_RESPIRACION`.
 */
export function faseEnPaso(i: number): FaseRespiracion {
  if (!Number.isInteger(i) || i < 0) {
    throw new RangeError('faseEnPaso: el paso debe ser un entero >= 0');
  }
  return FASES_RESPIRACION[i % FASES_RESPIRACION.length];
}
