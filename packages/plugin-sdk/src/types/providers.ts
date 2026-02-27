export type ProviderKind =
  | 'metadata'
  | 'streaming'
  | 'lyrics'
  | 'dashboard'
  | 'playlists'
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
    providerId: string,
    kind: ProviderKind,
  ): T | undefined;
  clear(): void;
};
