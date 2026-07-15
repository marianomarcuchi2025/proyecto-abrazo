# Pedido de revisión clínica — flujo de emergencia de Proyecto Abrazo

Este documento existe para que un profesional (terapista ocupacional, psicólogo/a infantil, especialista en autismo) pueda revisar en 15-20 minutos, **sin tener que leer código**, el texto exacto que un niño en crisis ve y toca en la app. Es el pedido puntual al que se refiere `CONTRIBUTING.md` cuando pide "profesionales clínicos para revisar el flujo de emergencia y el lenguaje usado con niños en crisis".

Repositorio: <https://github.com/marianomarcuchi2025/proyecto-abrazo> (AGPL-3.0, código abierto). Estado: MVP, **no validado clínicamente todavía** — por eso este pedido.

## Qué es la app, en una frase

Una app web con tres botones para un niño (especialmente en el espectro autista): registrar cómo se siente ("semáforo del cuerpo"), pedir ayuda a un adulto de confianza con un botón de emergencia, y una respiración guiada de 3 pasos.

## El flujo completo, paso a paso, con el texto literal

**1. Pantalla principal** — dos botones grandes:

> 🫂 Necesito un abrazo
> 🌬️ Ayúdame a calmarme

**2. Si toca "Necesito un abrazo"** — aparece una confirmación (para evitar toques accidentales):

> ¿Quieres avisar a {nombre del adulto configurado}?
> [Sí, avisar]   [No, volver]

**3. Si confirma "Sí, avisar"** y hay conexión:

> Aviso a {nombres} confirmado.

(en paralelo, intenta mandar un SMS de mejor esfuerzo con el texto: *"Hola {nombre}. Te aviso desde la app Abrazo: necesito que vengas."* — pero esto NO es lo que confirma el envío; solo el servidor confirmando por HTTP cuenta como "confirmado", justamente para no mostrarle al niño un falso positivo).

**4. Si confirma "Sí, avisar" pero no hay conexión** (offline):

> No se pudo enviar el aviso todavía (se reintentará solo apenas haya conexión). Puedes tocar el botón otra vez, o buscar a un adulto cerca.

Y cuando la conexión vuelve y el aviso finalmente sale, sin que el niño tenga que hacer nada más:

> Aviso a {nombres} confirmado (se envió apenas volvió la conexión).

**5. Si no hay ningún adulto configurado todavía:**

> Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️ de arriba.

**6. Si toca "Ayúdame a calmarme"** — respiración guiada, ciclo de 3 pasos que se repite:

> Toma aire por la nariz (4 segundos, círculo que crece)
> Aguanta el aire (2 segundos)
> Suelta el aire despacio (6 segundos, círculo que se achica)

## Preguntas puntuales para quien revise

1. ¿El lenguaje de la confirmación de emergencia ("¿Quieres avisar a...?", "Sí, avisar" / "No, volver") es apropiado para un niño en crisis, o genera más fricción/ansiedad de la necesaria en ese momento?
2. ¿El mensaje de "no se pudo enviar todavía" es claro sin ser alarmante? ¿Hay una forma mejor de decir "seguimos intentando" sin que el niño sienta que nadie lo escuchó?
3. ¿El ciclo de respiración 4-2-6 segundos es apropiado como default para niños en el espectro autista, o debería ser configurable/diferente?
4. ¿Falta algún caso — por ejemplo, qué pasa si el niño toca el botón repetidamente en pánico (la app tiene un cooldown para evitar duplicados, pero el niño no ve ningún mensaje distinto en ese caso)?
5. ¿Hay algo en este flujo que un profesional consideraría directamente inapropiado o riesgoso para publicar, más allá de sugerencias de mejora?

## Actualización (Pasada 9): "Quiero decir algo" ya tiene una función real

El botón "Quiero decir algo", que antes no hacía nada (por eso se había quitado), ahora muestra 6 símbolos fijos de [ARASAAC](https://arasaac.org) para que el niño señale o le muestre a un adulto qué necesita:

> Tengo hambre / Tengo sed / Me duele / Estoy cansado/a / Necesito ir al baño / Necesito estar solo/a

No dispara ningún aviso, solo se muestra grande en pantalla. **Preguntas adicionales para quien revise:**

6. ¿Estas 6 necesidades son las más importantes para cubrir con un set tan chico, o falta/sobra alguna?
7. ¿"Necesito estar solo/a" puede malinterpretarse en un contexto de crisis (por ejemplo, un adulto podría leerlo como "dejalo solo" en un momento donde no corresponde)?
8. ¿El texto en primera persona ("Tengo hambre") es más apropiado que una instrucción ("Dame de comer"), o depende del niño?

No hace falta revisar código ni instalar nada — alcanza con responder estas preguntas por escrito (email, o un comentario en el issue de GitHub si se prefiere: <https://github.com/marianomarcuchi2025/proyecto-abrazo/issues>).
