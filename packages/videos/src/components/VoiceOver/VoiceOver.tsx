import { FC } from 'react';
import { Html5Audio, Sequence } from 'remotion';

import { VoiceLine } from './types';

type VoiceOverProps = {
  lines: VoiceLine[];
};

export const VoiceOver: FC<VoiceOverProps> = ({ lines }) => (
  <>
    {lines.map((line) => (
      <Sequence
        key={`${line.src}@${line.startFrame}`}
        from={line.startFrame}
        durationInFrames={line.durationInFrames}
        layout="none"
      >
        <Html5Audio src={line.src} />
      </Sequence>
    ))}
  </>
);
