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
falta reportarlas: falta de autenticación en el backend, persistencia en
memoria, y ausencia de notificación server-side con confirmación de
entrega.
