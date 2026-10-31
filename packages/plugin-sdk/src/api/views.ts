import type { PluginViewDefinition, ViewsHost } from '../types/views';

export class ViewsAPI {
  #host?: ViewsHost;

  constructor(host?: ViewsHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: ViewsHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Views host not available');
    }
    return fn(host);
  }

  register(view: PluginViewDefinition): void {
    this.#withHost((host) => host.register(view));
  }

  unregister(id: string): void {
    this.#withHost((host) => host.unregister(id));
  }
}
