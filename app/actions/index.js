export const CREATE_PLUGINS = 'CREATE_PLUGINS';
export const UNIFIED_SEARCH = 'UNIFIED_SEARCH';

export function createSearchPlugins(pluginClasses) {
  var plugins = {};
  for(p in Object.keys(pluginClasses)) {
    if (plugins[key] != undefined) {
      plugins[key].push(pluginClass());
    } else {
      plugins[key] = [pluginClass()];
    }
  }

  return {
    type: CREATE_PLUGINS,
    plugins: plugins
  };
}

export function unifiedSearch(terms, plugins) {
  console.log(terms);

  return {
    type: UNIFIED_SEARCH
  }
}
