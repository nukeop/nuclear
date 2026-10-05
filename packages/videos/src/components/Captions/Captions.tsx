import { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';

import { Enter } from '../Enter';
import { CaptionPlate } from './CaptionPlate';
import { groupCaptions } from './groupCaptions';
import { CaptionLine } from './types';

type CaptionsProps = {
  lines: CaptionLine[];
};

export const Captions: FC<CaptionsProps> = ({ lines }) => (
  <>
    {groupCaptions(lines).map((group) => (
      <Sequence
        key={group.startFrame}
        from={group.startFrame}
        durationInFrames={group.durationInFrames}
        name="Captions"
      >
        <AbsoluteFill className="p-video-safe items-center justify-end">
          <Enter entrance="drop">
            <CaptionPlate pages={group.pages} />
          </Enter>
        </AbsoluteFill>
      </Sequence>
    ))}
  </>
);
