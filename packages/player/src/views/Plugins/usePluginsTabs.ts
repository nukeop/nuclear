import { useCallback, useState } from 'react';

const TABS = {
  INSTALLED: 0,
  STORE: 1,
} as const;

export const usePluginsTabs = () => {
  const [selectedTab, setSelectedTab] = useState<number>(TABS.INSTALLED);

  const goToStore = useCallback(() => {
    setSelectedTab(TABS.STORE);
  }, []);

  return { selectedTab, setSelectedTab, goToStore };
};
