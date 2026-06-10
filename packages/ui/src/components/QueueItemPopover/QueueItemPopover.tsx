import { FC, ReactNode } from 'react';

import type { StreamCandidate, Track } from '@nuclearplayer/model';

import { Popover } from '../Popover';
import { CandidateList } from './CandidateList';
import { StreamQualityInfo } from './StreamQualityInfo';
import { StreamThumbnail } from './StreamThumbnail';
import { TrackHeader } from './TrackHeader';

export type QueueItemPopoverLabels = {
  noCandidates?: string;
  failed?: string;
};

type QueueItemPopoverProps = {
  track: Track;
  children: ReactNode;
  className?: string;
  labels?: QueueItemPopoverLabels;
  onSelectCandidate?: (candidateId: string) => void;
};

const findSelectedCandidate = (
  candidates: StreamCandidate[],
): StreamCandidate | undefined =>
  candidates.find((candidate) => !candidate.failed);

export const QueueItemPopover: FC<QueueItemPopoverProps> = ({
  track,
  children,
  className,
  labels,
  onSelectCandidate,
}) => {
  const candidates = track.streamCandidates ?? [];
  const selected = findSelectedCandidate(candidates);

  return (
    <Popover
      className={className}
      panelClassName="box-content p-0"
      anchor="left"
      triggerOn="contextmenu"
      trigger={children}
    >
      <div
        data-testid="queue-item-popover"
        className="flex max-h-(--anchor-max-height) w-80 flex-col"
      >
        <TrackHeader track={track} />
        {selected && <StreamThumbnail candidate={selected} />}
        {selected?.stream && <StreamQualityInfo stream={selected.stream} />}

        {candidates.length === 0 ? (
          <div
            data-testid="queue-item-popover-empty"
            className="text-foreground/50 px-3 py-3 text-center text-xs"
          >
            {labels?.noCandidates}
          </div>
        ) : (
          <CandidateList
            candidates={candidates}
            selectedId={selected?.id}
            labels={labels}
            onSelectCandidate={onSelectCandidate}
          />
        )}
      </div>
    </Popover>
  );
};
