import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  BrowserStorage,
  SecureStorage,
  DeviceProfiler,
  DeviceTier,
  SemaforoDelCuerpo,
  EstadoSemaforo,
  ServicioEmergencia,
  EventBus,
} from '@abrazo/core';

@customElement('pantalla-abrazo')
export class PantallaAbrazo extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      --color-verde: #4caf50;
      --color-amarillo: #ffc107;
      --color-rojo: #f44336;
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
    }
    .titulo {
      font-size: 2rem;
      text-align: center;
      margin-bottom: 8px;
    }
    .boton-principal {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1.1rem;
      padding: 18px;
      border-radius: 16px;
      border: none;
      background: #eef1f5;
      cursor: pointer;
      min-height: 56px;
    }
    .boton-abrazo {
      background: #ffe3e3;
      font-weight: 600;
    }
    .icono {
      font-size: 1.4rem;
    }
    .semaforo {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 12px;
    }
    .boton-semaforo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 3px solid rgba(0, 0, 0, 0.15);
      font-size: 1.6rem;
      cursor: pointer;
    }
    .feedback {
      text-align: center;
      min-height: 24px;
      font-size: 0.95rem;
      color: #333;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 320px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .confirm-btn {
      background: var(--color-rojo);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      cursor: pointer;
    }
    .cancel-btn {
      background: transparent;
      border: 1px solid #ccc;
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
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
    .aviso-sin-config {
      text-align: center;
      font-size: 0.85rem;
      color: #a15c00;
      background: #fff6e5;
      border-radius: 10px;
      padding: 8px;
    }
    .form-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .form-config input {
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }
    .guardar-btn {
      background: var(--color-verde);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      cursor: pointer;
    }
  `;

  @state() private tier: DeviceTier = 'mid';
  @state() private feedbackMsg = '';
  @state() private showEmergencyConfirm = false;
  @state() private showSettings = false;
  @state() private tieneContacto = false;
  @state() private nombreContacto = '';
  @state() private telefonoContacto = '';

  private semaforo: SemaforoDelCuerpo;
  private emergencia: ServicioEmergencia;

  constructor() {
    super();
    // Misma instancia de storage base para semáforo y emergencia: ambas
    // encriptan con la misma clave maestra (ver secure-storage.ts).
    const storage = new SecureStorage(new BrowserStorage());
    this.semaforo = new SemaforoDelCuerpo(storage);
    this.emergencia = new ServicioEmergencia(storage);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.tier = DeviceProfiler.getInstance().tier;
    void this.emergencia.tieneProtocoloConfigurado().then((tiene) => {
      this.tieneContacto = tiene;
    });
  }

  render() {
    return html`
      <div class="contenedor">
        <div class="header-row">
          <button
            class="boton-config"
            aria-label="Configurar contacto de emergencia"
            @click=${this._toggleSettings}
          >
            ⚙️
          </button>
        </div>

        <div class="titulo">🫂 Abrazo</div>

        ${!this.tieneContacto && !this.showSettings
          ? html`<div class="aviso-sin-config">
              Todavía no configuraste a quién avisar en una emergencia. Tocá ⚙️ arriba.
            </div>`
          : ''}

        ${this.showSettings ? this._renderSettings() : this._renderPrincipal()}

        <div class="feedback" role="status" aria-live="polite">${this.feedbackMsg}</div>

        ${this.showEmergencyConfirm
          ? html`
              <div class="modal-overlay" @click=${this._cancelarEmergencia}>
                <div class="modal-content" @click=${(e: Event) => e.stopPropagation()}>
                  <p>🫂 ¿Necesitas que venga alguien?</p>
                  <button class="confirm-btn" @click=${this._pedirAbrazo}>SÍ, NECESITO AYUDA</button>
                  <button class="cancel-btn" @click=${this._cancelarEmergencia}>No, estoy bien</button>
                </div>
              </div>
            `
          : ''}
      </div>
    `;
  }

  private _renderPrincipal() {
    return html`
      <button class="boton-principal" @click=${() => this._navegar('voz')}>
        <span class="icono">🗣️</span> Quiero decir algo
      </button>

      <button class="boton-principal boton-abrazo" @click=${this._confirmarEmergencia}>
        <span class="icono">🫂</span> Necesito un abrazo
      </button>

      <button class="boton-principal" @click=${() => this._navegar('regulacion')}>
        <span class="icono">🧰</span> Ayúdame a calmarme
      </button>

      <div class="semaforo" role="group" aria-label="¿Cómo te sientes?">
        <button
          class="boton-semaforo verde"
          style="background: var(--color-verde)"
          aria-label="Me siento bien"
          @click=${() => this._registrar('verde')}
        >
          🟢
        </button>
        <button
          class="boton-semaforo amarillo"
          style="background: var(--color-amarillo)"
          aria-label="Me siento regular"
          @click=${() => this._registrar('amarillo')}
        >
          🟡
        </button>
        <button
          class="boton-semaforo rojo"
          style="background: var(--color-rojo)"
          aria-label="Me siento mal"
          @click=${() => this._registrar('rojo')}
        >
          🔴
        </button>
      </div>
    `;
  }

  private _renderSettings() {
    return html`
      <div class="form-config">
        <p>¿A quién avisamos si necesitás un abrazo?</p>
        <input
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
        <button class="guardar-btn" @click=${this._guardarContacto}>Guardar</button>
        <button class="cancel-btn" @click=${this._toggleSettings}>Cerrar</button>
      </div>
    `;
  }

  private _toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  private async _guardarContacto() {
    const nombre = this.nombreContacto.trim();
    const telefono = this.telefonoContacto.trim();
    if (!nombre || !telefono) {
      this.feedbackMsg = 'Completá nombre y teléfono para guardar.';
      return;
    }
    await this.emergencia.configurarProtocolo({
      contactos: [{ nombre, telefono, relacion: 'contacto principal' }],
      mensajeSMS: 'Hola {nombre}, necesito un abrazo. ¿Podés venir?',
    });
    this.tieneContacto = true;
    this.showSettings = false;
    this.feedbackMsg = `Listo, avisamos a ${nombre} si lo necesitás.`;
    setTimeout(() => {
      this.feedbackMsg = '';
    }, 3000);
  }

  private _navegar(destino: 'voz' | 'regulacion') {
    // Se emite un evento en vez de navegar directamente: el documento
    // original solo tenía un console.log de relleno aquí, sin router real.
    EventBus.getInstance().dispatch('navegacion.solicitada', { destino });
  }

  private _confirmarEmergencia() {
    if (navigator.vibrate) navigator.vibrate(50);
    this.showEmergencyConfirm = true;
  }

  private _cancelarEmergencia() {
    this.showEmergencyConfirm = false;
  }

  private async _pedirAbrazo() {
    this.showEmergencyConfirm = false;
    this.feedbackMsg = 'Pidiendo un abrazo...';
    await this.updateComplete;

    const res = await this.emergencia.activar();

    if (res.canal === 'cooldown') {
      this.feedbackMsg = 'Ya viene el abrazo. Respira.';
    } else if (res.canal === 'sin-configurar') {
      this.feedbackMsg = 'Todavía no hay un adulto configurado para avisar.';
    } else if (res.confirmado) {
      this.feedbackMsg = '🫂 Viene un abrazo para ti.';
    } else {
      // Ya no se finge éxito: si el backend no confirmó la alerta, se
      // avisa en vez de decir que "ya viene ayuda".
      this.feedbackMsg = 'No pude confirmar el aviso. Intenta de nuevo o busca a un adulto cerca.';
    }

    if (navigator.vibrate) navigator.vibrate([100, 50, 200]);
  }

  private async _registrar(estado: EstadoSemaforo) {
    await this.semaforo.registrar(estado);
    if (estado === 'rojo') this.feedbackMsg = 'Te escucho. Estoy aquí. 💙';
    else if (estado === 'amarillo') this.feedbackMsg = 'Tómatelo con calma. 🌿';
    else this.feedbackMsg = 'Me alegra verte bien ✨';

    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => {
      this.feedbackMsg = '';
    }, 3000);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'pantalla-abrazo': PantallaAbrazo;
  }
}
