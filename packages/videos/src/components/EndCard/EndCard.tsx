import { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

import { Enter } from '../Enter';
import { NuclearLogo } from '../NuclearLogo';
import { Panel, usePanelEntrance } from '../Panel';
import { UrlField } from './UrlField';
import { typingEndFrame } from './useTypedText';

const TYPING_START_FRAME = 24;
const TAGLINE_GAP = 6;

type EndCardProps = {
  backdrop: ReactNode;
  url?: string;
  tagline?: string;
};

export const EndCard: FC<EndCardProps> = ({
  backdrop,
  url = 'nuclearplayer.com',
  tagline = 'Free and open source · macOS · Windows · Linux',
}) => {
  const entrance = usePanelEntrance();
  const taglineDelay = typingEndFrame(url, TYPING_START_FRAME) + TAGLINE_GAP;

  return (
    <AbsoluteFill>
      <AbsoluteFill>{backdrop}</AbsoluteFill>
      <Panel side="right" hiddenAmount={1 - entrance}>
        <NuclearLogo />
        <div className="flex flex-1 flex-col justify-center gap-8">
          <UrlField url={url} typingStartFrame={TYPING_START_FRAME} />
          <Enter entrance="wipe" delay={taglineDelay} exit={false}>
            <p className="text-2xl leading-snug">{tagline}</p>
          </Enter>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
