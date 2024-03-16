import React from 'react';
import { useSelector } from 'react-redux';

import PluginsView from '../../components/PluginsView';
import { pluginsSelectors } from '../../selectors/plugins';

const PluginsContainer = () => {
  const plugins = useSelector(pluginsSelectors.plugins);
  const userPlugins = useSelector(pluginsSelectors.userPlugins);
  const selected = useSelector(pluginsSelectors.selected);

  return (
    <PluginsView
      plugins={plugins}
      userPlugins={userPlugins}
      selectedMusicSource={selected.streamProviders}
      selectedLyricsProvider={selected.lyricsProviders}
      selectedMetaProvider={selected.metaProviders} />
  );
};

export default PluginsContainer;
