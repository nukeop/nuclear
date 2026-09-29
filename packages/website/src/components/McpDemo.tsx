import { ArrowRight } from 'lucide-react';
import type { ComponentProps, FC } from 'react';

import { QueueItem } from '@nuclearplayer/ui';

type Track = ComponentProps<typeof QueueItem>['track'];

const track = (
  title: string,
  artist: string,
  cover: string,
  durationMs: number,
): Track => ({
  title,
  artists: [{ name: artist, roles: ['main'] }],
  durationMs,
  artwork: { items: [{ url: `/images/showcase/${cover}.jpg` }] },
  source: { provider: 'geiger', id: title },
});

const QUEUE = [
  track('Kintsugi', 'Yuki Tanaka', 'paper-lanterns', 341000),
  track('Paper Lanterns', 'Yuki Tanaka', 'paper-lanterns', 223000),
  track('Antenna', 'Moth & Signal', 'wing-beat', 274000),
];

export const McpDemo: FC = () => (
  <div className="flex w-full flex-col items-center gap-8 md:flex-row md:gap-10">
    <div className="bg-foreground text-background shadow-shadow flex w-full flex-1 flex-col gap-4 rounded-md p-5 font-mono text-sm">
      <div>
        <span className="text-primary">&gt;</span> put on something mellow for
        late night coding
      </div>
      <div className="opacity-60">● nuclear · call Queue.addToQueue</div>
      <div>Queued 3 tracks and started Kintsugi by Yuki Tanaka.</div>
    </div>
    <ArrowRight className="size-10 shrink-0 rotate-90 md:rotate-0" />
    <div className="flex w-full max-w-80 flex-col gap-2">
      {QUEUE.map((queued, index) => (
        <QueueItem
          key={queued.title}
          track={queued}
          isCurrent={index === 0}
          labels={{}}
        />
      ))}
    </div>
  </div>
);
