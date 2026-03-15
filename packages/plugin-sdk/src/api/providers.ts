import type {
  ProviderDescriptor,
  ProviderKind,
  ProvidersHost,
} from '../types/providers';

export class Providers {
  #host?: ProvidersHost;

  constructor(host?: ProvidersHost) {
    this.#host = host;
  }

  #withHost<T>(fn: (host: ProvidersHost) => T): T {
    const host = this.#host;
    if (!host) {
      throw new Error('Providers host not available');
    }
    return fn(host);
  }

  register<T extends ProviderDescriptor>(p: T) {
    return this.#withHost((h) => h.register<T>(p));
  }

  unregister(id: string) {
    return this.#withHost((h) => h.unregister(id));
  }

  list<K extends ProviderKind = ProviderKind>(kind?: K) {
    return this.#withHost((h) => h.list<K>(kind));
  }

  get<T extends ProviderDescriptor>(id: string, kind: ProviderKind) {
    return this.#withHost((host) => host.get<T>(id, kind));
  }

  getActive(kind: ProviderKind) {
    return this.#withHost((host) => host.getActive(kind));
  }

  setActive(kind: ProviderKind, providerId: string) {
    return this.#withHost((host) => host.setActive(kind, providerId));
  }

  clearActive(kind: ProviderKind) {
    return this.#withHost((host) => host.clearActive(kind));
  }

  subscribe(listener: () => void) {
    return this.#withHost((host) => host.subscribe(listener));
  }
}
