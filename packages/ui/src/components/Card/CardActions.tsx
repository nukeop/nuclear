import { AnimatePresence, motion } from 'motion/react';
import { FC, ReactNode } from 'react';

import { cn } from '../../utils';
import { buttonVariants, shapeVariants } from './cardActionsAnimation';
import { CardLoadingBar } from './CardLoadingBar';
import { CardMenu } from './CardMenu';
import { CardPlayButton } from './CardPlayButton';

export type CardLabels = {
  play?: string;
  menu?: string;
};

type CardActionsProps = {
  onPlay?: () => void;
  menuItems?: ReactNode;
  labels?: CardLabels;
  isLoading?: boolean;
};

export const CardActions: FC<CardActionsProps> = ({
  onPlay,
  menuItems,
  labels,
  isLoading = false,
}) => (
  <div className="group-hover:translate-x-shadow-x group-hover:translate-y-shadow-y pointer-events-none absolute inset-0 border-(length:--border-width) border-transparent p-2 transition-all">
    <div className="relative aspect-square">
      <div className="absolute inset-(--border-width) overflow-hidden rounded-[calc(var(--radius-md)-var(--border-width))]">
        <motion.div
          variants={shapeVariants}
          initial={false}
          animate={isLoading ? 'loading' : 'idle'}
          className={cn(
            'surface-background border-border divide-border absolute right-0 bottom-0 flex justify-end divide-x-(--border-width) overflow-hidden border-t-(length:--border-width) border-l-(length:--border-width) bg-clip-padding',
            { 'pointer-events-auto': !isLoading },
          )}
        >
          {menuItems && (
            <motion.div variants={buttonVariants}>
              <CardMenu label={labels?.menu}>{menuItems}</CardMenu>
            </motion.div>
          )}
          {onPlay && (
            <motion.div variants={buttonVariants}>
              <CardPlayButton onClick={onPlay} label={labels?.play} />
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {isLoading && <CardLoadingBar key="loading" />}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  </div>
);
