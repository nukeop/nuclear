## Troubleshooting common issues
This section lists issues that might be encountered during development and how to deal with them. Before opening a new issue, make sure you've looked here.

### Before you do anything
Make sure you have the latest node and npm. Node needs to be at least v11, and npm at least v6. Never hurts to keep them up to date though. Failure to install the latest versions can cause a million different problems.

### worker_threads
Some people see a message like this when building the web app:
```
`WARNING in ./node_modules/write-file-atomic/index.js
Module not found: Error: Can't resolve 'worker_threads' in '<nuclear dir>/node_modules'
```
This is normal and expected. This won't impact normal operation in any way.

### I can't run Docker or docker-compose
Try the manual development process. After cloning the repo, run the following from the root folder:
```shell
$ lerna bootstrap
$ lerna run start
```

### I can't run lerna (or running with lerna doesn't work)
Try the manual start. Note that `lerna bootstrap` is required to link the packages even in this procedure.
```shell
$ lerna bootstrap
$ cd packages/app
$ npm start

# Run this in another shell
$ cd packages/main
$ npm start

### There is no debug output
Lerna eats it. If you want to see the debug output, try the manual start above.

### I started Nuclear, but all I see is the loading screen with the logo
This means the web app failed to build. The logo is a static html that is replaced with the web app as the scripts start. See the debug output of the `watch` script for details.

### I started Nuclear, but all I see is a white screen
This indicates a problem with the initial html loading. During development, all assets are served by `webpack-dev-server`. It's possible that it's not running, or that it crashed. The output from the `watch` script should give you some details.

### Uncaught TypeError: composeEnhancers is not a function
This typically means that the Redux Devtools extension failed to download or install. You can temporarily disable it by changing `composeEnhancers` in `packages/app/app/store/configureStore.js` to just `compose`. You won't have access to the devtools though, and developing without them can be a pain.

### Songs load but fail to start
Sometimes our Youtube API key gets too much traffic and becomes rate limited. This causes problems with loading streams. As a workaround, you can use your own API key by pasting it in the settings section, near the bottom.
