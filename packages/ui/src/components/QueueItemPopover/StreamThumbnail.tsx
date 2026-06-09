import { Music } from 'lucide-react';
import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { Badge } from '../Badge';

type StreamThumbnailProps = {
  candidate: StreamCandidate;
};

export const StreamThumbnail: FC<StreamThumbnailProps> = ({ candidate }) => (
  <div className="relative">
    {candidate.thumbnail ? (
      <img
        src={candidate.thumbnail}
        alt={candidate.title}
        className="h-36 w-full rounded-t-md object-cover"
      />
    ) : (
      <div className="bg-background flex h-36 w-full items-center justify-center rounded-t-md">
        <Music size={48} className="text-foreground/20" />
      </div>
    )}
    <Badge variant="pill" color="secondary" className="absolute top-2 right-2">
      {candidate.source.provider}
    </Badge>
  </div>
);
