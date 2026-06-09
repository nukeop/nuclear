import { PopoverButton } from '@headlessui/react';
import { FC, ReactNode } from 'react';

export const ClickTrigger: FC<{ children: ReactNode }> = ({ children }) => (
  <PopoverButton as="div" className="cursor-pointer">
    {children}
  </PopoverButton>
);
