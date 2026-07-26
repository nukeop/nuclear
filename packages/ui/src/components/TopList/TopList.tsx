import { FC } from 'react';

import { cn } from '../../utils';
import { TopListRow } from './TopListRow';
import type { TopListProps } from './types';

export const TopList: FC<TopListProps> = ({
  title,
  entries,
  formatValue,
  className,
}) => {
  const maxValue = Math.max(...entries.map((entry) => entry.value));

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="font-heading text-xl">{title}</h3>
      <div>
        {entries.map((entry, index) => (
          <TopListRow
            key={entry.id}
            entry={entry}
            rank={index + 1}
            fillRatio={entry.value / maxValue}
            formatValue={formatValue}
          />
        ))}
      </div>
    </div>
  );
};
