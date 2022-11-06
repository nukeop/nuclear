export type LoadableMeta = Partial<
  Record<'isLoading' | 'isReady' | 'hasError', boolean>
> &
  Partial<{
    error: string;
  }>;

export type Loadable<T> = LoadableMeta & {
  data?: T;
};

export type EmptyPayloadKeyCreator = () => string;
export type KeyCreator<P> = (payload: P) => string;
