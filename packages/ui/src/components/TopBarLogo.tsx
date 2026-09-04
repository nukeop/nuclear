import { FC } from 'react';

import Logo from '../assets/logo-icon.svg?react';
import { cn } from '../utils';

type TopBarLogoProps = {
  className?: string;
};

export const TopBarLogo: FC<TopBarLogoProps> = ({ className }) => (
  <span className="ml-0.5">
    <Logo className={cn('h-6 w-6', className)} />
  </span>
);
