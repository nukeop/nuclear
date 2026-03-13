import { SparklesIcon } from 'lucide-react';
import { FC } from 'react';

type TimelineNodeProps = {
  isLatest?: boolean;
};

export const TimelineNode: FC<TimelineNodeProps> = ({ isLatest }) =>
  isLatest ? (
    <div className="bg-accent-green border-foreground flex size-7 shrink-0 items-center justify-center rounded-full border-(length:--border-width)">
      <SparklesIcon className="text-foreground size-4" strokeWidth={2.5} />
    </div>
  ) : (
    <div className="bg-foreground border-foreground size-5 shrink-0 rounded-full border-(length:--border-width)">
      <div className="bg-background-secondary border-background-secondary size-full rounded-full border-(length:--border-width)">
        <div className="bg-foreground size-full rounded-full" />
      </div>
    </div>
  );
