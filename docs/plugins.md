## Plugin API
User plugins are supported in the form of arbitrary js files, which can be loaded at runtime. Obviously, plugins should be loaded only from trusted sources, because they can run arbitrary code.

### Plugin files

A plugin file should export an object with the following keys:

- `name` - The name of the plugin
- `description` - A short summary of the plugin's functionality
- `image` - either null or a URL to an icon
- `start` a function which accepts a single argument where the API will be passed

Example of a complete plugin file:

```javascript
module.exports = {
  name: 'test plugin',
  description: 'test plugin description',
  image: null,
  start: api => {
    console.log('plugin started')
    console.log(api)
  }
};
```

### The API object

The plugin API that's passed to the plugin exposes the following keys:

- `app` - app object from the Electron API, as defined here: https://electronjs.org/docs/api/app
