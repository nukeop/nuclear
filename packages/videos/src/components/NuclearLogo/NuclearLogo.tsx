import { FC } from 'react';

import { cn } from '@nuclearplayer/ui';

import LogoFull from '../../assets/logo-full-outlined.svg?react';

type NuclearLogoProps = {
  className?: string;
};

export const NuclearLogo: FC<NuclearLogoProps> = ({ className }) => (
  <LogoFull
    aria-label="Nuclear"
    className={cn('h-9 w-auto self-start', className)}
  />
);
