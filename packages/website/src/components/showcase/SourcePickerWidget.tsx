import { useState, type ComponentProps, type FC } from 'react';

import {
  CandidateList,
  StreamQualityInfo,
  StreamThumbnail,
  TrackHeader,
} from '@nuclearplayer/ui';

type Track = ComponentProps<typeof TrackHeader>['track'];
type Candidate = ComponentProps<typeof StreamThumbnail>['candidate'] & {
  stream: ComponentProps<typeof StreamQualityInfo>['stream'];
};

const candidate = (
  id: string,
  title: string,
  durationMs: number,
): Candidate => {
  const source = { provider: 'geiger', id };

  return {
    id,
    title,
    durationMs,
    thumbnail: `/images/showcase/candidate-${id}.jpg`,
    failed: false,
    source,
    stream: {
      url: `https://geiger.example/${id}`,
      protocol: 'https',
      bitrateKbps: 192,
      codec: 'mp3',
      durationMs,
      source,
    },
  };
};

const CANDIDATES = [
  candidate(
    'live',
    'Neon Cascade - Phosphor Gate (Live at the Aurora)',
    285000,
  ),
  candidate(
    'official',
    'Neon Cascade - Phosphor Gate (Official Audio)',
    247000,
  ),
  candidate('cover', 'Phosphor Gate - acoustic cover', 226000),
  candidate('slowed', 'Neon Cascade - Phosphor Gate (slowed + reverb)', 321000),
];

const TRACK: Track = {
  title: 'Phosphor Gate',
  artists: [{ name: 'Neon Cascade', roles: ['main'] }],
  album: {
    title: 'Phosphor Dreams',
    source: { provider: 'geiger', id: 'phosphor-dreams' },
  },
  durationMs: 247000,
  source: { provider: 'geiger', id: 'phosphor-gate' },
  streamCandidates: CANDIDATES,
};

export const SourcePickerWidget: FC = () => {
  const [selectedId, setSelectedId] = useState('live');
  const selected = CANDIDATES.find((entry) => entry.id === selectedId)!;

  return (
    <div className="surface-popover border-border shadow-shadow flex w-full flex-col overflow-hidden rounded-md border-(length:--border-width) leading-5 select-none">
      <TrackHeader track={TRACK} />
      <StreamThumbnail candidate={selected} />
      <StreamQualityInfo stream={selected.stream} />
      <CandidateList
        candidates={CANDIDATES}
        selectedId={selectedId}
        onSelectCandidate={setSelectedId}
      />
    </div>
  );
};
