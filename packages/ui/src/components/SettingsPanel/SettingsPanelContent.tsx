import { FC, ReactNode } from 'react';

type SettingsPanelContentProps = {
  children: ReactNode;
};

export const SettingsPanelContent: FC<SettingsPanelContentProps> = ({
  children,
}) => (
  <div className="flex flex-1 flex-col overflow-hidden">
    <div className="flex-1 overflow-y-auto">{children}</div>
  </div>
);
