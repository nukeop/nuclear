import { FC } from 'react';

import type { TopListEntry } from './types';

type TopListRowProps = {
  entry: TopListEntry;
  rank: number;
  fillRatio: number;
  formatValue: (value: number) => string;
};

export const TopListRow: FC<TopListRowProps> = ({}) => <div></div>;
