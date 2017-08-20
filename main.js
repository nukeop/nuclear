const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const { app, ipcMain, BrowserWindow } = require('electron');
const Player = require('mpris-service');
const path = require('path');
const url = require('url');

let win;

let player = Player({
  name: 'nuclear',
  identity: 'nuclear music player',
  supportedUriSchemes: ['file'],
  supportedMimeTypes: ['audio/mpeg', 'application/ogg'],
  supportedInterfaces: ['player'],
  desktopEntry: 'nuclear'
});

function createWindow() {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
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

  win.on('closed', () => {
    win = null;
  });

  player.on('quit', function () {
	   win = null;
  });

  var events = ['raise', 'quit', 'next', 'previous', 'pause', 'playpause', 'stop', 'play', 'seek', 'position', 'open', 'volume'];
events.forEach(function (eventName) {
	player.on(eventName, function () {
		console.log('Event:', eventName, arguments);
	});
});

  player.metadata = {
		'mpris:trackid': player.objectPath('track/0'),
		'mpris:length': 60 * 1000 * 1000, // In microseconds
		'mpris:artUrl': 'http://3.bp.blogspot.com/_aNTsUIQhmf0/TJD02nFCD0I/AAAAAAAADyc/nEs2_ttp98c/s1600/Neutral+Milk+Hotel+-+In+the+Aeroplane+Over+the+Sea+-+1998.jpg',
		'xesam:title': 'Two-Headed Boy',
		'xesam:album': 'In The Aeroplane Over The Sea',
		'xesam:artist': 'Neutral Milk Hotel'
	};

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
