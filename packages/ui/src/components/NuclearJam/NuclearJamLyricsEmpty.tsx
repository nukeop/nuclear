import { FC, ReactNode } from 'react';

import { EmptyState } from '../EmptyState';

type NuclearJamLyricsEmptyProps = {
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export const NuclearJamLyricsEmpty: FC<NuclearJamLyricsEmptyProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <EmptyState
    data-testid="jam-lyrics-empty"
    icon={icon}
    title={title}
    description={subtitle}
    className="flex-1"
  />
);
