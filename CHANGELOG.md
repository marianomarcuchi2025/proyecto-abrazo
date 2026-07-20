# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html) en la medida en que un MVP pre-1.0 puede hacerlo.

## [Unreleased] — Pasada 12: demo online y distribución verificada

### Agregado
- Demo estática en GitHub Pages (rama `gh-pages`, build de `ui-nino` con base `/proyecto-abrazo/`): <https://marianomarcuchi2025.github.io/proyecto-abrazo/>. Corre sin servidor: el botón de emergencia muestra el mensaje honesto de "no se pudo enviar todavía" — sirve para evaluar flujo y lenguaje, no para uso real.
- `docs/CLINICAL_REVIEW_PENDING.md`: versión en inglés del documento de revisión clínica (el español sigue siendo fuente de verdad).
- `.github/ISSUE_TEMPLATE/config.yml`: link a los docs de revisión clínica en el selector de issues.
- Issue #3 etiquetada "good first issue" (auditoría de accesibilidad con axe-core/Lighthouse). La #4 duplicada se cerró.
- PR abierto a la lista curada [awesome-autism-tech](https://github.com/hbcondo/awesome-autism-tech/pull/4) (verificado abierto el 2026-07-20).

### Conocido / no resuelto en esta pasada
- El deploy de la demo es manual (build local pusheado a `gh-pages`); el workflow de Actions quedó fuera porque el token de push no tiene scope `workflow`. Automatizarlo queda pendiente.
- PR a up-for-grabs.net pendiente (requiere completar el flujo de fork+PR desde la sesión del mantenedor).
- Verificar que la creación de issues no esté restringida para cuentas externas (un visitante deslogueado ve "Issue creation is restricted").

## [Unreleased] — Pasada 11: captura real para el README

### Agregado
- `docs/capturas/principal.png`: captura real de la pantalla principal, tomada corriendo la app localmente (no un mockup). Enlazada en el README.

### Conocido / no resuelto en esta pasada
- Faltan capturas de las otras 3 pantallas (ajustes, respiración guiada, "Quiero decir algo"). Se intentó automatizar su captura y se descartó un método (SVG renderizado por DOM) por riesgo de no verse en GitHub (sanitiza `foreignObject`); ver detalle en `AUDIT.md`, Pasada 11.

## [Unreleased] — Pasada 10: aviso duplicado al pedir un abrazo sin contacto

### Corregido
- Tocar "Necesito un abrazo" sin contacto configurado abría igual el modal "¿Quieres avisar a tu adulto?" (engañoso) y después repetía el mensaje de "Falta elegir a quién avisar" una segunda vez. Ahora el botón no abre el modal en ese caso — el aviso persistente ya visible arriba es suficiente, sin duplicar texto.

## [Unreleased] — Pasada 9: símbolos ARASAAC para "Quiero decir algo"

### Agregado
- `packages/core/src/domain/comunicacion/necesidades.ts`: set fijo de 6 símbolos ARASAAC (hambre, sed, dolor, cansancio, baño, estar solo/a), con IDs reales verificados en la API pública de ARASAAC. 3 tests nuevos (17 en `core` en total).
- Nueva vista en `pantalla-abrazo.ts`: el botón "Quiero decir algo" (antes muerto, sin función) ahora muestra una grilla de estos 6 símbolos; al tocar uno se agranda para señalarlo/mostrarlo a un adulto. No dispara ningún aviso de red — solo carga la imagen del pictograma desde la CDN de ARASAAC.
- Preguntas 6-8 agregadas a `docs/REVISION_CLINICA_PENDIENTE.md` sobre este set de símbolos.

### Conocido / no resuelto en esta pasada
- No se pudo verificar visualmente que las imágenes cargan bien (restricción de red del entorno de desarrollo, no del código). Pendiente de confirmación corriendo `npm run dev` con internet real.
- Depende de conexión a un tercero (ARASAAC) — trade-off de privacidad nuevo, no resuelto (alternativa futura: empaquetar las imágenes localmente).
- Los 6 símbolos son una propuesta razonable, sin revisión clínica todavía.

## [Unreleased] — Pasada 8: canal de comunidad liviano

### Agregado
- `docs/COMUNIDAD.md`: explica cómo participar sin abrir un issue de GitHub (usar Discussions), enlazado desde `CONTRIBUTING.md`.

### Pendiente (no resuelto en esta pasada)
- Falta habilitar GitHub Discussions en la configuración del repositorio — requiere un clic del dueño en Settings, no se puede activar por API/git.

## [Unreleased] — Pasada 7: cobertura de tests visible

### Agregado
- Script `test:coverage` en `core`, `server` y el paquete raíz (`npm run test:coverage`), usando `node --test --experimental-test-coverage`. Reporta cobertura real de líneas/branches/funciones por archivo, no una insignia.
- Tabla de cobertura real en `README.md` (90.64% líneas en `core`, 93.47% en `server`, medida el 2026-07-14). `ui-nino` queda explícitamente fuera de la tabla porque no tiene tests todavía — se documenta como ausencia intencional, no se inventa un número.

## [Unreleased] — Pasada 6: persistencia, autenticación y optimización

### Agregado
- **Persistencia real en disco** (`packages/server/src/persistence.ts`, `JsonFileStore`): postales y alertas ya no viven en un array en memoria que se perdía al reiniciar el proceso; se guardan en `data/postales.json` y `data/alertas.json` con escritura atómica. No es una base de datos transaccional, pero sobrevive reinicios — cierra el punto 10 de `AUDIT.md`.
- **Autenticación opcional por API key compartido**: si se define `API_KEY`, todos los endpoints `/api/*` exigen `Authorization: Bearer <clave>` (comparación en tiempo constante contra timing attacks). Sin `API_KEY`, el servidor arranca abierto e imprime una advertencia explícita.
- **Notificación a todos los contactos de emergencia configurados**, no solo al primero (`ServicioEmergencia`, gap #19 de `AUDIT.md` Pasada 5). La UI ahora permite configurar un segundo contacto opcional.
- **Confirmación tardía de mensajes encolados offline**: cuando un aviso de emergencia se encola por falta de conexión y `NetworkService` lo entrega más tarde, se emite un evento (`network.entregado-tarde` → `emergencia.confirmado-tarde`) que la pantalla usa para avisar al usuario que el mensaje finalmente salió — cierra el gap #18 de `AUDIT.md` Pasada 5.
- **`packages/core/src/domain/regulacion/respiracion.ts`**: el ciclo de respiración guiada 4-2-6 se extrajo del componente Lit a lógica pura testeable, con 4 tests nuevos.
- Tests HTTP end-to-end para el servidor (auth, persistencia, multi-contacto) y tests directos de `JsonFileStore`: 12 tests nuevos en `server`, 6 tests nuevos en `core`. Total: 26 tests automatizados (antes 11).
- `.env.example` documenta `DATA_DIR`, `API_KEY` y `VITE_API_KEY`.

### Corregido
- `README.md` había sido reemplazado por una versión con arquitectura y funcionalidades inventadas (React/Next.js, PostgreSQL, Docker, autenticación 2FA, exportación HIPAA/GDPR, etc.) que no existían en el código. Restaurado a una versión alineada con el repo real, y ahora actualizado con las capacidades reales agregadas en esta pasada. Ver `AUDIT.md`, Pasada 5.
- Contradicción de licencia: el README afirmaba MIT en el FAQ; la licencia real del proyecto es AGPL-3.0-only.
- `CHANGELOG.md` (este archivo) no existía pese a estar enlazado desde el README.

## [0.1.0] - 2026-07-06 a 2026-07-14

MVP inicial del monorepo (`core`, `ui-nino`, `server`), con cuatro pasadas de auditoría documentadas en `AUDIT.md`.

### Agregado
- Monorepo funcional con npm workspaces + Lerna: `packages/core` (dominio), `packages/ui-nino` (Lit + Vite), `packages/server` (Express).
- Servicio de emergencia (`ServicioEmergencia`) con confirmación real vía backend, cooldown honesto y guard contra activaciones concurrentes por toques rápidos.
- `SemaforoDelCuerpo`: registro de estado emocional con historial acotado en memoria y persistencia local.
- `SecureStorage`: cifrado AES-GCM 256 real (Web Crypto API) para el storage local del cliente.
- `NetworkService`: cola offline-first con reintento y reencolado en caso de fallo parcial de lote.
- Backend Express con filtro recursivo de datos biométricos, CORS restringido por variable de entorno, rate limiting y endpoint `/api/alertas-emergencia` como única fuente de verdad de confirmación.
- Pantalla principal (`pantalla-abrazo.ts`) adaptada a guía GOV.UK/W3C-COGA para niños autistas: lenguaje literal, vibración opt-in, respiración guiada con soporte de `prefers-reduced-motion`.
- Panel de ajustes para configurar el contacto de emergencia.
- CI en GitHub Actions (`npm ci && npm run build && npm test`) contra Node 20.x y 22.x.
- `LICENSE` (AGPL-3.0-only), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, templates de issues/PR.

### Corregido (ver `AUDIT.md` para el detalle completo de cada punto)
- Typo que rompía el build (`export * from './shared.secure-storage'`).
- Falso positivo de éxito en el canal de emergencia (SMS que nunca lanza excepción aunque no se envíe).
- Pérdida silenciosa de mensajes en cola de red al fallar un envío a mitad de lote.
- `SecureStorage` que en realidad no cifraba nada (Base64 reversible).
- Filtro de datos biométricos evadible con payloads anidados.
- CORS abierto por defecto (`origin: '*'`).
- Cola de red que no se vaciaba al iniciar si ya había conexión.
- Array en memoria del servidor sin límite (fuga de memoria).
- Cooldown de emergencia que confirmaba envíos que en realidad habían fallado.
- Mensaje de UI que prometía algo no verificable ("viene un abrazo") en vez de lenguaje literal.
- Botones sin función ("Quiero decir algo", "Ayúdame a calmarme" antes de implementar la respiración).
- Alertas de emergencia duplicadas por toques rápidos repetidos (condición de carrera en `activar()`).

### Conocido / no resuelto (intencional, documentado)
- Sin base de datos transaccional real (persistencia en archivos JSON desde Pasada 6, sin locking entre procesos).
- Sin cuentas de usuario ni identidad por dispositivo/familia (solo API key compartido por instancia desde Pasada 6).
- Sin notificación server-side con confirmación de entrega real (SMS/push) — la confirmación tardía de Pasada 6 avisa cuando la propia cola offline del cliente entrega, no agrega un canal server-side nuevo.
- Sin cumplimiento normativo formal para datos de menores (COPPA/GDPR-K).
- Sin validación clínica del flujo de crisis.
- `ui-nino` sin tests de interfaz/DOM (la lógica pura que se pudo extraer, como la respiración, sí tiene tests desde Pasada 6).
- Máximo dos contactos de emergencia configurables desde la UI (decisión de simplicidad, no limitación técnica del modelo de datos).
