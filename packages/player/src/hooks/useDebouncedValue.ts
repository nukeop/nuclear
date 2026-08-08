import debounce from 'lodash-es/debounce';
import { useEffect, useMemo, useState } from 'react';

export const useDebouncedValue = <Value>(
  value: Value,
  delayMs: number,
): Value => {
  const [debounced, setDebounced] = useState(value);
  const sync = useMemo(() => debounce(setDebounced, delayMs), [delayMs]);

  useEffect(() => sync(value), [sync, value]);
  useEffect(() => sync.cancel, [sync]);

  return debounced;
};
