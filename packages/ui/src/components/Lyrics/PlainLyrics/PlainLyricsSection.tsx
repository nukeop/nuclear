import compact from 'lodash-es/compact';
import uniq from 'lodash-es/uniq';
import { FC } from 'react';

import type {
  LyricsLine,
  LyricsSection,
  LyricsSegment,
  LyricsVocalist,
} from '@nuclearplayer/model';

import { LyricsSectionLabel } from '../LyricsSectionLabel';
import { PlainLyricsLine } from './PlainLyricsLine';

type PlainLyricsSectionProps = {
  section: LyricsSection<LyricsLine<LyricsSegment>>;
  vocalists: LyricsVocalist[];
};

const vocalistNames = (
  section: PlainLyricsSectionProps['section'],
  vocalists: LyricsVocalist[],
) => {
  const ids = uniq(section.lines.flatMap((line) => line.vocalistIds ?? []));
  return compact(
    ids.map((id) => vocalists.find((vocalist) => vocalist.id === id)?.name),
  );
};

export const PlainLyricsSection: FC<PlainLyricsSectionProps> = ({
  section,
  vocalists,
}) => {
  const header = compact([
    section.label,
    ...vocalistNames(section, vocalists),
  ]).join(' - ');

  return (
    <div data-testid="lyrics-section">
      {header && <LyricsSectionLabel>{header}</LyricsSectionLabel>}
      {section.lines.map((line, index) => (
        <PlainLyricsLine key={index} line={line} />
      ))}
    </div>
  );
};
