import { FC } from 'react';

import { TopBarLogo } from '../TopBarLogo';

type TitleTextProps = {
  title: string;
};

export const TitleText: FC<TitleTextProps> = ({ title }) => (
  <span className="text-foreground font-heading text-md pointer-events-none absolute inset-x-0 flex text-center font-medium">
    <span className="flex w-full items-center justify-center gap-2">
      <TopBarLogo className="h-4" />
      {title}
    </span>
  </span>
);
