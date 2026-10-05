import { useSettingsModalStore } from '../../stores/settingsModalStore';

export const usePluginsTabs = () => {
  const selectedTab = useSettingsModalStore((state) => state.pluginsTab);
  const selectTab = useSettingsModalStore((state) => state.selectPluginsTab);
  const goToStore = () => selectTab('store');

  return { selectedTab, selectTab, goToStore };
};
