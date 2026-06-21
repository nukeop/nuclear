import { FC } from 'react';

import LogoLight from '../assets/logo-icon-light.svg?react';
import LogoDark from '../assets/logo-icon.svg?react';
import { cn } from '../utils';

const logoClass = 'h-6 w-6';

type TopBarLogoProps = {
  className?: string;
};

export const TopBarLogo: FC<TopBarLogoProps> = ({ className }) => (
  <>
    <span className="ml-0.5 dark:hidden">
      <LogoDark className={cn(logoClass, className)} />
    </span>
    <span className="ml-0.5 hidden dark:block!">
      <LogoLight className={cn(logoClass, className)} />
    </span>
  </>
);
