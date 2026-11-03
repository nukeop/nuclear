import type { NavigationHost, NavigationLocation } from '../types/navigation';

export class NavigationAPI {
  #host?: NavigationHost;

  constructor(host?: NavigationHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: NavigationHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Navigation host not available');
    }
    return fn(host);
  }

  navigate(path: string): Promise<void> {
    return this.#withHost((host) => host.navigate(path));
  }

  back(): void {
    this.#withHost((host) => host.back());
  }

  forward(): void {
    this.#withHost((host) => host.forward());
  }

  current(): NavigationLocation {
    return this.#withHost((host) => host.current());
  }
}
