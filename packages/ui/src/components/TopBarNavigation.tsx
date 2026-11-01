import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FC } from 'react';

import { Button } from './Button';

type TopBarNavigationProps = {
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

export const TopBarNavigation: FC<TopBarNavigationProps> = ({
  onBack,
  onForward,
  canGoBack = true,
  canGoForward = true,
}) => (
  <div className="flex flex-row items-center gap-2">
    <Button
      data-testid="top-bar-back"
      size="icon-sm"
      disabled={!canGoBack}
      onClick={onBack}
    >
      <ChevronLeft size={16} />
    </Button>
    <Button
      data-testid="top-bar-forward"
      size="icon-sm"
      disabled={!canGoForward}
      onClick={onForward}
    >
      <ChevronRight size={16} />
    </Button>
  </div>
);
