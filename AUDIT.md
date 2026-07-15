# Auditoría del código original

Este documento registra lo que se encontró al auditar la primera versión del
proyecto (recibida como texto/código pegado, no como repo real) y qué se
corrigió. Se mantiene en el repo por transparencia, no para quedar bien —
para que cualquiera que use esto para una app real de familias sepa
exactamente qué se tocó y por qué.

## Crítico (rompía la compilación o el propósito de la app)

1. **`packages/core/src/index.ts`**: `export * from './shared.secure-storage'`
   — typo (punto en vez de barra). Rompía el build completo. Corregido.

2. **`packages/ui-nino/index.html`**: anunciado en el texto original pero sin
   contenido. Sin este archivo, Vite no puede arrancar nada. Creado.

3. **`packages/ui-nino/src/pantalla-abrazo.ts`**: el archivo original era un
   fragmento — empezaba a mitad de una clase, sin imports, sin decorador
   `@customElement`, sin propiedades de estado, sin instanciar los
   servicios que usaba, y sin una sola línea de CSS pese a referenciar más
   de diez clases. No compilaba. Reescrito completo.

4. **Falso positivo de éxito en el canal de emergencia**
   (`emergencia.service.ts`): se marcaba `exito: true` solo por asignar
   `window.location.href = 'sms:...'`, lo cual **nunca lanza excepción**
   aunque el dispositivo no pueda enviar SMS (desktop, muchos Android sin
   SIM). Un niño en crisis podía ver "ya viene un abrazo" sin que ningún
   mensaje hubiera salido. Corregido: la única vía que ahora se reporta
   como `confirmado` es la respuesta HTTP real del backend; SMS/WhatsApp
   quedan como intento adicional, nunca como fuente de verdad.

## Alto (pérdida de datos / seguridad)

5. **Pérdida silenciosa de mensajes en cola** (`network.service.ts`):
   `flushQueue()` hacía `splice()` (sacaba los items de la cola) antes de
   enviarlos; si un envío fallaba a mitad del lote, el resto se descartaba
   para siempre porque ya no estaban en la cola y nunca se reinsertaban.
   Corregido: los items no enviados se reencolan.

6. **`SecureStorage` no cifraba nada**: usaba `atob`/`btoa` (Base64),
   trivialmente reversible por cualquiera — el propio comentario original
   ya admitía que era un placeholder ("MVP: Base64. Prod: Web Crypto API"),
   pero el nombre de la clase sugiere seguridad real. Corregido con AES-GCM
   256 vía Web Crypto API. Esto obligó a un cambio de arquitectura: la
   interfaz `StorageProvider` pasó de síncrona a asíncrona (Web Crypto es
   100% asíncrona), lo que en cadena obligó a adaptar `SemaforoDelCuerpo`,
   `ServicioEmergencia`, `ServicioPostal` y `NetworkService`.
   **Límite honesto que sigue existiendo:** la clave se guarda en el mismo
   storage (sin cifrar) porque un cliente sin backend de auth no tiene otro
   lugar seguro donde ponerla. Protege contra lectura casual, no contra
   alguien con acceso completo al dispositivo.

7. **Filtro de datos biométricos evadible** (`server.ts`): solo revisaba
   `Object.keys(payload)` de primer nivel; un payload como
   `{ datos: { hrv: 123 } }` pasaba sin problema. Corregido con recorrido
   recursivo (con límite de profundidad para evitar objetos maliciosamente
   profundos).

8. **CORS abierto por defecto** (`server.ts`): `origin: '*'` si no había env
   var. Cambiado el default a `http://localhost:3000`; quien despliegue a
   producción tiene que fijarlo a propósito.

## Medio (robustez / fugas de recursos)

9. **Cola de red no se vaciaba al iniciar** si la app se recargaba estando
   ya online con mensajes pendientes de una sesión anterior — quedaban
   varados hasta el próximo ciclo offline→online. Se agregó un flush al
   arrancar si ya hay conexión.

10. **Array en memoria sin límite** en el servidor (`postales`) — fuga de
    memoria garantizada en un proceso de larga duración. Se agregó un tope
    (`MAX_POSTALES_EN_MEMORIA`), aunque la solución real para producción es
    una base de datos, no un array — se deja documentado como pendiente.

11. **Falta el endpoint que el propio cliente necesitaba**: una vez que el
    canal de emergencia depende de una respuesta HTTP real (punto 4), hacía
    falta `/api/alertas-emergencia` en el servidor. No existía. Agregado.

## No resuelto a propósito (fuera de alcance de un fix de código)

- Validación clínica del flujo de crisis y del lenguaje usado con niños.
- Notificación server-side con confirmación real de entrega (hoy sigue
  dependiendo del navegador del dispositivo del niño para el intento
  best-effort de SMS/WhatsApp).
- Cumplimiento normativo (COPPA/GDPR-K) para datos de menores.
- Accesibilidad más allá de lo básico (se agregaron `aria-label`,
  `role="status"`/`aria-live`, y los emojis ya daban redundancia además del
  color en el semáforo, pero no hubo una auditoría de accesibilidad
  completa).
- Persistencia real en el backend, autenticación de endpoints, tests de
  integración end-to-end, revisión de seguridad independiente.

## Sobre "viral" y "ayudar a todas las familias"

Estos son objetivos de producto/distribución, no algo que el código por sí
solo garantice. Nada en esta corrección los asegura — solo se corrigieron
bugs concretos y verificables por compilación y tests.

---

# Pasada 3: adaptación para niños autistas

## Qué es esto y qué NO es

Los cambios de esta pasada aplican guía de diseño **publicada**: el póster
de accesibilidad de GOV.UK "Designing for users on the autistic spectrum"
y la guía de accesibilidad cognitiva (COGA) del W3C. Son hipótesis de
diseño razonables y con fuente — **no son validación clínica**. El
espectro autista es heterogéneo: lo que ayuda a un niño puede molestar a
otro. Antes de uso real, esto necesita revisión de profesionales
(terapia ocupacional / psicología infantil) y prueba con usuarios reales.
Nada de lo que sigue sustituye eso.

## Bugs corregidos (verificables, no opinables)

12. **Cooldown deshonesto** (`emergencia.service.ts`): si el aviso de
    emergencia FALLABA y el niño reintentaba dentro de los 30 segundos, la
    app respondía por la rama de cooldown con `confirmado: true` — es
    decir, afirmaba que el aviso estaba enviado cuando nunca salió, y
    además bloqueaba el reintento justo cuando más se necesitaba. Ahora el
    cooldown solo aplica si el último intento fue confirmado por el
    backend; un intento fallido permite reintentar de inmediato.
    Verificado con test de regresión y con smoke test en runtime contra el
    servidor real vivo y caído.

13. **Promesa no verificable en la UI**: "🫂 Viene un abrazo para ti"
    afirma que el adulto va a venir — algo que la app no puede saber. Lo
    único verificable es que el aviso llegó al servidor. Sustituido por
    lenguaje literal: "Aviso enviado a {nombre}". Esto es un bug de
    honestidad en cualquier app, pero pesa más aquí: la interpretación
    literal del lenguaje es frecuente en niños autistas.

14. **Botón muerto** ("Quiero decir algo"): visible pero sin función →
    resultado impredecible (contra guía GOV.UK). Eliminado hasta que la
    funcionalidad exista.

15. **"Ayúdame a calmarme" tampoco hacía nada**: implementado con una guía
    de respiración simple (ciclo 4-2-6, círculo que crece/decrece),
    respetando `prefers-reduced-motion` (sin animación si el sistema del
    usuario lo pide; solo cambia el texto).

## Hipótesis de diseño aplicadas (con fuente, pendientes de validación)

- **Lenguaje literal y consistente** en todos los mensajes; se eliminaron
  metáforas ("te escucho", "tómatelo con calma") y los mensajes del
  semáforo son idénticos en cada uso (predecibilidad). [GOV.UK: "write in
  plain language"; "don't use figures of speech"]
- **Vibración apagada por defecto y configurable** desde ajustes; los
  estímulos sensoriales inesperados pueden ser aversivos. [GOV.UK: "don't
  build with bright contrasting..."/sobrecarga sensorial; COGA]
- **Colores de baja saturación** en toda la pantalla. [GOV.UK: "use simple
  colours"]
- **Etiqueta de texto visible** en cada opción del semáforo ("Bien" /
  "Más o menos" / "Mal"); no se depende solo del color ni del emoji.
  También se cambiaron los círculos de color por caras (🙂 😐 🙁), más
  directas que la metáfora del semáforo.
- **Los mensajes de estado no desaparecen solos**: quedan hasta la
  siguiente acción (antes se borraban a los 3 s). [WCAG 2.2.1, tiempo
  ajustable]
- **Sin mayúsculas sostenidas** en botones ("SÍ, NECESITO AYUDA" →
  "Sí, avisar").
- **Ajustes marcados como "para un adulto"**, con el nombre del contacto
  precargado al reabrir.

## Qué NO se hizo (y no debe fingirse hecho)

- Validación con niños autistas reales y sus cuidadores.
- Revisión clínica del flujo de crisis y del patrón de respiración.
- Personalización por perfil sensorial (cada niño necesita ajustes
  distintos; hoy solo la vibración es configurable).
- Todo lo pendiente de las pasadas anteriores (notificación server-side
  con confirmación de entrega, persistencia real, autenticación, COPPA/
  GDPR-K, auditoría de seguridad independiente).

---

# Pasada 4: revisión crítica sin cambios nuevos solicitados

El pedido de esta pasada repetía textualmente el de la pasada 3. En vez de
rehacer trabajo ya hecho, se hizo una revisión crítica nueva sobre el
código ya existente — y apareció un bug real.

16. **Alertas de emergencia duplicadas por toques rápidos** (bug de
    concurrencia, `emergencia.service.ts`): `activar()` no tenía guardia
    contra llamadas concurrentes. Tres toques del botón "Sí, avisar" antes
    de que el primer pedido de red resolviera disparaban 3 pedidos HTTP y
    3 intentos de SMS/WhatsApp en paralelo — verificado con una prueba que
    simula exactamente ese escenario (3 llamadas concurrentes con latencia
    de red real de 200ms). Esto es relevante en concreto para el público
    de esta app: la repetición motora ante ansiedad/impulsividad es un
    patrón real, no una hipótesis de diseño. Corregido con un guard de
    "envío en curso": si `activar()` se llama mientras hay un envío
    pendiente, se devuelve la misma promesa en vez de iniciar uno nuevo.
    Verificado con test automatizado y con el mismo script manual que
    expuso el bug originalmente (antes: 3 llamadas concurrentes; después:
    1 sola).

---

# Pasada 5: auditoría del repositorio completo (no solo el código)

A diferencia de las pasadas 1-4, que auditaban lógica de dominio, esta
pasada auditó el repo entero contra sí mismo: clonado real, `npm ci`,
`npm run build`, `npm test` ejecutados de verdad (no solo lectura), y
comparación exhaustiva entre lo que la documentación afirma y lo que el
código hace. El código en sí (`core`/`server`/`ui-nino`) pasó esta
auditoría sin bugs nuevos de la gravedad de los puntos 1-16: build limpio,
11/11 tests verdes, servidor probado manualmente contra el filtro de
datos biométricos. El problema encontrado esta vez está en la
documentación, y es grave por lo que este mismo archivo defiende:
integridad sobre apariencia.

## Crítico: el README real fue borrado y reemplazado por uno ficticio

17. **`README.md` no describía este proyecto.** Reconstruido el historial:
    el commit `bf7a7d2` dejó un README de 129 líneas alineado con el
    código real. Un commit posterior (`e052553`) creó un archivo nuevo de
    819 líneas, `Realmente.md`, con una arquitectura y set de features
    completamente inventados (React/Next.js, PostgreSQL, Redis, Docker/
    Kubernetes, backend FastAPI, autenticación 2FA con TOTP/WebAuthn,
    E2EE, exportación de datos "que cumple HIPAA/GDPR", CI con ArgoCD/
    Playwright/K6, ORM Prisma/Drizzle con `npm run db:migrate`, versión
    "empresarial" con SSO/OIDC/SAML, bug bounty, demo en vivo en
    `proyecto-abrazo.org`, video de YouTube, capturas en
    `docs/assets/*.png` y un GIF en `docs/assets/demo.gif`). El commit
    `182ebb4` borró el README honesto, y `772a12a` renombró
    `Realmente.md` a `README.md`, dejándolo como el README oficial del
    repo. Ninguna de las imágenes, el video, el dominio de demo, el
    `docker-compose.yml`, el `Dockerfile`, `docs/clinical-guide.md` ni
    `CHANGELOG.md` existían en el repo — se verificó archivo por archivo.
    Además el FAQ de ese README afirmaba licencia MIT ("haz lo que
    quieras con el código"), cuando la licencia real declarada en
    `LICENSE` y en los cuatro `package.json` es AGPL-3.0-only (copyleft
    fuerte) — una diferencia legal, no cosmética. **Corregido:** se
    restauró como base el README honesto recuperado del historial y se
    agregó `CHANGELOG.md` (enlazado desde el README pero inexistente
    hasta ahora).

## Gaps encontrados en la revisión de código de esta pasada (no bugs de honestidad, robustez menor — corregidos en Pasada 6)

18. **Confirmación tardía no propagada**: si `ServicioEmergencia.activar()`
    se llamaba sin conexión, `NetworkService` encolaba correctamente y
    devolvía `confirmado: false` (correcto). Pero cuando `flushQueue()`
    reintentaba con éxito más tarde, no había ningún callback que
    actualizara `lastConfirmado` en `ServicioEmergencia` ni que avisara a
    la UI — el niño nunca se enteraba de que el aviso finalmente salió.
    **Corregido en Pasada 6**, ver más abajo.

19. **Un solo contacto de emergencia recibía el aviso**: `activar()` usaba
    `this.protocolo.contactos[0]` aunque el modelo de datos
    (`ProtocoloEmergencia.contactos: ContactoEmergencia[]`) siempre
    soportó varios. No estaba documentado en ningún lado como limitación
    intencional. **Corregido en Pasada 6**.

20. **`packages/ui-nino` seguía sin tests** (535 líneas en
    `pantalla-abrazo.ts` sin cobertura automatizada). **Parcialmente
    corregido en Pasada 6**: la lógica pura que se pudo extraer sin DOM
    (respiración guiada) ahora vive en `core` y tiene tests; el componente
    Lit en sí (render, eventos de click, estado) sigue sin tests de
    interfaz.

## Qué NO se hizo en esta pasada (y no debe fingirse hecho)

- No se generaron capturas ni GIF de demo reales: el entorno de auditoría
  no tenía permisos para instalar un navegador headless (Playwright/
  Chromium falló por falta de `sudo` en el sandbox). Fabricar un mockup y
  presentarlo como captura real habría repetido exactamente el problema
  que este documento denuncia. Sigue pendiente: correr `npm run dev` en
  un entorno con navegador y capturar de verdad.
- No se verificó si `proyecto-abrazo.org` sirve o no una versión real de
  la app.

---

# Pasada 6: persistencia, autenticación y cierre de gaps de la Pasada 5

Esta pasada implementó las correcciones concretas que la Pasada 5 había
dejado identificadas pero sin resolver, más el pendiente #10 de la
auditoría original (persistencia real). Todo lo de abajo está verificado
con build limpio, 26 tests automatizados en verde (14 en `core`, 12 en
`server`, antes 11 en total) y una prueba manual end-to-end real: servidor
levantado con `API_KEY` configurada, `ServicioEmergencia` real (no un
mock) mandándole una alerta con dos contactos, verificación de que
`alertas.json` en disco tiene los dos contactos, y verificación de que un
API key incorrecto devuelve `confirmado: false` sin tirar excepción.

## Persistencia real (cierra el punto 10, pendiente desde la auditoría original)

21. **`packages/server/src/persistence.ts` — `JsonFileStore`**: reemplaza
    los arrays en memoria (`postales`, `alertas`) por archivos JSON en
    disco (`DATA_DIR/postales.json`, `DATA_DIR/alertas.json`), con
    escritura atómica (escribe a un `.tmp` y renombra) para no corromper
    el archivo si el proceso se cae a mitad de una escritura. Límite
    honesto documentado en el propio archivo: no es una base de datos
    transaccional, reescribe el archivo completo en cada escritura
    (O(n)), y no soporta escritura concurrente segura desde más de un
    proceso. Correcto y suficiente para una sola instancia de MVP; para
    producción con más de una instancia sigue haciendo falta una base de
    datos real, como ya estaba documentado.

## Autenticación mínima (nuevo, no estaba en el alcance de las pasadas 1-5)

22. **API key compartido opcional** (`server.ts`): si se define `API_KEY`
    (env var), todos los endpoints `/api/*` exigen
    `Authorization: Bearer <clave>`, comparada en tiempo constante
    (`crypto.timingSafeEqual`) para no filtrar el valor por timing
    attack. Si no se define, el servidor arranca abierto e imprime una
    advertencia explícita en el log. Límite honesto: es un secreto único
    por instancia desplegada, no autenticación por usuario ni por
    dispositivo/familia — sigue sin poder distinguir qué familia mandó
    qué dato. Verificado con tests HTTP reales (401 sin token, 401 con
    token incorrecto, 201 con token correcto) y con curl manual contra el
    servidor corriendo.

## Multi-contacto y confirmación tardía (cierran los gaps #19 y #18 de la Pasada 5)

23. **Todos los contactos configurados reciben el aviso** (`emergencia.
    service.ts`, `server.ts`): `activar()` ya no usa solo
    `contactos[0]`; envía un único pedido al backend con el array
    completo de contactos, y best-effort intenta SMS/WhatsApp para cada
    uno. El endpoint `/api/alertas-emergencia` cambió de aceptar un
    `contacto` singular a `contactos: [...]` (rechaza arrays vacíos o con
    contactos sin `nombre`/`telefono`). La UI de ajustes ahora permite
    cargar un segundo contacto opcional. Se limitó a dos contactos desde
    la interfaz (no una lista sin límite) por simplicidad del formulario,
    no por límite técnico del modelo de datos.

24. **Confirmación tardía de mensajes encolados offline** (`network.
    service.ts`, `emergencia.service.ts`): `NetworkService` ahora emite
    un evento (`network.entregado-tarde`) cuando `flushQueue()` entrega
    con éxito un pedido que se había encolado offline. `ServicioEmergencia`
    escucha ese evento; si corresponde a una alerta de emergencia propia,
    actualiza su estado interno y emite `emergencia.confirmado-tarde`,
    que la pantalla usa para avisar al usuario ("Aviso a {nombres}
    confirmado, se envió apenas volvió la conexión") en vez de dejarlo
    sin saber si el mensaje llegó o no.

## Extracción de lógica testeable (cierra parcialmente el gap #20)

25. **`packages/core/src/domain/regulacion/respiracion.ts`**: el ciclo de
    respiración guiada 4-2-6, que vivía embebido en el componente Lit
    (`pantalla-abrazo.ts`) sin ningún test posible sin DOM, se extrajo a
    lógica pura (`FASES_RESPIRACION`, `faseEnPaso`) con 4 tests. El
    componente Lit sigue sin tests de interfaz — eso requeriría sumar
    infraestructura de testing con DOM (jsdom o similar), que no se
    agregó en esta pasada para no sumar dependencias pesadas sin que el
    usuario lo pidiera explícitamente.

## Qué NO se hizo en esta pasada (y no debe fingirse hecho)

- No se agregó autenticación por usuario/familia ni sistema de cuentas —
  el API key compartido es un paso intermedio razonable para un
  self-hosted de un solo operador, no un sistema de identidad.
- No se migró la persistencia a una base de datos real (Postgres/SQLite);
  se evaluó deliberadamente no sumar `better-sqlite3` u otra dependencia
  con compilación nativa para no arriesgar romper el build en entornos
  sin herramientas de compilación disponibles.
- No se agregaron tests de interfaz (DOM) para los componentes Lit.
- No se generó demo real (capturas/GIF/video) ni se verificó despliegue
  en `proyecto-abrazo.org` — mismo motivo que en Pasada 5.
- No se hizo push directo al repositorio remoto desde el entorno de
  auditoría; los cambios se entregaron para revisión y aplicación manual
  o vía el flujo de git que el usuario decida.
- Sigue sin validación clínica del flujo de crisis, sin cumplimiento
  normativo formal para datos de menores, y sin las demás pendientes ya
  documentadas en pasadas anteriores.

## Pasada 7 — Cobertura de tests visible (2026-07-14)

Contexto: investigación comparativa contra proyectos populares de dominios
adyacentes (AAC/autismo, salud mental abierta — ver
`INVESTIGACION_REPOS_POPULARES_Y_ROADMAP.md`) identificó que Abrazo tenía
26 tests reales pero ningún número de cobertura reportado en ningún lado.
Los 26 tests podían estar cubriendo un 30% del código o un 95% — nadie
podía saberlo sin correrlo manualmente con flags experimentales.

26. **`npm run test:coverage`** (raíz, y `test:coverage` en `core` y
    `server` individualmente): agrega `--experimental-test-coverage` al
    mismo comando `node --test` que ya se usaba, sin tocar el `test`
    normal que corre CI. Cobertura real medida el 2026-07-14:
    - `core`: 90.64% líneas, 84.25% branches, 87.67% funciones.
    - `server`: 93.47% líneas, 71.74% branches, 80.82% funciones.
    - `ui-nino`: sin número — no tiene tests (gap ya documentado, punto
      25/gap #20).
    Estos números se agregaron al `README.md` como tabla, no como
    insignia de servicio externo (no hay Code Climate ni Codecov
    configurado — eso requeriría una cuenta externa que nadie pidió).

## Qué NO se hizo en esta pasada

- No se subió cobertura a un servicio externo (Codecov/Code Climate) ni
  se agregó una insignia de cobertura al README — el número está en una
  tabla de texto plano, exacto y fechado, en vez de una insignia que
  puede quedar desactualizada o mentir si nadie la mantiene.
- No se tocó el script `test` que usa CI — `test:coverage` es aditivo,
  para no cambiar el comportamiento ni la salida que ya dependen otros
  workflows.
- Sigue pendiente todo lo de pasadas anteriores, empezando por la
  revisión clínica del flujo de crisis (ver
  `INVESTIGACION_REPOS_POPULARES_Y_ROADMAP.md`, prioridad 1).

## Pasada 8 — Canal de comunidad liviano (2026-07-14)

27. **`docs/COMUNIDAD.md`**: documenta GitHub Discussions como canal de
    baja fricción para preguntas/comentarios que no ameritan un issue
    formal, y explica por qué no se sumó Discord/Matrix todavía (un solo
    mantenedor, sin capacidad de moderar chat en vivo). Enlazado desde
    `CONTRIBUTING.md`.

### Qué falta para que esto funcione de verdad

- **GitHub Discussions no está habilitado todavía en el repositorio** —
  es una casilla en Settings → General → Features que solo puede tocar
  el dueño del repo (no se puede activar por API con los permisos de un
  token normal, ni por `git push`). El link `../../discussions` en
  `docs/COMUNIDAD.md` da 404 hasta que se habilite. Documentado acá para
  no fingir que ya está activo.
