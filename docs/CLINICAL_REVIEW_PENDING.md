# Request for clinical review — Proyecto Abrazo emergency flow

*This is the English version of [`REVISION_CLINICA_PENDIENTE.md`](REVISION_CLINICA_PENDIENTE.md). If both versions ever disagree, the Spanish one is the source of truth (the app's UI is currently Spanish-only). Contact tracking lives in the Spanish document only.*

This document exists so that a professional (occupational therapist, child psychologist, autism specialist) can review — in 15-20 minutes, **without reading any code** — the exact text a child in crisis sees and taps in the app. It is the specific request that `CONTRIBUTING.md` refers to when asking for "clinical professionals to review the emergency flow and the language used with children in crisis".

Repository: <https://github.com/marianomarcuchi2025/proyecto-abrazo> (AGPL-3.0, open source). Status: MVP, **not clinically validated yet** — hence this request.

## What the app is, in one sentence

A web app with three buttons for a child (especially autistic children): logging how they feel ("body traffic light"), asking a trusted adult for help through an emergency button, and a 3-step guided breathing exercise.

## The complete flow, step by step, with the literal text

The app's UI is in Spanish. Each quote below shows the literal Spanish text followed by an English gloss in brackets.

**1. Main screen** — two large buttons:

> 🫂 Necesito un abrazo [I need a hug]
> 🌬️ Ayúdame a calmarme [Help me calm down]

**2. If the child taps "I need a hug"** — a confirmation appears (to prevent accidental taps):

> ¿Quieres avisar a {configured adult's name}? [Do you want to alert {name}?]
> [Sí, avisar / Yes, alert]   [No, volver / No, go back]

**3. If they confirm "Yes, alert"** and there is a connection:

> Aviso a {names} confirmado. [Alert to {names} confirmed.]

(In parallel, the app makes a best-effort attempt to send an SMS with the text: *"Hola {nombre}. Te aviso desde la app Abrazo: necesito que vengas." [Hi {name}. Alerting you from the Abrazo app: I need you to come.]* — but this is NOT what confirms delivery; only the server confirming over HTTP counts as "confirmed", precisely to avoid showing the child a false positive.)

**4. If they confirm "Yes, alert" but there is no connection** (offline):

> No se pudo enviar el aviso todavía (se reintentará solo apenas haya conexión). Puedes tocar el botón otra vez, o buscar a un adulto cerca.
> [The alert couldn't be sent yet (it will retry on its own as soon as there's a connection). You can tap the button again, or look for an adult nearby.]

And when the connection returns and the alert finally goes out, without the child having to do anything else:

> Aviso a {nombres} confirmado (se envió apenas volvió la conexión).
> [Alert to {names} confirmed (it was sent as soon as the connection came back).]

**5. If no adult has been configured yet:**

> Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️ de arriba.
> [You still need to choose who to alert. Ask an adult to tap the ⚙️ button at the top.]

**6. If they tap "Help me calm down"** — guided breathing, a repeating 3-step cycle:

> Toma aire por la nariz [Breathe in through your nose] (4 seconds, circle grows)
> Aguanta el aire [Hold your breath] (2 seconds)
> Suelta el aire despacio [Let the air out slowly] (6 seconds, circle shrinks)

## Specific questions for the reviewer

1. Is the emergency confirmation language ("Do you want to alert...?", "Yes, alert" / "No, go back") appropriate for a child in crisis, or does it add more friction/anxiety than necessary at that moment?
2. Is the "couldn't send yet" message clear without being alarming? Is there a better way to say "we keep trying" without the child feeling that nobody heard them?
3. Is the 4-2-6 second breathing cycle an appropriate default for autistic children, or should it be configurable/different?
4. Is any case missing — for example, what happens if the child taps the button repeatedly in panic (the app has a cooldown to avoid duplicates, but the child sees no distinct message in that case)?
5. Is there anything in this flow that a professional would consider outright inappropriate or risky to publish, beyond suggestions for improvement?

## Update (Pass 9): "I want to say something" now has a real function

The "Quiero decir algo" [I want to say something] button, which previously did nothing (and had been removed for that reason), now shows 6 fixed [ARASAAC](https://arasaac.org) symbols so the child can point at or show an adult what they need:

> Tengo hambre / Tengo sed / Me duele / Estoy cansado/a / Necesito ir al baño / Necesito estar solo/a
> [I'm hungry / I'm thirsty / It hurts / I'm tired / I need the bathroom / I need to be alone]

It does not trigger any alert; it is only displayed large on screen. **Additional questions for the reviewer:**

6. Are these 6 needs the most important ones to cover with such a small set, or is anything missing/superfluous?
7. Could "I need to be alone" be misread in a crisis context (e.g., an adult might read it as "leave them alone" at a moment when that is not appropriate)?
8. Is first-person text ("I'm hungry") more appropriate than an instruction ("Feed me"), or does it depend on the child?

No code review or installation is needed — answering these questions in writing is enough (email, or a comment in the GitHub issue if preferred: <https://github.com/marianomarcuchi2025/proyecto-abrazo/issues>).

Contact: marianomarcuchi@gmail.com
