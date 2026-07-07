type DebouncedBatcherOptions<ItemType> = {
  delayMs: number;
  flush: (items: ItemType[]) => Promise<void>;
  onError?: (error: unknown) => void;
};

export type DebouncedBatcher<ItemType> = {
  push: (items: readonly ItemType[]) => void;
  cancel: () => void;
};

export const createDebouncedBatcher = <ItemType>({
  delayMs,
  flush,
  onError,
}: DebouncedBatcherOptions<ItemType>): DebouncedBatcher<ItemType> => {
  let pending: ItemType[] = [];
  let timer: ReturnType<typeof setTimeout> | null = null;
  let processing: Promise<void> = Promise.resolve();

  const startFlush = () => {
    timer = null;
    const batch = pending;
    pending = [];
    processing = processing
      .then(() => flush(batch))
      .catch((error) => {
        onError?.(error);
      });
  };

  const push = (items: readonly ItemType[]) => {
    pending = [...pending, ...items];
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(startFlush, delayMs);
  };

  const cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    pending = [];
  };

  return { push, cancel };
};
