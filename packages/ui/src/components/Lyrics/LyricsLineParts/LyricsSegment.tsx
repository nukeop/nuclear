import { FC } from 'react';

import type { LyricsSegment as LyricsSegmentModel } from '@nuclearplayer/model';

export const LyricsSegment: FC<{ segment: LyricsSegmentModel }> = ({
  segment,
}) => {
  if (!segment.ruby) {
    return segment.text;
  }

  return (
    <ruby data-testid="lyrics-ruby">
      <span data-testid="lyrics-ruby-text">{segment.text}</span>
      <rt data-testid="lyrics-ruby-reading" className="font-sans font-normal">
        {segment.ruby}
      </rt>
    </ruby>
  );
};
