import { cva } from 'class-variance-authority';
import { FC, ReactNode } from 'react';

import { cn } from '@nuclearplayer/ui';

export type PanelSide = 'left' | 'right';

const SHADOW_CLEARANCE = 16;

const panelVariants = cva(
  'bg-background text-foreground border-video-ink absolute -inset-y-4 flex w-9/16 flex-col px-16 py-20',
  {
    variants: {
      side: {
        left: 'shadow-video-hero left-0 border-r-(length:--video-border-width)',
        right:
          'shadow-video-hero-left right-0 border-l-(length:--video-border-width)',
      },
    },
  },
);

const direction: Record<PanelSide, number> = { left: -1, right: 1 };

type PanelProps = {
  side: PanelSide;
  hiddenAmount: number;
  className?: string;
  children: ReactNode;
};

export const Panel: FC<PanelProps> = ({
  side,
  hiddenAmount,
  className,
  children,
}) => {
  const travel = direction[side] * hiddenAmount;

  return (
    <div
      className={cn(panelVariants({ side }), className)}
      style={{
        transform: `translateX(calc((100% + ${SHADOW_CLEARANCE}px) * ${travel}))`,
      }}
    >
      {children}
    </div>
  );
};
