import { ListMusic } from 'lucide-react';
import type { FC } from 'react';

import type { Playlist } from '@nuclearplayer/model';
import { pickArtwork } from '@nuclearplayer/model';
import { cn, ImageReveal, Mosaic } from '@nuclearplayer/ui';

const MOSAIC_THRESHOLD = 4;

const getCustomArtworkUrl = (playlist: Playlist): string | undefined => {
  return pickArtwork(playlist.artwork, 'cover', 600)?.url;
};

const getUniqueTrackArtworkUrls = (playlist: Playlist): string[] => {
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const item of playlist.items) {
    const artwork = pickArtwork(item.track.artwork, 'cover', 300);
    if (artwork && !seen.has(artwork.url)) {
      seen.add(artwork.url);
      urls.push(artwork.url);
    }
  }

  return urls;
};

type PlaylistArtworkProps = {
  playlist: Playlist;
  className?: string;
};

export const PlaylistArtwork: FC<PlaylistArtworkProps> = ({
  playlist,
  className,
}) => {
  const customUrl = getCustomArtworkUrl(playlist);
  const trackUrls = getUniqueTrackArtworkUrls(playlist);

  const wrapperClasses = cn(
    'border-border shadow-shadow h-60 w-60 shrink-0 overflow-hidden rounded-md border-2',
    className,
  );

  if (customUrl) {
    return (
      <ImageReveal
        src={customUrl}
        alt={playlist.name}
        className={wrapperClasses}
        imgClassName="h-full w-full object-cover"
      />
    );
  }

  if (trackUrls.length >= MOSAIC_THRESHOLD) {
    return <Mosaic urls={trackUrls} className={wrapperClasses} />;
  }

  if (trackUrls.length > 0) {
    return (
      <ImageReveal
        src={trackUrls[0]}
        alt={playlist.name}
        className={wrapperClasses}
        imgClassName="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className={cn(wrapperClasses, 'flex items-center justify-center')}>
      <ListMusic size={96} className="opacity-20" />
    </div>
  );
};
