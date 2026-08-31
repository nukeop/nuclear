import { Transition, TransitionChild } from '@headlessui/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

export type NuclearJamSearchDrawerProps = {
  open: boolean;
  onBackdropClick?: () => void;
  children?: ReactNode;
  className?: string;
};

export const NuclearJamSearchDrawer: FC<NuclearJamSearchDrawerProps> = ({
  open,
  onBackdropClick,
  children,
  className,
}) => (
  <Transition show={open}>
    <div
      className={cn('absolute inset-0 z-10 overflow-hidden', className)}
      data-testid="jam-search-drawer"
    >
      <TransitionChild>
        <div
          className="absolute inset-0 bg-black/50 transition duration-200 data-closed:opacity-0"
          onClick={onBackdropClick}
          data-testid="jam-search-backdrop"
        />
      </TransitionChild>
      <TransitionChild>
        <div className="surface-background border-border absolute inset-x-0 top-0 flex min-h-40 flex-col border-b-(length:--border-width) backdrop-blur-xl transition duration-200 ease-out data-closed:-translate-y-full">
          {children}
        </div>
      </TransitionChild>
    </div>
  </Transition>
);
