export const CREATE_PLUGINS = 'CREATE_PLUGINS';

export const PLUGIN_LIST_SEARCH_START = 'PLUGIN_LIST_SEARCH_START';
export const PLUGIN_LIST_SEARCH_SUCCESS = 'PLUGIN_LIST_SEARCH_SUCCESS';
export const PLUGIN_LIST_SEARCH = 'PLUGIN_LIST_SEARCH';

import config from '../plugins/config';

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
    payload: plugins
  };
}

export function pluginListSearchStart() {
  return {
    type: PLUGIN_LIST_SEARCH_START,
    payload: null
  };
}

export function pluginListSearchSuccess(searchResults) {
  return {
    type: PLUGIN_LIST_SEARCH_SUCCESS,
    payload: searchResults
  };
}

export function pluginListSearch(terms, plugins) {
  return (dispatch) => {
    dispatch(pluginListSearchStart());
    var searchPromises = plugins.map(p => p.search(terms));

    Promise.all(searchPromises)
      .then(values => dispatch(pluginListSearchSuccess(values)));
  };
}
