import { FC } from 'react';

import { TopBarLogo } from '../TopBarLogo';

type TitleTextProps = {
  title: string;
};

export const TitleText: FC<TitleTextProps> = ({ title }) => (
  <span className="text-foreground font-heading text-md pointer-events-none absolute inset-x-0 flex flex-col text-center font-medium">
    <span className="align-center flex w-full items-center gap-2">
      <span className="flex-1" />
      <TopBarLogo className="h-4" />
      {title}
      <span className="flex-1" />
    </span>
  </span>
);
