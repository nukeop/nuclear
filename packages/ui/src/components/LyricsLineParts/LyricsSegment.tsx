import { FC } from 'react';

import type { LyricsSegment as LyricsSegmentModel } from '@nuclearplayer/model';

export const LyricsSegment: FC<{ segment: LyricsSegmentModel }> = ({
  segment,
}) => {
  if (!segment.ruby) {
    return segment.text;
  }

  return (
    <ruby>
      {segment.text}
      <rt className="font-sans font-normal">{segment.ruby}</rt>
    </ruby>
  );
};
