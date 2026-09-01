import { FC } from 'react';

import { WindowControlsProps } from './TitleBar';

export const MacWindowControls: FC<WindowControlsProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  labels,
}) => (
  <div
    data-testid="mac-window-controls"
    className="group flex items-center gap-1.5 pl-3"
  >
    <button
      onClick={onClose}
      title={labels.close}
      className="surface-accent-red outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
    <button
      onClick={onMinimize}
      title={labels.minimize}
      className="surface-accent-yellow outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
    <button
      onClick={onMaximize}
      title={labels.maximize}
      className="surface-accent-green outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
  </div>
);
