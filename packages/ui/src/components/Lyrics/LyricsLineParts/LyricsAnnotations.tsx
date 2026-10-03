import { FC } from 'react';

import type { LineAnnotation } from '@nuclearplayer/model';

export const LyricsAnnotations: FC<{ annotations: LineAnnotation[] }> = ({
  annotations,
}) =>
  annotations.map((annotation, index) => (
    <span
      key={index}
      lang={annotation.language}
      className="block font-sans text-base font-normal tracking-normal opacity-60"
    >
      {annotation.text}
    </span>
  ));
