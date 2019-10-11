## Plugin API
User plugins are supported in the form of arbitrary js files, which can be loaded at runtime. Obviously, plugins should be loaded only from trusted sources, because they can run arbitrary code.

### Plugin files

A plugin file should export an object with the following keys:

- `name` - The name of the plugin (required)
- `description` - A short summary of the plugin's functionality
- `image` - either null or a URL to an icon
- `author` - Github username of the author. If it exists, it will be turned into a link
- `onLoad` a function which accepts a single argument where the API will be passed. This will be called when the plugin is loaded. The plugin is loaded when the user adds the plugin file to his list, and afterwards whenever Nuclear is started.

Example of a complete plugin file:

```javascript
module.exports = {
  name: 'test plugin',
  description: 'test plugin description',
  image: null,
  onLoad: api => {
    console.log('plugin started')
    console.log(api)
  }
};
```

### The API object

The plugin API that's passed to the plugin exposes the following keys:

- `app` - app object from the Electron API, as defined here: https://electronjs.org/docs/api/app
- `store` - Redux store. This lets you use `getState()` to retrieve the complete application state, as well as use `dispatch` to dispatch actions. You can also use `subscribe` to react to actions.
- `React` and `ReactDOM` give you access to these two libraries exactly as used by Nuclear itself.
