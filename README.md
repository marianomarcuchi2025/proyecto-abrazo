# Proyecto Abrazo

Monorepo (npm workspaces + Lerna) para una app de apoyo emocional infantil:
registro de estado emocional ("semáforo del cuerpo"), un botón de emergencia
que avisa a un adulto, y un backend mínimo.

> **Estado: MVP / prototipo.** No está validado clínicamente ni auditado de
> seguridad de forma independiente. Ver `AUDIT.md` para el detalle completo
> de qué se revisó, qué bugs se encontraron y qué se corrigió — y sobre todo,
> qué **no** está resuelto todavía y debería resolverse antes de un uso real
> con familias.

## Estructura

```
packages/
  core/      # Lógica de dominio compartida (TypeScript, sin UI)
  ui-nino/   # Interfaz web (Lit + Vite)
  server/    # Backend (Express)
```

## Requisitos

- Node.js 18+
- npm 10+

## Uso

```bash
npm install
npm run build   # compila los 3 paquetes
npm test        # corre los tests de core y server
npm run dev      # levanta ui-nino en :3000 y server en :3001 en paralelo
```

## Antes de considerar esto listo para familias reales

Esto es lo que un lanzamiento real necesitaría y que este MVP no cubre:

- **Revisión clínica/de seguridad infantil** del flujo de emergencia y del
  lenguaje usado con niños en crisis, por parte de alguien con esa
  especialidad — no un LLM ni un desarrollador solo.
- **Notificación server-side real** (SMS/push con confirmación de entrega)
  en vez de depender del navegador del dispositivo del niño.
- **Cumplimiento normativo** para datos de menores (COPPA, GDPR-K u
  equivalente local) y una política de privacidad real.
- **Persistencia real** en el backend (hoy es un array en memoria: se
  pierde todo al reiniciar el proceso).
- **Autenticación** en los endpoints del backend.
- Pruebas con usuarios reales (niños, cuidadores) antes de cualquier
  intento de distribución masiva.

## Licencia

AGPL-3.0-only (ver `package.json`). Antes de publicar, copiar el texto
completo de la licencia desde <https://www.gnu.org/licenses/agpl-3.0.txt>
a un archivo `LICENSE` en la raíz.
