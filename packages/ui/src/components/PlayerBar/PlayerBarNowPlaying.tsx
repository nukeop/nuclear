import { Music2 } from 'lucide-react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';

type PlayerBarNowPlayingProps = {
  title: string;
  artist: string;
  coverUrl?: string;
  className?: string;
  action?: ReactNode;
};

export const PlayerBarNowPlaying: FC<PlayerBarNowPlayingProps> = ({
  title,
  artist,
  coverUrl,
  className = '',
  action,
}) => (
  <div className={cn('flex min-w-0 items-center gap-3', className)}>
    <div className="border-border bg-background-secondary size-12 shrink-0 overflow-hidden rounded-md border-2">
      {coverUrl ? (
        <img
          src={coverUrl}
          alt=""
          className="size-full object-cover select-none"
          data-testid="player-now-playing-thumbnail"
        />
      ) : (
        <div
          className="text-foreground-secondary flex size-full items-center justify-center"
          data-testid="player-now-playing-placeholder"
        >
          <Music2 size={20} />
        </div>
      )}
    </div>
    <div className="min-w-0 flex-1">
      <div
        className="text-foreground truncate text-sm font-bold"
        data-testid="now-playing-title"
      >
        {title}
      </div>
      <div
        className="text-foreground-secondary truncate text-xs"
        data-testid="player-now-playing-artist"
      >
        {artist}
      </div>
    </div>
    {action}
  </div>
);
