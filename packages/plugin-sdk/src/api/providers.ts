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

  get<T extends ProviderDescriptor>(
    id: string | undefined,
    kind: ProviderKind,
  ) {
    return this.#withHost((h) => h.get<T>(id, kind));
  }

  subscribe(listener: () => void) {
    return this.#withHost((h) => h.subscribe(listener));
  }
}
