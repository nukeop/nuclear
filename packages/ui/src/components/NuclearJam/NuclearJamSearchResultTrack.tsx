import { CassetteTape } from 'lucide-react';
import { FC } from 'react';

import { pickArtwork, Track } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';

const THUMBNAIL_SIZE = 48;

export type NuclearJamSearchResultTrackProps = {
  track: Track;
  onAdd: (track: Track) => void;
  className?: string;
};

export const NuclearJamSearchResultTrack: FC<
  NuclearJamSearchResultTrackProps
> = ({ track, onAdd, className }) => {
  const thumbnail = pickArtwork(track.artwork, 'thumbnail', THUMBNAIL_SIZE);
  const primaryArtist = track.artists[0]?.name;
  const duration = formatTimeMillis(track.durationMs);

  const handleClick = () => {
    onAdd(track);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'border-border active:bg-primary flex w-full cursor-pointer items-center gap-3 border-b-(length:--border-width) px-4 py-2 text-left',
        className,
      )}
      data-testid="jam-search-result-track"
    >
      <div className="border-border bg-background-secondary flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border-(length:--border-width)">
        {thumbnail?.url ? (
          <img
            src={thumbnail.url}
            alt={track.title}
            className="size-full object-cover"
          />
        ) : (
          <CassetteTape
            size={40}
            absoluteStrokeWidth
            className="text-foreground opacity-20"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-sm font-bold">
          {track.title}
        </div>
        {primaryArtist && (
          <div className="text-foreground-secondary truncate text-xs">
            {primaryArtist}
          </div>
        )}
      </div>

      {duration && (
        <div className="text-foreground-secondary shrink-0 text-xs tabular-nums">
          {duration}
        </div>
      )}
    </button>
  );
};
