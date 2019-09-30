export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const SELECT_DEFAULT_MUSIC_SOURCE = 'SELECT_DEFAULT_MUSIC_SOURCE';

export function createSearchPlugins (pluginClasses) {
  let plugins = {};

  for (let i = 0; i < Object.keys(pluginClasses).length; i++) {
    let category = Object.keys(pluginClasses)[i];

    if (typeof plugins[category] === 'undefined') {
      plugins[category] = [];
    }

    for (let j = 0; j < Object.keys(pluginClasses[category]).length; j++) {
      let pluginName = Object.keys(pluginClasses[category])[j];
      let plugin = new pluginClasses[category][pluginName]();
      plugins[category].push(plugin);
    }
  }

  return {
    type: CREATE_PLUGINS,
    payload: plugins
  };
}

export function selectDefaultMusicSource (musicSource) {
  return {
    type: SELECT_DEFAULT_MUSIC_SOURCE,
    payload: musicSource
  };
}
