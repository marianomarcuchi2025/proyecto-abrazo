# Cómo contribuir a Proyecto Abrazo

¡Gracias por tu interés! Este proyecto busca ayudar a niños — especialmente
en el espectro autista — a regular sus emociones. Toda ayuda cuenta.

*English speakers: issues and PRs in English are welcome too.*

## Lo que más necesitamos

1. **Revisión clínica** — si sos terapista ocupacional, psicólogo/a infantil
   o profesional afín: abrí un issue con tus observaciones sobre el flujo de
   emergencia y el lenguaje de la app (la etiqueta `clinical-review` todavía
   no existe en el repo — si no podés crearla por no tener permiso de
   escritura, no hace falta: mencioná "revisión clínica" en el título y el
   mantenedor la etiqueta). No hace falta leer código:
   [`docs/REVISION_CLINICA_PENDIENTE.md`](docs/REVISION_CLINICA_PENDIENTE.md)
   tiene el texto exacto que ve un niño en cada pantalla y preguntas puntuales
   para responder.
2. **Accesibilidad** — auditorías contra WCAG 2.2 / W3C COGA.
3. **Código** — ver los pendientes en el README ("Antes de considerar esto
   listo para familias reales").

## Cómo participar sin programar

Ver [`docs/COMUNIDAD.md`](docs/COMUNIDAD.md) — usá [GitHub Discussions](../../discussions) para preguntas y comentarios sueltos, en vez de un issue formal.

## Flujo de trabajo

1. Hacé fork del repo y creá una rama: `git checkout -b mi-cambio`.
2. Instalá y verificá que todo pase antes de tocar código:
   ```bash
   npm install
   npm run build
   npm test
   ```
3. Hacé tus cambios. Agregá tests si tocás lógica de `core` o `server`.
4. Verificá de nuevo `npm run build && npm test`.
5. Abrí un Pull Request explicando **qué** cambia y **por qué**.

## Principios no negociables

- **Lenguaje literal** en la UI del niño: sin metáforas ni ironía.
- **Nunca confirmar un envío de emergencia que no esté confirmado por el
  servidor.** Un falso "ya viene un abrazo" es el peor bug posible.
- **Efectos sensoriales opt-in** (vibración, animación): respetar
  `prefers-reduced-motion` y las preferencias del usuario.
- **Sin telemetría ni tracking** de datos de menores.

## Reportar bugs

Abrí un issue con: qué esperabas, qué pasó, pasos para reproducir, y
navegador/sistema operativo. Si el bug afecta el flujo de emergencia,
decilo explícitamente en el título/cuerpo (la etiqueta `safety-critical`
todavía no existe en el repo; si no podés crearla, no hace falta — el
mantenedor la va a etiquetar y priorizar en cuanto lo vea).

## Licencia

Al contribuir, aceptás que tu aporte se licencia bajo AGPL-3.0-only.
