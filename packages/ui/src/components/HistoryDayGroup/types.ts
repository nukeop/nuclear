import { ComponentProps } from 'react';

export type HistoryDayGroupClasses = {
  root?: string;
  marker?: string;
  rows?: string;
};

export type HistoryDayGroupProps = ComponentProps<'section'> & {
  marker: string;
  classes?: HistoryDayGroupClasses;
};
