import { CassetteTape, MicVocal } from 'lucide-react';
import { FC } from 'react';

import { cn } from '../../utils';
import { Button } from '../Button';

export type NuclearJamNowPlayingLabels = {
  lyrics: string;
};

export type NuclearJamNowPlayingProps = {
  title: string;
  artist?: string;
  coverUrl?: string;
  isLoading?: boolean;
  onLyricsClick?: () => void;
  labels: NuclearJamNowPlayingLabels;
  className?: string;
};

export const NuclearJamNowPlaying: FC<NuclearJamNowPlayingProps> = ({
  title,
  artist,
  coverUrl,
  isLoading = false,
  onLyricsClick,
  labels,
  className,
}) => (
  <div
    className={cn(
      'flex shrink-0 items-center gap-4 px-6 py-6',
      'tall:flex-col',
      'short:flex-row short:gap-3 short:px-4 short:py-3',
      className,
    )}
  >
    <div
      className="border-border bg-muted shadow-shadow short:size-24 short:rounded-sm short:shadow-none relative flex size-52 shrink-0 items-center justify-center overflow-hidden rounded-md border-(length:--border-width)"
      data-testid="now-playing-cover"
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={title}
          className="size-full object-cover select-none"
        />
      ) : (
        <CassetteTape
          size={128}
          strokeWidth={1}
          className="short:size-10 text-foreground opacity-20"
        />
      )}
      {isLoading && (
        <div className="bg-stripes-diagonal absolute inset-x-0 bottom-0 h-1.5" />
      )}
    </div>
    <div className="short:flex-1 flex w-full min-w-0 items-center gap-3">
      {onLyricsClick && (
        <span aria-hidden className="short:hidden size-10 shrink-0" />
      )}
      <div className="short:text-left min-w-0 flex-1 text-center">
        <div
          className="text-foreground short:text-base truncate text-xl font-black"
          data-testid="now-playing-title"
        >
          {title}
        </div>
        {artist && (
          <div
            className="text-foreground/60 short:mt-0 short:text-xs mt-1 truncate text-sm"
            data-testid="now-playing-artist"
          >
            {artist}
          </div>
        )}
      </div>
      {onLyricsClick && (
        <Button
          size="icon"
          aria-label={labels.lyrics}
          onClick={onLyricsClick}
          data-testid="jam-lyrics-button"
          className="shrink-0"
        >
          <MicVocal size={20} />
        </Button>
      )}
    </div>
  </div>
);
