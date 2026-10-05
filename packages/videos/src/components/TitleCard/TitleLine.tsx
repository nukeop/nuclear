import { FC } from 'react';
import { useCurrentFrame } from 'remotion';

import { easeOutExpo, progressOver } from '../motion';

const REVEAL_FRAMES = 18;
const HIDDEN_OFFSET_PERCENT = 110;

type TitleLineProps = {
  text: string;
  delay: number;
};

export const TitleLine: FC<TitleLineProps> = ({ text, delay }) => {
  const frame = useCurrentFrame();
  const reveal = progressOver(frame - delay, REVEAL_FRAMES, easeOutExpo);

  return (
    <span className="-mb-3 block overflow-hidden pb-3">
      <span
        className="block"
        style={{
          transform: `translateY(${HIDDEN_OFFSET_PERCENT * (1 - reveal)}%)`,
        }}
      >
        {text}
      </span>
    </span>
  );
};
