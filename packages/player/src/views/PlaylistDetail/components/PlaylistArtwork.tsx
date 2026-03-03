import { CassetteTape } from 'lucide-react';
import type { FC } from 'react';

import type { ArtworkSet, PlaylistItem } from '@nuclearplayer/model';
import { cn, ImageReveal, Mosaic, MOSAIC_SIZE } from '@nuclearplayer/ui';

import { buildThumbnails } from '../../../services/playlistFileService/buildThumbnails';

type PlaylistArtworkData = {
  name: string;
  artwork?: ArtworkSet;
  thumbnails?: string[];
  items?: PlaylistItem[];
};

type PlaylistArtworkProps = {
  playlist: PlaylistArtworkData;
  className?: string;
};

const resolveThumbnails = (playlist: PlaylistArtworkData): string[] => {
  if (playlist.thumbnails) {
    return playlist.thumbnails;
  }

  if (playlist.items) {
    return buildThumbnails({
      artwork: playlist.artwork,
      items: playlist.items,
    });
  }

  return [];
};

export const PlaylistArtwork: FC<PlaylistArtworkProps> = ({
  playlist,
  className,
}) => {
  const thumbnails = resolveThumbnails(playlist);

  if (thumbnails.length >= MOSAIC_SIZE) {
    return (
      <Mosaic urls={thumbnails} className={cn('h-full w-full', className)} />
    );
  }

  if (thumbnails.length > 0) {
    return (
      <ImageReveal
        src={thumbnails[0]}
        alt={playlist.name}
        className={cn('h-full w-full', className)}
        imgClassName="h-full w-full object-cover"
      />
    );
  }

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        className,
      )}
    >
      <CassetteTape
        size={96}
        absoluteStrokeWidth
        className="animate-pulse opacity-20"
      />
    </div>
  );
};
