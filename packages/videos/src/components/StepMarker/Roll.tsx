import { CSSProperties, FC } from 'react';

import { cn } from '@nuclearplayer/ui';

type RollProps = {
  items: string[];
  index: number;
  progress: number;
  className?: string;
};

const rollStyle = (
  itemIndex: number,
  index: number,
  progress: number,
): CSSProperties => {
  if (itemIndex === index) {
    return { transform: `translateY(${100 * (1 - progress)}%)` };
  }
  if (itemIndex === index - 1) {
    return { transform: `translateY(${-100 * progress}%)` };
  }
  return { visibility: 'hidden' };
};

export const Roll: FC<RollProps> = ({ items, index, progress, className }) => (
  <div className={cn('grid overflow-hidden', className)}>
    {items.map((item, itemIndex) => (
      <span
        key={itemIndex}
        className="col-start-1 row-start-1"
        style={rollStyle(itemIndex, index, progress)}
      >
        {item}
      </span>
    ))}
  </div>
);
