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
