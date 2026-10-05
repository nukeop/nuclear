import { FC } from 'react';

import type { LyricsSegment as LyricsSegmentModel } from '@nuclearplayer/model';

import { LyricsSegment } from './LyricsSegment';

export const LyricsSegments: FC<{ segments: LyricsSegmentModel[] }> = ({
  segments,
}) =>
  segments.map((segment, index) => (
    <LyricsSegment key={index} segment={segment} />
  ));
