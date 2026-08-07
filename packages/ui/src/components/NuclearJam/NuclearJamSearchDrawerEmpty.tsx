import { SearchX } from 'lucide-react';
import { FC } from 'react';

import { EmptyState } from '../EmptyState';

export type NuclearJamSearchDrawerEmptyLabels = {
  title: string;
  description?: string;
};

export type NuclearJamSearchDrawerEmptyProps = {
  labels: NuclearJamSearchDrawerEmptyLabels;
};

export const NuclearJamSearchDrawerEmpty: FC<
  NuclearJamSearchDrawerEmptyProps
> = ({ labels }) => (
  <EmptyState
    icon={<SearchX size={48} />}
    title={labels.title}
    description={labels.description}
    className="flex-1"
    data-testid="jam-search-empty"
  />
);
