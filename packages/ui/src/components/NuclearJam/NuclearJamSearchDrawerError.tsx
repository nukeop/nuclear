import { TriangleAlert } from 'lucide-react';
import { FC } from 'react';

import { EmptyState } from '../EmptyState';

export type NuclearJamSearchDrawerErrorLabels = {
  title: string;
  description?: string;
};

export type NuclearJamSearchDrawerErrorProps = {
  labels: NuclearJamSearchDrawerErrorLabels;
};

export const NuclearJamSearchDrawerError: FC<
  NuclearJamSearchDrawerErrorProps
> = ({ labels }) => (
  <EmptyState
    icon={<TriangleAlert size={48} />}
    title={labels.title}
    description={labels.description}
    className="flex-1"
    data-testid="jam-search-error"
  />
);
