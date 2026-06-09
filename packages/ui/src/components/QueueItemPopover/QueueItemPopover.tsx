import { FC, ReactNode } from 'react';

import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { Popover } from '../Popover';
import { CandidateSelect } from './CandidateSelect';
import { StreamQualityInfo } from './StreamQualityInfo';
import { StreamThumbnail } from './StreamThumbnail';

type QueueItemPopoverProps = {
  track: Track;
  children: ReactNode;
  onSelectCandidate?: (candidateId: string) => void;
};

const findSelectedCandidate = (
  candidates: StreamCandidate[],
): StreamCandidate | undefined => candidates.find((c) => !c.failed);

export const QueueItemPopover: FC<QueueItemPopoverProps> = ({
  track,
  children,
  onSelectCandidate,
}) => {
  const candidates = track.streamCandidates ?? [];
  const selected = findSelectedCandidate(candidates);

  return (
    <Popover
      panelClassName="p-0"
      anchor="left"
      triggerOn="contextmenu"
      trigger={children}
    >
      <div className="w-72">
        {selected && <StreamThumbnail candidate={selected} />}
        {selected?.stream && <StreamQualityInfo stream={selected.stream} />}

        {candidates.length === 0 ? (
          <div className="text-foreground/50 px-3 py-3 text-center text-xs">
            No stream candidates
          </div>
        ) : (
          <div className="px-3 py-2">
            <CandidateSelect
              candidates={candidates}
              selectedId={selected?.id}
              onSelectCandidate={onSelectCandidate}
            />
          </div>
        )}
      </div>
    </Popover>
  );
};
