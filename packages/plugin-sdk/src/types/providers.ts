export type ProviderKind =
  | 'metadata'
  | 'streaming'
  | 'lyrics'
  | 'dashboard'
  | 'playlists'
  | 'discovery'
  | (string & {});

export type ProviderDescriptor<K extends ProviderKind = ProviderKind> = {
  id: string;
  kind: K;
  name: string;
  pluginId?: string;
};

export type ProvidersHost = {
  register<T extends ProviderDescriptor>(provider: T): string;
  unregister(providerId: string): boolean;
  list<K extends ProviderKind = ProviderKind>(
    kind?: K,
  ): ProviderDescriptor<K>[];
  get<T extends ProviderDescriptor>(
    providerId: string | undefined,
    kind: ProviderKind,
  ): T | undefined;
  clear(): void;
  getActive(kind: ProviderKind): string | undefined;
  setActive(kind: ProviderKind, providerId: string): void;
  subscribe(listener: () => void): () => void;
};
