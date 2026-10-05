import { FC, ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

import { Enter } from '../Enter';
import { useExitProgress } from '../motion';
import { NuclearLogo } from '../NuclearLogo';
import { Panel, usePanelEntrance } from '../Panel';
import { TitleLine } from './TitleLine';

const PANEL_EXIT_FRAMES = 14;
const FIRST_LINE_DELAY = 10;
const LINE_STAGGER = 6;
const RULE_DELAY = 6;
const SUBTITLE_GAP = 10;

type TitleCardProps = {
  titleLines: string[];
  subtitle?: string;
  backdrop: ReactNode;
};

const lineDelay = (lineIndex: number) =>
  FIRST_LINE_DELAY + LINE_STAGGER * lineIndex;

export const TitleCard: FC<TitleCardProps> = ({
  titleLines,
  subtitle,
  backdrop,
}) => {
  const entrance = usePanelEntrance();
  const exit = useExitProgress(PANEL_EXIT_FRAMES);
  const subtitleDelay = lineDelay(titleLines.length - 1) + SUBTITLE_GAP;

  return (
    <AbsoluteFill>
      <AbsoluteFill>{backdrop}</AbsoluteFill>
      <Panel side="left" hiddenAmount={Math.max(1 - entrance, exit)}>
        <NuclearLogo />
        <div className="flex flex-1 flex-col justify-center gap-6">
          <Enter entrance="wipe" delay={RULE_DELAY} exit={false}>
            <div className="bg-foreground h-2 w-16" />
          </Enter>
          <h1 className="font-heading text-8xl leading-none font-extrabold tracking-tight">
            {titleLines.map((line, lineIndex) => (
              <TitleLine
                key={lineIndex}
                text={line}
                delay={lineDelay(lineIndex)}
              />
            ))}
          </h1>
          {subtitle && (
            <Enter entrance="wipe" delay={subtitleDelay} exit={false}>
              <p className="text-3xl leading-snug">{subtitle}</p>
            </Enter>
          )}
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
