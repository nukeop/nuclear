export type MseBackend = {
  Constructor: typeof MediaSource;
  managed: boolean;
};

export function getMseBackend(): MseBackend | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if ('ManagedMediaSource' in window) {
    return {
      Constructor: (window as unknown as Record<string, typeof MediaSource>)
        .ManagedMediaSource,
      managed: true,
    };
  }

  if ('MediaSource' in window) {
    return { Constructor: MediaSource, managed: false };
  }

  return undefined;
}
