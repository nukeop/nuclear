import { FC } from 'react';

import { Platform, usePlatform } from '../../providers/PlatformProvider';
import { cn } from '../../utils';
import { MacWindowControls } from './MacWindowControls';
import { TitleText } from './TitleText';
import { useTitleBarDrag } from './useTitleBarDrag';
import { WindowsWindowControls } from './WindowsWindowControls';

export type TitleBarLabels = {
  minimize: string;
  maximize: string;
  close: string;
};

export type WindowControlsProps = {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  labels: TitleBarLabels;
};

type TitleBarProps = {
  title: string;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onStartDrag?: () => void;
  styleOverride?: Platform;
  labels: TitleBarLabels;
  className?: string;
};

export const TitleBar: FC<TitleBarProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  onStartDrag,
  styleOverride,
  labels,
  className,
}) => {
  const detectedPlatform = usePlatform();
  const resolvedPlatform = styleOverride ?? detectedPlatform;
  const isMac = resolvedPlatform === 'macos';
  const handleMouseDown = useTitleBarDrag({ onMaximize, onStartDrag });

  const controls = isMac ? (
    <MacWindowControls
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      labels={labels}
    />
  ) : (
    <WindowsWindowControls
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
      labels={labels}
    />
  );

  return (
    <div
      data-testid="title-bar"
      onMouseDown={handleMouseDown}
      className={cn(
        'border-border bg-background relative flex h-6 items-center border-b-2 select-none',
        isMac ? 'justify-start' : 'justify-end',
        className,
      )}
    >
      {controls}
      <TitleText title={title} />
    </div>
  );
};
