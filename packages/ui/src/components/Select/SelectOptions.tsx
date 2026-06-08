import { ListboxOptions } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

import { useSelectContext } from './context';

export const SelectOptions: FC<PropsWithChildren> = ({ children }) => {
  const {
    ids: { listboxId, labelId },
  } = useSelectContext();

  return (
    <ListboxOptions
      as="ul"
      id={listboxId}
      aria-labelledby={labelId}
      anchor={{ to: 'bottom', gap: 8 }}
      portal
      transition
      className="border-border shadow-shadow bg-primary z-50 min-w-(--button-width) rounded-md border-(length:--border-width) p-2 transition duration-150 ease-out outline-none data-closed:scale-98 data-closed:opacity-0"
    >
      {children}
    </ListboxOptions>
  );
};
