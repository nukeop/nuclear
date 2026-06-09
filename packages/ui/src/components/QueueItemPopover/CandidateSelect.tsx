import { FC } from 'react';

import type { StreamCandidate } from '@nuclearplayer/model';

import { Select } from '../Select';
import { CandidateOption } from './CandidateOption';

type CandidateSelectProps = {
  candidates: StreamCandidate[];
  selectedId?: string;
  onSelectCandidate?: (candidateId: string) => void;
};

export const CandidateSelect: FC<CandidateSelectProps> = ({
  candidates,
  selectedId,
  onSelectCandidate,
}) => {
  const options = candidates.map((candidate) => ({
    id: candidate.id,
    label: candidate.title,
  }));

  return (
    <Select.Root
      options={options}
      value={selectedId}
      onValueChange={onSelectCandidate}
      placeholder="Select a stream source"
    >
      <Select.Button />
      <Select.Options className="flex flex-col p-0">
        {candidates.map((candidate) => (
          <Select.Option
            key={candidate.id}
            id={candidate.id}
            label={candidate.title}
            as="li"
            classes={{
              root: 'flex overflow-hidden p-0',
              selectedCheckmark: 'w-12 justify-center',
            }}
          >
            <CandidateOption candidate={candidate} />
          </Select.Option>
        ))}
      </Select.Options>
    </Select.Root>
  );
};
