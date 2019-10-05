export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const SELECT_DEFAULT_MUSIC_SOURCE = 'SELECT_DEFAULT_MUSIC_SOURCE';
export const SELECT_DEFAULT_LYRICS_PROVIDER = 'SELECT_DEFAULT_LYRICS_PROVIDER';

export function createPlugins (pluginClasses) {
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

  const categories = Object.keys(pluginClasses);
  let selected = {};
  _.forEach(categories, category => {
    selected[category] = _.head(plugins[category]).name;
  });

  return {
    type: CREATE_PLUGINS,
    payload: {
      plugins,
      selected
    }
  };
}

export function selectDefaultMusicSource (streamProvider) {
  return {
    type: SELECT_DEFAULT_MUSIC_SOURCE,
    payload: streamProvider
  };
}

export function selectDefaultLyricsProvider(lyricsProvider) {
  return {
    type: SELECT_DEFAULT_LYRICS_PROVIDER,
    payload: lyricsProvider
  };
}
