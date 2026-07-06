type Listener<T = unknown> = (data: T) => void;

export class EventBus {
  private static instance: EventBus;
  private events: Record<string, Listener[]> = {};

  static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  on<T = unknown>(event: string, listener: Listener<T>): void {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener as Listener);
  }

  off(event: string, listener: Listener): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((l) => l !== listener);
  }

  dispatch<T = unknown>(event: string, data?: T): void {
    if (!this.events[event]) return;
    for (const listener of this.events[event]) listener(data as T);
  }
}
