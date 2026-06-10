import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { ScrollableArea } from '../ScrollableArea';
import { CandidateRow } from './CandidateRow';

type CandidateListLabels = {
  failed?: string;
};

type CandidateListProps = {
  candidates: StreamCandidate[];
  selectedId?: string;
  labels?: CandidateListLabels;
  onSelectCandidate?: (candidateId: string) => void;
};

export const CandidateList: FC<CandidateListProps> = ({
  candidates,
  selectedId,
  labels,
  onSelectCandidate,
}) => (
  <ScrollableArea
    data-testid="candidate-list"
    className="min-h-0"
    viewportClassName="max-h-80 overscroll-contain"
  >
    {candidates.map((candidate) => (
      <CandidateRow
        key={candidate.id}
        candidate={candidate}
        isSelected={candidate.id === selectedId}
        labels={labels}
        onSelect={() => onSelectCandidate?.(candidate.id)}
      />
    ))}
  </ScrollableArea>
);
