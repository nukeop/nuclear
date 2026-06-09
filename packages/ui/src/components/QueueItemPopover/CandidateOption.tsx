import { Music } from 'lucide-react';
import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { formatTimeMillis } from '../../utils/time';

type CandidateOptionProps = {
  candidate: StreamCandidate;
};

export const CandidateOption: FC<CandidateOptionProps> = ({ candidate }) => (
  <div className="flex items-center gap-2 overflow-hidden">
    {candidate.thumbnail ? (
      <img
        src={candidate.thumbnail}
        alt={candidate.title}
        className="h-12 w-16 object-cover"
      />
    ) : (
      <div className="bg-background flex h-7 w-10 shrink-0 items-center justify-center rounded-sm">
        <Music size={12} className="text-foreground/30" />
      </div>
    )}
    <div className="min-w-0 flex-1 py-2">
      <div className="truncate text-xs">{candidate.title}</div>
      <div className="text-foreground/50 text-xs">
        {formatTimeMillis(candidate.durationMs)}
        {candidate.failed && (
          <span className="text-accent-red ml-2">failed</span>
        )}
      </div>
    </div>
  </div>
);
