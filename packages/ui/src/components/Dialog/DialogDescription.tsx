import { Description as HeadlessDialogDescription } from '@headlessui/react';
import { FC, PropsWithChildren } from 'react';

export const DialogDescription: FC<PropsWithChildren> = ({ children }) => (
  <HeadlessDialogDescription className="text-foreground/60 mt-2 text-sm">
    {children}
  </HeadlessDialogDescription>
);
