import { createContext, useContext } from 'react';

import { Track } from '@nuclearplayer/model';

import { TrackTableActions, TrackTableLabels, TrackTableProps } from './types';

export type TrackTableContextValue<T extends Track> = {
  isReorderable: boolean;
  features: NonNullable<TrackTableProps['features']>;
  actions: TrackTableActions<T>;
  labels: TrackTableLabels;
};

// any is unavoidable here due to the generics
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrackTableContext = createContext<TrackTableContextValue<any> | null>(
  null,
);

export function TrackTableProvider<T extends Track>({
  value,
  children,
}: {
  value: TrackTableContextValue<T>;
  children: React.ReactNode;
}) {
  return (
    <TrackTableContext.Provider value={value}>
      {children}
    </TrackTableContext.Provider>
  );
}

export function useTrackTableContext<T extends Track>() {
  const ctx = useContext(TrackTableContext);
  if (!ctx) {
    throw new Error(
      'useTrackTableContext must be used within <TrackTableProvider>',
    );
  }
  return ctx as TrackTableContextValue<T>;
}
