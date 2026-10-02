import { FC } from 'react';

import type { LyricsSegment } from '@nuclearplayer/model';

const Segment: FC<{ segment: LyricsSegment }> = ({ segment }) => {
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

export const LyricsSegments: FC<{ segments: LyricsSegment[] }> = ({
  segments,
}) =>
  segments.map((segment, index) => <Segment key={index} segment={segment} />);
