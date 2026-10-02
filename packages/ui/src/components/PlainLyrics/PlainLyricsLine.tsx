import { FC } from 'react';

import type { LyricsLine, LyricsSegment } from '@nuclearplayer/model';

import { LyricsSegments } from './LyricsSegments';

type PlainLyricsLineProps = {
  line: LyricsLine<LyricsSegment>;
};

export const PlainLyricsLine: FC<PlainLyricsLineProps> = ({ line }) => (
  <div className="py-1">
    <p>
      <LyricsSegments segments={line.segments} />
      {line.background && (
        <span className="text-foreground/60 font-semibold italic">
          {' ('}
          <LyricsSegments segments={line.background} />
          {')'}
        </span>
      )}
    </p>
    {line.annotations?.map((annotation, index) => (
      <p
        key={index}
        lang={annotation.language}
        className="text-foreground/60 font-sans text-base font-normal tracking-normal"
      >
        {annotation.text}
      </p>
    ))}
  </div>
);
