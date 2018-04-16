export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const SAVE_MUSIC_SOURCE_ORDER = 'SAVE_MUSIC_SOURCE_ORDER';

import config from '../plugins/config';

export function createSearchPlugins(pluginClasses) {
  var plugins = {};

  for ( var i=0; i<Object.keys(pluginClasses).length; i++ ) {
    var category = Object.keys(pluginClasses)[i];

    if (plugins[category] === undefined) {
      plugins[category] = [];
    }

    for (var j=0; j<Object.keys(pluginClasses[category]).length; j++) {
      var pluginName = Object.keys(pluginClasses[category])[j];
      var plugin = new pluginClasses[category][pluginName]();
      plugins[category].push(plugin);
    }
  }

  return {
    type: CREATE_PLUGINS,
    payload: plugins
  };
}

export function saveMusicSourceOrder(musicSourceOrder) {
  return {
    type: SAVE_MUSIC_SOURCE_ORDER,
    payload: musicSourceOrder
  };
}
