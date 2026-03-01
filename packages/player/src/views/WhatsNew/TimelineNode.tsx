import { SparklesIcon } from 'lucide-react';
import { FC } from 'react';

type TimelineNodeProps = {
  isLatest?: boolean;
};

export const TimelineNode: FC<TimelineNodeProps> = ({ isLatest }) =>
  isLatest ? (
    <div className="bg-accent-green border-foreground flex size-6 shrink-0 items-center justify-center rounded-full border-2">
      <SparklesIcon className="text-foreground size-3.5" strokeWidth={2.5} />
    </div>
  ) : (
    <div className="bg-foreground border-foreground size-4 shrink-0 rounded-full border-2">
      <div className="bg-background-secondary border-background-secondary size-full rounded-full border-2">
        <div className="bg-foreground size-full rounded-full" />
      </div>
    </div>
  );
