import { CassetteTape } from 'lucide-react';
import type { FC } from 'react';

import { cn, ImageReveal, Mosaic, MOSAIC_SIZE } from '@nuclearplayer/ui';

type PlaylistArtworkProps = {
  name: string;
  thumbnails?: string[];
  className?: string;
};

export const PlaylistArtwork: FC<PlaylistArtworkProps> = ({
  name,
  thumbnails = [],
  className,
}) => {

  if (thumbnails.length >= MOSAIC_SIZE) {
    return (
      <Mosaic urls={thumbnails} className={cn('h-full w-full', className)} />
    );
  }

  if (thumbnails.length > 0) {
    return (
      <ImageReveal
        src={thumbnails[0]}
        alt={name}
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
