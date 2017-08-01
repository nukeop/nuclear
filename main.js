const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const Player = require('mpris-service');


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      experimentalFeatures: true
    }
  });

  installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));


  installExtension(REDUX_DEVTOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  win.webContents.openDevTools();

  var player = Player({
	name: 'nodejs',
	identity: 'nuclear',
	supportedUriSchemes: ['file'],
	supportedMimeTypes: ['audio/mpeg'],
	supportedInterfaces: ['player']
});

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
