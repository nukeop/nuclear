import { ComponentProps } from 'react';

export type TopListEntry = {
  id: string;
  label: string;
  sublabel?: string;
  imageUrl?: string | null;
  value: number;
};

export type TopListProps = ComponentProps<'div'> & {
  title: string;
  entries: TopListEntry[];
  formatValue: (value: number) => string;
};
