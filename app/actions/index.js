export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const UNIFIED_SEARCH = 'UNIFIED_SEARCH';

export function createSearchPlugins(pluginClasses) {
  var plugins = {};

  for ( var i=0; i<Object.keys(pluginClasses).length; i++ ) {
    var category = Object.keys(pluginClasses)[i];

    if (plugins[category] == undefined) {
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
    plugins: plugins
  };
}

export function unifiedSearch(terms, plugins) {
  var searchResults = {};
  for(var i=0; i<plugins.musicSources.length; i++) {
    Object.assign(searchResults, plugins.musicSources[i].search(terms));
  }

  return {
    type: UNIFIED_SEARCH
  }
}
