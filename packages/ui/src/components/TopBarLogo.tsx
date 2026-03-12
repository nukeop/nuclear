import { FC } from 'react';

import LogoLight from '../assets/logo-icon-light.svg?react';
import LogoDark from '../assets/logo-icon.svg?react';

const logoClass = 'h-6 w-6';

export const TopBarLogo: FC = () => (
  <>
    <span className="ml-0.5 dark:hidden">
      <LogoDark className={logoClass} />
    </span>
    <span className="ml-0.5 hidden dark:block!">
      <LogoLight className={logoClass} />
    </span>
  </>
);
