import { Music } from 'lucide-react';
import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { formatTimeMillis } from '../../utils/time';

type CandidateRowLabels = {
  failed?: string;
};

type CandidateRowProps = {
  candidate: StreamCandidate;
  isSelected: boolean;
  labels?: CandidateRowLabels;
  onSelect?: () => void;
};

export const CandidateRow: FC<CandidateRowProps> = ({
  candidate,
  isSelected,
  labels,
  onSelect,
}) => (
  <button
    type="button"
    data-testid="candidate-row"
    data-selected={isSelected}
    onClick={onSelect}
    className={cn(
      'hover:bg-background-secondary flex w-full shrink-0 cursor-pointer items-center gap-2 overflow-hidden text-left',
      {
        'bg-background-secondary': isSelected,
      },
    )}
  >
    {candidate.thumbnail ? (
      <img
        src={candidate.thumbnail}
        alt={candidate.title}
        className="h-12 w-16 shrink-0 object-cover"
      />
    ) : (
      <div className="bg-background flex h-12 w-16 shrink-0 items-center justify-center">
        <Music size={16} className="text-foreground/30" />
      </div>
    )}
    <div className="min-w-0 flex-1 py-2 pr-2">
      <div data-testid="candidate-row-title" className="truncate text-xs">
        {candidate.title}
      </div>
      <div className="text-foreground/50 text-xs">
        {formatTimeMillis(candidate.durationMs)}
        {candidate.failed && (
          <span className="text-accent-red ml-2">{labels?.failed}</span>
        )}
      </div>
    </div>
  </button>
);
