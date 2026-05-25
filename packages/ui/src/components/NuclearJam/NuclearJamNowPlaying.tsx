import { Music2 } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';

export type NuclearJamNowPlayingProps = {
  title: string;
  artist?: string;
  coverUrl?: string;
  isLoading?: boolean;
  className?: string;
};

export const NuclearJamNowPlaying: FC<NuclearJamNowPlayingProps> = ({
  title,
  artist,
  coverUrl,
  isLoading = false,
  className,
}) => (
  <div
    className={cn(
      'flex shrink-0 flex-col items-center gap-4 px-6 py-6',
      className,
    )}
  >
    <div
      className="border-border bg-background-secondary shadow-shadow relative flex size-52 shrink-0 items-center justify-center overflow-hidden rounded-md border-(length:--border-width)"
      data-testid="now-playing-cover"
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="size-full object-cover select-none"
        />
      ) : (
        <Music2 size={64} className="text-foreground opacity-20" />
      )}
      {isLoading && (
        <div className="bg-stripes-diagonal absolute inset-x-0 bottom-0 h-1.5" />
      )}
    </div>
    <div className="w-full text-center">
      <div
        className="text-foreground truncate text-xl font-black"
        data-testid="now-playing-title"
      >
        {title}
      </div>
      {artist && (
        <div
          className="text-foreground-secondary mt-1 truncate text-sm"
          data-testid="now-playing-artist"
        >
          {artist}
        </div>
      )}
    </div>
  </div>
);
