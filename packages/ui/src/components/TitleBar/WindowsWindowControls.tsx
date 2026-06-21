import { Minus, Square, X } from 'lucide-react';
import { FC } from 'react';

import { TitleBarLabels } from './TitleBar';

type WindowsWindowControlsProps = {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  labels: TitleBarLabels;
};

export const WindowsWindowControls: FC<WindowsWindowControlsProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  labels,
}) => (
  <div className="flex h-full items-center">
    <button
      onClick={onMinimize}
      title={labels.minimize}
      className="text-foreground hover:bg-primary hover:text-foreground inline-flex h-full w-11 items-center justify-center border-none bg-transparent"
    >
      <Minus size={14} strokeWidth={1.5} />
    </button>
    <button
      onClick={onMaximize}
      title={labels.maximize}
      className="text-foreground hover:bg-primary hover:text-foreground inline-flex h-full w-11 items-center justify-center border-none bg-transparent"
    >
      <Square size={14} strokeWidth={1.5} />
    </button>
    <button
      onClick={onClose}
      title={labels.close}
      className="text-foreground hover:bg-accent-red inline-flex h-full w-11 items-center justify-center border-none bg-transparent hover:text-white"
    >
      <X size={14} strokeWidth={1.5} />
    </button>
  </div>
);
