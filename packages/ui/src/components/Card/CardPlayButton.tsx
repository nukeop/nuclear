import { PlayIcon } from 'lucide-react';
import { FC } from 'react';

import { Button } from '../Button';

type CardPlayButtonProps = {
  onClick: () => void;
  label?: string;
};

export const CardPlayButton: FC<CardPlayButtonProps> = ({ onClick, label }) => (
  <Button
    data-testid="card-play-button"
    variant="text"
    size="icon-sm"
    aria-label={label}
    className="surface-primary hover:surface-muted rounded-none bg-clip-padding"
    onClick={onClick}
  >
    <PlayIcon size={16} />
  </Button>
);
