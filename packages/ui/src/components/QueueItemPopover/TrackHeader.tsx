import { FC } from 'react';

import type { Track } from '@nuclearplayer/model';

type TrackHeaderProps = {
  track: Track;
};

export const TrackHeader: FC<TrackHeaderProps> = ({ track }) => {
  const primaryArtist = track.artists[0]?.name;

  return (
    <div
      data-testid="track-header"
      className="border-border border-b-2 px-3 py-2"
    >
      <div className="truncate text-sm font-bold">{track.title}</div>
      {primaryArtist && (
        <div className="text-foreground-secondary truncate text-xs">
          {primaryArtist}
        </div>
      )}
    </div>
  );
};
