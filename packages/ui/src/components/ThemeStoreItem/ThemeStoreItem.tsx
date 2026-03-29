import { FC } from 'react';

type ThemeStoreItemProps = {
  name: string;
  description: string;
  author: string;
  palette: [string, string, string, string];
  tags?: string[];
  isInstalled?: boolean;
  isInstalling?: boolean;
  onInstall: () => void;
  labels?: {
    install?: string;
    installing?: string;
    installed?: string;
    by?: string;
  };
  className?: string;
};

export const ThemeStoreItem: FC<ThemeStoreItemProps> = () => {
  return <div data-testid="theme-store-item" />;
};
