import isNil from 'lodash-es/isNil';
import { FC, useRef } from 'react';

import type { Lyrics } from '@nuclearplayer/model';

import { cn } from '../../utils';
import { ScrollableArea } from '../ScrollableArea';
import { NuclearJamLyricsContent } from './NuclearJamLyricsContent';

export type NuclearJamLyricsState =
  | { status: 'nothingPlaying' }
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error' }
  | { status: 'found'; lyrics: Lyrics };

export type NuclearJamLyricsLabels = {
  nothingPlayingTitle: string;
  nothingPlayingSubtitle: string;
  notFoundTitle: string;
  notFoundSubtitle: string;
  instrumentalTitle: string;
  instrumentalSubtitle: string;
  errorTitle: string;
  errorSubtitle: string;
  currentLine: string;
};

export type NuclearJamLyricsProps = {
  state: NuclearJamLyricsState;
  positionMs: number;
  textSize?: number;
  onSeek: (lineStartMs: number) => void;
  labels: NuclearJamLyricsLabels;
};

const TEXT_SIZE_CLASSES = ['text-xl', 'text-2xl', 'text-3xl'];

export const NuclearJamLyrics: FC<NuclearJamLyricsProps> = ({
  textSize,
  ...props
}) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="flex min-h-0 flex-1 flex-col" data-testid="jam-lyrics">
      <ScrollableArea
        viewportRef={viewportRef}
        className="min-h-0 flex-1"
        viewportClassName="scroll-smooth mask-y-from-95% px-6 py-6"
      >
        <NuclearJamLyricsContent
          {...props}
          textClassName={cn(!isNil(textSize) && TEXT_SIZE_CLASSES[textSize])}
          viewportRef={viewportRef}
        />
      </ScrollableArea>
    </div>
  );
};
