import { FC, ReactNode } from 'react';

import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { Popover } from '../Popover';
import { CandidateList } from './CandidateList';
import { StreamQualityInfo } from './StreamQualityInfo';
import { StreamThumbnail } from './StreamThumbnail';
import { TrackHeader } from './TrackHeader';

type QueueItemPopoverProps = {
  track: Track;
  children: ReactNode;
  selectedCandidateId?: string;
  onSelectCandidate?: (candidateId: string) => void;
};

const findSelectedCandidate = (
  candidates: StreamCandidate[],
  selectedId?: string,
): StreamCandidate | undefined => {
  const explicit = candidates.find((candidate) => candidate.id === selectedId);
  return explicit ?? candidates.find((candidate) => !candidate.failed);
};

export const QueueItemPopover: FC<QueueItemPopoverProps> = ({
  track,
  children,
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const candidates = track.streamCandidates ?? [];
  const selected = findSelectedCandidate(candidates, selectedCandidateId);

  return (
    <Popover
      panelClassName="p-0"
      anchor="left"
      triggerOn="contextmenu"
      trigger={children}
    >
      <div className="w-80">
        <TrackHeader track={track} />
        {selected && <StreamThumbnail candidate={selected} />}
        {selected?.stream && <StreamQualityInfo stream={selected.stream} />}

        {candidates.length === 0 ? (
          <div className="text-foreground/50 px-3 py-3 text-center text-xs">
            No stream candidates
          </div>
        ) : (
          <CandidateList
            candidates={candidates}
            selectedId={selected?.id}
            onSelectCandidate={onSelectCandidate}
          />
        )}
      </div>
    </Popover>
  );
};
