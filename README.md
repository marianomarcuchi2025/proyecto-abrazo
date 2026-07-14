<p align="center"><img src="docs/banner.svg" alt="Proyecto Abrazo — app de apoyo emocional para niños" width="100%"></p>

# 🫂 Proyecto Abrazo

[![CI](https://github.com/marianomarcuchi2025/proyecto-abrazo/actions/workflows/ci.yml/badge.svg)](https://github.com/marianomarcuchi2025/proyecto-abrazo/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-99%25-3178c6.svg)](https://github.com/marianomarcuchi2025/proyecto-abrazo)
[![Estado](https://img.shields.io/badge/estado-MVP%20%2F%20prototipo-orange.svg)](#-estado-del-proyecto)

"Millones de niños tienen dificultades para expresar cómo se sienten. Proyecto Abrazo busca ofrecer herramientas abiertas, accesibles y transparentes para acompañar la regulación emocional de forma segura."

**App web de apoyo emocional para niños** — pensada especialmente para niños
en el espectro autista. Incluye un "semáforo del cuerpo" para registrar cómo
se sienten, un botón de emergencia que avisa a un adulto de confianza, y
respiración guiada. Diseñada siguiendo guías publicadas de diseño accesible
para autismo (GOV.UK, W3C COGA).

> **English:** An open-source web app to help children — especially autistic
> children — regulate their emotions: a "body traffic light" for emotional
> check-ins, an emergency button that alerts a trusted adult, and guided
> breathing. Built following published autism-friendly design guidelines
> (GOV.UK autism design poster, W3C COGA).
> **Status: MVP / prototype — not
> clinically validated yet.** Contributions from clinicians, accessibility
> experts and developers are very welcome.

---

## ⚠️ Estado del proyecto

**Esto es un MVP / prototipo. NO está validado clínicamente ni auditado de
seguridad de forma independiente.** No lo uses todavía con familias reales.

Ver [`AUDIT.md`](AUDIT.md) para el detalle completo de qué se revisó, qué
bugs se encontraron y qué se corrigió — y sobre todo, qué **no** está
resuelto todavía.

## ✨ Qué hace

- 🚦 **Semáforo del cuerpo** — el niño registra su estado emocional con un
  lenguaje visual simple y literal (sin metáforas).
- 🆘 **Botón de emergencia** — avisa a un adulto de confianza. La app solo
  confirma el envío cuando el servidor lo confirma de verdad (sin falsos
  "ya viene un abrazo").
- 🌬️ **Respiración guiada** — con soporte de `prefers-reduced-motion` para
  sensibilidad al movimiento.
- ♿ **Diseño autism-friendly** — lenguaje literal, vibración opt-in,
  colores suaves, botones con texto, mensajes persistentes.

## 📥 Descargar y probar

**Opción 1 — Descarga directa (sin conocimientos de git):**

1. Andá a [Releases](https://github.com/marianomarcuchi2025/proyecto-abrazo/releases)
   y bajá el `.zip` de la última versión, **o** usá el botón verde
   **`<> Code` → `Download ZIP`** arriba a la derecha.
2. Descomprimí el archivo.
3. Seguí los pasos de instalación de abajo.

**Opción 2 — Con git:**

```bash
git clone https://github.com/marianomarcuchi2025/proyecto-abrazo.git
cd proyecto-abrazo
```

## 🚀 Instalación y uso

Requisitos: [Node.js 18+](https://nodejs.org) y npm 10+.

```bash
npm install
npm run build   # compila los 3 paquetes
npm test        # corre los tests de core y server
npm run dev     # levanta ui-nino en :3000 y server en :3001 en paralelo
```

Abrí <http://localhost:3000> en el navegador.

## 🏗️ Estructura

```
packages/
  core/      # Lógica de dominio compartida (TypeScript, sin UI)
  ui-nino/   # Interfaz web (Lit + Vite)
  server/    # Backend (Express)
```

Monorepo con npm workspaces + Lerna.

## 🤝 Cómo contribuir

Este proyecto necesita especialmente:

- **Profesionales clínicos** (terapistas ocupacionales, psicólogos
  infantiles) para revisar el flujo de emergencia y el lenguaje usado con
  niños en crisis.
- **Expertos en accesibilidad** para auditar contra WCAG y COGA.
- **Desarrolladores** para los pendientes listados abajo.

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md). Los issues y PRs son bienvenidos,
en español o inglés.

## 🗺️ Antes de considerar esto listo para familias reales

Esto es lo que un lanzamiento real necesitaría y que este MVP no cubre:

- **Revisión clínica/de seguridad infantil** del flujo de emergencia y del
  lenguaje usado con niños en crisis, por parte de alguien con esa
  especialidad — no un LLM ni un desarrollador solo.
- **Notificación server-side real** (SMS/push con confirmación de entrega)
  en vez de depender del navegador del dispositivo del niño.
- **Cumplimiento normativo** para datos de menores (COPPA, GDPR-K o
  equivalente local) y una política de privacidad real.
- **Persistencia real** en el backend (hoy es un array en memoria: se
  pierde todo al reiniciar el proceso).
- **Autenticación** en los endpoints del backend.
- Pruebas con usuarios reales (niños, cuidadores) antes de cualquier
  intento de distribución masiva.

## 📄 Licencia

[AGPL-3.0-only](LICENSE) — software libre: podés usarlo, modificarlo y
redistribuirlo, siempre que las versiones modificadas también sean libres.

## 🙏 Referencias de diseño

- [GOV.UK — Designing for users on the autistic spectrum](https://ukhomeoffice.github.io/accessibility-posters/posters/accessibility-posters.pdf)
- [W3C — Cognitive and Learning Disabilities Accessibility (COGA)](https://www.w3.org/TR/coga-usable/)
