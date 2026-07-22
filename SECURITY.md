# Política de Seguridad

## Versiones soportadas

| Versión | Soporte |
| ------- | ------- |
| 0.1.x   | ✅ (MVP, mejor esfuerzo) |

## Reportar una vulnerabilidad

Este proyecto maneja flujos de emergencia para niños. Una vulnerabilidad
acá puede tener consecuencias reales, así que se agradece especialmente
el reporte responsable.

**Cómo reportar:**

1. **Vulnerabilidades sensibles** (que permitan interceptar o falsificar
   alertas de emergencia, o acceder a datos de menores): usá
   [Security Advisories privados de GitHub](https://github.com/marianomarcuchi2025/proyecto-abrazo/security/advisories/new)
   o escribí a marianomarcuchi@gmail.com. **No abras un issue público.**
2. **Problemas de seguridad menores**: podés abrir un issue con la
   etiqueta `security`.

**Qué incluir:** descripción, impacto estimado, pasos para reproducir y,
si podés, una sugerencia de corrección.

**Qué esperar:** confirmación de lectura dentro de los 7 días. Este es un
proyecto mantenido por una persona en su tiempo libre — el mejor esfuerzo
es real, pero no hay SLA.

## Alcance conocido (limitaciones ya documentadas)

Estas limitaciones ya están declaradas en el README y AUDIT.md y no hace
falta reportarlas: persistencia en archivos JSON sin locking entre procesos
(no es una base de datos transaccional), autenticación por API key
compartida por instancia (sin cuentas de usuario individuales), y ausencia
de un canal de notificación server-side con confirmación de entrega
independiente (la confirmación tardía de la cola offline avisa cuando el
propio cliente logra entregar, no agrega un canal nuevo del lado del
servidor).

*(Corregido 2026-07-22: esta sección decía antes "falta de autenticación
en el backend" y "persistencia en memoria" — desactualizado desde la
Pasada 6, que agregó autenticación opcional por API key y persistencia
real en disco. Ver CHANGELOG.md.)*
