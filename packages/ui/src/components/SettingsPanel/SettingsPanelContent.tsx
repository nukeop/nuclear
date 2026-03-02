import { FC, ReactNode } from 'react';

type SettingsPanelContentProps = {
  children: ReactNode;
};

export const SettingsPanelContent: FC<SettingsPanelContentProps> = ({
  children,
}) => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
);
