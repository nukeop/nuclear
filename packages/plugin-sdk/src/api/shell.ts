import type { ShellHost } from '../types/shell';

export class ShellAPI {
  #host?: ShellHost;

  constructor(host?: ShellHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: ShellHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Shell host not available');
    }
    return fn(host);
  }

  openExternal(url: string): Promise<void> {
    return this.#withHost((host) => host.openExternal(url));
  }
}
