import { CircleHelp, ExternalLink } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../Button';
import { Popover } from '../Popover';
import type { StreamVerificationLabels } from './types';

type StreamVerificationHelpProps = {
  labels: StreamVerificationLabels;
  onLearnMore: () => void;
};

export const StreamVerificationHelp: FC<StreamVerificationHelpProps> = ({
  labels,
  onLearnMore,
}) => (
  <Popover
    className="relative"
    panelClassName="flex w-72 flex-col items-start gap-2 p-4 select-text"
    anchor="top start"
    trigger={
      <Button variant="text" size="icon-sm" aria-label={labels.help}>
        <CircleHelp size={16} />
      </Button>
    }
  >
    <p
      data-testid="stream-verification-explanation"
      className="text-sm whitespace-pre-line"
    >
      {labels.explanation}
    </p>
    <Button size="xs" className="gap-1" onClick={onLearnMore}>
      {labels.learnMore}
      <ExternalLink size={14} />
    </Button>
  </Popover>
);
