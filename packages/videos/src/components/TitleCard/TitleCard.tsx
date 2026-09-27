import { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

import { TopBarLogo } from '@nuclearplayer/ui';

import { Enter } from '../Enter';
import { useExitOpacity } from '../Enter/useEntrance';

type TitleCardProps = {
  title: string;
  subtitle?: string;
  logo?: ReactNode;
};

export const TitleCard: FC<TitleCardProps> = ({
  title,
  subtitle,
  logo = <TopBarLogo className="size-24" />,
}) => {
  const exitOpacity = useExitOpacity();

  return (
    <AbsoluteFill
      className="bg-background text-foreground items-center justify-center p-12"
      style={{ opacity: exitOpacity }}
    >
      <Enter className="flex flex-col items-center gap-8 text-center">
        {logo}
        <h1 className="font-heading text-7xl leading-none">{title}</h1>
        {subtitle && <p className="text-3xl opacity-80">{subtitle}</p>}
      </Enter>
    </AbsoluteFill>
  );
};
