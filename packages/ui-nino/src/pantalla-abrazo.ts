import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  BrowserStorage,
  SecureStorage,
  SemaforoDelCuerpo,
  EstadoSemaforo,
  ServicioEmergencia,
} from '@abrazo/core';

/**
 * DECISIONES DE DISEÑO DE ESTA PANTALLA — y su fuente.
 *
 * Aplican guía publicada de diseño para personas autistas y accesibilidad
 * cognitiva (póster "Designing for users on the autistic spectrum" de
 * GOV.UK; guía COGA del W3C). Son HIPÓTESIS DE DISEÑO razonables, no
 * validación clínica: el espectro autista es heterogéneo y esto necesita
 * revisión por profesionales (TO/psicología infantil) y prueba con
 * usuarios reales antes de cualquier uso serio.
 *
 * 1. Lenguaje literal y consistente. Nada de metáforas ("te escucho",
 *    "viene un abrazo") ni promesas que la app no puede verificar. La app
 *    solo afirma lo que sabe: "Aviso enviado a {nombre}".
 * 2. Sin botones muertos. Todo botón visible hace algo predecible
 *    (GOV.UK: no forzar interacciones de resultado impredecible). El botón
 *    "Quiero decir algo" del diseño original se eliminó hasta que exista.
 * 3. Vibración desactivada por defecto y configurable. Estímulos
 *    sensoriales inesperados pueden ser aversivos; se convierte en opt-in.
 * 4. Colores de baja saturación + etiqueta de texto visible en cada
 *    opción del semáforo (no depender solo de color/emoji).
 * 5. Los mensajes de estado NO desaparecen solos: quedan hasta la
 *    siguiente acción del usuario (WCAG 2.2.1, tiempo ajustable).
 * 6. Sin mayúsculas sostenidas en botones (más difíciles de leer, tono de
 *    grito). Sentence case.
 * 7. "Ayúdame a calmarme" ahora funciona: guía de respiración simple, que
 *    respeta prefers-reduced-motion (sin animación si el sistema lo pide).
 */

type Vista = 'principal' | 'ajustes' | 'calma';

@customElement('pantalla-abrazo')
export class PantallaAbrazo extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      /* Paleta de baja saturación a propósito (guía: colores simples y calmados) */
      --verde-suave: #b9d8b7;
      --amarillo-suave: #f0dfae;
      --rojo-suave: #eab8b6;
      --texto: #2f3437;
      --texto-suave: #5c6468;
      color: var(--texto);
    }
    .contenedor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      max-width: 420px;
      margin: 0 auto;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: center;
      background: #fbfaf7;
    }
    .header-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: -8px;
    }
    .boton-config {
      background: transparent;
      border: none;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 8px;
    }
    .titulo {
      font-size: 1.8rem;
      text-align: center;
      margin-bottom: 4px;
    }
    .aviso-sin-config {
      text-align: center;
      font-size: 0.85rem;
      color: #7a5b18;
      background: #f7efd9;
      border-radius: 10px;
      padding: 10px;
    }
    .boton-principal {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1.1rem;
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #d8d5cd;
      background: #f2f0ea;
      color: var(--texto);
      cursor: pointer;
      min-height: 56px;
    }
    .boton-abrazo {
      background: var(--rojo-suave);
      border-color: #d49a98;
      font-weight: 600;
    }
    .icono {
      font-size: 1.4rem;
    }
    .semaforo {
      display: flex;
      justify-content: center;
      gap: 18px;
      margin-top: 8px;
    }
    .opcion-semaforo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .boton-semaforo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid rgba(0, 0, 0, 0.12);
      font-size: 1.6rem;
      cursor: pointer;
    }
    .etiqueta-semaforo {
      font-size: 0.85rem;
      color: var(--texto-suave);
    }
    .feedback {
      text-align: center;
      min-height: 24px;
      font-size: 0.95rem;
      color: var(--texto);
      background: #f2f0ea;
      border-radius: 10px;
      padding: 10px;
    }
    .feedback:empty {
      background: transparent;
      padding: 0;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: #fbfaf7;
      border-radius: 16px;
      padding: 24px;
      max-width: 320px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .confirm-btn {
      background: var(--rojo-suave);
      color: var(--texto);
      border: 1px solid #d49a98;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .cancel-btn {
      background: transparent;
      border: 1px solid #c9c6be;
      color: var(--texto);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
    }
    .form-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .form-config label {
      font-size: 0.9rem;
      color: var(--texto-suave);
    }
    .form-config input[type='text'],
    .form-config input[type='tel'] {
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #c9c6be;
      font-size: 1rem;
      background: white;
    }
    .fila-check {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    }
    .guardar-btn {
      background: var(--verde-suave);
      color: var(--texto);
      border: 1px solid #97bd95;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      cursor: pointer;
    }
    .pantalla-calma {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 16px 0;
    }
    .circulo-respiracion {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--verde-suave);
      border: 2px solid #97bd95;
      transition: transform 4s ease-in-out;
      transform: scale(1);
    }
    .circulo-respiracion.grande {
      transform: scale(1.35);
    }
    @media (prefers-reduced-motion: reduce) {
      .circulo-respiracion {
        transition: none;
        transform: none !important;
      }
    }
    .texto-respiracion {
      font-size: 1.2rem;
      min-height: 32px;
      text-align: center;
    }
  `;

  @state() private vista: Vista = 'principal';
  @state() private feedbackMsg = '';
  @state() private showEmergencyConfirm = false;
  @state() private tieneContacto = false;
  @state() private nombreGuardado = '';
  @state() private nombreContacto = '';
  @state() private telefonoContacto = '';
  @state() private vibracionActivada = false;
  @state() private textoRespiracion = '';
  @state() private circuloGrande = false;

  private semaforo: SemaforoDelCuerpo;
  private emergencia: ServicioEmergencia;
  private timerRespiracion: number | undefined;

  constructor() {
    super();
    const storage = new SecureStorage(new BrowserStorage());
    this.semaforo = new SemaforoDelCuerpo(storage);
    this.emergencia = new ServicioEmergencia(storage);
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Vibración: opt-in explícito, apagada por defecto (sensibilidad sensorial).
    this.vibracionActivada = localStorage.getItem('abrazo-pref-vibracion') === '1';
    void this.emergencia.obtenerProtocolo().then((protocolo) => {
      if (protocolo && protocolo.contactos.length > 0) {
        this.tieneContacto = true;
        this.nombreGuardado = protocolo.contactos[0].nombre;
        this.nombreContacto = protocolo.contactos[0].nombre;
        this.telefonoContacto = protocolo.contactos[0].telefono;
      }
    });
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._detenerRespiracion();
  }

  render() {
    return html`
      <div class="contenedor">
        <div class="header-row">
          <button
            class="boton-config"
            aria-label="Ajustes (para un adulto)"
            @click=${() => this._cambiarVista(this.vista === 'ajustes' ? 'principal' : 'ajustes')}
          >
            ⚙️
          </button>
        </div>

        <div class="titulo">🫂 Abrazo</div>

        ${!this.tieneContacto && this.vista === 'principal'
          ? html`<div class="aviso-sin-config">
              Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️ de arriba.
            </div>`
          : ''}

        ${this.vista === 'principal' ? this._renderPrincipal() : ''}
        ${this.vista === 'ajustes' ? this._renderAjustes() : ''}
        ${this.vista === 'calma' ? this._renderCalma() : ''}

        <div class="feedback" role="status" aria-live="polite">${this.feedbackMsg}</div>

        ${this.showEmergencyConfirm
          ? html`
              <div class="modal-overlay" @click=${this._cancelarEmergencia}>
                <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
                  <p>¿Quieres avisar a ${this.nombreGuardado || 'tu adulto'}?</p>
                  <button class="confirm-btn" @click=${this._pedirAbrazo}>Sí, avisar</button>
                  <button class="cancel-btn" @click=${this._cancelarEmergencia}>No, volver</button>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderPrincipal() {
    return html`
      <button class="boton-principal boton-abrazo" @click=${this._confirmarEmergencia}>
        <span class="icono">🫂</span> Necesito un abrazo
      </button>

      <button class="boton-principal" @click=${() => this._cambiarVista('calma')}>
        <span class="icono">🌬️</span> Ayúdame a calmarme
      </button>

      <div class="semaforo" role="group" aria-label="¿Cómo te sientes?">
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--verde-suave)"
            aria-label="Me siento bien"
            @click=${() => this._registrar('verde')}
          >
            🙂
          </button>
          <span class="etiqueta-semaforo">Bien</span>
        </div>
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--amarillo-suave)"
            aria-label="Me siento más o menos"
            @click=${() => this._registrar('amarillo')}
          >
            😐
          </button>
          <span class="etiqueta-semaforo">Más o menos</span>
        </div>
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--rojo-suave)"
            aria-label="Me siento mal"
            @click=${() => this._registrar('rojo')}
          >
            🙁
          </button>
          <span class="etiqueta-semaforo">Mal</span>
        </div>
      </div>
    `;
  }

  private _renderAjustes() {
    return html`
      <div class="form-config">
        <p style="margin: 0; font-weight: 600;">Ajustes (para un adulto)</p>
        <label for="nombre">¿A quién avisamos si el niño pide un abrazo?</label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre (ej: Mamá)"
          .value=${this.nombreContacto}
          @input=${(e: InputEvent) => (this.nombreContacto = (e.target as HTMLInputElement).value)}
        />
        <input
          type="tel"
          placeholder="Teléfono (ej: 5491122334455)"
          .value=${this.telefonoContacto}
          @input=${(e: InputEvent) => (this.telefonoContacto = (e.target as HTMLInputElement).value)}
        />
        <label class="fila-check">
          <input
            type="checkbox"
            .checked=${this.vibracionActivada}
            @change=${(e: Event) => this._toggleVibracion((e.target as HTMLInputElement).checked)}
          />
          Vibración al tocar botones (apagada por defecto)
        </label>
        <button class="guardar-btn" @click=${this._guardarContacto}>Guardar</button>
        <button class="cancel-btn" @click=${() => this._cambiarVista('principal')}>Volver</button>
      </div>
    `;
  }

  private _renderCalma() {
    return html`
      <div class="pantalla-calma">
        <div class="circulo-respiracion ${this.circuloGrande ? 'grande' : ''}"></div>
        <div class="texto-respiracion" role="status" aria-live="polite">${this.textoRespiracion}</div>
        <button class="cancel-btn" style="width: 100%;" @click=${() => this._cambiarVista('principal')}>
          Volver
        </button>
      </div>
    `;
  }

  private _cambiarVista(vista: Vista) {
    this._detenerRespiracion();
    this.feedbackMsg = '';
    this.vista = vista;
    if (vista === 'calma') this._iniciarRespiracion();
  }

  private _iniciarRespiracion() {
    // Ciclo 4-2-6, patrón simple de respiración guiada. El círculo crece y
    // se achica por CSS; con prefers-reduced-motion solo cambia el texto.
    const fases = [
      { texto: 'Toma aire por la nariz', dur: 4000, grande: true },
      { texto: 'Aguanta el aire', dur: 2000, grande: true },
      { texto: 'Suelta el aire despacio', dur: 6000, grande: false },
    ];
    let i = 0;
    const paso = () => {
      const f = fases[i % fases.length];
      this.textoRespiracion = f.texto;
      this.circuloGrande = f.grande;
      i++;
      this.timerRespiracion = window.setTimeout(paso, f.dur);
    };
    paso();
  }

  private _detenerRespiracion() {
    if (this.timerRespiracion !== undefined) {
      clearTimeout(this.timerRespiracion);
      this.timerRespiracion = undefined;
    }
    this.textoRespiracion = '';
    this.circuloGrande = false;
  }

  private _toggleVibracion(activada: boolean) {
    this.vibracionActivada = activada;
    localStorage.setItem('abrazo-pref-vibracion', activada ? '1' : '0');
  }

  private async _guardarContacto() {
    const nombre = this.nombreContacto.trim();
    const telefono = this.telefonoContacto.trim();
    if (!nombre || !telefono) {
      this.feedbackMsg = 'Falta completar el nombre y el teléfono.';
      return;
    }
    await this.emergencia.configurarProtocolo({
      contactos: [{ nombre, telefono, relacion: 'contacto principal' }],
      // Mensaje literal también en el SMS best-effort.
      mensajeSMS: 'Hola {nombre}. Te aviso desde la app Abrazo: necesito que vengas.',
    });
    this.tieneContacto = true;
    this.nombreGuardado = nombre;
    this._cambiarVista('principal');
    this.feedbackMsg = `Guardado. Si el niño toca "Necesito un abrazo", el aviso llega a ${nombre}.`;
  }

  private _vibrar(patron: number | number[]) {
    if (this.vibracionActivada && navigator.vibrate) navigator.vibrate(patron);
  }

  private _confirmarEmergencia() {
    this._vibrar(50);
    this.showEmergencyConfirm = true;
  }

  private _cancelarEmergencia() {
    this.showEmergencyConfirm = false;
  }

  private async _pedirAbrazo() {
    this.showEmergencyConfirm = false;
    this.feedbackMsg = 'Enviando el aviso...';
    await this.updateComplete;

    const res = await this.emergencia.activar();
    const nombre = this.nombreGuardado || 'tu adulto';

    // Lenguaje LITERAL: la app solo afirma lo que puede verificar (que el
    // aviso llegó al servidor), nunca que el adulto "ya viene".
    if (res.canal === 'cooldown') {
      this.feedbackMsg = `El aviso ya fue enviado a ${nombre} hace un momento.`;
    } else if (res.canal === 'sin-configurar') {
      this.feedbackMsg = 'Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️.';
    } else if (res.confirmado) {
      this.feedbackMsg = `Aviso enviado a ${nombre}.`;
    } else {
      this.feedbackMsg = 'No se pudo enviar el aviso. Puedes tocar el botón otra vez, o buscar a un adulto cerca.';
    }

    this._vibrar([100, 50, 200]);
  }

  private async _registrar(estado: EstadoSemaforo) {
    await this.semaforo.registrar(estado);
    // Mensajes literales, idénticos cada vez (predecibilidad).
    if (estado === 'rojo') this.feedbackMsg = 'Guardado: te sientes mal.';
    else if (estado === 'amarillo') this.feedbackMsg = 'Guardado: te sientes más o menos.';
    else this.feedbackMsg = 'Guardado: te sientes bien.';
    this._vibrar(30);
    // El mensaje NO desaparece solo: queda hasta la siguiente acción.
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pantalla-abrazo': PantallaAbrazo;
  }
}
