import { FC } from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

import { activeIndex, easeOutExpo, progressOver } from '../motion';
import { CaptionText } from './CaptionText';
import { TextMeasurer } from './TextMeasurer';
import { CaptionPage } from './types';
import { useTextSizes } from './useTextSizes';

const TEXT_ENTER_FRAMES = 8;
const TEXT_EXIT_FRAMES = 5;
const TEXT_TRAVEL = 6;
const RESIZE_FRAMES = 12;

type CaptionPlateProps = {
  pages: CaptionPage[];
};

type PageTransition = {
  resize: number;
  textEnter: number;
  textExit: number;
};

const SETTLED_TRANSITION: PageTransition = {
  resize: 1,
  textEnter: 1,
  textExit: 1,
};

const pageTransition = (elapsed: number, fps: number): PageTransition => ({
  resize: spring({
    frame: elapsed,
    fps,
    config: { damping: 200 },
    durationInFrames: RESIZE_FRAMES,
  }),
  textEnter: progressOver(elapsed, TEXT_ENTER_FRAMES, easeOutExpo),
  textExit: progressOver(elapsed, TEXT_EXIT_FRAMES),
});

const transitionInto = (
  pages: CaptionPage[],
  pageIndex: number,
  frame: number,
  fps: number,
) => {
  if (pageIndex === 0) {
    return SETTLED_TRANSITION;
  }
  return pageTransition(frame - pages[pageIndex].startFrame, fps);
};

export const CaptionPlate: FC<CaptionPlateProps> = ({ pages }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const texts = pages.map((page) => page.text);
  const { sizes, containerRef } = useTextSizes(texts);

  const pageIndex = activeIndex(pages, frame);
  const { resize, textEnter, textExit } = transitionInto(
    pages,
    pageIndex,
    frame,
    fps,
  );

  const measurer = <TextMeasurer ref={containerRef} texts={texts} />;
  const size = sizes[pageIndex];
  if (!size) {
    return measurer;
  }

  const previousSize = sizes[pageIndex - 1] ?? size;
  const previousPage = pages[pageIndex - 1];

  return (
    <>
      {measurer}
      <div className="bg-video-paper text-video-ink border-video-ink shadow-video-plate overflow-hidden rounded-md border-(length:--video-border-width) px-6 py-3">
        <div
          className="relative"
          style={{
            width: interpolate(
              resize,
              [0, 1],
              [previousSize.width, size.width],
            ),
            height: interpolate(
              resize,
              [0, 1],
              [previousSize.height, size.height],
            ),
          }}
        >
          {previousPage && (
            <CaptionText
              text={previousPage.text}
              width={previousSize.width}
              offset={-TEXT_TRAVEL * textExit}
              opacity={1 - textExit}
            />
          )}
          <CaptionText
            text={pages[pageIndex].text}
            width={size.width}
            offset={TEXT_TRAVEL * (1 - textEnter)}
            opacity={textEnter}
          />
        </div>
      </div>
    </>
  );
};
