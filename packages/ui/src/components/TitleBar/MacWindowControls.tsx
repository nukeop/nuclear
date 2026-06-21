import { FC } from 'react';

import { TitleBarLabels } from './TitleBar';

type MacWindowControlsProps = {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  labels: TitleBarLabels;
};

export const MacWindowControls: FC<MacWindowControlsProps> = ({
  onMinimize,
  onMaximize,
  onClose,
  labels,
}) => (
  <div className="group flex items-center gap-1.5 pl-3">
    <button
      onClick={onClose}
      title={labels.close}
      className="bg-accent-red outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
    <button
      onClick={onMinimize}
      title={labels.minimize}
      className="bg-accent-yellow outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
    <button
      onClick={onMaximize}
      title={labels.maximize}
      className="bg-accent-green outline-foreground h-3 w-3 rounded-full opacity-80 outline-2 group-hover:opacity-100"
    />
  </div>
);
