import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { ScrollableArea } from '../ScrollableArea';
import { CandidateRow } from './CandidateRow';

type CandidateListProps = {
  candidates: StreamCandidate[];
  selectedId?: string;
  onSelectCandidate?: (candidateId: string) => void;
};

export const CandidateList: FC<CandidateListProps> = ({
  candidates,
  selectedId,
  onSelectCandidate,
}) => (
  <ScrollableArea data-testid="candidate-list" viewportClassName="max-h-80">
    {candidates.map((candidate) => (
      <CandidateRow
        key={candidate.id}
        candidate={candidate}
        isSelected={candidate.id === selectedId}
        onSelect={() => onSelectCandidate?.(candidate.id)}
      />
    ))}
  </ScrollableArea>
);
